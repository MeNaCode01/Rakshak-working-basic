import { benefits } from "../constants/index";
import Heading from "./Heading";
import Section from "./Section";
import Arrow from "../assets/svg/Arrow";
import ClipPath from "../assets/svg/ClipPath";
import { GradientLight } from "./design/Benefits";
import UploadButton from "./UploadButton";
import { useState, useEffect } from "react";
import {
  useContract,
  useContractWrite,
  useContractRead,
  useAddress,
} from "@thirdweb-dev/react";
import { MissingGasInnerError } from "web3";
import { benefitIcon2, benefitIcon3, benefitImage2 } from "../assets";
import { IoCloseSharp } from "react-icons/io5";
import { imgFile } from "../assets";
import axios from "axios";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "0xa3056456Ff179DF495B6a4301C0342F49ccEF87e";

const Dashboard = () => {
  const { contract, isLoading } = useContract(CONTRACT_ADDRESS);
  const address = useAddress();
  console.log(address);
  const [msg, setMsg] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!isLoading) {
        const data = await contract.call("getFiles", [address]);
        setMsg(data);
        console.log(msg.length);
      }
    };
    fetchData();
  }, [address, contract]);

  const handleBoxClick = async (item) => {
    try {
      console.log("Opening document with CID:", item.cid);
      // Use public IPFS gateway
      const url = `https://ipfs.io/ipfs/${item.cid}`;
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error opening document:", error);
      alert("Failed to open document");
    }
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
    window.location.reload();
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

  // Convert either bytes32 timestamp or numeric timestamp (seconds) to IST string
  const convertUTC = (value) => {
    try {
      let seconds = 0;
      if (typeof value === 'string' && value.startsWith('0x')) {
        // bytes32 hex
        seconds = Number(bytes32ToDecimal(value));
      } else if (typeof value === 'string' && /^[0-9]+$/.test(value)) {
        seconds = Number(value);
      } else if (typeof value === 'number') {
        seconds = value;
      } else if (value && value._hex) {
        // ethers BigNumber
        seconds = Number(value._hex ? BigInt(value._hex).toString() : value.toString());
      } else {
        return 'Unknown time';
      }

      const utcDate = new Date(seconds * 1000);
      const istDate = utcDate.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
      return istDate;
    } catch (err) {
      console.error('convertUTC error:', err);
      return 'Invalid time';
    }
  };

  const handleRefresh = async () => {
    try {
      if (!isLoading && contract && address) {
        // Fetch indexed events from backend (includes both sent and received)
        try {
          const resp = await axios.get(`http://localhost:5001/files/${address}`);
          const events = resp.data || [];
          // Normalize to the shape used by UI: { cid, sender, receiver, timestamp }
          const normalized = events.map((e) => ({
            cid: e.cid,
            sender: e.sender,
            receiver: e.receiver,
            timestamp: e.timestamp,
          }));
          setMsg(normalized);
          console.log('Documents refreshed from events:', normalized.length);
          alert(`Loaded ${normalized.length} documents (from events)`);
        } catch (err) {
          console.warn('Failed to fetch events from backend, falling back to contract.getFiles', err.message);
          const data = await contract.call('getFiles', [address]);
          setMsg(data);
          console.log('Documents refreshed (contract):', data.length);
          alert(`Loaded ${data.length} documents (from contract)`);
        }
      }
    } catch (error) {
      console.error("Error refreshing documents:", error);
      alert("Failed to refresh documents");
    }
  };

  return (
    <Section id="features" className="min-h-screen">
      <UploadButton className="fixed bottom-4 right-4 z-100" />
      <div className="container relative z-2">
        <div className="flex justify-between items-center mb-8">
          <Heading
            className="md:max-w-md lg:max-w-2xl"
            title="Your secured documents"
          />
          <button
            onClick={handleRefresh}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-700 text-white font-bold rounded-lg hover:from-orange-600 hover:to-orange-800 transition-all"
          >
            Refresh Documents
          </button>
        </div>

        {msg.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl">No documents uploaded yet</p>
            <p className="text-gray-500 mt-4">Click the Upload button to add your first document</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-10 mb-10">
            {msg.map((item, index) => (
            <div
              className="block relative p-0.5 bg-no-repeat bg-[length:100%_100%] md:max-w-[24rem]"
              key={index}
              onClick={() => handleBoxClick(item)}
            >
              <div className="relative z-2 flex flex-col min-h-[12rem] p-[2.4rem] cursor-pointer">
                <h5 className="text-xs font-bold text-orange-500 mb-2">Document #{index + 1}</h5>
                <p className="text-sm mb-2 text-gray-400 break-all">
                  <span className="font-semibold">CID:</span> {item.cid.substring(0, 20)}...
                </p>
                <p className="text-sm mb-2 text-gray-400">
                  <span className="font-semibold">From:</span> {item.sender?.substring(0, 10)}...
                </p>
                <p className="text-sm mb-2 text-gray-400">
                  <span className="font-semibold">To:</span> {item.receiver?.substring(0, 10)}...
                </p>
                <p className="body-2 mb-6 text-n-3">
                  {convertUTC(item.timestamp)}
                </p>
                <div className="flex items-center mt-auto">
                  <img
                    src={benefitIcon3}
                    width={48}
                    height={48}
                    alt="document"
                  />
                  <p className="ml-auto font-code text-xs hover:underline font-bold text-n-1 uppercase tracking-wider">
                    Open document
                  </p>
                  <Arrow />
                </div>
              </div>

              <GradientLight />

              <div
                className="absolute inset-0.5 bg-zinc-800"
                style={{ clipPath: "url(#benefits)" }}
              >
                <div className="absolute inset-0 opacity-0 transition-opacity hover:opacity-90">
                  <img
                    src={benefitImage2}
                    width={380}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <ClipPath />
            </div>
          ))}
          </div>
        )}
      </div>

      {isPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-xl bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h5 className="text-xl font-medium text-gray-800">
                Image Preview
              </h5>
              <button
                onClick={handlePopupClose}
                type="button"
                className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <IoCloseSharp size={24} />
              </button>
            </div>
            <div className="p-4">
              {selectedImage && (
                <iframe
                  src="https://amaranth-added-parrotfish-511.mypinata.cloud/ipfs/QmUtMaPZACmApkw9h9N1bLd6avr78kkgqyhAgfRa8ccdP3"
                  height="100px"
                  width="100px"
                ></iframe>
              )}
              {!selectedImage && (
                <>
                  <iframe
                    src="https://amaranth-added-parrotfish-511.mypinata.cloud/ipfs/QmUtMaPZACmApkw9h9N1bLd6avr78kkgqyhAgfRa8ccdP3"
                    height="100px"
                    width="100px"
                  ></iframe>
                  <p className="text-gray-500 text-center">
                    No image selected.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </Section>
  );
};

export default Dashboard;
