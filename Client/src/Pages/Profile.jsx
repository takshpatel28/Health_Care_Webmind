import React, { useState, useEffect } from 'react';
import { supabase } from '../helper/supabaseClient';
import { User, Edit3, Save, X, Upload, Mail, Phone, Briefcase, Calendar, Users } from 'react-feather';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phonenumber: '',
    role: '',
    specialization: '',
    department: '',
    gender: '',
    bio: '',
    experienceyears: '',
    departmentCategory: '',
  });

  useEffect(() => {
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
            setFormData({
              fullname: data.fullname,
              email: user.email,
              phonenumber: data.phonenumber,
              role: data.role,
              specialization: data.specialization,
              department: data.department,
              gender: data.gender,
              bio: data.bio,
              experienceyears: data.experienceyears,
              departmentCategory: data.departmentCategory,
            });
            setProfileImage(data.avatar_url);
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error.message);
      }
    };
    fetchUserProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
          <div className="relative h-56 bg-gradient-to-r from-blue-700 to-indigo-800">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`absolute top-6 right-6 flex items-center gap-2 px-6 py-3 rounded-xl ${
                isEditing ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
              } text-white transition-all shadow-lg font-medium`}
            >
              {isEditing ? (
                <>
                  <X size={18} />
                  Cancel
                </>
              ) : (
                <>
                  <Edit3 size={18} />
                  Edit Profile
                </>
              )}
            </button>
          </div>

          <div className="px-8 pb-10">
            <div className="flex flex-col md:flex-row items-center md:items-start -mt-20">
              <div className="relative group">
                <div className="w-40 h-40 rounded-full border-4 border-gray-800 shadow-xl overflow-hidden">
                  <img
                    src={profileImage || 'https://www.transparentpng.com/download/user/gray-user-profile-icon-png-fP8Q1P.png'}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                {isEditing && (
                  <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                    <div className="text-white text-center p-2">
                      <Upload size={24} className="mx-auto" />
                      <span className="text-xs mt-1 block">Change Photo</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div className="mt-6 md:mt-0 md:ml-8 text-center md:text-left">
                <h1 className="text-3xl font-bold text-white">
                  {formData.fullname || 'Doctor Name'}
                </h1>
                <div className="inline-flex items-center mt-2 px-4 py-1.5 bg-blue-900 bg-opacity-40 rounded-full text-blue-300 text-sm font-medium">
                  <Briefcase size={16} className="mr-2" />
                  @{formData.role}
                </div>
                <p className="mt-4 text-gray-300 text-lg max-w-2xl leading-relaxed">
                  {formData.bio || 'Add a bio to describe yourself.'}
                </p>
              </div>
            </div>

            {!isEditing ? (
              <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-700 bg-opacity-50 p-6 rounded-xl border border-gray-600">
                  <h2 className="text-xl font-semibold text-white mb-6 pb-3 border-b border-gray-600 flex items-center gap-2">
                    <Briefcase size={20} className="text-blue-400" />
                    Professional Information
                  </h2>
                  <div className="space-y-5">
                    <ProfileInfoItem 
                      icon={<Briefcase size={18} className="text-blue-400" />}
                      label="Specialization" 
                      value={formData.specialization} 
                    />
                    <ProfileInfoItem 
                      icon={<Users size={18} className="text-blue-400" />}
                      label="Department" 
                      value={formData.department} 
                    />
                    <ProfileInfoItem 
                      icon={<Calendar size={18} className="text-blue-400" />}
                      label="Experience" 
                      value={`${formData.experienceyears || '0'} years`} 
                    />
                  </div>
                </div>

                <div className="bg-gray-700 bg-opacity-50 p-6 rounded-xl border border-gray-600">
                  <h2 className="text-xl font-semibold text-white mb-6 pb-3 border-b border-gray-600 flex items-center gap-2">
                    <User size={20} className="text-blue-400" />
                    Personal Information
                  </h2>
                  <div className="space-y-5">
                    <ProfileInfoItem 
                      icon={<User size={18} className="text-blue-400" />}
                      label="Gender" 
                      value={formData.gender} 
                    />
                    <ProfileInfoItem 
                      icon={<Mail size={18} className="text-blue-400" />}
                      label="Email" 
                      value={formData.email} 
                    />
                    <ProfileInfoItem 
                      icon={<Phone size={18} className="text-blue-400" />}
                      label="Phone" 
                      value={formData.phonenumber} 
                    />
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-12 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <InputField
                    label="Full Name"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleInputChange}
                    icon={<User size={18} className="text-blue-400" />}
                  />
                  <InputField
                    label="Email"
                    name="email"
                    value={formData.email}
                    disabled
                    icon={<Mail size={18} className="text-blue-400" />}
                  />
                  <InputField
                    label="Phone Number"
                    name="phonenumber"
                    value={formData.phonenumber}
                    onChange={handleInputChange}
                    icon={<Phone size={18} className="text-blue-400" />}
                  />
                  <InputField
                    label="Specialization"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    icon={<Briefcase size={18} className="text-blue-400" />}
                  />
                  <InputField
                    label="Department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    icon={<Users size={18} className="text-blue-400" />}
                  />
                  <InputField
                    label="Department Category"
                    name="departmentCategory"
                    value={formData.departmentCategory}
                    onChange={handleInputChange}
                    icon={<Briefcase size={18} className="text-blue-400" />}
                  />
                  <SelectField
                    label="Gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    options={[
                      { value: '', label: 'Select Gender' },
                      { value: 'Male', label: 'Male' },
                      { value: 'Female', label: 'Female' },
                      { value: 'Other', label: 'Other' },
                    ]}
                    icon={<User size={18} className="text-blue-400" />}
                  />
                  <InputField
                    label="Years of Experience"
                    name="experienceyears"
                    type="number"
                    value={formData.experienceyears}
                    onChange={handleInputChange}
                    icon={<Calendar size={18} className="text-blue-400" />}
                  />
                </div>

                <div>
                  <label className="block text-lg font-medium text-gray-300 mb-3 flex items-center gap-2">
                    <User size={18} className="text-blue-400" />
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows="6"
                    className="block w-full rounded-xl bg-gray-700 border border-gray-600 text-white shadow-lg text-lg p-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg text-lg font-medium"
                  >
                    <Save size={18} />
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ label, name, value, onChange, disabled, type = 'text', icon }) => (
  <div>
    <label className="block text-lg font-medium text-gray-300 mb-2 flex items-center gap-2">
      {icon}
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`block w-full rounded-xl bg-gray-700 border border-gray-600 text-white shadow-lg text-lg p-4 pl-12 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all ${
        disabled ? 'bg-gray-800 cursor-not-allowed' : ''
      }`}
    />
  </div>
);

const SelectField = ({ label, name, value, onChange, options, icon }) => (
  <div>
    <label className="block text-lg font-medium text-gray-300 mb-2 flex items-center gap-2">
      {icon}
      {label}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="block w-full rounded-xl bg-gray-700 border border-gray-600 text-white shadow-lg text-lg p-4 pl-12 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
    >
      {options.map(option => (
        <option key={option.value} value={option.value} className="bg-gray-800">
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const ProfileInfoItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-4">
    <div className="mt-1 p-2 bg-blue-900 bg-opacity-30 rounded-lg text-blue-400">
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-lg font-medium text-white">{value || 'Not specified'}</p>
    </div>
  </div>
);

export default Profile;