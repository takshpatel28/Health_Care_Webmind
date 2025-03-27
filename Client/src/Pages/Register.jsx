import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../helper/supabaseClient";
import { MyContext } from "../AllContext";

const Register = () => {
  const navigate = useNavigate();
  const { role, setrole } = useContext(MyContext);

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    phonenumber: "",
    role: "",
    gender: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "role") {
      setrole(value); // Ensures role is updated in context
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    console.log("Form Data Before Submission:", formData); // 🔍 Debugging: Check if role exists

    if (!formData.role) {
      setError("Please select a role before proceeding.");
      setLoading(false);
      return;
    }

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw new Error(authError.message);
      if (!data?.user) throw new Error("User registration failed. Please try again.");

      const userID = data.user.id; // Get User ID from Supabase Auth

      console.log("User ID:", userID); // Debugging
      console.log("Inserting Data:", { ...formData, id: userID });

      // Insert user data into 'doctors' table
      const { error: dbError } = await supabase.from("doctors").insert([
        {
          id: userID,
          fullname: formData.fullname,
          gender: formData.gender,
          phonenumber: formData.phonenumber,
          specialization: formData.specialization || null,
          bio: formData.bio || null,
          experienceyears: formData.experienceyears || null,
          role: formData.role, // 🔹 Check this value in console
        },
      ]);

      if (dbError) throw new Error(dbError.message);

      setSuccess("Registration successful! Redirecting...");
      navigate("/questioning");
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 p-4">
      <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-6">
          Create an Account
        </h2>
        {error && <p className="text-red-500 text-center text-sm mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center text-sm mb-4">{success}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Full Name", name: "fullname" },
            { label: "Email", name: "email" },
            { label: "Password", name: "password", type: "password" },
            { label: "Phone Number", name: "phonenumber" },
          ].map(({ label, name, type }) => (
            <div key={name}>
              <label className="block text-gray-700 font-medium">{label}</label>
              <input
                type={type || "text"}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
            </div>
          ))}

          <div className="flex gap-4">

            <div className="w-1/2">
              <label className="block text-gray-700 font-medium">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="w-1/2">
              <label className="block text-gray-700 font-medium">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              >
                <option value="">Select Role</option> {/* Ensure a default empty option */}
                <option value="doctor">Doctor</option>
                <option value="HOD">HOD</option>
                <option value="Trustee">Trustee</option>
              </select>

            </div>

          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition transform hover:scale-105 duration-300"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;