import React from 'react';
import { motion } from 'framer-motion';
import { FaPhoneAlt, FaMapMarkerAlt, FaEnvelope, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaHeartbeat } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 pt-16 pb-8 relative overflow-hidden border-t border-gray-200">
      {/* Decorative elements */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-gray-200 rounded-full filter blur-3xl opacity-30"></div>
      <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-gray-300 rounded-full filter blur-3xl opacity-20"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="flex items-center">
              <FaHeartbeat className="text-3xl text-blue-600 mr-3" />
              <h3 className="text-2xl font-bold text-gray-900">HealthCare+</h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Providing world-class healthcare services with compassion and cutting-edge technology since 2005.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: <FaFacebookF className="text-lg" />, color: "hover:bg-blue-600" },
                { icon: <FaTwitter className="text-lg" />, color: "hover:bg-sky-500" },
                { icon: <FaInstagram className="text-lg" />, color: "hover:bg-pink-600" },
                { icon: <FaLinkedinIn className="text-lg" />, color: "hover:bg-blue-700" }
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href="#"
                  className={`w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-white transition-all duration-300 ${social.color}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-bold text-gray-900">Quick Links</h3>
            <ul className="space-y-3">
              {[
                "About Us",
                "Our Services",
                "Meet Our Doctors",
                "Patient Stories",
                "Careers",
                "News & Blog"
              ].map((link, index) => (
                <motion.li 
                  key={index}
                  whileHover={{ x: 5 }}
                >
                  <a 
                    href="#" 
                    className="text-gray-600 hover:text-gray-800 hover:font-semibold transition-colors duration-500 flex items-center"
                  >
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-bold text-gray-900">Our Services</h3>
            <ul className="space-y-3">
              {[
                "Emergency Care",
                "Cardiology",
                "Neurology",
                "Pediatrics",
                "Orthopedics",
                "Dermatology",
                "Laboratory"
              ].map((service, index) => (
                <motion.li 
                  key={index}
                  whileHover={{ x: 5 }}
                >
                  <a 
                    href="#" 
                    className="text-gray-600 hover:text-gray-800 hover:font-semibold transition-colors duration-500 flex items-center"
                  >
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {service}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-bold text-gray-900">Contact Us</h3>
            <div className="space-y-4">
              <motion.div 
                whileHover={{ x: 5 }}
                className="flex items-start"
              >
                <div className="bg-blue-100 p-2 rounded-lg mr-4">
                  <FaMapMarkerAlt className="text-blue-600 text-lg" />
                </div>
                <div>
                  <p className="text-gray-700 font-medium">Our Location</p>
                  <a 
                    href="https://maps.google.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-blue-600 transition-colors duration-300 text-sm"
                  >
                    123 Medical Drive, Health City, HC 12345
                  </a>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ x: 5 }}
                className="flex items-start"
              >
                <div className="bg-blue-100 p-2 rounded-lg mr-4">
                  <FaPhoneAlt className="text-blue-600 text-lg" />
                </div>
                <div>
                  <p className="text-gray-700 font-medium">Call Us</p>
                  <a 
                    href="tel:+11234567890" 
                    className="text-gray-600 hover:text-blue-600 transition-colors duration-300 text-sm"
                  >
                    +1 (123) 456-7890
                  </a>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ x: 5 }}
                className="flex items-start"
              >
                <div className="bg-blue-100 p-2 rounded-lg mr-4">
                  <FaEnvelope className="text-blue-600 text-lg" />
                </div>
                <div>
                  <p className="text-gray-700 font-medium">Email Us</p>
                  <a 
                    href="mailto:info@healthcareplus.com" 
                    className="text-gray-600 hover:text-blue-600 transition-colors duration-300 text-sm"
                  >
                    info@healthcareplus.com
                  </a>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-300 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-gray-500 text-sm mb-4 md:mb-0"
            >
              © {new Date().getFullYear()} HealthCare+. All rights reserved.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex space-x-6"
            >
              <a href="#" className="text-gray-500 hover:text-gray-800 transition-colors text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-500 hover:text-gray-800 transition-colors text-sm">Terms of Service</a>
              <a href="#" className="text-gray-500 hover:text-gray-800 transition-colors text-sm">Sitemap</a>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;