import React from 'react'
import { useNavigate } from 'react-router-dom';
import { supabase } from '../helper/supabaseClient';

const Sidebar = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/login");
    };

    return (
        <div className="w-full md:w-1/4 bg-white shadow-md p-4">
            <div className="flex items-center mb-6">
                <div className="text-2xl font-bold text-blue-600">DM</div>
                <div className="ml-2 text-lg">DoctorMS</div>
            </div>
            <nav className="mt-4">
                <ul>
                    <li className="py-2 hover:bg-gray-200 cursor-pointer" onClick={() => navigate("/dashboard")}>Dashboard</li>
                    <li className="py-2 hover:bg-gray-200 cursor-pointer" onClick={() => navigate("/doctors")}>Doctors Department</li>
                    <li className="py-2 hover:bg-gray-200 cursor-pointer">Settings</li>
                    <li className="py-2 hover:bg-gray-200 cursor-pointer">Department Doctors</li>
                    <li onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition-all text-white text-center">
                        Logout
                    </li>
                </ul>
            </nav>
        </div>
    )
}

export default Sidebar