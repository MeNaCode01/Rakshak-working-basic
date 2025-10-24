import React, { useState, useEffect } from 'react';
import Section from './Section';
import { RightBox } from './RightBox';
import { LeftBox } from './LeftBox';
import Split from 'react-split';
import { Line } from 'react-chartjs-2';
import { FaUserMd, FaCalendarAlt, FaDollarSign, FaSyringe, FaFileUpload, FaFileDownload } from 'react-icons/fa';
import { useContract, useAddress } from '@thirdweb-dev/react';

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "0xa3056456Ff179DF495B6a4301C0342F49ccEF87e";

const Share = () => {
  const { contract, isLoading } = useContract(CONTRACT_ADDRESS);
  const address = useAddress();
  
  const [sentCount, setSentCount] = useState(0);
  const [receivedCount, setReceivedCount] = useState(0);
  const [sentHistory, setSentHistory] = useState([]);
  const [receivedHistory, setReceivedHistory] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Fetch real-time data
  useEffect(() => {
    const fetchData = async () => {
      if (!isLoading && contract && address) {
        try {
          // Get uploaded documents
          const uploadedData = await contract.call("getFiles", [address]);
          
          // Get received documents from localStorage cache
          const receivedFilesCache = JSON.parse(
            localStorage.getItem(`receivedFiles_${address}`) || "[]"
          );
          
          setSentCount(uploadedData.length);
          setReceivedCount(receivedFilesCache.length);
          
          // Process history for charts (last 7 days)
          const sentByDay = processHistoryData(uploadedData);
          const receivedByDay = processHistoryData(receivedFilesCache);
          
          setSentHistory(sentByDay);
          setReceivedHistory(receivedByDay);
          setLastUpdate(new Date());
          
          console.log('📊 Service Dashboard Updated:', {
            sent: uploadedData.length,
            received: receivedFilesCache.length
          });
        } catch (error) {
          console.error('Error fetching service dashboard data:', error);
        }
      }
    };

    fetchData();
    
    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchData, 10000);
    
    return () => clearInterval(interval);
  }, [address, contract, isLoading]);

  // Helper function to process documents by day
  const processHistoryData = (documents) => {
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      last7Days.push({
        date: date,
        label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count: 0
      });
    }
    
    // Count documents per day
    documents.forEach(doc => {
      let docDate;
      if (doc.timestamp) {
        // Convert blockchain timestamp
        const timestampHex = doc.timestamp.startsWith('0x') ? doc.timestamp.slice(2) : doc.timestamp;
        const timestampDecimal = BigInt('0x' + timestampHex);
        docDate = new Date(Number(timestampDecimal) * 1000);
      } else {
        docDate = new Date();
      }
      
      docDate.setHours(0, 0, 0, 0);
      
      const dayIndex = last7Days.findIndex(day => 
        day.date.getTime() === docDate.getTime()
      );
      
      if (dayIndex !== -1) {
        last7Days[dayIndex].count++;
      }
    });
    
    return last7Days;
  };

  const sdata = {
    labels: sentHistory.map(day => day.label),
    datasets: [
      {
        label: 'Documents Sent',
        data: sentHistory.map(day => day.count),
        fill: true,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.4,
      },
    ],
  };

  const rdata = {
    labels: receivedHistory.map(day => day.label),
    datasets: [
      {
        label: 'Documents Received',
        data: receivedHistory.map(day => day.count),
        fill: true,
        backgroundColor: 'rgba(50, 205, 50, 0.2)',
        borderColor: 'lime',
        tension: 0.4,
      },
    ],
  };

  return (
    <Section
      className="pt-[8rem] min-h-screen -mt-[4rem]"
      crosses
      crossesOffset="lg:translate-y-[5.25rem]"
      customPaddings
      id="share"
    >
      
      <Split expandToMin={false} minSize={40} className="relative container flex gap-2 mt-8 mb-16">
        <RightBox />
        <LeftBox />
      </Split>
      <h1 className="text-center font-bold text-3xl md:text-4xl mb-4 md:mb-8 mt-16">
        Service Dashboard
      </h1>
      
      {/* Real-time Status Indicator */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-900/30 border border-green-500/50 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-300 text-sm font-semibold">
            Live Data • Auto-refresh every 10s
          </span>
          <span className="text-gray-400 text-xs">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </span>
        </div>
      </div>

      <div className="flex justify-center flex-wrap gap-4 mt-8">
        <div className="w-full lg:w-[710px] bg-zinc-800 p-4 rounded-[10px] shadow-lg">
          <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 p-4 rounded-lg shadow-lg mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <FaFileUpload />
                  Total Documents Sent
                </h3>
                <p className="text-4xl font-bold mt-2">{sentCount} Files</p>
                <p className="text-cyan-200 text-sm mt-1">
                  {sentCount > 0 ? `${sentHistory[sentHistory.length - 1]?.count || 0} sent today` : 'No documents sent yet'}
                </p>
              </div>
              <div className="text-5xl opacity-20">
                📤
              </div>
            </div>
          </div>
          <Line data={sdata} options={{
            responsive: true,
            plugins: {
              legend: {
                labels: { color: 'white' }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: { 
                  color: 'white',
                  stepSize: 1
                },
                grid: { color: 'rgba(255, 255, 255, 0.1)' }
              },
              x: {
                ticks: { color: 'white' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' }
              }
            }
          }} />
        </div>
        <div className="w-full lg:w-[710px] bg-zinc-800 p-4 rounded-[10px] shadow-lg">
          <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 rounded-lg shadow-lg mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <FaFileDownload />
                  Total Documents Received
                </h3>
                <p className="text-4xl font-bold mt-2">{receivedCount} Files</p>
                <p className="text-green-200 text-sm mt-1">
                  {receivedCount > 0 ? `${receivedHistory[receivedHistory.length - 1]?.count || 0} received today` : 'No documents received yet'}
                </p>
              </div>
              <div className="text-5xl opacity-20">
                📥
              </div>
            </div>
          </div>
          <Line data={rdata} options={{
            responsive: true,
            plugins: {
              legend: {
                labels: { color: 'white' }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: { 
                  color: 'white',
                  stepSize: 1
                },
                grid: { color: 'rgba(255, 255, 255, 0.1)' }
              },
              x: {
                ticks: { color: 'white' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' }
              }
            }
          }} />
        </div>
      </div>

      
    </Section>
  );
};

export default Share;

