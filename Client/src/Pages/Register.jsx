import { useState } from "react";
import { UserPlus, Building2, Stethoscope, Users, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../helper/supabaseClient";

const Register = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    phonenumber: "",
    role: "",
    specialization: "",
    department: "",
    gender: "",
    bio: "",
    experienceyears: "",
    departmentCategory: "",
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeAccordion, setActiveAccordion] = useState(null);

  // Department options remain the same
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
          "Pediatrics (Children’s Health)",
          "Geriatrics (Elderly Care)",
          "Psychiatry & Mental Health (Mental Disorders & Counseling)",
          "Urology (Urinary & Male Reproductive Health)",
          "Obstetrics & Gynecology (OB-GYN) (Women’s Health & Maternity Care)",
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
      "Pediatrician – Treats children’s illnesses and developmental issues.",
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const experienceYears = formData.experienceyears
        ? parseInt(formData.experienceyears, 10)
        : null;

      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: { displayName: formData.fullname },
        },
      });

      if (error) {
        setError(error.message);
      } else {
        const { error: insertError } = await supabase
          .from("doctors")
          .insert({
            id: data.user.id,
            fullname: formData.fullname,
            phonenumber: formData.phonenumber || null,
            role: formData.role,
            specialization: formData.specialization || null,
            department: formData.department || null,
            gender: formData.gender || null,
            bio: formData.bio || null,
            experienceyears: experienceYears,
            departmentCategory: formData.departmentCategory || null,
          });

        if (insertError) {
          setError(insertError.message);
        } else {
          setSuccess("Registration successful! Please check your email to verify your account.");
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        }
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Information */}
          <div className="space-y-8 mt-15">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Join Our Healthcare Network
              </h1>
              <p className="text-lg md:text-xl text-gray-600">
                Become part of a community revolutionizing patient care
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  icon: <Stethoscope className="w-6 h-6 text-blue-600" />,
                  title: "For Doctors",
                  description: "Access patient records and collaborate seamlessly",
                  bgColor: "bg-blue-100",
                },
                {
                  icon: <Building2 className="w-6 h-6 text-purple-600" />,
                  title: "For Department Heads",
                  description: "Manage operations and analyze department performance",
                  bgColor: "bg-purple-100",
                },
                {
                  icon: <Users className="w-6 h-6 text-green-600" />,
                  title: "For Trustees",
                  description: "Oversee strategy and resource allocation",
                  bgColor: "bg-green-100",
                },
              ].map((item, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer"
                  onClick={() => toggleAccordion(index)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 ${item.bgColor} rounded-lg`}>
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.title}
                      </h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                    <ChevronDown 
                      className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                        activeAccordion === index ? "transform rotate-180" : ""
                      }`}
                    />
                  </div>
                  
                  {activeAccordion === index && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <ul className="space-y-2 text-sm text-gray-600">
                        {index === 0 && (
                          <>
                            <li className="flex items-start">
                              <span className="text-blue-500 mr-2">•</span>
                              Real-time patient data access
                            </li>
                            <li className="flex items-start">
                              <span className="text-blue-500 mr-2">•</span>
                              Secure messaging with colleagues
                            </li>
                            <li className="flex items-start">
                              <span className="text-blue-500 mr-2">•</span>
                              Digital prescription tools
                            </li>
                          </>
                        )}
                        {index === 1 && (
                          <>
                            <li className="flex items-start">
                              <span className="text-purple-500 mr-2">•</span>
                              Department analytics dashboard
                            </li>
                            <li className="flex items-start">
                              <span className="text-purple-500 mr-2">•</span>
                              Staff management tools
                            </li>
                            <li className="flex items-start">
                              <span className="text-purple-500 mr-2">•</span>
                              Resource allocation tracking
                            </li>
                          </>
                        )}
                        {index === 2 && (
                          <>
                            <li className="flex items-start">
                              <span className="text-green-500 mr-2">•</span>
                              Hospital-wide performance metrics
                            </li>
                            <li className="flex items-start">
                              <span className="text-green-500 mr-2">•</span>
                              Financial overview reports
                            </li>
                            <li className="flex items-start">
                              <span className="text-green-500 mr-2">•</span>
                              Strategic planning tools
                            </li>
                          </>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 mt-15">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-blue-100 rounded-lg">
                <UserPlus className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Register Your Account
              </h2>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-green-600">{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullname"
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    <select
                      name="gender"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phonenumber"
                      placeholder="+1 234 567 890"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                      onChange={handleChange}
                      required
                    />
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
                className={`w-full py-3.5 rounded-lg font-semibold text-white ${
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
                  <>
                    <UserPlus className="w-5 h-5" />
                    Create Account
                  </>
                )}
              </button>

              <p className="text-center text-gray-600 text-sm">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Sign in here
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;