import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../helper/supabaseClient';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { FiEdit2, FiTrash2, FiUser, FiSearch, FiX, FiCheck, FiAlertCircle, FiPlus } from 'react-icons/fi';
import { FaUserMd, FaHospital, FaRegCalendarAlt } from 'react-icons/fa';

const HOD = () => {
  const [hods, setHods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState(false);
  const [currentHod, setCurrentHod] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    fullname: '',
    department: '',
    departmentCategory: '',
    experienceyears: ''
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');
  const [showConfirm, setShowConfirm] = useState(false);
  const [hodToDelete, setHodToDelete] = useState(null);
  const navigate = useNavigate();

  // Alert component with animations
  const AlertPopup = ({ message, type, onClose }) => {
    const bgColor = type === 'success' ? 'bg-emerald-100 border-emerald-400 text-emerald-700' : 'bg-rose-100 border-rose-400 text-rose-700';
    const icon = type === 'success' ? <FiCheck className="w-6 h-6 mr-2" /> : <FiAlertCircle className="w-6 h-6 mr-2" />;
    
    return (
      <motion.div
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 300, opacity: 0 }}
        transition={{ type: 'spring', damping: 25 }}
        className={`fixed top-6 right-6 border-l-4 ${bgColor} px-6 py-4 rounded-lg shadow-lg max-w-sm z-50 flex items-center`}
        role="alert"
      >
        {icon}
        <span className="font-medium flex-grow">{message}</span>
        <button 
          onClick={onClose}
          className="ml-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <FiX className="w-6 h-6" />
        </button>
      </motion.div>
    );
  };

  // Fetch HODs data
  useEffect(() => {
    const fetchHods = async () => {
      try {
        const response = await fetch('https://health-care-webmind.onrender.com/api/trusty/gethods');
        if (!response.ok) throw new Error('Failed to fetch HODs');
        const data = await response.json();
        setHods(data.hodsData || data.doctorsData || []);
      } catch (error) {
        console.error('Error fetching HODs:', error);
        setAlertMessage('Failed to fetch HODs');
        setAlertType('error');
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      } finally {
        setLoading(false);
      }
    };

    fetchHods();
  }, []);

  // Check if user is Trustee
  useEffect(() => {
    const checkUserRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data } = await supabase
          .from('doctors')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        if (data?.role !== 'Trustee') {
          navigate('/dashboard');
        }
      } else {
        navigate('/login');
      }
    };

    checkUserRole();
  }, [navigate]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://health-care-webmind.onrender.com/api/trusty/deletehod/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setHods(hods.filter(hod => hod.id !== id));
        setAlertMessage('HOD deleted successfully');
        setAlertType('success');
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      } else {
        throw new Error('Failed to delete HOD');
      }
    } catch (error) {
      console.error('Error deleting HOD:', error);
      setAlertMessage(error.message || 'Failed to delete HOD');
      setAlertType('error');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    } finally {
      setShowConfirm(false);
    }
  };

  const confirmDelete = (id) => {
    setHodToDelete(id);
    setShowConfirm(true);
  };

  const handleEdit = (hod) => {
    setCurrentHod(hod);
    setFormData({
      fullname: hod.fullname,
      department: hod.department,
      departmentCategory: hod.departmentCategory,
      experienceyears: hod.experienceyears
    });
    setEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://health-care-webmind.onrender.com/api/trusty/updatehod/${currentHod.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
  
      if (response.ok) {
        const updatedData = await response.json();
        
        setHods(hods.map(hod => 
          hod.id === currentHod.id ? 
          {
            ...hod,
            fullname: formData.fullname,
            department: formData.department,
            departmentCategory: formData.departmentCategory,
            experienceyears: formData.experienceyears
          } 
          : hod
        ));
        
        setEditModal(false);
        setAlertMessage('HOD updated successfully');
        setAlertType('success');
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update HOD');
      }
    } catch (error) {
      console.error('Error updating HOD:', error);
      setAlertMessage(error.message || 'Failed to update HOD');
      setAlertType('error');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const filteredHods = hods.filter(hod => 
    hod.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hod.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hod.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="rounded-full h-20 w-20 border-t-4 border-b-4 border-teal-500"
          ></motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-gray-600 text-lg font-medium"
          >
            Loading HOD data...
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto p-1 mt-7">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Head of Departments</h1>
              <p className="text-gray-500 mt-2">
                Manage and oversee all department heads in your organization
              </p>
            </div>
          </div>

          {/* Search and Table Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="p-3 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="relative w-full md:w-96">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400 text-xl" />
                </div>
                <input
                  type="text"
                  placeholder="Search HODs by name, department or email..."
                  className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-base"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-3">Showing:</span>
                <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-medium">
                  {filteredHods.length} {filteredHods.length === 1 ? 'HOD' : 'HODs'}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">HOD Details</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredHods.length > 0 ? (
                    filteredHods.map((hod, index) => (
                      <motion.tr
                        key={hod.id}
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-teal-100 flex items-center justify-center">
                              <FiUser className="text-teal-600 text-xl" />
                            </div>
                            <div className="ml-4">
                              <div className="text-lg font-medium text-gray-900">{hod.fullname}</div>
                              <div className="text-gray-500">{hod.email}</div>
                              <div className="text-sm text-gray-400 mt-1">{hod.departmentCategory}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center mr-3">
                              <FaHospital className="text-blue-500" />
                            </div>
                            <span className="text-gray-700 font-medium">{hod.department}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="inline-flex items-center px-3 py-1 rounded-full bg-amber-50 text-amber-700">
                            <span className="font-medium">{hod.experienceyears}</span>
                            <span className="ml-1">years</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex justify-end space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleEdit(hod)}
                              className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                              title="Edit"
                            >
                              <FiEdit2 className="w-5 h-5" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => confirmDelete(hod.id)}
                              className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                              title="Delete"
                            >
                              <FiTrash2 className="w-5 h-5" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <FiUser className="w-16 h-16 text-gray-300 mb-4" />
                          <h3 className="text-xl font-medium text-gray-500">No HODs found</h3>
                          <p className="text-gray-400 mt-2 max-w-md">
                            {searchTerm 
                              ? "We couldn't find any HODs matching your search. Try different keywords."
                              : "There are currently no Heads of Departments in the system."}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Edit Modal */}
      <AnimatePresence>
        {editModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Edit HOD Details</h2>
                <button
                  onClick={() => setEditModal(false)}
                  className="text-gray-400 hover:text-gray-500 transition-colors"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleUpdate} className="p-6">
                <div className="space-y-5">
                  {[
                    { label: 'Full Name', name: 'fullname', icon: <FiUser className="text-gray-400" /> },
                    { label: 'Department', name: 'department', icon: <FaHospital className="text-gray-400" /> },
                    { label: 'Department Category', name: 'departmentCategory', icon: <FiUser className="text-gray-400" /> },
                    { label: 'Experience (Years)', name: 'experienceyears', type: 'number', icon: <FaRegCalendarAlt className="text-gray-400" /> }
                  ].map((field) => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          {field.icon}
                        </div>
                        <input
                          type={field.type || 'text'}
                          name={field.name}
                          value={formData[field.name]}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                          required
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex justify-end space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setEditModal(false)}
                    className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 transition-all"
                  >
                    Save Changes
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Confirm Deletion</h2>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="text-gray-400 hover:text-gray-500 transition-colors"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6">
                <div className="flex items-start">
                  <FiAlertCircle className="flex-shrink-0 h-6 w-6 text-rose-500 mt-0.5 mr-3" />
                  <p className="text-gray-700">
                    Are you sure you want to delete this HOD? This action cannot be undone and will permanently remove all associated data.
                  </p>
                </div>
                <div className="mt-8 flex justify-end space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowConfirm(false)}
                    className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDelete(hodToDelete)}
                    className="px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 transition-all"
                  >
                    Delete Permanently
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alert Popup */}
      <AnimatePresence>
        {showAlert && (
          <AlertPopup 
            message={alertMessage} 
            type={alertType} 
            onClose={() => setShowAlert(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default HOD;