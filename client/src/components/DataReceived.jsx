import React, { useState, useEffect } from "react";
import axios from "axios";
import { IoCloseSharp } from "react-icons/io5";
import { curve, heroBackground, imgFile } from "../assets";
import { useAddress, useContract } from "@thirdweb-dev/react";

const DataReceived = () => {
  const CONTRACT_ADDRESS =
    import.meta.env.VITE_CONTRACT_ADDRESS ||
    "0x4F6E7C39E54DA42feBA978D7441335a36802A15c";
  const [msg, setMsg] = React.useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const address = useAddress();
  const { contract, isLoading } = useContract(CONTRACT_ADDRESS);

  useEffect(() => {
    const fetchData = async () => {
      if (!isLoading && contract && address) {
        try {
          // Get all files from all senders and filter for current user as receiver
          // Note: This is a simplified approach. In production, you'd want the contract
          // to have a function to get files by receiver address
          const data = await contract.call("getFiles", [address]);

          // Sort by timestamp - newest first (descending order)
          const sortedData = [...data].sort((a, b) => {
            const timestampA = bytes32ToDecimal(a.timestamp);
            const timestampB = bytes32ToDecimal(b.timestamp);
            return Number(timestampB) - Number(timestampA); // Newest first
          });

          // For now, we'll show files where user is listed as receiver
          // You might need to query multiple addresses or implement a new contract function
          setMsg(sortedData);
          console.log(
            "Checking received documents (sorted by newest first):",
            sortedData.length
          );
        } catch (error) {
          console.error("Error fetching received documents:", error);
        }
      }
    };

    fetchData();
  }, [address, contract, isLoading]);

  const handleViewDocument = (cid) => {
    const ipfsUrl = `https://ipfs.io/ipfs/${cid}`;
    setSelectedImage(ipfsUrl);
    setIsPopupOpen(true);
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
    setSelectedImage(null);
  };

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
    const utcDateTime = decimalToUTC(decimal);
    const utcDate = new Date(utcDateTime);
    const istDate = utcDate.toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    });
    return istDate;
  };

  return (
    <div className="flex flex-col gap-2 p-4">
      {msg.length !== 0 ? (
        msg.map((item, index) => (
          <div
            key={index}
            className="border-transparent rounded-lg bg-zinc-600 border-white p-3 hover:bg-zinc-700 transition-colors"
          >
            <div className="text-emerald-300 text-sm mb-1">
              <span className="font-semibold">From:</span>
              <span className="text-white ml-2">
                {item.receiver
                  ? `${item.receiver.slice(0, 6)}...${item.receiver.slice(-4)}`
                  : "Unknown"}
              </span>
            </div>
            <div className="text-yellow-300 text-sm mb-1">
              <span className="font-semibold">IPFS CID:</span>
              <span className="text-white ml-2 break-all">
                {item.cid || item.content}
              </span>
            </div>
            <div className="text-blue-300 text-sm mb-2">
              <span className="font-semibold">Received:</span>
              <span className="text-white ml-2">
                {item.timestamp ? convertUTC(item.timestamp) : "Unknown"}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleViewDocument(item.cid || item.content)}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
              >
                📄 View Document
              </button>
              <a
                href={`https://ipfs.io/ipfs/${item.cid || item.content}`}
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
        <p className="text-gray-400 text-center p-4">Loading documents...</p>
      ) : address ? (
        <p className="text-gray-400 text-center p-4 bg-zinc-700 rounded-lg">
          No documents received yet! When someone sends you a document, it will
          appear here.
        </p>
      ) : (
        <p className="text-yellow-400 text-center p-4 bg-zinc-700 rounded-lg">
          Please connect your wallet to view received documents
        </p>
      )}

      {/* Document Preview Modal */}
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
                <IoCloseSharp size={24} />
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

export default DataReceived;
