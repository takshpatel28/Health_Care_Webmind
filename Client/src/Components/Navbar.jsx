import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX, FiSettings } from 'react-icons/fi';
import { supabase } from '../helper/supabaseClient';
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navigate = useNavigate()

  // Check authentication state when component mounts
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };

    checkAuth();

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => listener?.subscription?.unsubscribe();
  }, []);

  // Logout function
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login')
    setUser(null);
  };

  return (
    <nav className='bg-gray-800 p-4 text-white'>
      <div className='container mx-auto flex justify-between items-center'>
        {/* Logo */}
        <div className='text-2xl font-bold'>LOGO</div>

        {/* Mobile Menu Button */}
        <div className='md:hidden'>
          <button onClick={() => setIsOpen(!isOpen)} className='text-white text-2xl'>
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* Navigation Links */}
        <div className={`absolute top-16 left-0 w-full bg-gray-800 md:static md:flex md:items-center md:w-auto transition-all duration-300 ${isOpen ? 'block' : 'hidden'}`}>
          <div className='flex flex-col md:flex-row md:gap-6 p-4 md:p-0'>
            <Link to="/" className='hover:text-gray-400'>Home</Link>
            <Link to="/services" className='hover:text-gray-400'>Services</Link>
            <Link to="/doctors" className='hover:text-gray-400'>Doctors</Link>
            <Link to="/about" className='hover:text-gray-400'>About</Link>
          </div>
        </div>

        {/* Auth Buttons or Profile Dropdown */}
        {!user ? (
          <div className='hidden md:flex gap-4'>
            <Link to="/signup" className='bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 transition-all'>Sign Up</Link>
            <Link to="/login" className='hover:text-gray-400'>Login</Link>
          </div>
        ) : (
          <div className='hidden md:block relative'>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className='flex items-center space-x-3 focus:outline-none cursor-pointer'
            >
              <img
                src={ 'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI='}
                alt="Profile"
                className='w-8 h-8 rounded-full'
              />
              <span className='font-medium'>{user.user_metadata.displayName}</span>
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-gray-800'>
                <Link
                  to="/dashboard"
                  className='block px-4 py-2 text-sm hover:bg-gray-100'
                >
                  Dashboard
                </Link>
                <Link
                  to="/settings"
                  className='block px-4 py-2 text-sm hover:bg-gray-100'
                >
                  <div className='flex items-center'>
                    <FiSettings className='mr-2' />
                    Settings
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className='block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100'
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
