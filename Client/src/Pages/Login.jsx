import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../helper/supabaseClient";
import { Eye, EyeOff, Lock, Mail, Shield, UserCircle } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!email || !password) {
      setMessage("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (!data || !data.user) throw new Error("Login failed. Please try again.");

      const userID = data.user.id;
      console.log("Logged-in User ID:", userID);

      const { data: doctors, error: fetchError } = await supabase.from("doctors").select();

      if (fetchError) throw fetchError;
      if (!doctors) throw new Error("Failed to fetch users.");

      const loggedInHOD = doctors.find(user => user.id === userID && user.role === "HOD");

      if (loggedInHOD) {
        console.log("HOD Found:", loggedInHOD);
        navigate("/dashboard");
      } else {
        setMessage("Access Denied: Only HODs can access the dashboard.");
      }
    } catch (error) {
      setMessage(error?.message || "An error occurred.");
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setMessage("Please enter your email to reset the password.");
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "http://localhost:5173/update-password",
      });

      if (error) throw error;
      setMessage("Password reset email sent! Check your inbox.");
    } catch (error) {
      setMessage(error?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-7 bg-gray-50 flex flex-col lg:flex-row">
      {/* Left Section */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-12 xl:px-16">
        <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
        <p className="mt-3 text-gray-600 max-w-md">
          Sign in to access your role-specific dashboard and manage your healthcare responsibilities efficiently.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Whether you're a doctor, department head, or trustee, our platform provides the tools you need to excel in your role.
        </p>

        <div className="mt-8 space-y-6">
          {/* Feature List */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <UserCircle className="w-6 h-6 text-blue-500" />
              <div>
                <h3 className="font-semibold text-gray-900">Secure Authentication</h3>
                <p className="text-sm text-gray-500">Your data is protected with industry-standard encryption and security measures.</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Lock className="w-6 h-6 text-blue-500" />
              <div>
                <h3 className="font-semibold text-gray-900">Role-Based Access</h3>
                <p className="text-sm text-gray-500">Access dashboards and features tailored specifically to your role in the organization.</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-blue-500" />
              <div>
                <h3 className="font-semibold text-gray-900">HIPAA Compliant</h3>
                <p className="text-sm text-gray-500">Our platform is designed to meet healthcare compliance standards for data privacy.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Sign In Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Sign In</h2>
            {message && <p className="text-red-500 text-center mb-4">{message}</p>}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                <div className="flex justify-end mt-1">
                  <p
                    onClick={() => setResetMode(true)}
                    className="text-sm text-blue-600 hover:text-blue-500 cursor-pointer"
                  >
                    Forgot password?
                  </p>
                </div>
              </div>

              {!resetMode ? (
                <button
                  type="submit"
                  className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleResetPassword}
                  className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={loading}
                >
                  {loading ? "Sending email..." : "Reset Password"}
                </button>
              )}
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <a href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                Create one now
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;