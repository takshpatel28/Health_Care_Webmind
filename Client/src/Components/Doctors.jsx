import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/hod");
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

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-lg font-semibold">
        Loading doctors...
      </div>
    );

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