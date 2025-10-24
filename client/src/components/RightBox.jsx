
import React, { useState, useEffect } from 'react'
import Button from './Button'
import Section from './Section'
import { Dragendrop } from './Dragendrop'
import { Address, isValidChecksumAddress } from 'ethereumjs-util';
import { useContract, useContractWrite, useContractRead, useAddress } from '@thirdweb-dev/react';
import { Web3 } from 'web3';
import axios from "axios";
import { ankle } from "../assets/index.js";

const web3 = new Web3(window.ethereum);

// Use environment variable for contract address (update after deployment)
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "0xa3056456Ff179DF495B6a4301C0342F49ccEF87e";

export const RightBox = () => {
  const [dip, setDip] = useState(false);
  const { contract } = useContract(CONTRACT_ADDRESS);
  const { mutateAsync: addFileToIPFS, isLoading } = useContractWrite(contract, 'addFileToIPFS');

  const [fileData, setFileData] = React.useState(null);
  const [data, setData] = React.useState("");
  const [recieverAddress, setReceiverAddress] = React.useState('');
  const [uploadProgress, setUploadProgress] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const sender = useAddress();

  const handleFileData = (data) => {
    setFileData(data);
  }

  const promp = () => {
    const s = prompt("Enter the seed value.");
    console.log(s);
    setDip(true);
  }

  const upload = async (event) => {
    console.log("upload event")
    event.preventDefault();
    
    // Check if wallet is connected
    if (!sender) {
      return alert("❌ Please connect your MetaMask wallet first!");
    }
    
    // Check wallet balance
    const balance = await web3.eth.getBalance(sender);
    if (balance === 0n) {
      return alert("❌ Your wallet has no funds! You need Sepolia ETH to pay for gas fees.");
    }
    
    // Check if file is uploaded
    if (fileData === null || fileData.length === 0) {
      return alert("❌ Please upload a file first!");
    }
    
    // Check if receiver address is verified
    const isValid = localStorage.getItem("status");
    if (!isValid || isValid !== "verified") {
      return alert("❌ Please enter and verify the receiver wallet address first!");
    }
    
    // Check if receiver address is set
    if (!recieverAddress || recieverAddress.length === 0) {
      return alert("❌ Please enter a receiver wallet address!");
    }

    if (fileData.length > 0) {
      setIsUploading(true);
      setUploadProgress('📤 Step 1/3: Reading file...');
      localStorage.removeItem("status");
      const reader = new FileReader();

      reader.onload = function (fileEvent) {
        const f = fileEvent.target.result;
        setFileData(f);

        setUploadProgress('☁️ Step 2/3: Uploading to IPFS...');

        axios.post("http://localhost:5001/share", { fileData: f })
          .then(async (res) => {
            console.log("IPFS Upload Response:", res);
            // Backend returns Pinata response with IpfsHash
            const cid = res.data.IpfsHash;
            
            if (!cid) {
              throw new Error("No IPFS CID returned from upload");
            }
            
            console.log("IPFS CID:", cid);
            console.log("Sender:", sender, "Receiver:", recieverAddress);
            
            setUploadProgress(`✅ IPFS Upload Complete! CID: ${cid.substring(0, 10)}...`);
            
            // Wait a moment to show IPFS success
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            setUploadProgress('⛓️ Step 3/3: Saving to blockchain... Confirm in MetaMask!');
            
            const data = await addFileToIPFS({ args: [sender, recieverAddress, cid] });
            console.log("Blockchain transaction:", data);
            
            setUploadProgress('✅ Success! Document shared on blockchain!');
            
            // Wait to show success message
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            localStorage.removeItem("status");
            setFileData(null);
            setReceiverAddress('');
            setDip(false);
            setIsUploading(false);
            setUploadProgress('');
            
            alert(`✅ Document successfully shared!\n\nIPFS CID: ${cid}\nReceiver: ${recieverAddress}\n\nGo to "Sent" tab and click Refresh to see it!`);
          })
          .catch(err => {
            console.error("Upload error:", err);
            setUploadProgress('❌ Upload failed!');
            setIsUploading(false);
            alert("❌ Upload failed: " + (err.message || "Unknown error"));
          })
      };
      reader.readAsDataURL(fileData[0]);
    }
  }

  const checkValidAddress = () => {
    try {
      if (!recieverAddress || recieverAddress.length === 0) {
        alert("Please enter a receiver wallet address!");
        return;
      }
      
      const isValid = isValidChecksumAddress(recieverAddress);
      if (isValid) {
        localStorage.setItem("status", "verified");
        alert("✅ Receiver address verified successfully!");
      }
      else {
        alert("❌ Invalid Ethereum address! Please check and try again.");
      }
    } catch (error) {
      console.log(error);
      alert("❌ Invalid address format! Make sure it starts with 0x and is 42 characters long.");
    }
  }

  const [options, setOptions] = useState([
    { "cid": "QmepBVgf1faE3d1MMivdnjanhhuwheFTtxgkdJAzyBzBYP" },
    { "cid": "QmP1iJNWv9zgrWBDJ9fcMszywxiQEHgnQpqAWknF8UvpuG" },
    { "cid": "QmP1iJNWv9zgrWBDJ9fcMszywxiQEHgnQpqAWknF8UvpuG" },
  ]);
  const [selectedOption, setSelectedOption] = useState('');
  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div className="w-1/2 h-auto mb-5 bg-stone-900 p-4 rounded-md relative">
      <div className="flex gap-2 mb-4">
        <input 
          type="text" 
          value={recieverAddress}
          onChange={(e) => { setReceiverAddress(e.target.value) }} 
          className="w-full p-3 font-code rounded-md text-black" 
          placeholder="Enter Receiver Wallet Address (0x...)" 
        />
        <Button onClick={checkValidAddress}>Verify</Button>
      </div>
      
      <div className="w-full mb-4">
        <Dragendrop onFileData={handleFileData} />
      </div>
      
      <div className="flex items-center mb-4 ml-2">
        <input
          type="checkbox"
          id="action"
          name="action"
          className="appearance-none w-5 h-5 bg-gray-300 rounded-md checked:bg-blue-600 checked:border-transparent focus:outline-none transition duration-200 cursor-pointer"
          onChange={(e) => setDip(e.target.checked)}
        />
        <label htmlFor="action" className="ml-2 text-white text-sm cursor-pointer">
          Scramble Document (Optional)
        </label>
      </div>

      {dip && (
        <div className="mb-4 p-4 bg-zinc-800 rounded-md">
          <p className="text-yellow-400 text-sm mb-2">⚠️ Document will be scrambled before upload</p>
          <img src={ankle} alt="Scramble visualization" className="w-full h-auto max-w-xs mx-auto" />
        </div>
      )}
      
      {/* Progress Indicator */}
      {isUploading && (
        <div className="mb-4 bg-blue-900 border border-blue-500 text-white px-4 py-3 rounded-lg shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span className="font-semibold">Processing...</span>
          </div>
          <p className="text-sm">{uploadProgress}</p>
        </div>
      )}
      
      <div className="w-full flex flex-col gap-3">
        <Button 
          onClick={upload} 
          className="w-full"
          disabled={isLoading || isUploading}
        >
          {isUploading ? "⏳ Uploading..." : isLoading ? "Processing..." : "Send Document"}
        </Button>
        
        <div className="text-xs text-gray-400 text-center">
          <p>Current wallet: {sender ? `${sender.slice(0, 6)}...${sender.slice(-4)}` : "Not connected"}</p>
        </div>
      </div>
    </div>
  )
}