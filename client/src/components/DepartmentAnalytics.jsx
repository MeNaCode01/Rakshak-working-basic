import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaHeart,
  FaBone,
  FaBrain,
  FaChild,
  FaEye,
  FaLungs,
  FaTooth,
  FaStethoscope,
  FaSyringe,
  FaAmbulance,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const DepartmentAnalytics = () => {
  const [departmentStats, setDepartmentStats] = useState([]);
  const [loading, setLoading] = useState(true);

  // Color palette for charts
  const COLORS = [
    "#8B5CF6",
    "#EC4899",
    "#F59E0B",
    "#10B981",
    "#3B82F6",
    "#EF4444",
    "#14B8A6",
    "#F97316",
    "#6366F1",
    "#84CC16",
  ];

  // Add custom scrollbar styles
  const scrollbarStyles = `
    .custom-scrollbar::-webkit-scrollbar {
      width: 8px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #27272a;
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #8B5CF6;
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #a78bfa;
    }
  `;

  // Department icon mapping
  const getDepartmentIcon = (dept) => {
    const iconMap = {
      Cardiology: <FaHeart className="text-red-500" />,
      Orthopedics: <FaBone className="text-amber-500" />,
      Neurology: <FaBrain className="text-purple-500" />,
      Neurosurgery: <FaBrain className="text-purple-600" />,
      Pediatrics: <FaChild className="text-pink-500" />,
      Ophthalmology: <FaEye className="text-blue-500" />,
      Pulmonology: <FaLungs className="text-cyan-500" />,
      Dentistry: <FaTooth className="text-gray-300" />,
      "General Surgery": <FaSyringe className="text-red-600" />,
      "Emergency Medicine": <FaAmbulance className="text-red-700" />,
    };
    return iconMap[dept] || <FaStethoscope className="text-green-500" />;
  };

  useEffect(() => {
    fetchDepartmentStats();

    // Refresh every 5 seconds for real-time updates
    const interval = setInterval(fetchDepartmentStats, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchDepartmentStats = async () => {
    try {
      const response = await axios.get("http://localhost:3000/patients");
      const patients = response.data;

      // Count patients per department
      const departmentCounts = {};
      patients.forEach((patient) => {
        const dept = patient.department || "Unassigned";
        departmentCounts[dept] = (departmentCounts[dept] || 0) + 1;
      });

      // Convert to array and sort by count
      const statsArray = Object.entries(departmentCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);

      setDepartmentStats(statsArray);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching department stats:", error);
      setLoading(false);
    }
  };

  const totalPatients = departmentStats.reduce(
    (sum, dept) => sum + dept.count,
    0
  );

  if (loading) {
    return (
      <div className="bg-zinc-900 rounded-lg p-6 shadow-lg">
        <div className="animate-pulse">
          <div className="h-8 bg-zinc-700 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-zinc-800 rounded"></div>
        </div>
      </div>
    );
  }

  if (departmentStats.length === 0) {
    return (
      <div className="bg-zinc-900 rounded-lg p-6 shadow-lg text-center">
        <h2 className="text-2xl font-bold text-white mb-4">
          📊 Department Analytics
        </h2>
        <p className="text-gray-400">No patient data available yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 rounded-lg p-6 shadow-lg">
      <style>{scrollbarStyles}</style>
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
        <span className="mr-3">🏥</span> Department-wise Patient Distribution
      </h2>

      <div
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        style={{ minHeight: "600px" }}
      >
        {/* Department Cards Grid */}
        <div className="flex flex-col h-full">
          <h3 className="text-lg font-semibold text-purple-400 mb-4">
            Department Overview
          </h3>
          <div className="grid grid-cols-1 gap-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {departmentStats.map((dept, index) => {
              const percentage = ((dept.count / totalPatients) * 100).toFixed(
                1
              );
              return (
                <div
                  key={dept.name}
                  className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 hover:border-purple-500 transition-all hover:shadow-lg hover:shadow-purple-500/20"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">
                        {getDepartmentIcon(dept.name)}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{dept.name}</p>
                        <p className="text-sm text-gray-400">
                          {dept.count}{" "}
                          {dept.count === 1 ? "patient" : "patients"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-400">
                        {percentage}%
                      </div>
                      <div className="text-xs text-gray-500">of total</div>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="mt-3 bg-zinc-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Charts Section */}
        <div className="space-y-6">
          {/* Bar Chart */}
          <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
            <h3 className="text-lg font-semibold text-purple-400 mb-4">
              Patient Count by Department
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={departmentStats.slice(0, 8)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="name"
                  stroke="#9CA3AF"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  tick={{ fontSize: 10 }}
                />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181B",
                    border: "1px solid #3F3F46",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="count" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
            <h3 className="text-lg font-semibold text-purple-400 mb-4">
              Department Distribution
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={departmentStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name.split(" ")[0]} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {departmentStats.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181B",
                    border: "1px solid #3F3F46",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-purple-900/50 to-purple-700/30 border border-purple-500/30 rounded-lg p-4 text-center">
          <p className="text-sm text-purple-300">Total Departments</p>
          <p className="text-3xl font-bold text-white">
            {departmentStats.length}
          </p>
        </div>
        <div className="bg-gradient-to-br from-blue-900/50 to-blue-700/30 border border-blue-500/30 rounded-lg p-4 text-center">
          <p className="text-sm text-blue-300">Total Patients</p>
          <p className="text-3xl font-bold text-white">{totalPatients}</p>
        </div>
        <div className="bg-gradient-to-br from-pink-900/50 to-pink-700/30 border border-pink-500/30 rounded-lg p-4 text-center">
          <p className="text-sm text-pink-300">Busiest Department</p>
          <p className="text-xl font-bold text-white truncate">
            {departmentStats[0]?.name}
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-900/50 to-green-700/30 border border-green-500/30 rounded-lg p-4 text-center">
          <p className="text-sm text-green-300">Avg per Dept</p>
          <p className="text-3xl font-bold text-white">
            {(totalPatients / departmentStats.length).toFixed(1)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DepartmentAnalytics;
