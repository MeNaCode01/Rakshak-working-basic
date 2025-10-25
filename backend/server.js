import { create } from "ipfs-http-client";
import Express from "express";
import cors from "cors";
import fs from "fs";
import bodyParser from "body-parser";
import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//pinata gateway added

//gateway - https://amaranth-added-parrotfish-511.mypinata.cloud
import axios from "axios";
import { ethers } from "ethers";
import FormData from "form-data";
const JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJmNjU0ZTNkNi03ZGY0LTQ0NzEtODJlMy05MjNjMDUxNzVmNDQiLCJlbWFpbCI6ImRhdmVkbWoxNzI1QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiIwOTk5OTE3NjlmMzNjYWRjNjFhMiIsInNjb3BlZEtleVNlY3JldCI6IjcwZjVmZjlkOWU2OGRhM2I3NjUyMWI5MzVlMzk3ZDk2YzUwOTU0OTgyZGU5YTQ5NTVkMTk0ZTRmOTg3ZDMyODYiLCJpYXQiOjE3MTcxNjY2NDV9.AnzcPJ3F2ImEnH2rMrXmSCHjo-E8HjrDx8rAhxrCxVw";

const PORT = process.env.PORT || 5001;
const app = Express();

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

const corsOptions = {
  origin: "*",
};

app.use(Express.json());
app.use(cors(corsOptions));

const ipfsClient = create({
  host: "localhost",
  port: 5001,
  protocol: "http",
});

const addFileToIPFS = async (file) => {
  const timestamp = Date.now();
  const tempFileName = `./fetched_image_${timestamp}.jpg`;
  
  fs.writeFileSync(tempFileName, file);
  console.log(`💾 Temp file saved: ${tempFileName}`);
  
  const fileSizeKB = (file.length / 1024).toFixed(2);
  console.log(`📊 Uploading file size: ${fileSizeKB} KB`);

  const formData = new FormData();
  const f = fs.createReadStream(tempFileName);
  formData.append("file", f);

  const pinataMetadata = JSON.stringify({
    name: `Medical_Document_${timestamp}`,
  });
  formData.append("pinataMetadata", pinataMetadata);

  const pinataOptions = JSON.stringify({
    cidVersion: 0,
  });
  formData.append("pinataOptions", pinataOptions);

  try {
    console.log("📤 Sending to Pinata...");
    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        maxBodyLength: "Infinity",
        headers: {
          "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
          Authorization: `Bearer ${JWT}`,
        },
      }
    );
    
    console.log(`✅ Pinata response - CID: ${res.data.IpfsHash}`);
    
    // Clean up temp file
    fs.unlinkSync(tempFileName);
    console.log(`🗑️ Cleaned up temp file: ${tempFileName}`);
    
    return res.data;
  } catch (error) {
    console.error("❌ Pinata upload error:", error);
    // Clean up temp file even on error
    if (fs.existsSync(tempFileName)) {
      fs.unlinkSync(tempFileName);
    }
    throw error;
  }
};

const getFile = async (hash) => {
  try {
    const chunks = [];
    for await (const chunk of ipfsClient.cat(hash)) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  } catch (error) {
    console.error("Error fetching file from IPFS:", error);
    throw error;
  }
};

app.get("/", async (req, res) => {
  res.send("main page");
});

