import { useState, useEffect } from 'react';
import { FaArrowRight, FaArrowLeft, FaStethoscope, FaUserMd, FaClinicMedical, FaCalendarAlt, FaStar } from 'react-icons/fa';

const Dashboard = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const doctors = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      experience: "12 years",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialty: "Neurologist",
      experience: "8 years",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      specialty: "Pediatrician",
      experience: "15 years",
      rating: 5.0,
      image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    {
      id: 4,
      name: "Dr. David Wilson",
      specialty: "Orthopedic Surgeon",
      experience: "10 years",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === doctors.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? doctors.length - 1 : prev - 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovered) {
        nextSlide();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 pt-16">
      {/* Hero Section */}
      <section className="relative py-24 px-4 md:px-8 bg-gradient-to-r from-blue-600 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        <div className="relative max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-cyan-300 to-white bg-clip-text text-transparent">
              Streamlined Doctor Management
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 opacity-90 max-w-3xl mx-auto">
            Efficiently manage healthcare professionals and departments with our reactive platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-white hover:bg-gray-100 text-blue-800 font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              Get Started
            </button>
            <button className="bg-transparent hover:bg-white/10 border-2 border-white/50 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:border-white/80">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Powerful Features
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to manage your healthcare facility efficiently
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <FaUserMd className="text-4xl" />,
              title: "Doctor Profiles",
              description: "Comprehensive profiles with specialties, availability, and patient reviews.",
              color: "from-blue-500 to-blue-600"
            },
            {
              icon: <FaClinicMedical className="text-4xl" />,
              title: "Department Management",
              description: "Organize departments and assign staff efficiently with our intuitive system.",
              color: "from-purple-500 to-purple-600"
            },
            {
              icon: <FaCalendarAlt className="text-4xl" />,
              title: "Scheduling",
              description: "Real-time scheduling with automatic conflict detection and resolution.",
              color: "from-cyan-500 to-cyan-600"
            }
          ].map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className={`bg-gradient-to-r ${feature.color} p-1 rounded-full w-16 h-16 flex items-center justify-center mb-6 mx-auto`}>
                <div className="bg-white rounded-full w-full h-full flex items-center justify-center">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold text-center text-gray-800 mb-3">{feature.title}</h3>
              <p className="text-gray-600 text-center">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Doctors Slider */}
      <section className="py-16 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Our Expert Doctors
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Meet our team of highly qualified healthcare professionals
            </p>
          </div>
          
          <div 
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {doctors.map((doctor) => (
                  <div key={doctor.id} className="w-full flex-shrink-0 px-4">
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                      <div className="md:flex h-full">
                        <div className="md:w-1/3 relative">
                          <img 
                            src={doctor.image} 
                            alt={doctor.name} 
                            className="w-full h-64 md:h-full object-cover"
                          />
                          <div className="absolute bottom-4 left-4 bg-white/90 px-3 py-1 rounded-full flex items-center">
                            <FaStar className="text-yellow-400 mr-1" />
                            <span className="text-sm font-medium">{doctor.rating}</span>
                          </div>
                        </div>
                        <div className="md:w-2/3 p-8 flex flex-col">
                          <div className="flex flex-wrap items-center gap-2 mb-4">
                            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                              {doctor.specialty}
                            </span>
                            <span className="text-gray-600 text-sm flex items-center">
                              <FaStethoscope className="mr-2" /> {doctor.experience} experience
                            </span>
                          </div>
                          <h3 className="text-2xl font-bold text-gray-800 mb-4">{doctor.name}</h3>
                          <p className="text-gray-600 mb-6 flex-grow">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                          </p>
                          <div className="flex justify-between items-center">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-full transition-all duration-300 flex items-center">
                              View Profile
                              <FaArrowRight className="ml-2" />
                            </button>
                            <button className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-300">
                              Book Appointment
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <button 
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-300 z-10"
            >
              <FaArrowLeft className="text-blue-600" />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-300 z-10"
            >
              <FaArrowRight className="text-blue-600" />
            </button>
          </div>
          
          <div className="flex justify-center mt-8 space-x-2">
            {doctors.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-blue-600 w-6' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-8 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to transform your healthcare management?</h2>
          <p className="text-xl mb-10 opacity-90">
            Join hundreds of medical institutions using our platform to streamline their operations.
          </p>
          <button className="bg-white hover:bg-gray-100 text-blue-800 font-bold py-4 px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg">
            Request a Demo
          </button>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;