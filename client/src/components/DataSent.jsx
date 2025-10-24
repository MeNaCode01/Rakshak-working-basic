// import React from "react";
// import axios from "axios";
// import { useEffect, useState } from "react";
// import { useContract, useAddress, useContractRead } from "@thirdweb-dev/react";
// import { IoCloseSharp } from "react-icons/io5";
// import { curve, heroBackground, imgFile } from "../assets";

// const DataSent = () => {
//   const address = useAddress();
//   console.log(address);
//   const [msg, setMsg] = useState([]);
//   const [isPopupOpen, setIsPopupOpen] = useState(false);
//   const [selectedImage, setSelectedImage] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       const send = address;
//       try {
//         const resp = await axios.get(
//           `http://localhost:5002/getsendData/${send}`
//         );
//         setMsg(resp.data);
//         console.log;
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     fetchData();
//   }, [address]);

//   const handleBoxClick = async (item) => {
//     try {
//       console.log(item.content);
//       const res = await axios.get(`http://localhost:3000/img/${item.content}`);
//       console.log(res);
//       setSelectedImage(imgFile);
//       console.log(done);
//     } catch (error) {
//       console.log(error);
//     }

//     setIsPopupOpen(true);
//   };
//   // Function to close the popup
//   const handlePopupClose = () => {
//     setIsPopupOpen(false);
//     window.location.reload();
//     setSelectedImage(null);
//   };

//   const bytes32ToDecimal = (bytes32Hex) => {
//     if (bytes32Hex.startsWith("0x")) {
//       bytes32Hex = bytes32Hex.slice(2);
//     }
//     let result = BigInt("0x" + bytes32Hex);
//     return result.toString();
//   };

//   const formatTimestamp = (timestamp) => {
//     const dateObj = new Date(timestamp);
//     return dateObj.toLocaleString();
//   };

//   const decimalToUTC = (decimalTimestamp) => {
//     const timestampMilliseconds = decimalTimestamp * 1000;
//     const date = new Date(timestampMilliseconds);
//     const utcString = date.toUTCString();
//     return utcString;
//   };

//   const convertUTC = (bytes32) => {
//     const decimal = bytes32ToDecimal(bytes32);
//     const utcDateTime = decimalToUTC(decimal);
//     const utcDate = new Date(utcDateTime);
//     const istDate = utcDate.toLocaleString("en-US", {
//       timeZone: "Asia/Kolkata",
//     });
//     return istDate;
//   };

//   return (
//     <div className="flex flex-col gap-2 p-4">
//       {msg.length > 0 ? (
//         msg.map((item, index) => (
//           <div
//             key={index}
//             className="box bg-zinc-700 rounded-lg shadow-lg border-transparent p-4 cursor-pointer hover:bg-zinc-800"
//             onClick={() => handleBoxClick(item)}
//           >
//             <div className="text-yellow-3100">
//               Filename : <span className="text-white">{item.filename}</span>
//             </div>
//             <div className="text-yellow-3100">
//               Receiver : <span className="text-white">{item.receiver}</span>
//             </div>
//             <p className="text-yellow-3100">
//               cid : <span className="text-white">{item.content}</span>
//             </p>
//             <div className="text-yellow-3100">
//               TimeStamp :{" "}
//               <span className="text-white">
//                 {formatTimestamp(item.createdAt)}
//               </span>
//             </div>
//           </div>
//         ))
//       ) : (
//         <p className="text-gray-400 bg-zinc-700 rounded-lg">
//           No messages to display.
//         </p>
//       )}
//       {isPopupOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="w-full max-w-xl bg-white rounded-lg shadow-lg overflow-hidden">
//             <div className="flex items-center justify-between p-4 border-b border-gray-200">
//               <h5 className="text-xl font-medium text-gray-800">
//                 Image Preview
//               </h5>
//               <button
//                 onClick={handlePopupClose}
//                 type="button"
//                 className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//               >
//                 <IoCloseSharp size={24} />
//               </button>
//             </div>
//             <div className="p-4">
//               {selectedImage && (
//                 <img
//                   src={selectedImage}
//                   alt="Selected Image Preview"
//                   className="w-full h-auto object-contain rounded-lg"
//                 />
//               )}
//               {!selectedImage && (
//                 <p className="text-gray-500 text-center">No image selected.</p>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };
// export default DataSent;

// // useEffect(() => {
// //   const fetchData = async () => {
// //     if(!isLoading){
// //       const data = await contract.call("getFiles",[address]);
// //       setMsg(data);
// //       console.log(msg.length);
// //       // const _cid = msg[0].cid;
// //       // const _receiver = msg[0].receiver;
// //       // const _timestamp = convertUTC(msg[0].timestamp);
// //       // return console.log(`CID: ${_cid}\nReceiver: ${_receiver}\nTimeStamp: ${_timestamp}`);
// //     }
// //   };
// //   fetchData();
// // }, [address,contract]);

import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useContract, useAddress, useContractRead } from "@thirdweb-dev/react";

