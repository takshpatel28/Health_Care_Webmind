import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Phone, ChevronDown, Stethoscope, Building2, Users } from "lucide-react";
import { supabase } from "../helper/supabaseClient";

const ProfileCompletion = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    gender: "male",
    role: "Doctor",
    department: "",
    specialization: "",
    bio: "",
    experienceyears: "",
    departmentCategory: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const departmentOptions = {
    "Medical Departments (Clinical)": [
      "Cardiology (Heart & Vascular Care)",
      "Neurology (Brain & Nervous System)",
      "Neurosurgery (Surgical Neurology)",
      "Orthopedics (Bone & Joint Care)",
      "General Surgery (All Types of Surgery)",
      "Internal Medicine (General Physician Care)",
      "Pulmonology (Lung & Respiratory Care)",
      "Gastroenterology (Digestive System Care)",
      "Endocrinology (Diabetes & Hormonal Disorders)",
      "Nephrology (Kidney Care)",
      "Hematology (Blood Disorders)",
      "Oncology (Cancer Care)",
      "Radiology (Medical Imaging & Diagnostics)",
      "Dermatology (Skin, Hair & Nails)",
      "Ophthalmology (Eye Care)",
      "Otolaryngology (ENT) (Ear, Nose & Throat)",
      "Rheumatology (Joint & Autoimmune Diseases)",
      "Pediatrics (Children's Health)",
      "Geriatrics (Elderly Care)",
      "Psychiatry & Mental Health (Mental Disorders & Counseling)",
      "Urology (Urinary & Male Reproductive Health)",
      "Obstetrics & Gynecology (OB-GYN) (Women's Health & Maternity Care)",
      "Anesthesiology (Pain Management & Surgery Preparation)",
      "Emergency Medicine (Emergency & Trauma Care)",
    ],
    "Surgical Departments": [
      "General Surgery (Broad Surgical Treatments)",
      "Cardiac Surgery (Heart Surgery)",
      "Neurosurgery (Brain & Spine Surgery)",
      "Orthopedic Surgery (Bone & Joint Surgery)",
      "Plastic & Reconstructive Surgery",
      "ENT Surgery",
      "Pediatric Surgery",
      "Urology Surgery",
      "Ophthalmic Surgery (Eye Surgery)",
      "Gynecologic Surgery",
    ],
    "Diagnostic & Laboratory Departments": [
      "Radiology (MRI, CT Scan, X-rays)",
      "Pathology (Lab Tests & Disease Diagnosis)",
      "Microbiology (Infectious Disease Testing)",
      "Biochemistry (Blood & Chemical Analysis)",
      "Genetics (Genetic Testing & Counseling)",
    ],
    "Support & Allied Health Departments": [
      "Physiotherapy & Rehabilitation",
      "Occupational Therapy",
      "Speech Therapy",
      "Dietetics & Nutrition",
      "Pharmacy",
      "Blood Bank",
    ],
    "Administrative & Management Departments": [
      "Hospital Administration",
      "Human Resources (HR)",
      "Finance & Billing",
      "Medical Records & Health Information Management",
      "Quality & Compliance",
      "Infection Control",
      "Supply Chain & Procurement",
      "IT & Health Informatics",
    ],
    "Emergency & Specialized Units": [
      "Emergency Department (ER)",
      "Intensive Care Unit (ICU)",
      "Neonatal Intensive Care Unit (NICU)",
      "Burn Unit",
      "Dialysis Unit",
    ],
  };

  const doctorsfordepartment = {
    "General Medicine & Primary Care": [
      "General Physician – Treats common illnesses, chronic diseases, and provides primary healthcare.",
      "Family Medicine – Provides ongoing care for individuals and families across all ages.",
    ],
    "Surgical Departments": [
      "General Surgery – Performs surgeries on the digestive tract, skin, soft tissues, and more.",
      "Cardiothoracic Surgery – Specializes in heart and lung surgeries.",
      "Neurosurgery – Treats brain, spine, and nervous system disorders through surgery.",
      "Plastic Surgery – Focuses on reconstructive and cosmetic surgeries.",
      "Orthopedic Surgery – Specializes in bone, joint, and ligament surgeries.",
      "Urology – Deals with urinary tract and male reproductive system surgeries.",
      "Otolaryngology (ENT Surgery) – Treats ear, nose, and throat disorders.",
      "Ophthalmology (Eye Surgery) – Specializes in eye surgeries.",
    ],
    "Cardiology & Vascular Medicine": [
      "Cardiologist – Diagnoses and treats heart diseases.",
      "Interventional Cardiology – Performs minimally invasive heart procedures.",
      "Vascular Surgeon – Specializes in blood vessels and circulatory system surgeries.",
    ],
    "Neurology & Neurosciences": [
      "Neurologist – Diagnoses and treats brain and nervous system disorders.",
      "Pediatric Neurologist – Specializes in neurological issues in children.",
    ],
    "Gastroenterology & Hepatology": [
      "Gastroenterologist – Treats digestive system disorders.",
      "Hepatologist – Specializes in liver, pancreas, and gallbladder diseases.",
    ],
    "Pulmonology & Respiratory Medicine": [
      "Pulmonologist – Treats lung diseases and respiratory disorders.",
    ],
    "Endocrinology & Diabetes": [
      "Endocrinologist – Specializes in hormone-related diseases, including diabetes and thyroid disorders.",
    ],
    "Nephrology & Kidney Care": [
      "Nephrologist – Treats kidney diseases and dialysis patients.",
    ],
    "Hematology & Oncology": [
      "Hematologist – Specializes in blood disorders.",
      "Oncologist – Diagnoses and treats cancer.",
    ],
    "Rheumatology & Autoimmune Disorders": [
      "Rheumatologist – Treats arthritis and autoimmune diseases.",
    ],
    "Dermatology & Venereology": [
      "Dermatologist – Treats skin, hair, and nail disorders.",
      "Venereologist – Specializes in sexually transmitted infections (STIs).",
    ],
    "Obstetrics & Gynecology": [
      "Gynecologist – Treats female reproductive health issues.",
      "Obstetrician – Specializes in pregnancy, childbirth, and postpartum care.",
    ],
    "Pediatrics & Neonatology": [
      "Pediatrician – Treats children's illnesses and developmental issues.",
      "Neonatologist – Specializes in newborn and premature infant care.",
    ],
    "Geriatrics & Elderly Care": [
      "Geriatrician – Specializes in healthcare for the elderly.",
    ],
    "Psychiatry & Mental Health": [
      "Psychiatrist – Diagnoses and treats mental health disorders.",
      "Clinical Psychologist – Provides therapy and mental health counseling.",
    ],
    "Pain Management & Anesthesiology": [
      "Anesthesiologist – Manages anesthesia during surgeries.",
      "Pain Management Specialist – Treats chronic pain conditions.",
    ],
    "Emergency & Critical Care": [
      "Emergency Medicine Specialist – Provides urgent medical care.",
      "Intensivist (Critical Care Specialist) – Treats patients in ICU.",
    ],
    "Physical Medicine & Rehabilitation": [
      "Physiatrist – Specializes in rehabilitation after injuries or surgeries.",
    ],
    "Sports Medicine & Orthopedics": [
      "Sports Medicine Specialist – Treats sports-related injuries and performance issues.",
    ],
    "Ophthalmology (Eye Care)": [
      "Ophthalmologist – Treats eye diseases and performs surgeries.",
      "Optometrist – Conducts eye exams and prescribes glasses/lenses.",
    ],
    "Otolaryngology (ENT – Ear, Nose, Throat)": [
      "ENT Specialist – Treats disorders of the ear, nose, and throat.",
    ],
    "Dentistry & Oral Health": [
      "Dentist – Provides general oral healthcare.",
      "Orthodontist – Specializes in teeth alignment and braces.",
      "Periodontist – Treats gum diseases.",
      "Oral & Maxillofacial Surgeon – Performs surgeries on the mouth, jaw, and face.",
    ],
    "Immunology & Allergy": [
      "Immunologist – Diagnoses and treats immune system disorders.",
      "Allergist – Specializes in allergies and hypersensitivities.",
    ],
  };

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }
      setUser(user);
    };

    fetchUser();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      // Prepare the data to be inserted
      const profileData = {
        id: user.id,
        fullname: formData.fullName,
        phonenumber: formData.phoneNumber,
        gender: formData.gender,
        role: formData.role,
        created_at: new Date().toISOString(),
      };

      // Add role-specific fields
      if (formData.role === "Doctor") {
        profileData.department = formData.department;
        profileData.specialization = formData.specialization;
        profileData.bio = formData.bio;
        profileData.experienceyears = formData.experienceyears;
      } else if (formData.role === "HOD") {
        profileData.departmentCategory = formData.departmentCategory;
        profileData.department = formData.department;
        profileData.experienceyears = formData.experienceyears;
      }

      // Insert data into doctors table
      const { data, error } = await supabase
        .from("doctors")
        .insert([profileData]);

      if (error) throw error;

      setMessage({ text: "Profile completed successfully!", type: "success" });
      
      // Redirect based on role after a short delay
      setTimeout(() => {
        if (formData.role === "HOD" || formData.role === "Trustee") {
          navigate("/dashboard");
        } else {
          navigate("/profile");
        }
      }, 1500);

    } catch (error) {
      console.error("Error saving profile:", error);
      setMessage({ text: error.message || "Failed to save profile", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-md">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Complete Your Profile</h2>
          </div>

          {message.text && (
            <div className={`mb-6 p-4 rounded-lg border ${
              message.type === "error"
                ? "bg-red-50 border-red-200 text-red-600"
                : "bg-green-50 border-green-200 text-green-600"
            }`}>
              <p>{message.text}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  placeholder="+1 234 567 890"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <div className="relative">
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="block w-full pl-3 pr-10 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all appearance-none"
                  required
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Your Role
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    role: "Doctor",
                    icon: <Stethoscope className="w-5 h-5" />,
                    color: "blue",
                  },
                  {
                    role: "HOD",
                    icon: <Building2 className="w-5 h-5" />,
                    color: "purple",
                  },
                  {
                    role: "Trustee",
                    icon: <Users className="w-5 h-5" />,
                    color: "green",
                  },
                ].map(({ role, icon, color }) => (
                  <label
                    key={role}
                    className={`flex flex-col items-center justify-center gap-2 cursor-pointer rounded-lg px-4 py-3 text-center font-medium text-sm border-2 ${
                      formData.role === role
                        ? `bg-${color}-600 text-white border-${color}-600 shadow-lg`
                        : `bg-white text-gray-600 border-gray-200 hover:bg-gray-50`
                    } transition-all duration-200`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={role}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <div className={`p-2 rounded-full bg-${color}-100`}>
                      {icon}
                    </div>
                    <span>{role}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Dynamic Fields Based on Role */}
            {formData.role === "Doctor" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Department</option>
                    {Object.keys(doctorsfordepartment).map((department) => (
                      <option key={department} value={department}>
                        {department}
                      </option>
                    ))}
                  </select>
                </div>

                {formData.department && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Specialization
                    </label>
                    <select
                      name="specialization"
                      value={formData.specialization}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Specialization</option>
                      {doctorsfordepartment[formData.department]?.map(
                        (specialization) => (
                          <option key={specialization} value={specialization}>
                            {specialization}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    placeholder="Tell us about your professional background..."
                    rows="3"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    name="experienceyears"
                    value={formData.experienceyears}
                    placeholder="5"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            )}

            {formData.role === "HOD" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department Category
                  </label>
                  <select
                    name="departmentCategory"
                    value={formData.departmentCategory}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Category</option>
                    {Object.keys(departmentOptions).map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {formData.departmentCategory && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Department</option>
                      {departmentOptions[formData.departmentCategory]?.map(
                        (department) => (
                          <option key={department} value={department}>
                            {department}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    name="experienceyears"
                    value={formData.experienceyears}
                    placeholder="5"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className={`w-full py-3 rounded-lg font-semibold text-white ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              } transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Complete Profile"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletion;