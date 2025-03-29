import React, { useState, useEffect } from 'react';
import { supabase } from '../helper/supabaseClient';
import { useNavigate } from 'react-router-dom';

const HOD = () => {
  const [hods, setHods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState(false);
  const [currentHod, setCurrentHod] = useState(null);
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    department: '',
    departmentCategory: '',
    experienceyears: ''
  });
  const navigate = useNavigate();

  // Fetch HODs data
  useEffect(() => {
    const fetchHods = async () => {
      try {
        const response = await fetch('https://health-care-webmind.onrender.com/api/trusty/getdoctors');
        if (!response.ok) throw new Error('Failed to fetch HODs');
        const data = await response.json();
        setHods(data.doctorsData);
      } catch (error) {
        console.error('Error fetching HODs:', error);
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
    if (window.confirm('Are you sure you want to delete this HOD?')) {
      try {
        const response = await fetch(`https://health-care-webmind.onrender.com/api/trusty/deletedoctor/${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          setHods(hods.filter(hod => hod._id !== id));
        } else {
          throw new Error('Failed to delete HOD');
        }
      } catch (error) {
        console.error('Error deleting HOD:', error);
        alert('Failed to delete HOD');
      }
    }
  };

  const handleEdit = (hod) => {
    setCurrentHod(hod);
    setFormData({
      fullname: hod.fullname,
      email: hod.email,
      department: hod.department,
      departmentCategory: hod.departmentCategory,
      experienceyears: hod.experienceyears
    });
    setEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://health-care-webmind.onrender.com/api/trusty/updatedoctor/${currentHod._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const updatedHod = await response.json();
        setHods(hods.map(hod => hod._id === currentHod._id ? updatedHod.doctor : hod));
        setEditModal(false);
      } else {
        throw new Error('Failed to update HOD');
      }
    } catch (error) {
      console.error('Error updating HOD:', error);
      alert('Failed to update HOD');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">HOD's Department Management</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {hods.map((hod) => (
                <tr key={hod._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{hod.fullname}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{hod.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{hod.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{hod.departmentCategory}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{hod.experienceyears} years</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(hod)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(hod._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Edit HOD Details</h2>
              <button
                onClick={() => setEditModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fullname">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullname"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="department">
                  Department
                </label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="departmentCategory">
                  Department Category
                </label>
                <input
                  type="text"
                  id="departmentCategory"
                  name="departmentCategory"
                  value={formData.departmentCategory}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="experienceyears">
                  Experience (Years)
                </label>
                <input
                  type="number"
                  id="experienceyears"
                  name="experienceyears"
                  value={formData.experienceyears}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setEditModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HOD;