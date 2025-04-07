import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaStethoscope, FaHospital, FaAward, FaHeartbeat, FaPhone, FaCalendarAlt } from 'react-icons/fa';

const About = () => {
  const [doctors, setDoctors] = useState([]);
  const [currentDoctorIndex, setCurrentDoctorIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Unique doctor images from Unsplash with medical theme
  const doctorImages = [
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', // Female doctor 1
    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', // Male doctor 1
    'https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', // Female doctor 2
    'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', // Male doctor 2
    'https://images.unsplash.com/photo-1579684453423-f84349ef60b0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', // Female doctor 3
    'https://images.unsplash.com/photo-1622250774001-8a61a29f2c7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', // Male doctor 3
    'https://images.unsplash.com/photo-1527613426441-4da17471b66d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', // Female doctor 4
    'https://images.unsplash.com/photo-1622252432555-1e7a1a6d8c3a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'  // Male doctor 4
  ];

  // Mock data with unique images
  const mockDoctors = [
    {
      _id: '1',
      name: 'Dr. Sarah Johnson',
      image: doctorImages[0],
      specialization: 'Cardiologist',
      qualifications: ['MD, Harvard Medical School', 'Board Certified in Cardiology', 'PhD in Cardiovascular Research'],
      experience: '18 years',
      bio: 'Dr. Johnson specializes in interventional cardiology and has performed over 2,000 successful procedures. She is passionate about preventive care and patient education.'
    },
    {
      _id: '2',
      name: 'Dr. Michael Chen',
      image: doctorImages[1],
      specialization: 'Neurologist',
      qualifications: ['MD, Johns Hopkins University', 'Fellowship in Neurological Disorders', 'Board Certified in Neurology'],
      experience: '12 years',
      bio: 'Dr. Chen is an expert in treating complex neurological conditions and has published numerous papers on neurodegenerative diseases.'
    },
    {
      _id: '3',
      name: 'Dr. Priya Patel',
      image: doctorImages[2],
      specialization: 'Pediatrician',
      qualifications: ['MD, Stanford University', 'Board Certified in Pediatrics', 'Specialization in Neonatal Care'],
      experience: '15 years',
      bio: 'Dr. Patel has dedicated her career to children\'s health and wellness. She is known for her gentle approach and excellent bedside manner.'
    },
    {
      _id: '4',
      name: 'Dr. Robert Williams',
      image: doctorImages[3],
      specialization: 'Orthopedic Surgeon',
      qualifications: ['MD, Mayo Clinic', 'Fellowship in Sports Medicine', 'Board Certified in Orthopedic Surgery'],
      experience: '20 years',
      bio: 'Dr. Williams specializes in minimally invasive joint replacement and has helped hundreds of patients regain mobility and quality of life.'
    },
    {
      _id: '5',
      name: 'Dr. Emily Zhang',
      image: doctorImages[4],
      specialization: 'Dermatologist',
      qualifications: ['MD, Yale School of Medicine', 'Board Certified in Dermatology', 'Cosmetic Dermatology Specialist'],
      experience: '10 years',
      bio: 'Dr. Zhang focuses on both medical and cosmetic dermatology, helping patients achieve healthy skin at every age.'
    },
    {
      _id: '6',
      name: 'Dr. David Kim',
      image: doctorImages[5],
      specialization: 'Oncologist',
      qualifications: ['MD, UCLA Medical School', 'Board Certified in Oncology', 'Immunotherapy Researcher'],
      experience: '14 years',
      bio: 'Dr. Kim leads our cancer care team with a focus on personalized treatment plans and cutting-edge therapies.'
    }
  ];

  // Fetch doctors from API or use mock data
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(
          'https://health-care-webmind.onrender.com/api/trusty/getdoctors'
        );
        // Enhance API data with unique images if needed
        const doctorsWithImages = response.data.doctorsData?.map((doctor, index) => ({
          ...doctor,
          image: doctor.image || doctorImages[index % doctorImages.length]
        }));
        setDoctors(doctorsWithImages?.length > 0 ? doctorsWithImages : mockDoctors);
        setLoading(false);
      } catch (err) {
        console.error('Using mock data due to:', err.message);
        setDoctors(mockDoctors);
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
          <div className="text-blue-600 text-2xl font-medium">Loading our medical team...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center">
          <div className="text-red-500 text-5xl mb-4">!</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-6">We're showing sample data. {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const currentDoctor = doctors[currentDoctorIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-24 px-4 text-center overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-white"></div>
          <div className="absolute bottom-1/3 right-1/3 w-40 h-40 rounded-full bg-white"></div>
          <div className="absolute top-1/3 right-1/4 w-24 h-24 rounded-full bg-white"></div>
        </div>
        <div className="relative max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Exceptional Care from Compassionate Professionals</h1>
          <p className="text-xl md:text-2xl font-light max-w-3xl mx-auto">
            Our team of board-certified specialists is dedicated to your health and well-being
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <div className="flex items-center bg-white/20 px-4 py-2 rounded-full">
              <FaHospital className="mr-2 text-blue-300" />
              <span>24/7 Emergency Care</span>
            </div>
            <div className="flex items-center bg-white/20 px-4 py-2 rounded-full">
              <FaAward className="mr-2 text-blue-300" />
              <span>Certified Specialists</span>
            </div>
            <div className="flex items-center bg-white/20 px-4 py-2 rounded-full">
              <FaHeartbeat className="mr-2 text-blue-300" />
              <span>Personalized Treatment</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-6xl mx-auto px-4 py-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center">
          <div className="text-4xl font-bold text-blue-600 mb-2">150+</div>
          <div className="text-gray-600">Years Combined Experience</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center">
          <div className="text-4xl font-bold text-blue-600 mb-2">24</div>
          <div className="text-gray-600">Medical Specialties</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center">
          <div className="text-4xl font-bold text-blue-600 mb-2">10K+</div>
          <div className="text-gray-600">Patients Treated Annually</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center">
          <div className="text-4xl font-bold text-blue-600 mb-2">98%</div>
          <div className="text-gray-600">Patient Satisfaction Rate</div>
        </div>
      </div>

      {/* Featured Doctor Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-500 hover:shadow-2xl">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Doctor Image */}
            <div className="relative h-96 md:h-auto group">
              <img
                src={currentDoctor.image}
                alt={currentDoctor.name}
                className="w-full h-full object-cover transition-opacity duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <div className="text-white">
                  <p className="text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                    "My philosophy is to treat every patient as I would my own family."
                  </p>
                </div>
              </div>
              {/* Navigation Dots */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                {doctors.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentDoctorIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all ${index === currentDoctorIndex ? 'bg-blue-600 w-6' : 'bg-gray-300 hover:bg-gray-400'}`}
                    aria-label={`Go to doctor ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Doctor Info */}
            <div className="p-8 md:p-12">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-1">{currentDoctor.name}</h2>
                  <p className="text-blue-600 text-lg font-medium flex items-center">
                    <FaStethoscope className="mr-2" />
                    {currentDoctor.specialization}
                  </p>
                </div>
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  Available
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                  <FaAward className="mr-2 text-blue-500" />
                  Qualifications
                </h3>
                <ul className="space-y-2 text-gray-600">
                  {currentDoctor.qualifications?.map((qual, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      {qual}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                  <FaHospital className="mr-2 text-blue-500" />
                  Experience
                </h3>
                <p className="text-gray-600 pl-8">{currentDoctor.experience} of dedicated practice</p>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                  <FaHeartbeat className="mr-2 text-blue-500" />
                  About
                </h3>
                <p className="text-gray-600 pl-8">
                  {currentDoctor.bio}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Medical Team Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Medical Team</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Meet our diverse team of specialists dedicated to providing comprehensive care
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {doctors.map((doctor, index) => (
            <div
              key={doctor._id || index}
              className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer ${currentDoctorIndex === index ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => setCurrentDoctorIndex(index)}
            >
              <div className="relative h-64 overflow-hidden group">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div>
                    <h3 className="text-white font-bold text-lg">{doctor.name}</h3>
                    <p className="text-blue-200 text-sm">{doctor.specialization}</p>
                    <button className="mt-2 text-white text-sm font-medium hover:text-blue-300 transition">
                      View Profile →
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800">{doctor.name}</h3>
                <p className="text-blue-600 text-sm mb-2">{doctor.specialization}</p>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {doctor.bio}
                </p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-xs text-gray-500">{doctor.experience} experience</span>
                  <button className="text-blue-600 text-xs font-medium hover:text-blue-800 transition">
                    Learn more
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-blue-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Our Commitment to You</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-blue-600 text-3xl mb-4 font-semibold">01</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Patient-Centered Care</h3>
              <p className="text-gray-600">
                We prioritize your unique needs and preferences in every treatment plan, ensuring personalized care.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-blue-600 text-3xl mb-4 font-semibold">02</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Clinical Excellence</h3>
              <p className="text-gray-600">
                Our team maintains the highest standards through continuous education and evidence-based practices.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-blue-600 text-3xl mb-4 font-semibold">03</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Compassionate Service</h3>
              <p className="text-gray-600">
                We treat every patient with empathy, respect, and kindness throughout their healthcare journey.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-4 text-center overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-white"></div>
          <div className="absolute bottom-1/3 right-1/3 w-40 h-40 rounded-full bg-white"></div>
        </div>
        <div className="relative max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Ready to Take the Next Step?</h2>
          <p className="text-xl mb-8">
            Schedule a consultation with one of our specialists today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="flex items-center justify-center bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition transform hover:scale-105 shadow-lg">
              <FaCalendarAlt className="mr-2" />
              Book Appointment
            </button>
            <button className="flex items-center justify-center bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-blue-600 transition transform hover:scale-105">
              <FaPhone className="mr-2" />
              Call Now
            </button>
          </div>
          <p className="mt-6 text-blue-200 text-sm">
            Same-day appointments available for urgent cases
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;