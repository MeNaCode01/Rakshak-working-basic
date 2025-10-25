import React, { useState, useEffect } from "react";
import PatientDashboard from "./patientDashboard";
import PatientList from "./PatientList";
import DepartmentAnalytics from "./DepartmentAnalytics";
import axios from "axios";
import {
  FaUserMd,
  FaCalendarAlt,
  FaDollarSign,
  FaSyringe,
} from "react-icons/fa";
import SOSRequestList from "./SOSRequestList";

const MainDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [totalPatients, setTotalPatients] = useState(0);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [totalSurgeries, setTotalSurgeries] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [lastMonthData, setLastMonthData] = useState({
    patients: 0,
    appointments: 0,
    surgeries: 0,
    revenue: 0,
  });

  const lastMonthPatients = lastMonthData.patients;
  const thisMonthPatients = totalPatients;
  const thisMonthPatientsAppointment = totalAppointments;

  const calculatePercentageIncrease = (lastMonth, thisMonth) => {
    if (lastMonth === 0) {
      return thisMonth > 0 ? "∞" : "0%";
    }
    return (
      (((thisMonthPatients - lastMonth) / lastMonth) * 100).toFixed(2) + "%"
    );
  };

  const calculatePercentageIncreaseAppointments = (lastMonth, thisMonth) => {
    if (lastMonth === 0) {
      return thisMonth > 0 ? "∞" : "0%";
    }
    return (
      (((thisMonthPatientsAppointment - lastMonth) / lastMonth) * 100).toFixed(
        2
      ) + "%"
    );
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);

  // Real-time data fetching for statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsRefreshing(true);

        // Fetch patient stats
        const patientsResponse = await axios.get(
          "http://localhost:3000/patientsdashboard"
        );
        const patientCount =
          patientsResponse.data.femalePatients +
          patientsResponse.data.malePatients +
          patientsResponse.data.otherPatients +
          patientsResponse.data.nonPatients;

        // Fetch SOS status for appointments
        const sosResponse = await axios.get(
          "http://localhost:3000/sos/statusCounts"
        );
        const appointmentCount =
          patientCount + sosResponse.data.sent + sosResponse.data.pending;

        // Calculate surgeries (for demo - count patients with specific criteria)
        const surgeriesCount = Math.floor(patientCount * 0.05); // 5% of patients

        // Calculate revenue (for demo - $50 per patient)
        const revenueAmount = patientCount * 50;

        setTotalSurgeries(surgeriesCount);
        setTotalRevenue(revenueAmount);
        setLastUpdated(new Date());

        console.log("📊 Real-time stats updated:", {
          patients: patientCount,
          appointments: appointmentCount,
          surgeries: surgeriesCount,
          revenue: revenueAmount,
          time: new Date().toLocaleTimeString(),
        });

        setIsRefreshing(false);
      } catch (error) {
        console.error("Error fetching real-time stats:", error);
        setIsRefreshing(false);
      }
    };

    fetchStats();

    // Auto-refresh every 5 seconds for real-time updates
    const interval = setInterval(fetchStats, 5000);

    return () => clearInterval(interval);
  }, []);

  const LoadingBox = () => (
    <div className="grid gap-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="bg-zinc-800 shadow-lg animate-pulse h-36 rounded-lg"
          ></div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-6">
        {[...Array(2)].map((_, index) => (
          <div
            key={index}
            className="bg-zinc-800 shadow-lg animate-pulse h-96 rounded-lg"
          ></div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-zinc-800 shadow-lg animate-pulse h-96 rounded-lg"></div>
      </div>
    </div>
  );

  return (
    <div>
      {loading ? (
        <LoadingBox />
      ) : (
        <div className="grid gap-8 px-10 py-4">
          {/* Real-time Indicator */}
          <div className="flex items-center justify-between bg-zinc-800 px-6 py-3 rounded-lg shadow-lg border border-zinc-700">
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  isRefreshing ? "bg-yellow-500 animate-pulse" : "bg-green-500"
                }`}
              ></div>
              <span className="text-white font-semibold">
                {isRefreshing ? "🔄 Updating..." : "✅ Live Dashboard"}
              </span>
              <span className="text-gray-400 text-sm">
                Auto-refreshes every 5 seconds
              </span>
            </div>
            <div className="text-gray-400 text-sm">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-4 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105">
              <h3 className="text-xl font-bold flex items-center">
                <FaUserMd className="mr-2" /> Total Patients
              </h3>
              <p className="text-3xl font-bold mt-2">{totalPatients}</p>
              <p className="text-blue-100 text-sm mt-1">
                {totalPatients > lastMonthData.patients ? "📈" : "📊"}{" "}
                {calculatePercentageIncrease(
                  lastMonthData.patients,
                  totalPatients
                )}{" "}
                vs Last Month
              </p>
            </div>
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-4 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105">
              <h3 className="text-xl font-bold flex items-center">
                <FaCalendarAlt className="mr-2" /> Total Appointments
              </h3>
              <p className="text-3xl font-bold mt-2">{totalAppointments}</p>
              <p className="text-yellow-100 text-sm mt-1">
                {totalAppointments > lastMonthData.appointments ? "📈" : "📊"}{" "}
                {calculatePercentageIncreaseAppointments(
                  lastMonthData.appointments,
                  totalAppointments
                )}{" "}
                vs Last Month
              </p>
            </div>
            <div className="bg-gradient-to-r from-pink-400 to-pink-600 p-4 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105">
              <h3 className="text-xl font-bold flex items-center">
                <FaSyringe className="mr-2" /> Total Surgeries
              </h3>
              <p className="text-3xl font-bold mt-2">{totalSurgeries}</p>
              <p className="text-pink-100 text-sm mt-1">
                {totalSurgeries > lastMonthData.surgeries ? "📈" : "📊"}{" "}
                {(
                  ((totalSurgeries - lastMonthData.surgeries) /
                    (lastMonthData.surgeries || 1)) *
                  100
                ).toFixed(1)}
                % vs Last Month
              </p>
            </div>
            <div className="bg-gradient-to-r from-purple-400 to-purple-600 p-4 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105">
              <h3 className="text-xl font-bold flex items-center">
                <FaDollarSign className="mr-2" /> Total Revenue
              </h3>
              <p className="text-3xl font-bold mt-2">${totalRevenue}</p>
              <p className="text-purple-100 text-sm mt-1">
                {totalRevenue > lastMonthData.revenue ? "📈" : "📊"}{" "}
                {(
                  ((totalRevenue - lastMonthData.revenue) /
                    (lastMonthData.revenue || 1)) *
                  100
                ).toFixed(1)}
                % vs Last Month
              </p>
            </div>
          </div>
          <PatientDashboard
            setTotalPatients={setTotalPatients}
            setTotalAppointments={setTotalAppointments}
          />
          <DepartmentAnalytics />
          <div className="overflow-x-auto">
            <SOSRequestList />
          </div>
          <div className="overflow-x-auto">
            <PatientList />
          </div>
        </div>
      )}
    </div>
  );
};

export default MainDashboard;
