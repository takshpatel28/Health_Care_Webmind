import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiUser, FiLogOut, FiHome, FiActivity, FiUsers, FiInfo } from 'react-icons/fi';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { supabase } from '../helper/supabaseClient';
import Logo from '../assets/logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  // Scroll animations
  const { scrollY } = useScroll();
  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.98)']
  );
  const shadow = useTransform(
    scrollY,
    [0, 100],
    ['0 1px 2px 0 rgba(0, 0, 0, 0.05)', '0 4px 6px -1px rgba(0, 0, 0, 0.1)']
  );
  const padding = useTransform(
    scrollY,
    [0, 100],
    ['1rem', '0.5rem']
  );

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          const { data } = await supabase
            .from('doctors')
            .select('role')
            .eq('id', session.user.id)
            .single();
          setRole(data?.role || null);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        supabase
          .from('doctors')
          .select('role')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => setRole(data?.role || null));
      } else {
        setUser(null);
        setRole(null);
      }
    });
    return () => subscription?.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const isAdmin = role === "HOD" || role === "Trustee";

  return (
    <motion.nav 
      style={{
        backgroundColor,
        boxShadow: shadow,
        paddingTop: padding,
        paddingBottom: padding
      }}
      className="fixed w-full z-50 backdrop-blur-sm transition-all duration-300"
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.img 
              src={Logo} 
              alt="Logo" 
              className="w-10 h-10"
              whileHover={{ 
                rotate: [0, 10, -10, 0],
                transition: { duration: 0.7 }
              }}
              transition={{ type: 'spring', stiffness: 300 }}
            />
            <motion.span 
              className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              MediCare
            </motion.span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            <NavLink to="/" icon={<FiHome />} text="Home" />
            <NavLink to="/services" icon={<FiActivity />} text="Services" />
            {/* Show Doctors tab only for HOD/Trustee */}
            {isAdmin && (
              <NavLink to="/my_doctors" icon={<FiUsers />} text="Doctors" />
            )}
            <NavLink to="/about" icon={<FiInfo />} text="About" />
          </div>

          <div className="flex items-center space-x-4">
            {!user ? (
              <>
                <Link to="/login" className="hidden md:block px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors duration-300">
                  Login
                </Link>
                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <Link to="/signup" className="hidden md:block px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full text-sm font-medium text-white shadow-md hover:shadow-lg transition-all duration-300">
                    Sign Up
                  </Link>
                </motion.div>
              </>
            ) : (
              <div className="relative">
                <motion.button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)} 
                  className="flex items-center space-x-2 focus:outline-none group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="relative">
                    <motion.img
                      src={'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI='}
                      alt="Profile"
                      className="w-9 h-9 rounded-full border-2 border-transparent group-hover:border-blue-400 transition-all duration-300"
                      whileTap={{ scale: 0.9 }}
                    />
                    <motion.div 
                      className="absolute -bottom-1 -right-1 bg-green-400 rounded-full w-3 h-3 border-2 border-white"
                      animate={{
                        scale: [1, 1.2, 1],
                        boxShadow: ['0 0 0 0 rgba(74, 222, 128, 0)', '0 0 0 4px rgba(74, 222, 128, 0.3)', '0 0 0 0 rgba(74, 222, 128, 0)']
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: 'loop'
                      }}
                    />
                  </div>
                  <span className="hidden md:inline font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                    {user.user_metadata?.displayName || user.email?.split('@')[0] || "User"}
                  </span>
                </motion.button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ 
                        type: 'spring', 
                        damping: 20,
                        stiffness: 300
                      }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200 origin-top-right"
                    >
                      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                        <p className="text-sm text-gray-800 font-medium">{user.email}</p>
                        {role && (
                          <motion.p 
                            className="text-xs text-gray-500 mt-1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            {role}
                          </motion.p>
                        )}
                      </div>
                      <div className="py-1">
                        {(role === "HOD" || role === "Trustee") && (
                          <DropdownLink to="/dashboard" icon={<FiActivity />} text="Dashboard" onClick={() => setIsProfileOpen(false)} />
                        )}
                        {role === "Doctor" && (
                          <DropdownLink to="/profile" icon={<FiUser />} text="Profile" onClick={() => setIsProfileOpen(false)} />
                        )}
                        <motion.button
                          onClick={handleLogout}
                          className="w-full flex items-center px-4 py-2 text-sm text-red-500 hover:bg-gray-50 transition-colors duration-200"
                          whileHover={{ x: 2 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <FiLogOut className="mr-2" />
                          Logout
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-gray-600 p-2 rounded-lg hover:bg-gray-100 focus:outline-none transition-colors duration-300"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ 
                duration: 0.3,
                ease: [0.04, 0.62, 0.23, 0.98]
              }}
              className="md:hidden overflow-hidden"
            >
              <div className="flex flex-col space-y-3 px-2 py-4">
                <MobileNavLink to="/" icon={<FiHome />} text="Home" onClick={() => setIsOpen(false)} />
                <MobileNavLink to="/services" icon={<FiActivity />} text="Services" onClick={() => setIsOpen(false)} />
                {/* Show Doctors tab only for HOD/Trustee in mobile view */}
                {isAdmin && (
                  <MobileNavLink to="/my_doctors" icon={<FiUsers />} text="Doctors" onClick={() => setIsOpen(false)} />
                )}
                <MobileNavLink to="/about" icon={<FiInfo />} text="About" onClick={() => setIsOpen(false)} />

                {!user ? (
                  <div className="flex flex-col space-y-3 pt-4">
                    <motion.div 
                      whileHover={{ scale: 1.02 }} 
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      <Link to="/login" className="w-full px-4 py-3 text-center bg-gray-50 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors duration-300">
                        Login
                      </Link>
                    </motion.div>
                    <motion.div 
                      whileHover={{ scale: 1.02 }} 
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      <Link to="/signup" className="w-full px-4 py-3 text-center bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg text-white font-medium hover:shadow-md transition-all duration-300">
                        Sign Up
                      </Link>
                    </motion.div>
                  </div>
                ) : (
                  <>
                    {(role === "HOD" || role === "Trustee") && (
                      <MobileNavLink to="/dashboard" icon={<FiActivity />} text="Dashboard" onClick={() => setIsOpen(false)} />
                    )}
                    {role === "Doctor" && (
                      <MobileNavLink to="/profile" icon={<FiUser />} text="Profile" onClick={() => setIsOpen(false)} />
                    )}
                    <motion.button
                      onClick={handleLogout}
                      className="w-full mt-4 px-4 py-3 text-left bg-gray-50 rounded-lg text-red-500 font-medium hover:bg-gray-100 transition-colors duration-300 flex items-center"
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FiLogOut className="mr-2" />
                      Logout
                    </motion.button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

const NavLink = ({ to, icon, text }) => (
  <Link to={to} className="relative flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg transition-colors duration-300 group">
    <motion.span 
      className="mr-2 text-gray-500 group-hover:text-blue-500 transition-colors duration-300"
      whileHover={{ rotate: 10 }}
    >
      {icon}
    </motion.span>
    {text}
    <motion.span 
      className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600"
      initial={{ width: 0 }}
      whileHover={{ width: '100%' }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    />
  </Link>
);

const MobileNavLink = ({ to, icon, text, onClick }) => (
  <motion.div 
    whileHover={{ x: 5 }} 
    whileTap={{ scale: 0.98 }}
    transition={{ type: 'spring', stiffness: 400 }}
  >
    <Link
      to={to}
      className="flex items-center px-4 py-3 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-300"
      onClick={onClick}
    >
      <motion.span 
        className="mr-3 text-gray-500"
        whileHover={{ scale: 1.1 }}
      >
        {icon}
      </motion.span>
      {text}
    </Link>
  </motion.div>
);

const DropdownLink = ({ to, icon, text, onClick }) => (
  <motion.div 
    whileHover={{ x: 3 }} 
    whileTap={{ scale: 0.98 }}
    transition={{ type: 'spring', stiffness: 400 }}
  >
    <Link
      to={to}
      className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
      onClick={onClick}
    >
      <motion.span 
        className="mr-2 text-gray-500"
        whileHover={{ rotate: 10 }}
      >
        {icon}
      </motion.span>
      {text}
    </Link>
  </motion.div>
);

export default Navbar;