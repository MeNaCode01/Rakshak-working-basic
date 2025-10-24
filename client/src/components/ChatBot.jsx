import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  FaHeartbeat,
  FaNotesMedical,
  FaClock,
  FaThermometerHalf,
} from "react-icons/fa";
import { MdCheckCircle } from "react-icons/md";
import Section from "./Section";
import Button from "./Button";

const DiseaseInputForm = () => {
  const [formData, setFormData] = useState({
    symptoms: "",
    medicalHistory: "",
    duration: "",
    severity: "",
  });
  const [answer, setAnswer] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const generateAnswer = async () => {
    setIsGenerating(true);
    setErrorMessage("");
    setSuccessMessage("Generating AI response...");
    setAnswer("");

    try {
      // Add timeout wrapper
      const timeoutPromise = new Promise(
        (_, reject) =>
          setTimeout(() => reject(new Error("Request timeout")), 30000) // 30 second timeout
      );

      const apiPromise = axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=AIzaSyBGe74bxJu3TrJZqvVK3JpWBVXjYC-PkVc",
        {
          contents: [
            {
              parts: [
                {
                  text: `According to your knowledge if a person has these ${formData.symptoms}, with the medical history ${formData.medicalHistory}, and from the duration of ${formData.duration}, and with ${formData.severity} severity, could you please provide more details or ask for advice on how to manage or treat your condition?`,
                },
              ],
            },
          ],
        }
      );

      const response = await Promise.race([apiPromise, timeoutPromise]);

      if (
        response.data &&
        response.data.candidates &&
        response.data.candidates[0] &&
        response.data.candidates[0].content &&
        response.data.candidates[0].content.parts
      ) {
        setAnswer(response.data.candidates[0].content.parts[0].text);
        setSuccessMessage("✓ Answer generated successfully!");
        setTimeout(() => setSuccessMessage(""), 3000); // Clear success message after 3 seconds
      } else {
        setAnswer("Error: Unable to generate answer. Please try again.");
        setErrorMessage("Failed to get a valid response from AI.");
        setSuccessMessage("");
      }
    } catch (error) {
      console.error("Error generating answer:", error);
      if (error.message === "Request timeout") {
        setAnswer(
          "Error: The request took too long. Please try again with a shorter query."
        );
        setErrorMessage(
          "⏱️ Request timed out. The AI is taking too long to respond."
        );
      } else {
        setAnswer(
          "Error: Unable to generate answer. Please check your internet connection and try again."
        );
        setErrorMessage("❌ Failed to generate response. Please try again.");
      }
      setSuccessMessage("");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { symptoms, medicalHistory, duration, severity } = formData;
    if (!symptoms || !medicalHistory || !duration || !severity) {
      setErrorMessage("Please fill out all fields.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    setErrorMessage("");
    await generateAnswer();

    setFormData({
      symptoms: "",
      medicalHistory: "",
      duration: "",
      severity: "",
    });
  };

  return (
    <Section>
      <div className="flex flex-col md:flex-row justify-between">
        <div className="left w-full md:w-3/5 left-0 max-w-3xl mx-auto bg-black shadow-md rounded border border-zinc-800 px-8 pt-6 pb-8 mb-4 md:ml-16">
          <h2 className="text-2xl font-light mb-6 ">
            <FaHeartbeat className="inline-block mr-2 text-purple-500" />{" "}
            Disease Input Form
          </h2>
          {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
          {successMessage && (
            <p className="text-green-500 mb-4">{successMessage}</p>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="block text-white mb-2">
                <FaNotesMedical className="inline-block mr-2" /> Symptoms:
              </label>
              <input
                type="text"
                name="symptoms"
                value={formData.symptoms}
                onChange={handleChange}
                className="block appearance-none border border-zinc-800 w-full rounded py-2 px-3 mb-3 leading-tight focus:outline-none focus:shadow-outline text-white"
                placeholder="Enter Symptoms"
                required
              />
            </div>
            <div className="mb-3">
              <label className="block text-white mb-2">
                <FaNotesMedical className="inline-block mr-2" /> Medical
                History:
              </label>
              <input
                type="text"
                name="medicalHistory"
                value={formData.medicalHistory}
                onChange={handleChange}
                className="block appearance-none border border-zinc-800 w-full rounded py-2 px-3 mb-3 leading-tight focus:outline-none focus:shadow-outline text-white"
                placeholder="Enter Medical History"
                required
              />
            </div>
            <div className="mb-3">
              <label className="block text-white mb-2">
                <FaClock className="inline-block mr-2" /> Duration:
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="block appearance-none border border-zinc-800 w-full rounded py-2 px-3 mb-3 leading-tight focus:outline-none focus:shadow-outline text-white"
                placeholder="Enter Duration"
                required
              />
            </div>
            <div className="mb-3">
              <label className="block text-white mb-2">
                <FaThermometerHalf className="inline-block mr-2" /> Severity:
              </label>
              <input
                type="text"
                name="severity"
                value={formData.severity}
                onChange={handleChange}
                className="block appearance-none border border-zinc-800 w-full rounded py-2 px-3 mb-3 leading-tight focus:outline-none focus:shadow-outline text-white"
                placeholder="Enter Severity"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isGenerating}
              className={`${
                isGenerating
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700"
              } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200`}
            >
              {isGenerating ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Generating...
                </span>
              ) : (
                "Generate Answer"
              )}
            </button>
          </form>
        </div>
        <div className="right md:w-1/2 text-lg mt-4 md:mt-0 md:ml-4 rounded border h-[465px] border-zinc-800 px-8 pt-6 pb-8 mr-16 overflow-y-auto">
          <h1 className="text-2xl font-light mb-4 text-white">
            <MdCheckCircle className="inline-block mr-2 text-green-600" />{" "}
            Diagnosis and Management Advice:
          </h1>
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center h-64">
              <svg
                className="animate-spin h-12 w-12 text-purple-500 mb-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <p className="text-purple-400 animate-pulse">
                Analyzing your symptoms with AI...
              </p>
              <p className="text-zinc-500 text-sm mt-2">
                This may take up to 30 seconds
              </p>
            </div>
          ) : answer ? (
            <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-700">
              <p className="text-zinc-300 font-light text-base leading-relaxed whitespace-pre-wrap">
                {answer}
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-zinc-600">
              <p className="text-center">
                Fill out the form and click "Generate Answer" to get AI-powered
                medical advice.
              </p>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
};

export default DiseaseInputForm;
