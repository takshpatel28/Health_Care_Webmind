import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../helper/supabaseClient";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    phonenumber: "",
    specialization: "",
    bio: "",
    experienceyears: "",
    role: "Doctor", // Default role
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const { email, password, ...profileData } = formData;

    try {
      // Sign up the user with Supabase Authentication
      const { data, error: authError } = await supabase.auth.signUp({ email, password });

      if (authError) throw authError;
      if (!data?.user) throw new Error("User registration failed. Please try again.");

      // Insert user profile data into the 'healthcare' table
      const { error: profileError } = await supabase.from("doctors").insert([
        { id: data.user.id, ...profileData },
      ]);

      if (profileError) throw profileError;

      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Register</h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {success && <p className="text-green-500 text-sm text-center">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Full Name", name: "fullname", type: "text" },
            { label: "Email", name: "email", type: "email" },
            { label: "Password", name: "password", type: "password" },
            { label: "Phone Number", name: "phonenumber", type: "tel" },
            { label: "Specialization", name: "specialization", type: "text" },
            { label: "Bio", name: "bio", type: "textarea" },
            { label: "Experience Years", name: "experienceyears", type: "number" },
          ].map(({ label, name, type }) => (
            <div key={name}>
              <label className="block text-gray-700">{label}</label>
              {type === "textarea" ? (
                <textarea
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                  required
                />
              ) : (
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                  required
                />
              )}
            </div>
          ))}

          {/* Role Selection */}
          <div>
            <label className="block text-gray-700">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
            >
              <option value="Doctor">Doctor</option>
              <option value="HOD">HOD</option>
              <option value="Trustee">Trustee</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
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