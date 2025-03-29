import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../helper/supabaseClient';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { FiEdit2, FiTrash2, FiUser, FiBriefcase, FiLayers, FiAward, FiSearch, FiX, FiCheck, FiAlertCircle } from 'react-icons/fi';

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
    const bgColor = type === 'success' ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700';
    const icon = type === 'success' ? <FiCheck className="w-5 h-5 mr-2" /> : <FiAlertCircle className="w-5 h-5 mr-2" />;
    
    return (
      <motion.div
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 300, opacity: 0 }}
        transition={{ type: 'spring', damping: 25 }}
        className={`fixed top-4 right-4 border ${bgColor} px-4 py-3 rounded-lg shadow-lg max-w-sm z-50 flex items-center`}
        role="alert"
      >
        {icon}
        <span className="font-medium flex-grow">{message}</span>
        <button 
          onClick={onClose}
          className="ml-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <FiX className="w-5 h-5" />
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
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex justify-center items-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
          ></motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex justify-between items-center mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-800">HOD Management</h1>
              <p className="text-gray-600 mt-2">Manage Heads of Departments in your organization</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8"
          >
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <div className="relative w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search HODs..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <motion.span 
                whileHover={{ scale: 1.05 }}
                className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full"
              >
                {filteredHods.length} {filteredHods.length === 1 ? 'HOD' : 'HODs'} found
              </motion.span>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {['Name', 'Department', 'Category', 'Experience', 'Actions'].map((header, index) => (
                      <motion.th
                        key={header}
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {header}
                      </motion.th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredHods.length > 0 ? (
                    filteredHods.map((hod, index) => (
                      <motion.tr
                        key={hod.id}
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 + index * 0.03 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <motion.div 
                              whileHover={{ rotate: 10, scale: 1.1 }}
                              className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center"
                            >
                              <FiUser className="text-blue-600" />
                            </motion.div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{hod.fullname}</div>
                              <div className="text-sm text-gray-500">{hod.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-medium">{hod.department}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{hod.departmentCategory}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{hod.experienceyears} years</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleEdit(hod)}
                            className="text-blue-600 hover:text-blue-900 mr-4 inline-flex items-center transition-all"
                          >
                            <FiEdit2 className="mr-1" /> Edit
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => confirmDelete(hod.id)}
                            className="text-red-600 hover:text-red-900 inline-flex items-center transition-all"
                          >
                            <FiTrash2 className="mr-1" /> Delete
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                        No HODs found matching your search
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
            className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-white rounded-xl shadow-lg max-w-md w-full overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">Edit HOD Details</h2>
                  <motion.button
                    whileHover={{ rotate: 90 }}
                    onClick={() => setEditModal(false)}
                    className="text-white hover:text-blue-100 transition-all"
                  >
                    <FiX className="h-6 w-6" />
                  </motion.button>
                </div>
              </div>
              <form onSubmit={handleUpdate} className="p-6">
                <div className="space-y-4">
                  {[
                    { label: 'Full Name', name: 'fullname' },
                    { label: 'Department', name: 'department' },
                    { label: 'Department Category', name: 'departmentCategory' },
                    { label: 'Experience (Years)', name: 'experienceyears', type: 'number' }
                  ].map((field, index) => (
                    <motion.div
                      key={field.name}
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                      <input
                        type={field.type || 'text'}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      />
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setEditModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
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
            className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-white rounded-xl shadow-lg max-w-md w-full overflow-hidden"
            >
              <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
                <motion.div 
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex justify-between items-center"
                >
                  <h2 className="text-xl font-bold">Confirm Deletion</h2>
                  <motion.button
                    whileHover={{ rotate: 90 }}
                    onClick={() => setShowConfirm(false)}
                    className="text-white hover:text-red-100 transition-all"
                  >
                    <FiX className="h-6 w-6" />
                  </motion.button>
                </motion.div>
              </div>
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="p-6"
              >
                <p className="text-gray-700 mb-6">Are you sure you want to delete this HOD? This action cannot be undone.</p>
                <div className="flex justify-end space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowConfirm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(hodToDelete)}
                    className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all"
                  >
                    Delete
                  </motion.button>
                </div>
              </motion.div>
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