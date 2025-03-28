import React, { useState, useEffect } from 'react';
import { supabase } from '../helper/supabaseClient';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    role: 'doctor',
    specialization: '',
    department: '',
    gender: '',
    bio: '',
    experienceYears: '',
    departmentCategory: '',
  });

  // Fetch user profile on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Fetch user profile data from Supabase
  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('doctors')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (data) {
          setFormData((prev) => ({
            ...prev,
            ...data,
            email: user.email,
          }));
          setProfileImage(data.avatar_url);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error.message);
    }
  };

  // Handle input changes for form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle profile image upload
  const handleImageUpload = async (e) => {
    try {
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setProfileImage(publicUrl);
    } catch (error) {
      console.error('Error uploading image:', error.message);
    }
  };

  // Handle form submission to update profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase
          .from('doctors')
          .upsert({
            id: user.id,
            ...formData,
            avatar_url: profileImage,
            updated_at: new Date(),
          });

        if (error) throw error;

        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {/* Cover Photo */}
        <div className="relative h-48 bg-blue-600">
          <button
            className="absolute top-4 right-4 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {/* Profile Section */}
        <div className="p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start">
            {/* Profile Image */}
            <div className="relative">
              <img
                src={profileImage || 'https://via.placeholder.com/150'}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-700 shadow-md"
              />
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </label>
              )}
            </div>

            {/* Profile Info */}
            <div className="mt-6 md:mt-0 md:ml-8">
              <h1 className="text-2xl font-bold">{formData.fullName || 'Doctor Name'}</h1>
              <p className="text-gray-400">@{formData.role}</p>
              <p className="mt-2">{formData.bio || 'Add a bio to describe yourself.'}</p>
            </div>
          </div>

          {/* Profile Form */}
          {isEditing && (
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Email"
                  name="email"
                  value={formData.email}
                  disabled
                />
                <InputField
                  label="Phone Number"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Specialization"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Department Category"
                  name="departmentCategory"
                  value={formData.departmentCategory}
                  onChange={handleInputChange}
                />
                <SelectField
                  label="Gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  options={[
                    { value: '', label: 'Select Gender' },
                    { value: 'male', label: 'Male' },
                    { value: 'female', label: 'Female' },
                    { value: 'other', label: 'Other' },
                  ]}
                />
                <InputField
                  label="Years of Experience"
                  name="experienceYears"
                  type="number"
                  value={formData.experienceYears}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows="4"
                  className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                ></textarea>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

// Reusable InputField Component
const InputField = ({ label, name, value, onChange, disabled, type = 'text' }) => (
  <div>
    <label className="block text-sm font-medium text-gray-400">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm ${
        disabled ? 'bg-gray-800' : 'focus:border-blue-500 focus:ring-blue-500'
      }`}
    />
  </div>
);

// Reusable SelectField Component
const SelectField = ({ label, name, value, onChange, options, disabled }) => (
  <div>
    <label className="block text-sm font-medium text-gray-400">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm ${
        disabled ? 'bg-gray-800' : 'focus:border-blue-500 focus:ring-blue-500'
      }`}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

export default Profile;