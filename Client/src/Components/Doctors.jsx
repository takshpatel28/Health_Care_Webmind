import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("https://health-care-webmind.onrender.com/api/hod");
        if (!response.ok) throw new Error("Failed to fetch doctors");

        const data = await response.json();
        setDoctors(data.doctorsData);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
        <Sidebar />
        <div className="p-6 w-full md:w-4/5 flex flex-col items-center justify-center">
          <div className="flex space-x-4 mb-8">
            {[...Array(3)].map((_, i) => (
              <div 
                key={i}
                className="w-6 h-6 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.1}s` }}
              ></div>
            ))}
          </div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Finding Your Doctors</h2>
          <p className="text-gray-500 text-center max-w-md">
            Connecting you with our top medical specialists...
          </p>
          <div className="mt-8 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-blue-500 animate-pulse"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <Sidebar />
      <div className="p-6 w-full md:w-4/5">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6">Department Doctors</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.length > 0 ? (
            doctors.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white p-6 shadow-lg rounded-2xl border border-gray-200 hover:shadow-xl transition-shadow duration-300"
              >
                <h2 className="text-2xl font-bold text-gray-900">{doctor.fullname}</h2>
                <p className="text-gray-600 mt-1">{doctor.specialization}</p>
                <p className="text-gray-700 mt-2 font-medium">
                  {doctor.experienceyears} Years Experience
                </p>
                <p className="text-gray-500 mt-2">📞 {doctor.phonenumber}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-lg col-span-full text-center">No doctors found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Doctors;