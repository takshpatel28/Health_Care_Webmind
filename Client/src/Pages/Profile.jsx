import React, { useState, useEffect } from 'react';
import { supabase } from '../helper/supabaseClient';
import { User, Edit3, Save, X, Upload, Phone, Briefcase, Calendar, Users, Award } from 'react-feather';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tempProfileImage, setTempProfileImage] = useState(null);
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
  const [tempFormData, setTempFormData] = useState({});

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
    setTempFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      // Store the file temporarily
      const objectUrl = URL.createObjectURL(file);
      setTempProfileImage(objectUrl);

    } catch (error) {
      console.error('Error uploading image:', error.message);
    }
  };

  const handleEditStart = () => {
    setTempFormData({...formData});
    setTempProfileImage(profileImage);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setTempProfileImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user logged in');

      let newProfileImage = tempProfileImage;

      // If a new image was selected (but not yet uploaded)
      if (tempProfileImage && tempProfileImage !== profileImage && tempProfileImage.startsWith('blob:')) {
        // Upload the new image
        const fileInput = document.querySelector('input[type="file"]');
        const file = fileInput?.files?.[0];
        
        if (file) {
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

          const { data: { publicUrl } } = supabase.storage
            .from('doctor-images')
            .getPublicUrl(filePath);

          newProfileImage = publicUrl;
        }
      }

      // Update the profile data
      const { error } = await supabase
        .from('doctors')
        .upsert({
          id: user.id,
          ...tempFormData,
          avatar_url: newProfileImage,
        });

      if (error) throw error;

      // Update the state with the new data
      setFormData({...tempFormData});
      setProfileImage(newProfileImage);
      setIsEditing(false);
      setTempProfileImage(null);

    } catch (error) {
      console.error('Error updating profile:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !isEditing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-32 w-32 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-6 w-64 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl shadow-md overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-lg">
          {/* Header with light blue background */}
          <div className="relative h-32 sm:h-40 md:h-48 bg-gradient-to-r from-blue-50 to-blue-100">
            <div className="absolute inset-0 bg-gradient-to-t from-white/50 to-transparent"></div>
            <button
              onClick={isEditing ? handleCancelEdit : handleEditStart}
              className={`absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-xl ${
                isEditing ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
              } text-white transition-all shadow-md font-medium text-sm sm:text-base`}
            >
              {isEditing ? (
                <>
                  <X size={16} className="sm:w-4 sm:h-4" />
                  <span>Cancel</span>
                </>
              ) : (
                <>
                  <Edit3 size={16} className="sm:w-4 sm:h-4" />
                  <span>Edit Profile</span>
                </>
              )}
            </button>
          </div>

          {/* Profile content */}
          <div className="px-4 sm:px-6 md:px-8 pb-8 md:pb-10">
            {/* Profile picture and basic info */}
            <div className="flex flex-col md:flex-row items-center md:items-start -mt-16 sm:-mt-20 md:-mt-24">
              <div className="relative group">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100">
                  <img
                    src={isEditing && tempProfileImage ? tempProfileImage : profileImage || 'https://www.transparentpng.com/download/user/gray-user-profile-icon-png-fP8Q1P.png'}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://www.transparentpng.com/download/user/gray-user-profile-icon-png-fP8Q1P.png';
                    }}
                  />
                </div>
                {isEditing && (
                  <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                    <div className="text-white text-center p-2">
                      <Upload size={20} className="mx-auto" />
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

              <div className="mt-4 md:mt-0 md:ml-6 lg:ml-8 text-center md:text-left w-full md:w-auto">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {formData.fullname || 'Doctor Name'}
                </h1>
                <div className="inline-flex items-center mt-2 px-3 py-1 bg-indigo-900 bg-opacity-40 rounded-full text-indigo-300 text-xs sm:text-sm font-medium">
                  <Briefcase size={14} className="mr-1 sm:mr-2" />
                  {formData.role || 'Medical Professional'}
                </div>
                <p className="mt-3 text-gray-700 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed">
                  {formData.bio || 'No bio added yet. Share something about yourself.'}
                </p>
              </div>
            </div>

            {/* Profile sections */}
            {!isEditing ? (
              <div className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Professional Information */}
                <div className="bg-gray-50 p-4 sm:p-6 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6 pb-2 sm:pb-3 border-b border-gray-200 flex items-center gap-2">
                    <Briefcase size={18} className="text-blue-500" />
                    <span>Professional Information</span>
                  </h2>
                  <div className="space-y-3 sm:space-y-4">
                    <ProfileInfoItem 
                      icon={<Award size={16} className="text-blue-500" />}
                      label="Specialization" 
                      value={formData.specialization || 'Not specified'} 
                    />
                    <ProfileInfoItem 
                      icon={<Users size={16} className="text-blue-500" />}
                      label="Department" 
                      value={formData.department || 'Not specified'} 
                    />
                    <ProfileInfoItem 
                      icon={<Calendar size={16} className="text-blue-500" />}
                      label="Experience" 
                      value={formData.experienceyears ? `${formData.experienceyears} years` : 'Not specified'} 
                    />
                  </div>
                </div>

                {/* Personal Information */}
                <div className="bg-gray-50 p-4 sm:p-6 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6 pb-2 sm:pb-3 border-b border-gray-200 flex items-center gap-2">
                    <User size={18} className="text-blue-500" />
                    <span>Personal Information</span>
                  </h2>
                  <div className="space-y-3 sm:space-y-4">
                    <ProfileInfoItem 
                      icon={<User size={16} className="text-blue-500" />}
                      label="Gender" 
                      value={formData.gender || 'Not specified'} 
                    />
                    <ProfileInfoItem 
                      icon={<Phone size={16} className="text-blue-500" />}
                      label="Phone" 
                      value={formData.phonenumber || 'Not specified'} 
                    />
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 md:mt-12 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <InputField
                    label="Full Name"
                    name="fullname"
                    value={tempFormData.fullname || ''}
                    onChange={handleInputChange}
                    icon={<User size={16} className="text-blue-500" />}
                    required
                  />
                  <InputField
                    label="Phone Number"
                    name="phonenumber"
                    value={tempFormData.phonenumber || ''}
                    onChange={handleInputChange}
                    icon={<Phone size={16} className="text-blue-500" />}
                    type="tel"
                  />
                  <InputField
                    label="Specialization"
                    name="specialization"
                    value={tempFormData.specialization || ''}
                    onChange={handleInputChange}
                    icon={<Award size={16} className="text-blue-500" />}
                    required
                  />
                  <InputField
                    label="Department"
                    name="department"
                    value={tempFormData.department || ''}
                    onChange={handleInputChange}
                    icon={<Users size={16} className="text-blue-500" />}
                    required
                  />
                  <SelectField
                    label="Gender"
                    name="gender"
                    value={tempFormData.gender || ''}
                    onChange={handleInputChange}
                    options={[
                      { value: '', label: 'Select Gender' },
                      { value: 'Male', label: 'Male' },
                      { value: 'Female', label: 'Female' },
                      { value: 'Other', label: 'Other' },
                      { value: 'Prefer not to say', label: 'Prefer not to say' },
                    ]}
                    icon={<User size={16} className="text-blue-500" />}
                  />
                  <InputField
                    label="Years of Experience"
                    name="experienceyears"
                    type="number"
                    value={tempFormData.experienceyears || ''}
                    onChange={handleInputChange}
                    icon={<Calendar size={16} className="text-blue-500" />}
                    min="0"
                    max="50"
                  />
                </div>

                <div>
                  <label className="block text-base sm:text-lg font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <User size={16} className="text-blue-500" />
                    <span>Bio</span>
                  </label>
                  <textarea
                    name="bio"
                    value={tempFormData.bio || ''}
                    onChange={handleInputChange}
                    rows="5"
                    className="block w-full rounded-xl bg-gray-50 border border-gray-300 text-gray-700 shadow-sm text-base sm:text-lg p-3 sm:p-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all placeholder-gray-400"
                    placeholder="Tell patients about your expertise and approach..."
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center gap-2 px-6 py-2.5 sm:px-8 sm:py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg text-base sm:text-lg font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      'Saving...'
                    ) : (
                      <>
                        <Save size={16} className="sm:w-4 sm:h-4" />
                        <span>Save Changes</span>
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
    <label className="block text-base sm:text-lg font-medium text-gray-700 mb-2 flex items-center gap-2">
      {icon}
      <span>{label}</span>
      {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {React.cloneElement(icon, { size: 16, className: "text-blue-500" })}
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`block w-full rounded-xl bg-gray-50 border border-gray-300 text-gray-700 shadow-sm text-base sm:text-lg p-3 sm:p-4 pl-10 sm:pl-12 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all ${
          disabled ? 'bg-gray-100 cursor-not-allowed' : ''
        }`}
        {...props}
      />
    </div>
  </div>
);

const SelectField = ({ label, name, value, onChange, options, icon, required = false }) => (
  <div className="relative">
    <label className="block text-base sm:text-lg font-medium text-gray-700 mb-2 flex items-center gap-2">
      {icon}
      <span>{label}</span>
      {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {React.cloneElement(icon, { size: 16, className: "text-blue-500" })}
      </div>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="block w-full rounded-xl bg-gray-50 border border-gray-300 text-gray-700 shadow-sm text-base sm:text-lg p-3 sm:p-4 pl-10 sm:pl-12 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all appearance-none"
      >
        {options.map(option => (
          <option key={option.value} value={option.value} className="bg-white">
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
  <div className="flex items-start gap-3 sm:gap-4 hover:bg-gray-100 p-2 sm:p-3 rounded-lg transition-colors">
    <div className="mt-1 p-1.5 sm:p-2 bg-blue-100 rounded-lg text-blue-500">
      {React.cloneElement(icon, { size: 16 })}
    </div>
    <div>
      <p className="text-xs sm:text-sm text-gray-500">{label}</p>
      <p className="text-base sm:text-lg font-medium text-gray-800">{value}</p>
    </div>
  </div>
);

export default Profile;