import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX, FiUser, FiLogOut, FiHome, FiActivity, FiUsers, FiInfo } from 'react-icons/fi';
import { supabase } from '../helper/supabaseClient';
import { useNavigate } from "react-router-dom";
import Logo from '../assets/logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch user data and role
  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);

        const { data, error } = await supabase
          .from("doctors")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (data) setRole(data.role);
        if (error) console.error("Error fetching role:", error.message);
      }
    };

    fetchUserData();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => listener?.subscription?.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
    setUser(null);
    setRole("");
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-gray-900 shadow-xl py-2' : 'bg-gray-800 py-4'}`}>
      <div className='container mx-auto px-4'>
        <div className='flex justify-between items-center'>
          {/* Logo */}
          <Link to="/" className='flex items-center space-x-2 group'>
            <img src={Logo} alt="Logo" className='w-10 h-10 transition-transform duration-300 group-hover:rotate-12' />
            <span className='text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent'>
              MediCare
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className='hidden md:flex items-center space-x-1'>
            <NavLink to="/" icon={<FiHome />} text="Home" />
            <NavLink to="/services" icon={<FiActivity />} text="Services" />
            <NavLink to="/doctor" icon={<FiUsers />} text="Doctors" />
            <NavLink to="/about" icon={<FiInfo />} text="About" />
          </div>

          {/* Auth Buttons or Profile Dropdown */}
          <div className='flex items-center space-x-4'>
            {!user ? (
              <>
                <Link
                  to="/login"
                  className='hidden md:block px-4 py-2 text-sm font-medium text-white hover:text-blue-300 transition-colors duration-300'
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className='hidden md:block px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-sm font-medium text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:from-blue-600 hover:to-purple-700'
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <div className='relative'>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className='flex items-center space-x-2 focus:outline-none group'
                >
                  <div className='relative'>
                    <img
                      src={'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI='}
                      alt="Profile"
                      className='w-9 h-9 rounded-full border-2 border-transparent group-hover:border-blue-400 transition-all duration-300'
                    />
                    <div className='absolute -bottom-1 -right-1 bg-green-400 rounded-full w-3 h-3 border-2 border-gray-800'></div>
                  </div>
                  <span className='hidden md:inline font-medium text-white group-hover:text-blue-300 transition-colors duration-300'>
                    {user.user_metadata?.displayName || "User"}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className='absolute right-0 mt-2 w-56 bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-700'>
                    <div className='px-4 py-3 border-b border-gray-700'>
                      <p className='text-sm text-white font-medium'>{user.email}</p>
                      <p className='text-xs text-gray-400'>{role}</p>
                    </div>
                    <div className='py-1'>
                      {role === "HOD" && (
                        <DropdownLink to="/dashboard" icon={<FiActivity />} text="Dashboard" />
                      )}
                      {role === "Doctor" && (
                        <DropdownLink to="/profile" icon={<FiUser />} text="Profile" />
                      )}
                      <button
                        onClick={handleLogout}
                        className='w-full flex items-center px-4 py-2 text-sm text-red-400 hover:bg-gray-700 transition-colors duration-200'
                      >
                        <FiLogOut className='mr-2' />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className='md:hidden text-white p-2 rounded-lg hover:bg-gray-700 focus:outline-none transition-colors duration-300'
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Links */}
        <div className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 py-4' : 'max-h-0'}`}>
          <div className='flex flex-col space-y-3 px-2'>
            <MobileNavLink to="/" icon={<FiHome />} text="Home" />
            <MobileNavLink to="/services" icon={<FiActivity />} text="Services" />
            <MobileNavLink to="/doctors" icon={<FiUsers />} text="Doctors" />
            <MobileNavLink to="/about" icon={<FiInfo />} text="About" />

            {!user ? (
              <div className='flex flex-col space-y-3 pt-4'>
                <Link
                  to="/login"
                  className='w-full px-4 py-3 text-center bg-gray-700 rounded-lg text-white font-medium hover:bg-gray-600 transition-colors duration-300'
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className='w-full px-4 py-3 text-center bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300'
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <button
                onClick={handleLogout}
                className='w-full mt-4 px-4 py-3 text-left bg-gray-700 rounded-lg text-red-400 font-medium hover:bg-gray-600 transition-colors duration-300 flex items-center'
              >
                <FiLogOut className='mr-2' />
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

// Reusable NavLink component for desktop
const NavLink = ({ to, icon, text }) => (
  <Link
    to={to}
    className="flex items-center px-4 py-2 text-sm font-medium text-gray-300 hover:text-white rounded-lg group transition-colors duration-300"
  >
    <span className="mr-2 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
      {icon}
    </span>
    {text}
    <span className="block w-0 group-hover:w-full h-0.5 bg-blue-400 transition-all duration-300 mt-1"></span>
  </Link>
);

// Reusable MobileNavLink component
const MobileNavLink = ({ to, icon, text }) => (
  <Link
    to={to}
    className="flex items-center px-4 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-300"
    onClick={() => setIsOpen(false)}
  >
    <span className="mr-3">
      {icon}
    </span>
    {text}
  </Link>
);

// Reusable DropdownLink component
const DropdownLink = ({ to, icon, text }) => (
  <Link
    to={to}
    className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
    onClick={() => setIsProfileOpen(false)}
  >
    <span className="mr-2">
      {icon}
    </span>
    {text}
  </Link>
);

export default Navbar;