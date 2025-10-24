import React, { useState } from 'react';
import axios from 'axios';
import Section from './Section';
import Button from './Button';

const SOSRequest = () => {
  const [formData, setFormData] = useState({
    contactNumber: '',
    reason: '',
    healthProblem: '',
    estimatedTime: '',
    language: 'english',
  });
  const [answer, setAnswer] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitProgress, setSubmitProgress] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const generateAnswer = async (retryCount = 0) => {
    const MAX_RETRIES = 3;
    const languageMapping = {
      english: 'in English',
      hindi: 'in Hindi',
      telugu: 'in Telugu',
      spanish: 'in Spanish',
      french: 'in French',
      german: 'in German',
      italian: 'in Italian',
      portuguese: 'in Portuguese',
      russian: 'in Russian',
      japanese: 'in Japanese',
      korean: 'in Korean',
      chinese: 'in Chinese (Simplified)',
      arabic: 'in Arabic',
      bengali: 'in Bengali',
      urdu: 'in Urdu',
      punjabi: 'in Punjabi',
      marathi: 'in Marathi',
      tamil: 'in Tamil',
      gujarati: 'in Gujarati',
      kannada: 'in Kannada',
      malayalam: 'in Malayalam',
      odia: 'in Odia',
      thai: 'in Thai',
      vietnamese: 'in Vietnamese',
      indonesian: 'in Indonesian',
      malay: 'in Malay',
      dutch: 'in Dutch',
      polish: 'in Polish',
      turkish: 'in Turkish',
      greek: 'in Greek',
      swedish: 'in Swedish',
      danish: 'in Danish',
      norwegian: 'in Norwegian',
      finnish: 'in Finnish',
    };

    try {
      console.log('Generating answer for language:', formData.language, `(Attempt ${retryCount + 1}/${MAX_RETRIES + 1})`);
      console.log('Language mapping:', languageMapping[formData.language]);
      
      if (retryCount > 0) {
        setAnswer(`⏳ Retrying... (Attempt ${retryCount + 1}/${MAX_RETRIES + 1})`);
      }
      
      const response = await axios.post(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=AIzaSyBGe74bxJu3TrJZqvVK3JpWBVXjYC-PkVc',
        {
          contents: [{
            parts: [{
              text: `I have ${formData.estimatedTime} minutes left for the ambulance to come. Could you please guide me in detail on what steps I should follow to reduce pain or get some relief? I have this problem: ${formData.healthProblem} and ${formData.reason}. It's severe, and don't mention calling an ambulance or 911, as we have already done that and it will come after ${formData.estimatedTime} minutes. Give response ${languageMapping[formData.language]}.`
            }]
          }]
        },
        {
          timeout: 30000, // 30 second timeout
        }
      );
      
      console.log('Full API response:', response.data);
      
      if (response.data && response.data.candidates && response.data.candidates[0]) {
        const candidate = response.data.candidates[0];
        
        // Check if content was blocked
        if (candidate.finishReason === 'SAFETY' || candidate.finishReason === 'RECITATION') {
          console.warn('Content blocked by safety filters:', candidate.finishReason);
          setAnswer('⚠️ The AI response was blocked for safety reasons. Please try rephrasing your health problem description or try again.');
          return;
        }
        
        if (candidate.content && candidate.content.parts && candidate.content.parts[0] && candidate.content.parts[0].text) {
          setAnswer(candidate.content.parts[0].text);
        } else {
          console.error('Unexpected response structure:', candidate);
          setAnswer('Error: Unable to generate answer. The response format was unexpected. Please try again.');
        }
      } else {
        console.error('No candidates in response:', response.data);
        setAnswer('Error: Unable to generate answer. Please check your internet connection and try again.');
      }
    } catch (error) {
      console.error('Error generating answer:', error);
      console.error('Error details:', error.response?.data);
      
      const status = error.response?.status;
      
      // Retry logic for temporary server errors (503, 500, 502, 504)
      if ([500, 502, 503, 504].includes(status) && retryCount < MAX_RETRIES) {
        const delay = Math.min(1000 * Math.pow(2, retryCount), 5000); // Exponential backoff: 1s, 2s, 4s
        console.log(`Server error ${status}. Retrying in ${delay}ms...`);
        setAnswer(`⏳ Server is busy (Error ${status}). Retrying in ${delay/1000} seconds... (Attempt ${retryCount + 1}/${MAX_RETRIES})`);
        
        setTimeout(() => {
          generateAnswer(retryCount + 1);
        }, delay);
        return;
      }
      
      // Handle specific error codes
      if (status === 429) {
        setAnswer('⚠️ API rate limit exceeded. Please wait a minute and try again.');
      } else if (status === 403) {
        setAnswer('⚠️ API key issue. Please contact support.');
      } else if ([500, 502, 503, 504].includes(status)) {
        setAnswer(`⚠️ AI service is temporarily unavailable (Error ${status}). Please try again in a few moments. The ambulance is still on the way!`);
      } else if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
        setAnswer('⚠️ Network error or timeout. Please check your internet connection and try again.');
      } else {
        setAnswer('⚠️ Unable to generate AI guidance at this moment. Please follow basic first aid procedures while waiting for the ambulance.');
      }
    }
  };

  const handleSubmit = async () => {
    const { contactNumber, reason, healthProblem, estimatedTime, language } = formData;
    
    // Clear previous messages
    setErrorMessage('');
    setSuccessMessage('');
    setAnswer('');
    
    // Validation
    if (!contactNumber || !reason || !healthProblem || !estimatedTime || !language) {
      setErrorMessage('❌ Please fill out all fields before submitting.');
      return;
    }

    // Validate contact number (basic check for 10 digits)
    if (!/^\d{10}$/.test(contactNumber)) {
      setErrorMessage('❌ Please enter a valid 10-digit contact number.');
      return;
    }

    // Validate estimated time is a number
    if (!/^\d+$/.test(estimatedTime)) {
      setErrorMessage('❌ Please enter estimated time in minutes (numbers only).');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Step 1: Get user's location
      setSubmitProgress('📍 Step 1/3: Getting your location...');
      
      const location = await new Promise((resolve, reject) => {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
            },
            (error) => {
              console.warn('Geolocation error:', error);
              // Fallback to static location if user denies or error occurs
              resolve({
                latitude: 17.385044,
                longitude: 78.486671,
              });
            },
            {
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 0,
            }
          );
        } else {
          // Fallback to static location if geolocation not supported
          resolve({
            latitude: 17.385044,
            longitude: 78.486671,
          });
        }
      });

      const data = {
        ...formData,
        location: {
          type: 'Point',
          coordinates: [location.longitude, location.latitude],
        },
      };

      // Step 2: Send SOS request to backend
      setSubmitProgress('🚨 Step 2/3: Sending SOS request to emergency services...');
      const response = await axios.post('http://localhost:3000/sos', data);
      console.log('SOS request sent successfully:', response.data);

      // Step 3: Generate AI first-aid guidance
      setSubmitProgress('🤖 Step 3/3: Generating first-aid guidance...');
      await generateAnswer();

      setSubmitProgress('');
      setSuccessMessage('✅ SOS request sent successfully! Ambulance has been notified. Follow the guidance on the right.');
      
      // Clear form
      setFormData({
        contactNumber: '',
        reason: '',
        healthProblem: '',
        estimatedTime: '',
        language: 'english',
      });

    } catch (error) {
      console.error('Error sending SOS request:', error);
      setSubmitProgress('');
      if (error.code === 'ERR_NETWORK') {
        setErrorMessage('❌ Cannot connect to emergency services backend. Make sure the server is running on port 3000.');
      } else {
        setErrorMessage('❌ Error sending SOS request. Please try again or call emergency services directly.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Section>
      <div className="flex flex-col md:flex-row justify-between">
        <div className="left w-full md:w-3/5 left-0 max-w-3xl mx-auto bg-black shadow-md rounded border border-zinc-800 px-8 pt-6 pb-8 mb-4 md:ml-16">
          <h2 className="text-2xl font-bold mb-6 text-red-500">Emergency SOS Request</h2>
          {errorMessage && (
            <div className="bg-red-900/30 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="bg-green-900/30 border border-green-500 text-green-200 px-4 py-3 rounded mb-4">
              {successMessage}
            </div>
          )}
          {submitProgress && (
            <div className="bg-blue-900/30 border border-blue-500 text-blue-200 px-4 py-3 rounded mb-4 flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400 mr-3"></div>
              <span>{submitProgress}</span>
            </div>
          )}
          <div className="mb-3">
            <label className="block text-white mb-2">Contact Number:</label>
            <input
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              className="block appearance-none border border-zinc-800 bg-black w-full rounded py-2 px-3 mb-3 leading-tight focus:outline-none focus:border-red-500 text-white"
              placeholder="Enter 10-digit Contact Number"
              maxLength="10"
              pattern="\d{10}"
              disabled={isSubmitting}
              required
            />
          </div>
          <div className="mb-3">
            <label className="block text-white mb-2">Reason for SOS:</label>
            <input
              type="text"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              className="block appearance-none border border-zinc-800 bg-black w-full rounded py-2 px-3 mb-3 leading-tight focus:outline-none focus:border-red-500 text-white"
              placeholder="e.g., Accident, Heart Attack, Fall"
              disabled={isSubmitting}
              required
            />
          </div>
          <div className="mb-3">
            <label className="block text-white mb-2">Health Problem:</label>
            <textarea
              name="healthProblem"
              value={formData.healthProblem}
              onChange={handleChange}
              className="block appearance-none border border-zinc-800 bg-black w-full rounded py-2 px-3 mb-3 leading-tight focus:outline-none focus:border-red-500 text-white"
              placeholder="Describe symptoms in detail"
              rows="3"
              disabled={isSubmitting}
              required
            />
          </div>
          <div className="mb-3">
            <label className="block text-white mb-2">Estimated Time Needed:</label>
            <input
              type="number"
              name="estimatedTime"
              value={formData.estimatedTime}
              onChange={handleChange}
              className="block appearance-none border border-zinc-800 bg-black w-full rounded py-2 px-3 mb-3 leading-tight focus:outline-none focus:border-red-500 text-white"
              placeholder="Estimated Time in Minutes (e.g., 30)"
              min="1"
              max="120"
              disabled={isSubmitting}
              required
            />
          </div>
          <div className="mb-3">
            <label className="block text-white mb-2">Choose Language for AI Guidance:</label>
            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="block appearance-none w-full bg-black border border-zinc-800 text-white py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:border-red-500"
              disabled={isSubmitting}
            >
              <optgroup label="Indian Languages">
                <option value="english">English</option>
                <option value="hindi">Hindi (हिंदी)</option>
                <option value="bengali">Bengali (বাংলা)</option>
                <option value="telugu">Telugu (తెలుగు)</option>
                <option value="marathi">Marathi (मराठी)</option>
                <option value="tamil">Tamil (தமிழ்)</option>
                <option value="gujarati">Gujarati (ગુજરાતી)</option>
                <option value="urdu">Urdu (اردو)</option>
                <option value="kannada">Kannada (ಕನ್ನಡ)</option>
                <option value="malayalam">Malayalam (മലയാളം)</option>
                <option value="punjabi">Punjabi (ਪੰਜਾਬੀ)</option>
                <option value="odia">Odia (ଓଡ଼ିଆ)</option>
              </optgroup>
              <optgroup label="European Languages">
                <option value="spanish">Spanish (Español)</option>
                <option value="french">French (Français)</option>
                <option value="german">German (Deutsch)</option>
                <option value="italian">Italian (Italiano)</option>
                <option value="portuguese">Portuguese (Português)</option>
                <option value="russian">Russian (Русский)</option>
                <option value="dutch">Dutch (Nederlands)</option>
                <option value="polish">Polish (Polski)</option>
                <option value="turkish">Turkish (Türkçe)</option>
                <option value="greek">Greek (Ελληνικά)</option>
                <option value="swedish">Swedish (Svenska)</option>
                <option value="danish">Danish (Dansk)</option>
                <option value="norwegian">Norwegian (Norsk)</option>
                <option value="finnish">Finnish (Suomi)</option>
              </optgroup>
              <optgroup label="Asian Languages">
                <option value="chinese">Chinese (中文)</option>
                <option value="japanese">Japanese (日本語)</option>
                <option value="korean">Korean (한국어)</option>
                <option value="arabic">Arabic (العربية)</option>
                <option value="thai">Thai (ไทย)</option>
                <option value="vietnamese">Vietnamese (Tiếng Việt)</option>
                <option value="indonesian">Indonesian (Bahasa Indonesia)</option>
                <option value="malay">Malay (Bahasa Melayu)</option>
              </optgroup>
            </select>
          </div>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? '🚨 Sending Emergency Request...' : '🚨 Send SOS Request'}
          </Button>
        </div>
        <div className="right md:w-1/2 text-lg mt-4 md:mt-0 md:ml-4 rounded border border-zinc-800 px-8 pt-6 pb-8 mr-16 ">
          <h1 className="text-2xl font-bold mb-4 text-green-600">
            {answer ? '✅ Ambulance is on the way. Follow these steps:' : '📋 First-Aid Guidance Will Appear Here'}
          </h1> 
          {answer ? (
            <p className='text-white font-extralight whitespace-pre-line'>{answer}</p>
          ) : (
            <div className="text-gray-400 text-center py-8">
              <p className="mb-4">👈 Fill out the emergency form on the left</p>
              <p className="text-sm">After submitting, AI-powered first-aid guidance will appear here based on your health problem and estimated ambulance arrival time.</p>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
};

export default SOSRequest;
