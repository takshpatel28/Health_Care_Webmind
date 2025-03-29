import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import axios from 'axios';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingDoctor, setViewingDoctor] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    specialization: "",
    experienceyears: "",
    phonenumber: ""
  });

  // Get user role from your authentication system
  // This should come from your auth context or localStorage
  const userRole = localStorage.getItem('userRole') || "HOD"; // Default to HOD if not set

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("https://health-care-webmind.onrender.com/api/trusty/getdoctors");
        if (!response.ok) throw new Error("Failed to fetch doctors");

        const data = await response.json();
        setDoctors(data.doctorsData || data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter(doctor =>
    doctor.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (doctorId) => {
    if (userRole !== "Trustee") {
      alert("Only Trustees can delete doctors");
      return;
    }

    if (window.confirm("Are you sure you want to delete this doctor?")) {
      try {
        const response = await axios.delete(`https://health-care-webmind.onrender.com/api/trusty/deletedoctor/${doctorId}`);
        
        if (response.status === 200) {
          setDoctors(doctors.filter(doctor => doctor.id !== doctorId));
        } else {
          throw new Error("Failed to delete doctor");
        }
      } catch (error) {
        console.error("Error deleting doctor:", error);
        alert("Failed to delete doctor");
      }
    }
  };

  const handleEditClick = (doctor) => {
    if (userRole !== "Trustee") {
      alert("Only Trustees can edit doctors");
      return;
    }
    
    setEditingDoctor(doctor);
    setFormData({
      fullname: doctor.fullname,
      specialization: doctor.specialization,
      experienceyears: doctor.experienceyears,
      phonenumber: doctor.phonenumber
    });
    setIsModalOpen(true);
  };

  const handleViewProfile = (doctor) => {
    setViewingDoctor(doctor);
    setIsProfileModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (userRole !== "Trustee") {
      alert("Only Trustees can update doctor information");
      return;
    }

    try {
      const response = await fetch(`https://health-care-webmind.onrender.com/api/trusty/updatedoctor/${editingDoctor.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) throw new Error("Failed to update doctor");
      
      const updatedDoctor = await response.json();
      setDoctors(doctors.map(doctor => 
        doctor.id === updatedDoctor.id ? updatedDoctor : doctor
      ));
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating doctor:", error);
      alert("Failed to update doctor");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <Sidebar />
        <div className="p-6 w-full md:w-4/5 flex flex-col items-center justify-center">
          <div className="relative w-64 h-64 mb-8">
            <div className="absolute inset-0 bg-blue-100 rounded-full opacity-30 animate-pulse"></div>
            <div className="absolute inset-4 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-32 w-32 text-blue-600 animate-pulse"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Finding Your Doctors
          </h2>
          <p className="text-gray-600 text-center max-w-md mb-8">
            Connecting you with our top medical specialists...
          </p>
          <div className="flex space-x-4">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i}
                className="w-4 h-4 bg-blue-600 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.1}s` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Sidebar />
      <div className="p-6 w-full md:w-4/5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 md:mb-0">
            Our <span className="text-blue-600">Medical</span> Team
          </h1>
          <div className="flex space-x-4">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search doctors..."
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400 absolute right-3 top-2.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            {userRole === "Trustee" && (
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center"
                onClick={() => {
                  setEditingDoctor(null);
                  setFormData({
                    fullname: "",
                    specialization: "",
                    experienceyears: "",
                    phonenumber: ""
                  });
                  setIsModalOpen(true);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Doctor
              </button>
            )}
          </div>
        </div>

        {filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
              >
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-32 flex items-center justify-center">
                  <div className="bg-white p-2 rounded-full shadow-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 w-16 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800 mb-1">{doctor.fullname}</h2>
                      <p className="text-blue-600 font-semibold mb-3">{doctor.specialization}</p>
                    </div>
                    {userRole === "Trustee" && (
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEditClick(doctor)}
                          className="p-2 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-100 transition-colors"
                          title="Edit"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleDelete(doctor.id)}
                          className="p-2 text-red-600 hover:text-red-800 rounded-full hover:bg-red-100 transition-colors"
                          title="Delete"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {doctor.experienceyears} Years Experience
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    {doctor.phonenumber}
                  </div>
                  
                  <div className="flex space-x-3">
                    <button 
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300"
                      onClick={() => handleViewProfile(doctor)}
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-24 w-24 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-2xl font-medium text-gray-700 mb-2">No doctors found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search criteria</p>
            <button 
              onClick={() => setSearchTerm("")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>

      {/* Edit/Add Doctor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingDoctor ? "Edit Doctor" : "Add New Doctor"}
                </h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2" htmlFor="fullname">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullname"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2" htmlFor="specialization">
                    Specialization
                  </label>
                  <input
                    type="text"
                    id="specialization"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2" htmlFor="experienceyears">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    id="experienceyears"
                    name="experienceyears"
                    value={formData.experienceyears}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2" htmlFor="phonenumber">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phonenumber"
                    name="phonenumber"
                    value={formData.phonenumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  {userRole === "Trustee" && (
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {editingDoctor ? "Update" : "Add"} Doctor
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Profile View Modal */}
      {isProfileModalOpen && viewingDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Doctor Profile</h2>
                <button 
                  onClick={() => setIsProfileModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-shrink-0">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-48 w-48 rounded-full flex items-center justify-center mx-auto">
                    <div className="bg-white p-3 rounded-full shadow-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-24 w-24 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="flex-grow">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{viewingDoctor.fullname}</h3>
                  <p className="text-blue-600 font-semibold mb-6">{viewingDoctor.specialization}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">EXPERIENCE</h4>
                      <p className="text-lg font-semibold text-gray-800">{viewingDoctor.experienceyears} Years</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">CONTACT</h4>
                      <p className="text-lg font-semibold text-gray-800">{viewingDoctor.phonenumber}</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">ABOUT</h4>
                      <p className="text-gray-700">
                        Dr. {viewingDoctor.fullname} is a specialist in {viewingDoctor.specialization.toLowerCase()} with {viewingDoctor.experienceyears} years of experience. 
                        Committed to providing the highest quality care to all patients.
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex space-x-4">
                    {userRole === "Trustee" && (
                      <button
                        onClick={() => {
                          setIsProfileModalOpen(false);
                          handleEditClick(viewingDoctor);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Edit Profile
                      </button>
                    )}
                    <button
                      onClick={() => setIsProfileModalOpen(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Doctors;