import { useState, useEffect } from 'react';
import { FaArrowRight, FaArrowLeft, FaStethoscope, FaUserMd, FaClinicMedical, FaCalendarAlt, FaStar, FaHeartbeat, FaProcedures, FaPills } from 'react-icons/fa';
import { motion } from 'framer-motion';

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

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pt-16 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 px-4 md:px-8 bg-gradient-to-br from-teal-600 to-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-400 rounded-full filter blur-3xl opacity-20"></div>
          <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-teal-300 rounded-full filter blur-3xl opacity-20"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-12 lg:mb-0 lg:pr-10">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
              >
                <span className="bg-gradient-to-r from-teal-200 to-white bg-clip-text text-transparent">
                  Advanced Healthcare
                </span> <br />Management System
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl md:text-2xl mb-10 opacity-90"
              >
                Streamline your medical practice with our comprehensive solution for doctors and patients.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <button className="bg-white hover:bg-gray-100 text-teal-700 font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center">
                  Get Started <FaArrowRight className="ml-2" />
                </button>
                <button className="bg-transparent hover:bg-white/10 border-2 border-white/50 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:border-white/80 flex items-center justify-center">
                  Learn More
                </button>
              </motion.div>
            </div>
            <div className="lg:w-1/2">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-1 shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                    alt="Doctor with patient" 
                    className="w-full h-auto rounded-2xl"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-gray-100">
                  <div className="flex items-center">
                    <div className="bg-teal-100 p-3 rounded-full mr-3">
                      <FaHeartbeat className="text-teal-600 text-xl" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Patients Today</p>
                      <p className="text-xl font-bold text-gray-800">42</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-gray-100">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-3 rounded-full mr-3">
                      <FaUserMd className="text-blue-600 text-xl" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Active Doctors</p>
                      <p className="text-xl font-bold text-gray-800">24</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 md:px-8 bg-white -mt-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
          >
            {[
              { icon: <FaUserMd className="text-3xl" />, number: "150+", text: "Expert Doctors", color: "bg-blue-100 text-blue-600" },
              { icon: <FaProcedures className="text-3xl" />, number: "10K+", text: "Patients Treated", color: "bg-teal-100 text-teal-600" },
              { icon: <FaClinicMedical className="text-3xl" />, number: "25+", text: "Departments", color: "bg-purple-100 text-purple-600" },
              { icon: <FaPills className="text-3xl" />, number: "100%", text: "Satisfaction", color: "bg-indigo-100 text-indigo-600" }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                variants={item}
                className={`p-6 rounded-2xl ${stat.color} flex flex-col items-center text-center shadow-md hover:shadow-lg transition-shadow duration-300`}
              >
                <div className="mb-4">{stat.icon}</div>
                <h3 className="text-3xl font-bold mb-2">{stat.number}</h3>
                <p className="text-gray-700 font-medium">{stat.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
          >
            Comprehensive <span className="text-teal-600">Features</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Everything you need to manage your healthcare facility efficiently
          </motion.p>
        </div>
        
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
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
              color: "from-teal-500 to-teal-600"
            },
            {
              icon: <FaHeartbeat className="text-4xl" />,
              title: "Patient Records",
              description: "Secure digital health records accessible to authorized personnel only.",
              color: "from-indigo-500 to-indigo-600"
            },
            {
              icon: <FaProcedures className="text-4xl" />,
              title: "Appointment System",
              description: "Easy online booking for patients with automated reminders.",
              color: "from-pink-500 to-pink-600"
            },
            {
              icon: <FaPills className="text-4xl" />,
              title: "Prescription Module",
              description: "Digital prescriptions with pharmacy integration and refill alerts.",
              color: "from-cyan-500 to-cyan-600"
            }
          ].map((feature, index) => (
            <motion.div 
              key={index}
              variants={item}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
            >
              <div className={`bg-gradient-to-r ${feature.color} p-1 rounded-full w-16 h-16 flex items-center justify-center mb-6 mx-auto`}>
                <div className="bg-white rounded-full w-full h-full flex items-center justify-center">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold text-center text-gray-800 mb-3">{feature.title}</h3>
              <p className="text-gray-600 text-center">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Doctors Slider */}
      <section className="py-16 px-4 md:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
            >
              Meet Our <span className="text-blue-600">Specialists</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              Our team of highly qualified healthcare professionals
            </motion.p>
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
                          <div className="absolute bottom-4 left-4 bg-white/90 px-3 py-1 rounded-full flex items-center shadow-sm">
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
                            {doctor.specialty} with extensive experience in treating complex cases. Committed to providing personalized care.
                          </p>
                          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-full transition-all duration-300 flex items-center">
                              View Profile
                              <FaArrowRight className="ml-2" />
                            </button>
                            <button className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-300 flex items-center">
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

      {/* Testimonials Section */}
      <section className="py-16 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
            >
              What Our <span className="text-teal-600">Patients Say</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              Hear from people who have experienced our healthcare services
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Robert Johnson",
                role: "Heart Patient",
                quote: "The care I received was exceptional. The doctors were knowledgeable and compassionate.",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
                rating: 5
              },
              {
                name: "Sarah Williams",
                role: "Pediatric Care",
                quote: "My children feel comfortable with the pediatricians here. The service is top-notch.",
                image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
                rating: 4.5
              },
              {
                name: "Michael Chen",
                role: "Neurology Patient",
                quote: "The neurology department helped me through a difficult time with professionalism and care.",
                image: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FaStar 
                      key={i} 
                      className={`${i < Math.floor(testimonial.rating) ? 'text-yellow-400' : 'text-gray-300'} ${i === Math.floor(testimonial.rating) && testimonial.rating % 1 !== 0 ? 'text-yellow-400 opacity-50' : ''}`} 
                    />
                  ))}
                  <span className="text-gray-500 ml-2 text-sm">{testimonial.rating}</span>
                </div>
                <p className="text-gray-600 italic mb-6">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover mr-4" />
                  <div>
                    <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-8 bg-gradient-to-r from-teal-600 to-blue-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-400 rounded-full filter blur-3xl opacity-20"></div>
          <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-teal-300 rounded-full filter blur-3xl opacity-20"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Ready to transform your healthcare management?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl mb-10 opacity-90"
          >
            Join hundreds of medical institutions using our platform to streamline their operations.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <button className="bg-white hover:bg-gray-100 text-teal-700 font-bold py-4 px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg">
              Request a Demo
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;