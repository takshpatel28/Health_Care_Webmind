import React, { useState } from "react";
import { supabase } from "../helper/supabaseClient";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const navigate = useNavigate();

  // Handle user login
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
      if (!data) throw new Error("Login failed. Please try again.");

      navigate("/dash");
    } catch (error) {
      setMessage(error?.message || "An error occurred.");
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  // Handle password reset request
  const handleResetPassword = async () => {
    if (!email) {
      setMessage("Please enter your email to reset the password.");
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "http://localhost:5173/update-password", // Update with your frontend URL
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
    <div className="max-w-md mx-auto mt-10 p-6 border border-gray-300 rounded-md shadow-md">
      <h1 className="text-3xl font-serif font-semibold text-center">
        {resetMode ? "Reset Password" : "Login"}
      </h1>
      <br />
      {message && <p className="text-red-500">{message}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col">
        <input
          className="border border-gray-400 p-2 rounded-md"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Enter your email..."
        />
        {!resetMode && (
          <>
            <br />
            <input
              className="border border-gray-400 p-2 rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Enter your password..."
            />
          </> 
        )}
        <br />

        {!resetMode ? (
          <>
            <button
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              type="submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            <p
              className="text-blue-500 cursor-pointer mt-2"
              onClick={() => setResetMode(true)}
            >
              Forgot Password?
            </p>
          </>
        ) : (
          <>
            <button
              className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              type="button"
              onClick={handleResetPassword}
              disabled={loading}
            >
              {loading ? "Sending email..." : "Reset Password"}
            </button>
            <p
              className="text-blue-500 cursor-pointer mt-2"
              onClick={() => setResetMode(false)}
            >
              Back to Login
            </p>
          </>
        )}
      </form>

      <p>
        Don't have an account?{" "}
        <a href="/signup" className="text-blue-500 underline">
          Register
        </a>
      </p>
    </div>
  );
};

export default Login;