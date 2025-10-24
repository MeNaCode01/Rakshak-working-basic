import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Section from './Section';
import Button from './Button';
import { curve } from '../assets';
import { AiOutlineAudio } from 'react-icons/ai'; // Import the AiOutlineAudio icon from react-icons

const MicListener = () => {
  const [isListening, setIsListening] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [commandDetected, setCommandDetected] = useState(false);
  const [transcript, setTranscript] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let recognition = null;

    const startRecognition = () => {
      recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMessage('');
        setTranscript('');
        console.log('Recognition started');
      };

      recognition.onresult = (event) => {
        if (!commandDetected) {
          const currentTranscript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');

          setTranscript(currentTranscript);
          console.log('Transcript:', currentTranscript);

          if (currentTranscript.toLowerCase().includes('emergency emergency')) {
            recognition.stop();
            setCommandDetected(true);
            setTranscript('✅ Emergency command detected!');
            speakResponse("Your ambulance is on the way.");
            
            // Small delay to show the confirmation message
            setTimeout(() => {
              navigate('/sosreq');
            }, 1000);
            
            console.log('Detected emergency command');
          }
        }
      };

      recognition.onerror = (event) => {
        console.error('Error occurred in recognition:', event.error);
        if (event.error === 'no-speech') {
          setErrorMessage('⚠️ No speech detected. Please try speaking again.');
          setTranscript('Waiting for speech...');
          // Auto-restart after no-speech error
          setTimeout(() => {
            if (isListening && !commandDetected) {
              setErrorMessage('');
              startRecognition();
            }
          }, 1000);
        } else if (event.error === 'network') {
          setErrorMessage('❌ Network error. Please check your internet connection.');
          recognition.stop();
        } else if (event.error === 'not-allowed') {
          setErrorMessage('❌ Microphone access denied. Please allow microphone access in browser settings.');
          recognition.stop();
        } else {
          setErrorMessage('❌ Error: ' + event.error);
          recognition.stop();
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        console.log('Recognition ended');
      };

      recognition.start();
    };

    const speakResponse = (text) => {
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    };

    if (isListening) {
      startRecognition();
    }

    return () => {
      if (recognition) {
        recognition.stop();
        console.log('Recognition stopped on cleanup');
      }
    };
  }, [isListening, navigate, commandDetected]);

  const handleToggleListening = () => {
    if (isListening) {
      setIsListening(false);
      setCommandDetected(false);
      setTranscript('');
    } else {
      setIsListening(true);
      setCommandDetected(false);
      setTranscript('Listening...');
    }
  };

  return (
    <Section className="pt-[12rem] -mt-[5.25rem] h-screen" crosses crossesOffset="lg:translate-y-[5.25rem]" customPaddings id="hero">
      <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[3.875rem] md:mb-12 lg:mb-[0.25rem]">
        <h1 className="h1 mb-6">
          Securing Medical Emergency by Booking an{' '}
          <span className="inline-block relative">
            Ambulance{' '}
            <img src={curve} className="absolute top-full left-0 w-full xl:-mt-2" width={624} height={28} alt="Curve" />
          </span>
        </h1>
        <p className="body-1 max-w-3xl mx-auto text-n-2 lg:mb-8">
          In urgent medical situations, swiftly book emergency services.
        </p>
      </div>
      <div className={`p-6 rounded-lg shadow-lg text-center transition-all ${isListening ? 'bg-red-900/20 border-2 border-red-500 animate-pulse' : 'bg-zinc-900 border border-zinc-800'}`}>
        <div className="flex flex-col items-center justify-center mb-4">
          <div className="relative mb-6">
            <AiOutlineAudio className={`w-16 h-16 ${isListening ? 'text-red-500 animate-bounce' : 'text-gray-400'}`} />
            {isListening && (
              <div className="absolute -inset-2 bg-red-500 rounded-full opacity-25 animate-ping"></div>
            )}
          </div>
          
          <button 
            onClick={handleToggleListening} 
            className={`px-8 py-4 text-xl font-bold rounded-lg shadow-md transition-all transform hover:scale-105 focus:outline-none focus:ring-4 ${
              isListening 
                ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500' 
                : 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
            }`}
          >
            {isListening ? '🛑 Stop Listening' : '🎤 Start Voice Emergency'}
          </button>
          
          <p className="mt-4 text-sm text-gray-400">
            {isListening ? 'Say "emergency emergency" to book ambulance' : 'Click the button and say "emergency emergency"'}
          </p>
        </div>
        
        {transcript && (
          <div className="mt-4 p-4 bg-zinc-800 rounded-lg border border-zinc-700">
            <p className="text-sm text-gray-400 mb-1">What you said:</p>
            <p className={`text-lg font-medium ${commandDetected ? 'text-green-400' : 'text-white'}`}>
              {transcript}
            </p>
          </div>
        )}
        
        {errorMessage && (
          <div className="mt-4 p-4 bg-red-900/30 border border-red-500 text-red-200 rounded-lg">
            {errorMessage}
          </div>
        )}
        
        {!isListening && !errorMessage && (
          <div className="mt-6 text-left bg-zinc-800 p-4 rounded-lg border border-zinc-700">
            <h3 className="text-white font-bold mb-2">📝 How to use:</h3>
            <ol className="text-gray-300 text-sm space-y-1 list-decimal list-inside">
              <li>Click the "Start Voice Emergency" button above</li>
              <li>Allow microphone access when prompted</li>
              <li>Clearly say "emergency emergency"</li>
              <li>You'll be automatically redirected to the emergency form</li>
            </ol>
          </div>
        )}
      </div>
    </Section>
  );
};

export default MicListener;
