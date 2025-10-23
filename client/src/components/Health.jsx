import React, { useState } from 'react';
import Section from './Section';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaArrowRight } from 'react-icons/fa';
import { MdMedicalServices } from 'react-icons/md';
import Button from './Button';
import DiseaseInputForm from './ChatBot';
import DiseaseSpreadChart from './DiseaseSpreadChart';
import FoodNutrientsGraph from './FoodNutrientGraph';

const VideoCallInput = () => {
  const [input, setInput] = useState('');
  const [mlServiceRunning, setMlServiceRunning] = useState(false);
  const [checking, setChecking] = useState(true);
  const [starting, setStarting] = useState(false);
  const navigate = useNavigate();

  // Check if ML service is running
  const checkMLService = async () => {
    try {
      const response = await fetch('http://localhost:8501/_stcore/health', { method: 'GET' });
      setMlServiceRunning(true);
    } catch (error) {
      setMlServiceRunning(false);
    } finally {
      setChecking(false);
    }
  };

  // Auto-start ML service via backend
  const startMLService = async () => {
    setStarting(true);
    try {
      // Call backend to start ML service
      await fetch('http://localhost:5001/start-ml-service', { method: 'POST' });
      
      // Wait and check if it started
      let attempts = 0;
      const checkInterval = setInterval(async () => {
        attempts++;
        try {
          const response = await fetch('http://localhost:8501/_stcore/health');
          if (response.ok || attempts > 20) {
            clearInterval(checkInterval);
            setStarting(false);
            checkMLService();
            if (response.ok) {
              window.open('http://localhost:8501', '_blank');
            }
          }
        } catch (e) {
          // Still starting...
        }
      }, 1000);
    } catch (error) {
      console.error('Error starting ML service:', error);
      setStarting(false);
    }
  };

  React.useEffect(() => {
    checkMLService();
    // Recheck every 5 seconds
    const interval = setInterval(checkMLService, 5000);
    return () => clearInterval(interval);
  }, []);

  const submitHandler = () => {
    navigate(`/room/${input}`);
  };

  return (
    <Section>
      <h1 className="text-3xl font-bold mb-8 -mt-8 text-center text-zinc-600">
        Workspace for Doctors
      </h1>
      <div className="flex flex-col md:flex-row justify-between gap-2">
        <div className="left w-full md:w-3/5 left-0 max-w-3xl h-52 mx-auto bg-black shadow-md rounded border border-zinc-800 px-8 pt-6 pb-8 mb-4 md:ml-16">
          <h1 className="text-2xl font-light mb-6 text-white">
            <FaUser className="inline-block mr-2 text-red-500 font-normal" /> End to end encrypted meetings
          </h1>
          <div className="mb-6">
            <div className="flex items-center rounded-full overflow-hidden w-full bg-gray-800 px-4 py-2 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-opacity-75">
              <FaEnvelope className="text-gray-400 mr-3" />
              <input
                type="text"
                className="flex-grow px-3 py-2 bg-transparent text-white focus:outline-none placeholder-gray-400"
                placeholder="Enter name or email address"
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                className="flex items-center px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-r-full"
                onClick={submitHandler}
                disabled={!input}
              >
                <FaArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        <div className="right md:w-1/2 text-lg mt-4 md:mt-0 h-52 md:ml-4 rounded border border-zinc-800 px-8 pt-6 pb-8 mr-16">
          <h1 className="text-2xl font-light mb-4 text-white">
            <MdMedicalServices className="inline-block mr-2 text-green-600" /> Advance disease detection using ML and Deep Learning
          </h1>
          
                    {checking ? (
            <Button className="w-full mt-4" disabled>
              🔄 Checking ML service status...
            </Button>
          ) : mlServiceRunning ? (
            <Button 
              className="w-full mt-4 bg-green-600 hover:bg-green-700" 
              onClick={() => window.open('http://localhost:8501', '_blank')}
            >
              <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              Open ML Dashboard
            </Button>
          ) : starting ? (
            <Button className="w-full mt-4" disabled>
              <span className="inline-block w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse"></span>
              Starting ML Service... (this may take 20-30 seconds)
            </Button>
          ) : (
            <Button 
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700" 
              onClick={startMLService}
            >
              🚀 Start Advanced Disease Prediction
            </Button>
          )}
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-center mt-8 gap-4">
        <div className="w-full md:w-1/2 mb-8 mx-auto ml-28">
          <DiseaseSpreadChart />
        </div>
        <div className="w-full md:w-1/2 mb-8 mx-auto mr-24">
          <FoodNutrientsGraph />
        </div>
      </div>
      <div className="-mt-16 ">
        <DiseaseInputForm />
      </div>
      
    </Section>
  );
};

export default VideoCallInput;
