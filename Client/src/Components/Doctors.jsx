import React, { useEffect, useState } from "react";

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

  if (loading) return <div className="text-center text-gray-600">Loading doctors...</div>;

  return (
    <div className="p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Department Doctors</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {doctors.length > 0 ? (
          doctors.map((doctor) => (
            <div key={doctor.id} className="bg-white p-4 shadow-md rounded">
              <h2 className="text-xl font-semibold">{doctor.fullname}</h2>
              <p className="text-gray-500">{doctor.specialization}</p>
              <p className="text-gray-700">{doctor.experienceyears} Years Experience</p>
              <p className="text-gray-500">{doctor.phonenumber}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No doctors found.</p>
        )}
      </div>
    </div>
  );
};

export default Doctors;