import React, { useState, useEffect } from 'react';
import { supabase } from '../helper/supabaseClient';
import { User, Edit3, Save, X, Upload, Mail, Phone, Briefcase, Calendar, Users, Award } from 'react-feather';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullname: '',
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
      setIsLoading(true);
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
              fullname: data.fullname || '',
              phonenumber: data.phonenumber || '',
              role: data.role || '',
              specialization: data.specialization || '',
              department: data.department || '',
              gender: data.gender || '',
              bio: data.bio || '',
              experienceyears: data.experienceyears || '',
              departmentCategory: data.departmentCategory || '',
            });
            setProfileImage(data.avatar_url);
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error.message);
      } finally {
        setIsLoading(false);
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
      if (!file) return;

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user logged in');

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `doctor-images/${fileName}`;

      // Delete old image if exists
      if (profileImage) {
        const oldFileName = profileImage.split('/doctor-images/')[1];
        if (oldFileName) {
          await supabase.storage.from('doctor-images').remove([oldFileName]);
        }
      }

      // Upload new image
      const { error: uploadError } = await supabase.storage
        .from('doctor-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('doctor-images')
        .getPublicUrl(filePath);

      // Update state and database immediately
      setProfileImage(publicUrl);
      
      const { error: updateError } = await supabase
        .from('doctors')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

    } catch (error) {
      console.error('Error uploading image:', error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase
          .from('doctors')
          .upsert({
            id: user.id,
            ...formData,
            avatar_url: profileImage,
          });

        if (error) throw error;
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !isEditing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-32 w-32 bg-gray-700 rounded-full mb-4"></div>
          <div className="h-6 w-64 bg-gray-700 rounded mb-2"></div>
          <div className="h-4 w-48 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-700 transition-all duration-300 hover:shadow-2xl">
          {/* Header with gradient background */}
          <div className="relative h-48 bg-gradient-to-r from-indigo-900 to-purple-800">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent"></div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`absolute top-6 right-6 flex items-center gap-2 px-6 py-3 rounded-xl ${
                isEditing ? 'bg-rose-600 hover:bg-rose-700' : 'bg-indigo-600 hover:bg-indigo-700'
              } text-white transition-all shadow-lg font-medium hover:shadow-indigo-500/30`}
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

          {/* Profile content */}
          <div className="px-8 pb-10">
            {/* Profile picture and basic info */}
            <div className="flex flex-col md:flex-row items-center md:items-start -mt-20">
              <div className="relative group">
                <div className="w-40 h-40 rounded-full border-4 border-gray-800 shadow-xl overflow-hidden bg-gray-700">
                  <img
                    src={profileImage || 'https://www.transparentpng.com/download/user/gray-user-profile-icon-png-fP8Q1P.png'}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://www.transparentpng.com/download/user/gray-user-profile-icon-png-fP8Q1P.png';
                    }}
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
                <div className="inline-flex items-center mt-2 px-4 py-1.5 bg-indigo-900 bg-opacity-40 rounded-full text-indigo-300 text-sm font-medium">
                  <Briefcase size={16} className="mr-2" />
                  {formData.role || 'Medical Professional'}
                </div>
                <p className="mt-4 text-gray-300 text-lg max-w-2xl leading-relaxed">
                  {formData.bio || 'No bio added yet. Share something about yourself.'}
                </p>
              </div>
            </div>

            {/* Profile sections */}
            {!isEditing ? (
              <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Professional Information */}
                <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600 hover:border-indigo-500 transition-colors">
                  <h2 className="text-xl font-semibold text-white mb-6 pb-3 border-b border-gray-600 flex items-center gap-2">
                    <Briefcase size={20} className="text-indigo-400" />
                    Professional Information
                  </h2>
                  <div className="space-y-5">
                    <ProfileInfoItem 
                      icon={<Award size={18} className="text-indigo-400" />}
                      label="Specialization" 
                      value={formData.specialization || 'Not specified'} 
                    />
                    <ProfileInfoItem 
                      icon={<Users size={18} className="text-indigo-400" />}
                      label="Department" 
                      value={formData.department || 'Not specified'} 
                    />
                    <ProfileInfoItem 
                      icon={<Calendar size={18} className="text-indigo-400" />}
                      label="Experience" 
                      value={formData.experienceyears ? `${formData.experienceyears} years` : 'Not specified'} 
                    />
                    <ProfileInfoItem 
                      icon={<Briefcase size={18} className="text-indigo-400" />}
                      label="Department Category" 
                      value={formData.departmentCategory || 'Not specified'} 
                    />
                  </div>
                </div>

                {/* Personal Information */}
                <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600 hover:border-indigo-500 transition-colors">
                  <h2 className="text-xl font-semibold text-white mb-6 pb-3 border-b border-gray-600 flex items-center gap-2">
                    <User size={20} className="text-indigo-400" />
                    Personal Information
                  </h2>
                  <div className="space-y-5">
                    <ProfileInfoItem 
                      icon={<User size={18} className="text-indigo-400" />}
                      label="Gender" 
                      value={formData.gender || 'Not specified'} 
                    />
                    <ProfileInfoItem 
                      icon={<Phone size={18} className="text-indigo-400" />}
                      label="Phone" 
                      value={formData.phonenumber || 'Not specified'} 
                    />
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-12 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Full Name"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleInputChange}
                    icon={<User size={18} className="text-indigo-400" />}
                    required
                  />
                  <InputField
                    label="Phone Number"
                    name="phonenumber"
                    value={formData.phonenumber}
                    onChange={handleInputChange}
                    icon={<Phone size={18} className="text-indigo-400" />}
                    type="tel"
                  />
                  <InputField
                    label="Specialization"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    icon={<Award size={18} className="text-indigo-400" />}
                    required
                  />
                  <InputField
                    label="Department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    icon={<Users size={18} className="text-indigo-400" />}
                    required
                  />
                  <InputField
                    label="Department Category"
                    name="departmentCategory"
                    value={formData.departmentCategory}
                    onChange={handleInputChange}
                    icon={<Briefcase size={18} className="text-indigo-400" />}
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
                      { value: 'Prefer not to say', label: 'Prefer not to say' },
                    ]}
                    icon={<User size={18} className="text-indigo-400" />}
                  />
                  <InputField
                    label="Years of Experience"
                    name="experienceyears"
                    type="number"
                    value={formData.experienceyears}
                    onChange={handleInputChange}
                    icon={<Calendar size={18} className="text-indigo-400" />}
                    min="0"
                    max="50"
                  />
                </div>

                <div>
                  <label className="block text-lg font-medium text-gray-300 mb-3 flex items-center gap-2">
                    <User size={18} className="text-indigo-400" />
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows="6"
                    className="block w-full rounded-xl bg-gray-700 border border-gray-600 text-white shadow-lg text-lg p-4 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition-all placeholder-gray-500"
                    placeholder="Tell patients about your expertise and approach..."
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-indigo-500/30 text-lg font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      'Saving...'
                    ) : (
                      <>
                        <Save size={18} />
                        Save Changes
                      </>
                    )}
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

const InputField = ({ label, name, value, onChange, disabled, type = 'text', icon, required = false, ...props }) => (
  <div className="relative">
    <label className="block text-lg font-medium text-gray-300 mb-2 flex items-center gap-2">
      {icon}
      {label}
      {required && <span className="text-rose-500">*</span>}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {React.cloneElement(icon, { size: 18, className: "text-indigo-400" })}
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`block w-full rounded-xl bg-gray-700 border border-gray-600 text-white shadow-lg text-lg p-4 pl-12 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition-all ${
          disabled ? 'bg-gray-800 cursor-not-allowed' : ''
        }`}
        {...props}
      />
    </div>
  </div>
);

const SelectField = ({ label, name, value, onChange, options, icon, required = false }) => (
  <div className="relative">
    <label className="block text-lg font-medium text-gray-300 mb-2 flex items-center gap-2">
      {icon}
      {label}
      {required && <span className="text-rose-500">*</span>}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {React.cloneElement(icon, { size: 18, className: "text-indigo-400" })}
      </div>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="block w-full rounded-xl bg-gray-700 border border-gray-600 text-white shadow-lg text-lg p-4 pl-12 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
      >
        {options.map(option => (
          <option key={option.value} value={option.value} className="bg-gray-800">
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  </div>
);

const ProfileInfoItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-4 hover:bg-gray-700/30 p-3 rounded-lg transition-colors">
    <div className="mt-1 p-2 bg-indigo-900/30 rounded-lg text-indigo-400">
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-lg font-medium text-white">{value}</p>
    </div>
  </div>
);

export default Profile;