app.get("/img/:cid", async (req, res) => {
  try {
    const exampleCID = req.params.cid;
    console.log(exampleCID);

    try {
      const data = await getFile(exampleCID);
      console.log(data);
      const fileSignature = data.toString("hex", 0, 4);
      let filePath = "";

      if (fileSignature === "89504e47") {
        filePath = "../client/src/assets/img_file.png";
      } else if (fileSignature === "ffd8ffe0" || fileSignature === "ffd8ffe1") {
        filePath = "../client/src/assets/img_file.jpg";
      } else if (fileSignature === "ffd8ffe0" || fileSignature === "ffd8ffe1") {
        filePath = "../client/src/assets/img_file.jpeg";
      } else {
        console.log("File type: Unknown");
        res.status(400).json("File type is unknown.");
        return;
      }

      fs.writeFileSync(filePath, data);
      res.status(200).json("File added successfully.");
    } catch (error) {
      console.error(error);
      res.status(400).json("Failed to fetch and save the file.");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal server error.");
  }
});

app.post("/share", async (req, res) => {
  try {
    console.log("\n=== /share endpoint called ===");

    if (!req.body.fileData) {
      return res.status(400).json({ error: "No file data provided" });
    }

    const base64Data = req.body.fileData;
    const matches = base64Data.match(/^data:(.+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: "Invalid base64 data format" });
    }
    const [, mimeType, base64EncodedData] = matches;
    const fileExtension = mimeType.split("/")[1];
    
    // Use timestamp to create unique filename
    const timestamp = Date.now();
    const fileName = `output_${timestamp}.${fileExtension}`;
    console.log(`📁 Saving as: ${fileName}`);

    const imageData = Buffer.from(base64Data.split(",")[1], "base64");
    const fileSizeKB = (imageData.length / 1024).toFixed(2);
    console.log(`📊 File size: ${fileSizeKB} KB`);
    console.log(`🔑 First 50 bytes (hex): ${imageData.toString('hex', 0, 50)}`);
    
    fs.writeFileSync(fileName, imageData);

    console.log("☁️ Uploading to IPFS via Pinata...");
    const result = await addFileToIPFS(imageData);
    console.log("✅ IPFS upload result:", result);

    if (!result || !result.IpfsHash) {
      return res.status(500).json({ error: "Failed to upload to IPFS" });
    }

    return res.json(result);
  } catch (error) {
    console.error("Error processing /share request:", error);
    return res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

// GET /files/:address - returns event-indexed files where address is sender or receiver
app.get("/files/:address", async (req, res) => {
  try {
    const target = req.params.address;
    // Contract address - use env or fallback if not set
    const CONTRACT_ADDRESS =
      process.env.VITE_CONTRACT_ADDRESS ||
      "0xa3056456Ff179DF495B6a4301C0342F49ccEF87e";
    // Minimal ABI to decode the event
    const abi = [
      "event addedFileToIPFS(address _sender, address _receiver, string _cid)",
    ];

    // Use a public Sepolia RPC that supports CORS for server-side requests
    const provider = new ethers.providers.JsonRpcProvider(
      "https://ethereum-sepolia-rpc.publicnode.com"
    );
    const contractReader = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);

    // Query all events (no indexed topics in the event) - filter in JS
    const events = await contractReader.queryFilter(
      contractReader.filters.addedFileToIPFS(),
      0,
      "latest"
    );

    const results = [];
    for (const ev of events) {
      const sender = ev.args?._sender;
      const receiver = ev.args?._receiver;
      const cid = ev.args?._cid;
      // filter by address (case-insensitive)
      if (!sender || !receiver) continue;
      if (
        sender.toLowerCase() === target.toLowerCase() ||
        receiver.toLowerCase() === target.toLowerCase()
      ) {
        // fetch block timestamp
        const block = await provider.getBlock(ev.blockNumber);
        results.push({
          sender,
          receiver,
          cid,
          blockNumber: ev.blockNumber,
          timestamp: block.timestamp,
        });
      }
    }

    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching events:", error);
    res
      .status(500)
      .json({
        error: "Failed to fetch files from events",
        details: error.message,
      });
  }
});

// Endpoint to start ML service
app.post("/start-ml-service", (req, res) => {
  const workspacePath = path.join(__dirname, "..", "workspace");
  const command = `cd /d "${workspacePath}" && streamlit run app.py --server.port=8501`;

  exec(command, (error) => {
    if (error) {
      console.error("Error starting ML service:", error);
    }
  });

  res.json({ message: "ML service starting..." });
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
