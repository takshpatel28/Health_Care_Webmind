import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Shield,
  UserCircle,
  ArrowRight,
  Key,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { supabase } from "../helper/supabaseClient";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    if (!email || !password) {
      setMessage({
        text: "Please enter both email and password.",
        type: "error",
      });
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (!data || !data.user)
        throw new Error("Login failed. Please try again.");

      const userID = data.user.id;

      const { data: doctor, error: fetchError } = await supabase
        .from("doctors")
        .select("role")
        .eq("id", userID)
        .single();

      if (fetchError) throw fetchError;
      if (!doctor) throw new Error("User not found in the database.");

      if (doctor.role === "HOD" || doctor.role === "Trustee") {
        navigate("/dashboard");
      } else if (doctor.role === "Doctor") {
        navigate("/profile");
      } else {
        setMessage({
          text: "Access Denied: Unauthorized role.",
          type: "error",
        });
      }
    } catch (error) {
      setMessage({
        text: error?.message || "An error occurred.",
        type: "error",
      });
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      const redirectTo = window.location.origin + "/profile-completion";

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      });
      console.log("Redirecting to:", redirectTo);
      if (error) throw error;

    } catch (error) {
      setMessage({
        text: error?.message || "Google sign-in failed",
        type: "error",
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setMessage({
        text: "Please enter your email to reset the password.",
        type: "error",
      });
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `https://health-care-webmind-1.onrender.com/update-password`, // Dynamically set the redirect URL
      });

      if (error) throw error;
      setMessage({
        text: "Password reset email sent! Check your inbox.",
        type: "success",
      });
    } catch (error) {
      setMessage({
        text: error?.message || "An error occurred.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Section - Information */}
          <div className="space-y-8 mt-15">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Welcome Back
              </h1>
              <p className="text-lg md:text-xl text-gray-600">
                Sign in to access your role-specific dashboard and manage
                healthcare responsibilities.
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <UserCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Secure Authentication
                    </h3>
                    <p className="text-gray-600">
                      Your data is protected with industry-standard encryption.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Lock className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Role-Based Access
                    </h3>
                    <p className="text-gray-600">
                      Access dashboards tailored to your role in the
                      organization.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      HIPAA Compliant
                    </h3>
                    <p className="text-gray-600">
                      Designed to meet healthcare compliance standards.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Login Form */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Key className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {resetMode ? "Reset Password" : "Sign In"}
              </h2>
            </div>

            {message.text && (
              <div
                className={`mb-6 p-4 rounded-lg border ${
                  message.type === "error"
                    ? "bg-red-50 border-red-200 text-red-600"
                    : "bg-green-50 border-green-200 text-green-600"
                }`}
              >
                <p>{message.text}</p>
              </div>
            )}

            <form
              onSubmit={
                resetMode
                  ? (e) => {
                      e.preventDefault();
                      handleResetPassword();
                    }
                  : handleSubmit
              }
              className="space-y-6"
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
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
                    className="block w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              {!resetMode && (
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
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
                      className="block w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                      )}
                    </button>
                  </div>
                  <div className="flex justify-end mt-2">
                    <button
                      type="button"
                      onClick={() => setResetMode(true)}
                      className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                    >
                      Forgot password?
                    </button>
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
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {resetMode ? "Processing..." : "Signing in..."}
                  </>
                ) : (
                  <>
                    {resetMode ? "Send Reset Link" : "Sign In"}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={googleLoading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {googleLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-gray-700"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <>
                    <FcGoogle className="h-5 w-5" />
                    Sign in with Google
                  </>
                )}
              </button>
            </form>

            {resetMode ? (
              <button
                type="button"
                onClick={() => setResetMode(false)}
                className="w-full mt-4 text-center text-sm text-blue-600 hover:text-blue-500 font-medium"
              >
                Back to Sign In
              </button>
            ) : (
              <p className="mt-6 text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <a
                  href="/signup"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Create one now
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;