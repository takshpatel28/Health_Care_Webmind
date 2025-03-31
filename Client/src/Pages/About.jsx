import React, { useState, useEffect } from 'react';
import axios from 'axios';

const About = () => {
  const [doctors, setDoctors] = useState([]);
  const [currentDoctorIndex, setCurrentDoctorIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch doctors from API
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(
          'https://health-care-webmind.onrender.com/api/trusty/getdoctors'
        );
        setDoctors(response.data.doctorsData || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Auto-rotate doctors every 4 seconds
  useEffect(() => {
    if (doctors.length > 1) {
      const interval = setInterval(() => {
        setCurrentDoctorIndex((prevIndex) => 
          (prevIndex + 1) % doctors.length
        );
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [doctors.length]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-blue-600 text-2xl">Loading doctors...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-xl">Error: {error}</div>
      </div>
    );
  }

  if (doctors.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600 text-xl">No doctors found</div>
      </div>
    );
  }

  const currentDoctor = doctors[currentDoctorIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">About Our Medical Team</h1>
        <p className="text-xl max-w-2xl mx-auto">Meet our trusted healthcare professionals</p>
      </div>

      {/* Doctor Slider Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Doctor Image */}
            <div className="relative h-96 md:h-auto">
              <img
                src={currentDoctor.image || 'https://via.placeholder.com/500'}
                alt={currentDoctor.name}
                className="w-full h-full object-cover"
              />
              {/* Navigation Dots */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                {doctors.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentDoctorIndex(index)}
                    className={`w-3 h-3 rounded-full ${index === currentDoctorIndex ? 'bg-blue-600' : 'bg-gray-300'}`}
                    aria-label={`Go to doctor ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Doctor Info */}
            <div className="p-8 md:p-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">{currentDoctor.name}</h2>
              <p className="text-blue-600 text-lg mb-6">{currentDoctor.specialization}</p>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Qualifications</h3>
                <ul className="list-disc list-inside text-gray-600">
                  {currentDoctor.qualifications?.map((qual, i) => (
                    <li key={i}>{qual}</li>
                  )) || <li>MD, Board Certified</li>}
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Experience</h3>
                <p className="text-gray-600">{currentDoctor.experience || '15+ years'}</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">About</h3>
                <p className="text-gray-600">
                  {currentDoctor.bio || 'Dedicated professional committed to patient care.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* All Doctors Grid */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Our Medical Team</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {doctors.map((doctor, index) => (
            <div 
              key={doctor._id || index}
              className={`bg-white rounded-lg shadow-md overflow-hidden transition-all ${currentDoctorIndex === index ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => setCurrentDoctorIndex(index)}
            >
              <img
                src={doctor.image || 'https://via.placeholder.com/400'}
                alt={doctor.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800">{doctor.name}</h3>
                <p className="text-blue-600 mb-2">{doctor.specialization}</p>
                <p className="text-gray-600 line-clamp-2">
                  {doctor.bio || 'Specialized medical professional'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-12 px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Book an Appointment</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Consult with our specialists for personalized care
        </p>
        <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition">
          Schedule Now
        </button>
      </div>
    </div>
  );
};

export default About;


