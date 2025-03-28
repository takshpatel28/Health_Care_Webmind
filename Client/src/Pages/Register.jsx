import { useState } from "react";
import { UserPlus, Building2, Stethoscope, Users } from "lucide-react";
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
      // Convert experienceyears to a number or set to null if empty
      const experienceYears = formData.experienceyears
        ? parseInt(formData.experienceyears, 10)
        : null;

      // Supabase sign-up
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: { displayName: formData.fullname }, // Storing display name in user metadata
        },
      });

      if (error) {
        setError(error.message);
      } else {
        // Save additional user data in Supabase
        const { error: insertError } = await supabase
          .from("doctors") // Ensure you have a "doctors" table in your Supabase database
          .insert({
            id: data.user.id, // User ID from Supabase
            fullname: formData.fullname,
            phonenumber: formData.phonenumber || null, // Handle empty phone number
            role: formData.role,
            specialization: formData.specialization || null, // Handle empty specialization
            department: formData.department || null, // Handle empty department
            gender: formData.gender || null, // Handle empty gender
            bio: formData.bio || null, // Handle empty bio
            experienceyears: experienceYears, // Use the converted value
            departmentCategory: formData.departmentCategory || null, // Handle HOD department if applicable
          });

        if (insertError) {
          setError(insertError.message);
        } else {
          setSuccess(
            "Registration successful! Please check your email to verify your account."
          );
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        }
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Information */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Join MedAccess
              </h1>
              <p className="text-xl text-gray-600">
                Your gateway to streamlined healthcare management
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Stethoscope className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      For Doctors
                    </h3>
                    <p className="text-gray-600">
                      Access patient records and collaborate seamlessly
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Building2 className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      For Department Heads
                    </h3>
                    <p className="text-gray-600">
                      Manage operations and analyze department performance
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      For Trustees
                    </h3>
                    <p className="text-gray-600">
                      Oversee strategy and resource allocation
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-100">
            <div className="flex items-center gap-3 mb-8">
              <UserPlus className="w-8 h-8 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                Create Your Account
              </h2>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-100">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-100">
                <p className="text-green-600 text-sm">{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <input
                  type="text"
                  name="fullname"
                  placeholder="Full Name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  onChange={handleChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="phonenumber"
                  placeholder="Phone Number"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  onChange={handleChange}
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  onChange={handleChange}
                  required
                />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  onChange={handleChange}
                  required
                />
                <select
                  name="gender"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">
                  Select your role
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      role: "Doctor",
                      icon: <Stethoscope className="w-5 h-5 text-blue-600" />,
                    },
                    {
                      role: "HOD",
                      icon: <Building2 className="w-5 h-5 text-purple-600" />,
                    },
                    {
                      role: "Trustee",
                      icon: <Users className="w-5 h-5 text-green-600" />,
                    },
                  ].map(({ role, icon }) => (
                    <label
                      key={role}
                      className={`flex items-center justify-between gap-2 cursor-pointer rounded-lg px-4 py-3 text-center font-medium text-sm border-2 ${
                        formData.role === role
                          ? "bg-blue-600 text-white border-blue-600 shadow-lg"
                          : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
                      } transition-all duration-200`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={role}
                        onChange={handleChange}
                        className="hidden"
                      />
                      <span>{role}</span>
                      {icon}
                    </label>
                  ))}
                </div>
              </div>

              {formData.role === "Doctor" && (
                <>
                  {/* Department Dropdown */}
                  <select
                    name="department"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
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

                  {/* Specialization Dropdown */}
                  {formData.department && (
                    <select
                      name="specialization"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
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
                  )}

                  {/* Bio Textarea */}
                  <textarea
                    name="bio"
                    placeholder="Add your bio or achievements"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    onChange={handleChange}
                    required
                  />

                  {/* Experience Input */}
                  <input
                    type="number"
                    name="experienceyears"
                    placeholder="Years of Experience"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    onChange={handleChange}
                    required
                  />
                </>
              )}

              {formData.role === "HOD" && (
                <>
                  {/* Department Category Dropdown */}
                  <select
                    name="departmentCategory"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select HOD Department Category</option>
                    {Object.keys(departmentOptions).map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>

                  {/* Department Dropdown */}
                  {formData.departmentCategory && (
                    <select
                      name="department"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
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
                  )}
                  <input
                    type="number"
                    name="experienceyears"
                    placeholder="Years of Experience"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    onChange={handleChange}
                    required
                  />
                </>
              )}

              <button
                type="submit"
                className={`w-full py-3 rounded-lg font-semibold text-white ${
                  loading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
                } transition-all duration-200 shadow-lg hover:shadow-xl`}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>

              <p className="text-center text-gray-600">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Sign in
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
