import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../helper/supabaseClient';
import { User, Edit3, Save, X, Upload, Phone, Briefcase, Calendar, Users, Award } from 'react-feather';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

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
  
  // For scroll animations
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="animate-pulse flex flex-col items-center">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ 
              repeat: Infinity,
              repeatType: "reverse",
              duration: 1.5,
              ease: "easeInOut"
            }}
            className="h-32 w-32 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full mb-4"
          ></motion.div>
          <div className="h-6 w-64 bg-gradient-to-r from-blue-200 to-indigo-200 rounded mb-2"></div>
          <div className="h-4 w-48 bg-gradient-to-r from-blue-200 to-indigo-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Floating bubbles background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: Math.random() * 100,
              y: Math.random() * 100,
              scale: Math.random() * 0.5 + 0.5,
              opacity: Math.random() * 0.3 + 0.1
            }}
            animate={{
              y: [0, Math.random() * 100 - 50],
              x: [0, Math.random() * 100 - 50],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
            className="absolute rounded-full bg-blue-200"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              filter: 'blur(20px)'
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto relative z-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden border border-white/20 transition-all duration-300 hover:shadow-2xl"
        >
          {/* Header with gradient background */}
          <div className="relative h-32 sm:h-40 md:h-48 bg-gradient-to-r from-blue-500 to-indigo-600">
            <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent"></div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={isEditing ? handleCancelEdit : handleEditStart}
              className={`absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-xl ${
                isEditing ? 'bg-red-500 hover:bg-red-600' : 'bg-white text-blue-600 hover:bg-blue-50'
              } transition-all shadow-lg font-medium text-sm sm:text-base`}
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
            </motion.button>
          </div>

          {/* Profile content */}
          <div className="px-4 sm:px-6 md:px-8 pb-8 md:pb-10">
            {/* Profile picture and basic info */}
            <div className="flex flex-col md:flex-row items-center md:items-start -mt-16 sm:-mt-20 md:-mt-24">
              <motion.div 
                whileHover={isEditing ? { scale: 1.05 } : {}}
                className="relative group"
              >
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gradient-to-r from-blue-100 to-indigo-100">
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
                  <motion.label 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                  >
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
                  </motion.label>
                )}
              </motion.div>

              <div className="mt-4 md:mt-0 md:ml-6 lg:ml-8 text-center md:text-left w-full md:w-auto relative h-40 sm:h-48 md:h-32">
                <motion.h1 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl sm:text-3xl font-bold text-gray-900 sm:text-gray-900 md:text-gray-100 absolute top-0 left-0 right-0 md:left-auto md:right-auto md:relative md:top-auto"
                >
                  {formData.fullname || 'Doctor Name'}
                </motion.h1>
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="inline-flex items-center px-3 py-1 bg-indigo-900 bg-opacity-10 rounded-full text-indigo-300 text-xs sm:text-sm font-medium absolute top-10 sm:top-12 md:top-5 left-0 right-0 md:left-auto md:right-auto md:relative"
                >
                  <Briefcase size={14} className="mr-1 sm:mr-2" />
                  {formData.role || 'Medical Professional'}
                </motion.div>
                <motion.p 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-gray-700 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed absolute top-20 sm:top-24 md:top-16 left-0 right-0 md:left-auto md:right-auto md:relative"
                >
                  {formData.bio || 'No bio added yet. Share something about yourself.'}
                </motion.p>
              </div>
            </div>

            {/* Profile sections */}
            <AnimatePresence mode="wait">
              {!isEditing ? (
                <motion.div 
                  key="view"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
                >
                  {/* Professional Information */}
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 hover:border-blue-300 transition-all shadow-sm hover:shadow-md"
                  >
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
                  </motion.div>

                  {/* Personal Information */}
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 hover:border-blue-300 transition-all shadow-sm hover:shadow-md"
                  >
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
                  </motion.div>
                </motion.div>
              ) : (
                <motion.form 
                  key="edit"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSubmit} 
                  className="mt-8 md:mt-12 space-y-6"
                >
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
                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      whileHover={{ scale: isLoading ? 1 : 1.05 }}
                      whileTap={{ scale: isLoading ? 1 : 0.95 }}
                      className="flex items-center gap-2 px-6 py-2.5 sm:px-8 sm:py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl text-base sm:text-lg font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <motion.span
                          animate={{ opacity: [0.6, 1, 0.6] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                          Saving...
                        </motion.span>
                      ) : (
                        <>
                          <Save size={16} className="sm:w-4 sm:h-4" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const InputField = ({ label, name, value, onChange, disabled, type = 'text', icon, required = false, ...props }) => (
  <motion.div 
    whileHover={{ y: -2 }}
    className="relative"
  >
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
  </motion.div>
);

const SelectField = ({ label, name, value, onChange, options, icon, required = false }) => (
  <motion.div 
    whileHover={{ y: -2 }}
    className="relative"
  >
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
  </motion.div>
);

const ProfileInfoItem = ({ icon, label, value }) => (
  <motion.div 
    whileHover={{ x: 5 }}
    className="flex items-start gap-3 sm:gap-4 hover:bg-gray-50 p-2 sm:p-3 rounded-lg transition-colors"
  >
    <motion.div 
      whileHover={{ rotate: 10 }}
      className="mt-1 p-1.5 sm:p-2 bg-blue-100 rounded-lg text-blue-500"
    >
      {React.cloneElement(icon, { size: 16 })}
    </motion.div>
    <div>
      <p className="text-xs sm:text-sm text-gray-500">{label}</p>
      <p className="text-base sm:text-lg font-medium text-gray-800">{value}</p>
    </div>
  </motion.div>
);

export default Profile;