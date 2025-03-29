import React, { useEffect, useState } from "react";
import { supabase } from "../helper/supabaseClient";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar";

const Dashboard = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [doctorsCount, setDoctorsCount] = useState(0);
  const [hodsCount, setHodsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // Fetch doctors count
        const doctorsResponse = await fetch("https://health-care-webmind.onrender.com/api/hod");
        if (!doctorsResponse.ok) throw new Error("Failed to fetch doctors");
        const doctorsData = await doctorsResponse.json();
        
        // Make sure the data structure matches what you expect
        const doctors = doctorsData.doctorsData || doctorsData || [];
        setDoctorsCount(doctors.length);

        // Fetch HODs count (only for trustees)
        const { count, error } = await supabase
          .from("doctors")
          .select("*", { count: 'exact', head: true })
          .eq("role", "HOD");
        
        if (error) {
          console.error("Error fetching HODs:", error);
        } else {
          setHodsCount(count || 0);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCounts();
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoading(true);
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !sessionData?.session) {
          console.error("Session error:", sessionError);
          navigate("/login");
          return;
        }
        
        const userID = sessionData.session.user.id;
        const { data: userData, error: userError } = await supabase
          .from("doctors")
          .select("*")
          .eq("id", userID)
          .single();
        
        if (userError) {
          console.error("Error fetching user:", userError);
          return;
        }
        
        setUserInfo(userData);
      } catch (error) {
        console.error("Error in fetchUserInfo:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserInfo();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-lg font-medium text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">User data not available</h2>
          <p className="mt-2 text-gray-600">Please try logging in again</p>
          <button 
            onClick={() => navigate("/login")}
            className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Stats for HOD
  const hodStats = [
    {
      title: "Department",
      value: userInfo?.department || "N/A",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      title: "Experience",
      value: userInfo?.experienceyears ? `${userInfo.experienceyears} Years` : "N/A",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: "Category",
      value: userInfo?.departmentCategory || "N/A",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      )
    }
  ];

  // Stats for Trustee
  const trusteeStats = [
    {
      title: "Total Doctors",
      value: doctorsCount,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      title: "Total HODs",
      value: hodsCount,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: "Role",
      value: userInfo?.role || "N/A",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }
  ];

  const stats = userInfo?.role === "HOD" ? hodStats : trusteeStats;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8 lg:p-10 mt-15">
        {/* Header with welcome message */}
        <header className="mb-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 md:text-4xl lg:text-5xl">
                Welcome back, <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">{userInfo?.fullname}</span>
              </h1>
              {userInfo?.role === "HOD" ? (
                <p className="mt-2 text-lg text-gray-500">
                  Head of <span className="font-medium text-gray-700">{userInfo?.department}</span> Department
                </p>
              ) : (
                <p className="mt-2 text-lg text-gray-500">
                  System <span className="font-medium text-gray-700">Trustee</span>
                </p>
              )}
            </div>
            <div className="hidden items-center space-x-2 rounded-full bg-white px-4 py-2 shadow-sm md:flex">
              <div className="h-3 w-3 rounded-full bg-green-400"></div>
              <span className="text-sm font-medium text-gray-600">Active</span>
            </div>
          </div>
        </header>

        {/* Stats cards */}
        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {stats.map((item, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md"
            >
              <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-blue-50 opacity-0 transition-all duration-500 group-hover:opacity-100"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium uppercase tracking-wider text-gray-500">
                    {item.title}
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-gray-800">{item.value}</h2>
                </div>
                <div className="rounded-lg bg-blue-50 p-3">
                  {item.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent activity section - Only for HOD */}
        {userInfo?.role === "HOD" && (
          <section className="mb-12">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-800">
                Recent Activity
              </h2>
              <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {[
                {
                  icon: (
                    <div className="rounded-full bg-blue-100 p-2 text-blue-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                    </div>
                  ),
                  title: "System Update",
                  description: "DoctorMS has been updated to version 2.1.0",
                  time: "2 hours ago",
                  color: "blue"
                },
                {
                  icon: (
                    <div className="rounded-full bg-amber-100 p-2 text-amber-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  ),
                  title: "Schedule Update",
                  description: "Your schedule for next week has been updated",
                  time: "1 day ago",
                  color: "amber"
                },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md"
                >
                  <div className="mr-4 mt-1">
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800">
                      {activity.title}
                    </h3>
                    <p className="text-gray-600">{activity.description}</p>
                    <div className="mt-2 flex items-center text-sm text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {activity.time}
                    </div>
                  </div>
                  <div className={`ml-4 h-full w-1 rounded-full bg-${activity.color}-500`}></div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Department overview - Only for HOD */}
        {userInfo?.role === "HOD" && (
          <section className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 p-8 text-center text-white shadow-lg">
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-white bg-opacity-10"></div>
            <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-white bg-opacity-10"></div>
            <div className="relative z-10">
              <h2 className="mb-2 text-2xl font-semibold">
                Department Overview
              </h2>
              <p className="mb-6 text-blue-100">DEPARTMENT STAFF</p>
              <p className="my-4 text-6xl font-bold">{doctorsCount}</p>
              <p className="mb-8 text-xl font-medium text-blue-100">Doctors in your department</p>
              <Link to="/doctors">
                <button className="rounded-lg bg-white px-8 py-3 font-semibold text-blue-600 shadow-md transition-all duration-300 hover:bg-opacity-90 hover:shadow-lg">
                  View Department Doctors →
                </button>
              </Link>
            </div>
          </section>
        )}

        {/* Trustee-specific content */}
        {userInfo?.role === "Trustee" && (
          <section className="relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-purple-500 p-8 text-center text-white shadow-lg">
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-white bg-opacity-10"></div>
            <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-white bg-opacity-10"></div>
            <div className="relative z-10">
              <h2 className="mb-2 text-2xl font-semibold">
                System Overview
              </h2>
              <p className="mb-6 text-indigo-100">TOTAL STAFF</p>
              <div className="flex justify-center space-x-12 my-4">
                <div>
                  <p className="text-6xl font-bold">{doctorsCount}</p>
                  <p className="text-xl font-medium text-indigo-100">Doctors</p>
                </div>
                <div>
                  <p className="text-6xl font-bold">{hodsCount}</p>
                  <p className="text-xl font-medium text-indigo-100">HODs</p>
                </div>
              </div>
              <Link to="/doctors">
                <button className="rounded-lg bg-white px-8 py-3 font-semibold text-indigo-600 shadow-md transition-all duration-300 hover:bg-opacity-90 hover:shadow-lg">
                  View All Staff →
                </button>
              </Link>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Dashboard;