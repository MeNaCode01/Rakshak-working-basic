import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { toPng } from "html-to-image";
import { saveAs } from "file-saver";

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [departments, setDepartments] = useState([]);
  const qrCodeRefs = useRef({});

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get("http://localhost:3000/patients");
        const allPatients = response.data;
        setPatients(allPatients);

        // Extract unique departments
        const uniqueDepts = [
          ...new Set(allPatients.map((p) => p.department || "Unassigned")),
        ];
        setDepartments(["All", ...uniqueDepts.sort()]);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };
    fetchPatients();

    // Refresh every 10 seconds for real-time updates (reduced frequency to avoid QR regeneration spam)
    const interval = setInterval(fetchPatients, 10000);

    return () => clearInterval(interval);
  }, []);

  // Filter patients when department selection changes
  useEffect(() => {
    if (selectedDepartment === "All") {
      setFilteredPatients(patients);
    } else {
      setFilteredPatients(
        patients.filter(
          (p) => (p.department || "Unassigned") === selectedDepartment
        )
      );
    }
  }, [selectedDepartment, patients]);

  const generateQRCodeData = (patient) => {
    return `http://localhost:5173/patient/${patient._id}`;
  };

  const downloadQRCode = async (id) => {
    const node = qrCodeRefs.current[id];
    const dataUrl = await toPng(node, {
      quality: 1.0,
      pixelRatio: 3, // Higher resolution for better quality
      backgroundColor: "#ffffff",
    });
    saveAs(dataUrl, `patient-${id}-qrcode.png`);
  };

  const deletePatient = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/patients/${id}`);
      setPatients(patients.filter((patient) => patient._id !== id));
    } catch (error) {
      console.error("Error deleting patient:", error);
    }
  };

  let count = 1;

  return (
    <div className="text-white flex flex-col justify-center items-center w-full mt-4">
      <div className="w-full mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Patient Records</h2>

        {/* Department Filter Dropdown */}
        <div className="flex items-center space-x-3">
          <label className="text-sm font-medium text-purple-300">
            Filter by Department:
          </label>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-4 py-2 bg-zinc-800 border border-purple-500/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-400">
            ({filteredPatients.length}{" "}
            {filteredPatients.length === 1 ? "patient" : "patients"})
          </span>
        </div>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full bg-gray-900 rounded-lg overflow-hidden">
          <thead className="bg-zinc-800">
            <tr className="text-left text-white">
              <th className="px-6 py-3 text-lg font-bold uppercase border-b border-gray-700">
                Sno
              </th>
              <th className="px-6 py-3 text-lg font-bold uppercase border-b border-gray-700">
                Name
              </th>
              <th className="px-6 py-3 text-lg font-bold uppercase border-b border-gray-700">
                Department
              </th>
              <th className="px-6 py-3 text-lg font-bold uppercase border-b border-gray-700">
                Age
              </th>
              <th className="px-6 py-3 text-lg font-bold uppercase border-b border-gray-700">
                Gender
              </th>
              <th className="px-6 py-3 text-lg font-bold uppercase border-b border-gray-700">
                Blood Type
              </th>
              <th className="px-6 py-3 text-lg font-bold uppercase border-b border-gray-700">
                Allergies
              </th>
              <th className="px-6 py-3 text-lg font-bold uppercase border-b border-gray-700">
                Diagnosis
              </th>
              <th className="px-6 py-3 text-lg font-bold uppercase border-b border-gray-700">
                Treatment
              </th>
              <th className="px-6 py-3 text-lg font-bold uppercase border-b border-gray-700">
                QR Code
              </th>
              <th className="px-6 py-3 text-lg font-bold uppercase border-b border-gray-700">
                Download
              </th>
              <th className="px-6 py-3 text-lg font-bold uppercase border-b border-gray-700">
                Delete
              </th>
            </tr>
          </thead>
          <tbody className="divide-y text-light divide-zinc-800">
            {filteredPatients.map((patient) => (
              <tr
                key={patient._id}
                className="text-white text-lg bg-zinc-700 hover:bg-zinc-800"
              >
                <td className="px-6 py-4">{count++}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link to={`/patient/${patient._id}`}>
                    {patient.patientName}
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-900/50 text-purple-300 border border-purple-500/30">
                    {patient.department || "N/A"}
                  </span>
                </td>
                <td className="px-6 py-4">{patient.age}</td>
                <td className="px-6 py-4">{patient.gender}</td>
                <td className="px-6 py-4">{patient.bloodType}</td>
                <td className="px-6 py-4">{patient.allergies}</td>
                <td className="px-6 py-4">{patient.diagnosis}</td>
                <td className="px-6 py-4">{patient.treatment}</td>
                <td className="px-6 py-4">
                  <div
                    ref={(el) => (qrCodeRefs.current[patient._id] = el)}
                    className="bg-white p-2 inline-block rounded"
                  >
                    <QRCodeSVG
                      value={generateQRCodeData(patient)}
                      size={80}
                      level="H"
                      includeMargin={true}
                      bgColor="#ffffff"
                      fgColor="#000000"
                    />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => downloadQRCode(patient._id)}
                    className="bg-amber-700 hover:bg-amber-800 text-white font-light py-2 px-4 rounded"
                  >
                    Download
                  </button>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => deletePatient(patient._id)}
                    className="bg-red-700 hover:bg-red-800 text-white font-light py-2 px-4 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientList;
