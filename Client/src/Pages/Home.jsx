import { useState, useEffect } from 'react';
import { FaArrowRight, FaArrowLeft, FaStethoscope, FaUserMd, FaClinicMedical, FaCalendarAlt, FaStar, FaHeartbeat, FaProcedures, FaPills } from 'react-icons/fa';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Animation controls for each section
  const controls1 = useAnimation();
  const controls2 = useAnimation();
  const controls3 = useAnimation();
  const controls4 = useAnimation();
  const controls5 = useAnimation();
  const controls6 = useAnimation();

  // Intersection observers for each section
  const [ref1, inView1] = useInView({ threshold: 0.1, triggerOnce: false });
  const [ref2, inView2] = useInView({ threshold: 0.1, triggerOnce: false });
  const [ref3, inView3] = useInView({ threshold: 0.1, triggerOnce: false });
  const [ref4, inView4] = useInView({ threshold: 0.1, triggerOnce: false });
  const [ref5, inView5] = useInView({ threshold: 0.1, triggerOnce: false });
  const [ref6, inView6] = useInView({ threshold: 0.1, triggerOnce: false });

  // Trigger animations when sections come into view
  useEffect(() => {
    if (inView1) controls1.start("visible");
    else controls1.start("hidden");
  }, [controls1, inView1]);

  useEffect(() => {
    if (inView2) controls2.start("visible");
    else controls2.start("hidden");
  }, [controls2, inView2]);

  useEffect(() => {
    if (inView3) controls3.start("visible");
    else controls3.start("hidden");
  }, [controls3, inView3]);

  useEffect(() => {
    if (inView4) controls4.start("visible");
    else controls4.start("hidden");
  }, [controls4, inView4]);

  useEffect(() => {
    if (inView5) controls5.start("visible");
    else controls5.start("hidden");
  }, [controls5, inView5]);

  useEffect(() => {
    if (inView6) controls6.start("visible");
    else controls6.start("hidden");
  }, [controls6, inView6]);

  const doctors = [
    // ... (same doctors array as before)
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
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const fadeInDown = {
    hidden: { opacity: 0, y: -40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const fadeInLeft = {
    hidden: { opacity: 0, x: -40 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const fadeInRight = {
    hidden: { opacity: 0, x: 40 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 overflow-x-hidden">
      {/* Hero Section */}
      <section ref={ref1} className="relative py-20 md:py-32 px-4 md:px-8 bg-gradient-to-br from-teal-600 to-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-400 rounded-full filter blur-3xl opacity-20"></div>
          <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-teal-300 rounded-full filter blur-3xl opacity-20"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-12 lg:mb-0 lg:pr-10">
              <motion.h1 
                initial="hidden"
                animate={controls1}
                variants={fadeInUp}
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
              >
                <span className="bg-gradient-to-r from-teal-200 to-white bg-clip-text text-transparent">
                  Advanced Healthcare
                </span> <br />Management System
              </motion.h1>
              <motion.p 
                initial="hidden"
                animate={controls1}
                variants={fadeInUp}
                transition={{ delay: 0.2 }}
                className="text-xl md:text-2xl mb-10 opacity-90"
              >
                Streamline your medical practice with our comprehensive solution for doctors and patients.
              </motion.p>
              <motion.div 
                initial="hidden"
                animate={controls1}
                variants={fadeInUp}
                transition={{ delay: 0.4 }}
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
                initial="hidden"
                animate={controls1}
                variants={fadeInRight}
                transition={{ delay: 0.6 }}
                className="relative"
              >
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-1 shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                    alt="Doctor with patient" 
                    className="w-full h-auto rounded-2xl"
                  />
                </div>
                <motion.div 
                  initial="hidden"
                  animate={controls1}
                  variants={fadeInUp}
                  transition={{ delay: 0.8 }}
                  className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-gray-100"
                >
                  <div className="flex items-center">
                    <div className="bg-teal-100 p-3 rounded-full mr-3">
                      <FaHeartbeat className="text-teal-600 text-xl" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Patients Today</p>
                      <p className="text-xl font-bold text-gray-800">42</p>
                    </div>
                  </div>
                </motion.div>
                <motion.div 
                  initial="hidden"
                  animate={controls1}
                  variants={fadeInUp}
                  transition={{ delay: 1 }}
                  className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-gray-100"
                >
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-3 rounded-full mr-3">
                      <FaUserMd className="text-blue-600 text-xl" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Active Doctors</p>
                      <p className="text-xl font-bold text-gray-800">24</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={ref2} className="py-16 px-4 md:px-8 bg-white -mt-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            animate={controls2}
            variants={container}
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
      <section ref={ref3} className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial="hidden"
            animate={controls3}
            variants={fadeInDown}
            className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
          >
            Comprehensive <span className="text-teal-600">Features</span>
          </motion.h2>
          <motion.p 
            initial="hidden"
            animate={controls3}
            variants={fadeInDown}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Everything you need to manage your healthcare facility efficiently
          </motion.p>
        </div>
        
        <motion.div 
          initial="hidden"
          animate={controls3}
          variants={container}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {[
            // ... (same features array as before)
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
      <section ref={ref4} className="py-16 px-4 md:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2 
              initial="hidden"
              animate={controls4}
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
            >
              Meet Our <span className="text-blue-600">Specialists</span>
            </motion.h2>
            <motion.p 
              initial="hidden"
              animate={controls4}
              variants={fadeInUp}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              Our team of highly qualified healthcare professionals
            </motion.p>
          </div>
          
          <motion.div 
            initial="hidden"
            animate={controls4}
            variants={fadeInUp}
            transition={{ delay: 0.4 }}
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* ... (same slider implementation as before) */}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section ref={ref5} className="py-16 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2 
              initial="hidden"
              animate={controls5}
              variants={fadeInDown}
              className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
            >
              What Our <span className="text-teal-600">Patients Say</span>
            </motion.h2>
            <motion.p 
              initial="hidden"
              animate={controls5}
              variants={fadeInDown}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              Hear from people who have experienced our healthcare services
            </motion.p>
          </div>
          
          <motion.div 
            initial="hidden"
            animate={controls5}
            variants={container}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* ... (same testimonials implementation as before) */}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ref6} className="py-20 px-4 md:px-8 bg-gradient-to-r from-teal-600 to-blue-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-400 rounded-full filter blur-3xl opacity-20"></div>
          <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-teal-300 rounded-full filter blur-3xl opacity-20"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.h2 
            initial="hidden"
            animate={controls6}
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Ready to transform your healthcare management?
          </motion.h2>
          <motion.p 
            initial="hidden"
            animate={controls6}
            variants={fadeInUp}
            transition={{ delay: 0.2 }}
            className="text-xl mb-10 opacity-90"
          >
            Join hundreds of medical institutions using our platform to streamline their operations.
          </motion.p>
          <motion.div
            initial="hidden"
            animate={controls6}
            variants={fadeInUp}
            transition={{ delay: 0.4 }}
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

export default Home;