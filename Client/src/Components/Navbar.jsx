import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiUser, FiLogOut, FiHome, FiActivity, FiUsers, FiInfo } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../helper/supabaseClient';
import Logo from '../assets/logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-2' : 'bg-white/95 backdrop-blur-sm py-4'}`}>
      <div className='container mx-auto px-4'>
        <div className='flex justify-between items-center'>
          <Link to="/" className='flex items-center space-x-2 group'>
            <motion.img 
              src={Logo} 
              alt="Logo" 
              className='w-10 h-10'
              whileHover={{ rotate: 12, scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            />
            <motion.span 
              className='text-xl font-bold bg-gradient-to-r from-gray-700 to-gray-500 bg-clip-text text-transparent'
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              MediCare
            </motion.span>
          </Link>

          <div className='hidden md:flex items-center space-x-1'>
            <NavLink to="/" icon={<FiHome />} text="Home" />
            <NavLink to="/services" icon={<FiActivity />} text="Services" />
            <NavLink to="/doctors" icon={<FiUsers />} text="Doctors" />
            <NavLink to="/about" icon={<FiInfo />} text="About" />
          </div>

          <div className='flex items-center space-x-4'>
            {!user ? (
              <>
                <Link to="/login" className='hidden md:block px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors duration-300'>
                  Login
                </Link>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/signup" className='hidden md:block px-6 py-2 bg-gradient-to-r from-gray-600 to-gray-500 rounded-full text-sm font-medium text-white shadow-md hover:shadow-lg transition-all duration-300'>
                    Sign Up
                  </Link>
                </motion.div>
              </>
            ) : (
              <div className='relative'>
                <motion.button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)} 
                  className='flex items-center space-x-2 focus:outline-none group'
                  whileHover={{ scale: 1.05 }}
                >
                  <div className='relative'>
                    <motion.img
                      src={'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI='}
                      alt="Profile"
                      className='w-9 h-9 rounded-full border-2 border-transparent group-hover:border-gray-400 transition-all duration-300'
                      whileTap={{ scale: 0.9 }}
                    />
                    <div className='absolute -bottom-1 -right-1 bg-green-400 rounded-full w-3 h-3 border-2 border-white'></div>
                  </div>
                  <span className='hidden md:inline font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-300'>
                    {user.user_metadata?.displayName || user.email?.split('@')[0] || "User"}
                  </span>
                </motion.button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ type: 'spring', damping: 20 }}
                      className='absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200'
                    >
                      <div className='px-4 py-3 border-b border-gray-200 bg-gray-50'>
                        <p className='text-sm text-gray-800 font-medium'>{user.email}</p>
                        {role && <p className='text-xs text-gray-500 mt-1'>{role}</p>}
                      </div>
                      <div className='py-1'>
                        {(role === "HOD" || role === "Trustee") && (
                          <DropdownLink to="/dashboard" icon={<FiActivity />} text="Dashboard" onClick={() => setIsProfileOpen(false)} />
                        )}
                        {role === "Doctor" && (
                          <DropdownLink to="/profile" icon={<FiUser />} text="Profile" onClick={() => setIsProfileOpen(false)} />
                        )}
                        <motion.button
                          onClick={handleLogout}
                          className='w-full flex items-center px-4 py-2 text-sm text-red-500 hover:bg-gray-50 transition-colors duration-200'
                          whileHover={{ x: 2 }}
                        >
                          <FiLogOut className='mr-2' />
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
              className='md:hidden text-gray-600 p-2 rounded-lg hover:bg-gray-100 focus:outline-none transition-colors duration-300'
              whileHover={{ scale: 1.1 }}
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
              transition={{ duration: 0.3 }}
              className='md:hidden overflow-hidden'
            >
              <div className='flex flex-col space-y-3 px-2 py-4'>
                <MobileNavLink to="/" icon={<FiHome />} text="Home" onClick={() => setIsOpen(false)} />
                <MobileNavLink to="/services" icon={<FiActivity />} text="Services" onClick={() => setIsOpen(false)} />
                <MobileNavLink to="/doctors" icon={<FiUsers />} text="Doctors" onClick={() => setIsOpen(false)} />
                <MobileNavLink to="/about" icon={<FiInfo />} text="About" onClick={() => setIsOpen(false)} />

                {!user ? (
                  <div className='flex flex-col space-y-3 pt-4'>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Link to="/login" className='w-full px-4 py-3 text-center bg-gray-50 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors duration-300'>
                        Login
                      </Link>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Link to="/signup" className='w-full px-4 py-3 text-center bg-gradient-to-r from-gray-600 to-gray-500 rounded-lg text-white font-medium hover:shadow-md transition-all duration-300'>
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
                      className='w-full mt-4 px-4 py-3 text-left bg-gray-50 rounded-lg text-red-500 font-medium hover:bg-gray-100 transition-colors duration-300 flex items-center'
                      whileHover={{ x: 5 }}
                    >
                      <FiLogOut className='mr-2' />
                      Logout
                    </motion.button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

const NavLink = ({ to, icon, text }) => (
  <Link to={to} className="relative flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg transition-colors duration-300 group">
    <span className="mr-2 text-gray-500 group-hover:text-gray-700 transition-colors duration-300">{icon}</span>
    {text}
    <motion.span 
      className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-400"
      initial={{ width: 0 }}
      whileHover={{ width: '100%' }}
      transition={{ duration: 0.3 }}
    />
  </Link>
);

const MobileNavLink = ({ to, icon, text, onClick }) => (
  <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.98 }}>
    <Link
      to={to}
      className="flex items-center px-4 py-3 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-300"
      onClick={onClick}
    >
      <span className="mr-3 text-gray-500">{icon}</span>
      {text}
    </Link>
  </motion.div>
);

const DropdownLink = ({ to, icon, text, onClick }) => (
  <motion.div whileHover={{ x: 3 }}>
    <Link
      to={to}
      className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
      onClick={onClick}
    >
      <span className="mr-2 text-gray-500">{icon}</span>
      {text}
    </Link>
  </motion.div>
);

export default Navbar;