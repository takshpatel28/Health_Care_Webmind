import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../helper/supabaseClient";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

        // 🔹 Step 1: Authenticate User
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;
        if (!data || !data.user) throw new Error("Login failed. Please try again.");

        const userID = data.user.id; // ✅ Get logged-in user ID
        console.log("Logged-in User ID:", userID);

        // 🔹 Step 2: Fetch User Data from Doctors Table
        const { data: doctor, error: fetchError } = await supabase
            .from("doctors")
            .select("role")
            .eq("id", userID)
            .single();

        if (fetchError) throw fetchError;
        if (!doctor) throw new Error("User not found in the database.");

        console.log("User Role:", doctor.role);

        // 🔹 Step 3: Redirect Based on Role
        if (doctor.role === "HOD") {
            navigate("/dashboard"); // ✅ Redirect HOD to Dashboard
        } else if (doctor.role === "Doctor") {
            navigate("/profile"); // ✅ Redirect Doctor to Profile
        } else {
            setMessage("Access Denied: Unauthorized role.");
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-xl">
        <h1 className="text-2xl font-bold text-center text-gray-900">
          Sign in to your account
        </h1>
        <p className="text-center text-gray-500 mt-2">
          Or <a href="/signup" className="text-blue-600 hover:underline">create a new account</a>
        </p>
        {message && <p className="text-red-500 text-center mt-3">{message}</p>}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-gray-700">Email address</label>
            <input
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300 outline-none mt-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-gray-700">Password</label>
            <input
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300 outline-none mt-1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Enter your password"
            />
          </div>

          {!resetMode ? (
            <>
              <button
                className={`w-full py-2 text-white font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 transition-all ${loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                type="submit"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
              <p className="text-blue-500 text-center cursor-pointer mt-2 hover:underline">
                Forgot your password?
              </p>
            </>
          ) : (
            <>
              <button
                className={`w-full py-2 text-white font-semibold rounded-lg bg-green-500 hover:bg-green-700 transition-all ${loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                type="button"
                onClick={handleResetPassword}
                disabled={loading}
              >
                {loading ? "Sending email..." : "Reset Password"}
              </button>
              <p className="text-blue-500 text-center cursor-pointer mt-2 hover:underline">
                Back to Login
              </p>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;