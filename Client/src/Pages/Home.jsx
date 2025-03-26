import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col md:flex-row items-center justify-center px-6">
      {/* Left Side - Doctor Image */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }} 
        animate={{ opacity: 1, x: 0 }} 
        transition={{ duration: 1 }}
        className="md:w-1/2 flex justify-center"
      >
        <img 
          src="https://images.unsplash.com/photo-1651008376811-b90baee60c1f?q=80&w=1974&auto=format&fit=crop" 
          alt="Doctor" 
          className="w-full max-w-md rounded-lg shadow-lg"
        />
      </motion.div>

      {/* Right Side - Text Content */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }} 
        animate={{ opacity: 1, x: 0 }} 
        transition={{ duration: 1 }}
        className="md:w-1/2 text-center md:text-left mt-6 md:mt-0"
      >
        <h1 className="text-4xl md:text-6xl font-bold">
          Meet Our Expert Doctor
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mt-4">
          Providing top-quality medical care with expertise and compassion.
        </p>
        <motion.button 
          whileHover={{ scale: 1.1 }} 
          whileTap={{ scale: 0.9 }}
          className="mt-6 bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg shadow-lg text-lg md:text-xl"
        >
          Book an Appointment
        </motion.button>
      </motion.div>
    </div>
  );
}
