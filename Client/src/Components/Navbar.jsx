import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import { supabase } from '../helper/supabaseClient';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

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

        {/* Auth Buttons */}
        {!user ? (
          <div className='hidden md:flex gap-4'>
            <Link to="/signup" className='bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 transition-all'>Sign Up</Link>
            <Link to="/login" className='hover:text-gray-400'>Login</Link>
          </div>
        ) : (
          <div className='hidden md:flex gap-4 items-center'>
            <Link to="/profile" className='hover:text-gray-400'>Profile</Link>
            {/* <button onClick={handleLogout} className='bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition-all'>
              Logout
            </button> */}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;