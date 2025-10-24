import React, { useState } from "react";
import Section from "./Section";
import Button from "./Button";
import axios from "axios";

const PatientRecord = () => {
  const [patientName, setPatientName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [allergies, setAllergies] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [treatment, setTreatment] = useState("");
  const [department, setDepartment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newPatient = {
        patientName,
        age,
        gender,
        bloodType,
        allergies,
        diagnosis,
        treatment,
        department,
      };
      const response = await axios.post(
        "http://localhost:3000/patient",
        newPatient,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Patient record created:", response.data);
      alert(
        `✅ Patient record created successfully!\nDepartment: ${department}\nPatient: ${patientName}`
      );
      setPatientName("");
      setAge("");
      setGender("");
      setBloodType("");
      setAllergies("");
      setDiagnosis("");
      setTreatment("");
      setDepartment("");
    } catch (error) {
      console.error("Error creating patient record:", error);
      alert("❌ Error creating patient record. Please try again.");
    }
  };

  return (
    <Section className="text-white flex justify-center items-center -mt-10">
      <form
        onSubmit={handleSubmit}
        className="w-[1000px] rounded-md border bg-zinc-900 border-zinc-700 p-10"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-purple-500">
          Patient Consultation Record
        </h2>

        {/* Medical Department Selection */}
        <div className="mb-6 p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg">
          <label className="block text-lg font-bold mb-3 text-purple-400">
            🏥 Medical Department:
          </label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="block w-full px-4 py-3 rounded-md border-2 border-purple-500/50 bg-zinc-950 text-white text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            required
          >
            <option value="">Select Medical Department</option>
            <optgroup label="Surgical Departments">
              <option value="General Surgery">🔪 General Surgery</option>
              <option value="Orthopedics">
                🦴 Orthopedics (Bones & Joints)
              </option>
              <option value="Neurosurgery">
                🧠 Neurosurgery (Brain & Spine)
              </option>
              <option value="Cardiothoracic Surgery">
                ❤️ Cardiothoracic Surgery (Heart & Chest)
              </option>
              <option value="Plastic Surgery">
                ✨ Plastic & Reconstructive Surgery
              </option>
              <option value="Urology">🩺 Urology (Urinary System)</option>
            </optgroup>
            <optgroup label="Medical Departments">
              <option value="Internal Medicine">🏥 Internal Medicine</option>
              <option value="Cardiology">💓 Cardiology (Heart)</option>
              <option value="Pulmonology">🫁 Pulmonology (Lungs)</option>
              <option value="Gastroenterology">
                🍽️ Gastroenterology (Digestive System)
              </option>
              <option value="Nephrology">💧 Nephrology (Kidneys)</option>
              <option value="Endocrinology">⚡ Endocrinology (Hormones)</option>
              <option value="Rheumatology">
                🦴 Rheumatology (Autoimmune & Joints)
              </option>
              <option value="Hematology">
                🩸 Hematology (Blood Disorders)
              </option>
              <option value="Oncology">🎗️ Oncology (Cancer)</option>
            </optgroup>
            <optgroup label="Specialized Departments">
              <option value="Pediatrics">👶 Pediatrics (Children)</option>
              <option value="Obstetrics & Gynecology">
                🤰 Obstetrics & Gynecology (Women's Health)
              </option>
              <option value="ENT">👂 ENT (Ear, Nose & Throat)</option>
              <option value="Ophthalmology">👁️ Ophthalmology (Eyes)</option>
              <option value="Dermatology">🧴 Dermatology (Skin)</option>
              <option value="Psychiatry">🧠 Psychiatry (Mental Health)</option>
              <option value="Neurology">🧠 Neurology (Nervous System)</option>
              <option value="Radiology">📸 Radiology (Medical Imaging)</option>
              <option value="Anesthesiology">💉 Anesthesiology</option>
              <option value="Emergency Medicine">🚑 Emergency Medicine</option>
              <option value="Infectious Diseases">
                🦠 Infectious Diseases
              </option>
            </optgroup>
            <optgroup label="Dental & Allied">
              <option value="Dentistry">🦷 Dentistry</option>
              <option value="Physiotherapy">🏃 Physiotherapy</option>
              <option value="Nutrition & Dietetics">
                🥗 Nutrition & Dietetics
              </option>
            </optgroup>
          </select>
          {department && (
            <p className="mt-2 text-sm text-purple-300">
              ✓ Selected: <span className="font-bold">{department}</span>
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Patient Name:
            </label>
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="block w-full px-3 py-2 rounded-md border border-zinc-700 bg-transparent text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Age:</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="block w-full px-3 py-2 rounded-md border border-zinc-700 bg-transparent text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Gender:</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="block w-full px-3 py-2 rounded-md border border-zinc-700 bg-transparent text-white bg-zinc-950 focus:outline-none focus:ring-1 focus:ring-purple-500"
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non-binary">Non-Binary</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Blood Type:
            </label>
            <select
              value={bloodType}
              onChange={(e) => setBloodType(e.target.value)}
              className="block w-full px-3 py-2 rounded-md border border-zinc-700 bg-transparent text-white bg-zinc-950 focus:outline-none focus:ring-1 focus:ring-purple-500"
              required
            >
              <option value="">Select Blood Type</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Allergies (comma separated):
          </label>
          <input
            type="text"
            value={allergies}
            onChange={(e) => setAllergies(e.target.value)}
            className="block w-full px-3 py-2 rounded-md border border-zinc-700 bg-transparent text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Diagnosis:</label>
          <input
            type="text"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            className="block w-full px-3 py-2 rounded-md border border-zinc-700 bg-transparent text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Treatment:</label>
          <input
            type="text"
            value={treatment}
            onChange={(e) => setTreatment(e.target.value)}
            className="block w-full px-3 py-2 rounded-md border border-zinc-700 bg-transparent text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
            required
          />
        </div>
        <div className="flex justify-start w-56">
          <Button type="submit" className="w-56">
            Submit
          </Button>
        </div>
      </form>
    </Section>
  );
};

export default PatientRecord;
