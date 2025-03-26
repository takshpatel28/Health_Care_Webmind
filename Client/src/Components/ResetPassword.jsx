import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../helper/supabaseClient';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handlePasswordReset = async () => {
    if (!newPassword || !confirmPassword) {
      setMessage('Please fill out both fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });

      if (error) throw error;

      setMessage('Password updated successfully! Redirecting...');
      
      setTimeout(() => navigate('/login'), 2000); // Redirect after 2 seconds
    } catch (error) {
      setMessage(error?.message || 'An error occurred.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Reset Password</h1>
        {message && <span className="text-red-500 block text-center mb-4">{message}</span>}
        <div className="space-y-4">
          <input
            className="w-full border border-gray-300 p-3 rounded-lg"
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            className="w-full border border-gray-300 p-3 rounded-lg"
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            className="w-full bg-blue-500 text-white py-3 rounded-lg"
            onClick={handlePasswordReset}
          >
            Reset Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;