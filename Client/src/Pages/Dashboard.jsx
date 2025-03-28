import React, { useEffect, useState } from "react";
import { supabase } from "../helper/supabaseClient";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [hodInfo, setHodInfo] = useState(null);
  const [loading, setLoading] = 
  useState(true);
  const navigate = useNavigate();

  // Fetch HOD details
  useEffect(() => {
    const fetchHodInfo = async () => {
      setLoading(true);

      // Get current user session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData?.session) {
        console.error("Session error:", sessionError);
        navigate("/login");
        return;
      }

      const userID = sessionData.session.user.id;

      // Fetch only HODs from the doctors table
      const { data: hodData, error: hodError } = await supabase
        .from("doctors")
        .select()
        .eq("role", "HOD");

      if (hodError) {
        console.error("Error fetching HODs:", hodError);
        return;
      }

      // Find the logged-in user in the fetched HODs
      const userHod = hodData.find((hod) => hod.id === userID);
      if (userHod) {
        setHodInfo(userHod);
      } else {
        navigate("/login"); // Redirect non-HOD users
      }

      setLoading(false);
    };

    fetchHodInfo();
  }, [navigate]);

  // Logout function
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (loading) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-1/4 bg-white shadow-md p-4">
        <div className="flex items-center mb-6">
          <div className="text-2xl font-bold text-blue-600">DM</div>
          <div className="ml-2 text-lg">DoctorMS</div>
        </div>
        <nav className="mt-4">
          <ul>
            <li className="py-2 hover:bg-gray-200 cursor-pointer">Dashboard</li>
            <li className="py-2 hover:bg-gray-200 cursor-pointer" onClick={() => navigate("/doctors")}>Doctors Department</li>
            <li className="py-2 hover:bg-gray-200 cursor-pointer">Settings</li>
            <li className="py-2 hover:bg-gray-200 cursor-pointer">Department Doctors</li>
            <li onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition-all text-white text-center">
              Logout
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">Welcome, {hodInfo?.fullname}</h1>
          <p className="text-gray-500">Head of {hodInfo?.department} Department</p>
        </header>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-4 shadow-md rounded">
            <h2 className="text-lg">{hodInfo?.department}</h2>
            <p className="text-gray-500">Department</p>
          </div>
          <div className="bg-white p-4 shadow-md rounded">
            <h2 className="text-lg">{hodInfo?.experienceyears} Years</h2>
            <p className="text-gray-500">Experience</p>
          </div>
          <div className="bg-white p-4 shadow-md rounded">
            <h2 className="text-lg">5 New</h2>
            <p className="text-gray-500">Notifications</p>
          </div>
        </div>

        {/* Recent Activity Section */}
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>

          <div className="bg-white p-4 shadow-md rounded mb-4">
            <div className="flex items-center">
              <div className="bg-blue-200 rounded-full p-2 mr-2">🔔</div>
              <div>
                <h3 className="font-bold">System Update</h3>
                <p className="text-gray-500">DoctorMS has been updated to version 2.1.0</p>
                <span className="text-gray-400">2 hours ago</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 shadow-md rounded mb-4">
            <div className="flex items-center">
              <div className="bg-yellow-200 rounded-full p-2 mr-2">📅</div>
              <div>
                <h3 className="font-bold">Schedule Update</h3>
                <p className="text-gray-500">Your schedule for next week has been updated</p>
                <span className="text-gray-400">1 day ago</span>
              </div>
            </div>
          </div>
        </section>

        {/* Department Overview Section */}
        <section className="bg-white p-4 shadow-md rounded">
          <h2 className="text-2xl font-semibold mb-4">Department Overview</h2>
          <p className="font-bold">DEPARTMENT STAFF</p>
          <p className="text-2xl">0 Doctors</p>
          <p className="font-bold">UPCOMING REVIEWS</p>
          <p className="text-2xl">3 Pending</p>
          <button className="mt-4 bg-blue-600 text-white py-2 px-4 rounded">
            View Department Doctors &gt;
          </button>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;