const DataSent = () => {
  // Use environment variable for contract address
  const CONTRACT_ADDRESS =
    import.meta.env.VITE_CONTRACT_ADDRESS ||
    "0xa3056456Ff179DF495B6a4301C0342F49ccEF87e";
  const { contract, isLoading } = useContract(CONTRACT_ADDRESS);
  const address = useAddress();
  const [msg, setMsg] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const fetchData = async () => {
    if (!isLoading && contract && address) {
      try {
        console.log("📡 Fetching sent documents from blockchain...");
        console.log("Contract Address:", CONTRACT_ADDRESS);
        console.log("User Address:", address);

        const data = await contract.call("getFiles", [address]);

        // Sort by timestamp - newest first (descending order)
        const sortedData = [...data].sort((a, b) => {
          const timestampA = bytes32ToDecimal(a.timestamp);
          const timestampB = bytes32ToDecimal(b.timestamp);
          return Number(timestampB) - Number(timestampA); // Newest first
        });

        setMsg(sortedData);

        console.log(
          "✅ Documents fetched:",
          sortedData.length,
          "(sorted by newest first)"
        );
        console.log("Documents data:", sortedData);

        if (sortedData.length === 0) {
          console.log(
            "ℹ️ No documents found. Make sure your transaction was confirmed on the blockchain."
          );
        }
      } catch (error) {
        console.error("❌ Error fetching documents:", error);
        console.log(
          "Make sure you're connected to the correct network (Sepolia) and the contract is deployed."
        );
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [address, contract, isLoading]);

  const bytes32ToDecimal = (bytes32Hex) => {
    if (bytes32Hex.startsWith("0x")) {
      bytes32Hex = bytes32Hex.slice(2);
    }
    let result = BigInt("0x" + bytes32Hex);
    return result.toString();
  };

  const decimalToUTC = (decimalTimestamp) => {
    const timestampMilliseconds = decimalTimestamp * 1000;
    const date = new Date(timestampMilliseconds);
    const utcString = date.toUTCString();
    return utcString;
  };

  const convertUTC = (bytes32) => {
    const decimal = bytes32ToDecimal(bytes32);
    const utcDateTime = decimalToUTC(decimal); // Get the UTC date and time string
    const utcDate = new Date(utcDateTime); // Convert UTC string to a Date object
    const istDate = utcDate.toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    }); // Convert to IST
    return istDate;
  };

  const handleViewDocument = (cid) => {
    // Open IPFS gateway to view the document
    const ipfsUrl = `https://ipfs.io/ipfs/${cid}`;
    setSelectedImage(ipfsUrl);
    setIsPopupOpen(true);
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
    setSelectedImage(null);
  };

  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-white font-semibold">Sent Documents</h3>
        <button
          onClick={fetchData}
          disabled={isLoading}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors disabled:bg-gray-600"
        >
          🔄 Refresh
        </button>
      </div>
      {!(msg.length === 0) ? (
        msg.map((item, index) => (
          <div
            className="border-transparent rounded-lg bg-zinc-600 border-white p-3 hover:bg-zinc-700 transition-colors"
            key={index}
          >
            <div className="text-emerald-300 text-sm mb-1">
              <span className="font-semibold">Receiver:</span>
              <span className="text-white ml-2">
                {item.receiver.slice(0, 6)}...{item.receiver.slice(-4)}
              </span>
            </div>
            <div className="text-yellow-300 text-sm mb-1">
              <span className="font-semibold">IPFS CID:</span>
              <span className="text-white ml-2 break-all">{item.cid}</span>
            </div>
            <div className="text-blue-300 text-sm mb-2">
              <span className="font-semibold">Sent:</span>
              <span className="text-white ml-2">
                {convertUTC(item.timestamp)}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleViewDocument(item.cid)}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
              >
                📄 View Document
              </button>
              <a
                href={`https://ipfs.io/ipfs/${item.cid}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
              >
                ⬇️ Download
              </a>
            </div>
          </div>
        ))
      ) : isLoading ? (
        <p className="text-gray-400 text-center p-4">⏳ Loading documents...</p>
      ) : address ? (
        <div className="text-center p-4 bg-zinc-700 rounded-lg">
          <p className="text-gray-400 mb-2">No documents sent yet!</p>
          <p className="text-xs text-gray-500">
            Connected: {address.slice(0, 6)}...{address.slice(-4)}
            <br />
            Contract: {CONTRACT_ADDRESS.slice(0, 6)}...
            {CONTRACT_ADDRESS.slice(-4)}
            <br />
            Network: {isLoading ? "Checking..." : "Connected"}
          </p>
          <p className="text-xs text-yellow-400 mt-2">
            💡 After sending a document, wait 10-30 seconds for blockchain
            confirmation, then click Refresh.
          </p>
        </div>
      ) : (
        <p className="text-yellow-400 text-center p-4">
          Please connect your wallet to view documents
        </p>
      )}

      {/* Image/Document Preview Modal */}
      {isPopupOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={handlePopupClose}
        >
          <div
            className="w-full max-w-4xl bg-zinc-900 rounded-lg shadow-lg overflow-hidden m-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-zinc-700">
              <h5 className="text-xl font-medium text-white">
                Document Preview
              </h5>
              <button
                onClick={handlePopupClose}
                className="text-gray-400 hover:text-white focus:outline-none"
              >
                ✕
              </button>
            </div>
            <div className="p-4 max-h-[80vh] overflow-auto">
              {selectedImage && (
                <img
                  src={selectedImage}
                  alt="Document Preview"
                  className="w-full h-auto object-contain rounded-lg"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "block";
                  }}
                />
              )}
              <div
                style={{ display: "none" }}
                className="text-white text-center"
              >
                <p className="mb-4">Unable to preview this file type.</p>
                <a
                  href={selectedImage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded inline-block"
                >
                  Open in IPFS Gateway
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataSent;
