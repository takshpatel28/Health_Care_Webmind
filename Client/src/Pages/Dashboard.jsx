import React, { useEffect, useState } from "react";
import { supabase } from "../helper/supabaseClient";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar";

const Dashboard = () => {
  const [hodInfo, setHodInfo] = useState(null);
  const [doctors, setDoctors] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/hod");
        if (!response.ok) throw new Error("Failed to fetch doctors");
        const data = await response.json();
        setDoctors(data.length);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    const fetchHodInfo = async () => {
      setLoading(true);
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData?.session) {
        console.error("Session error:", sessionError);
        navigate("/login");
        return;
      }
      const userID = sessionData.session.user.id;
      const { data: hodData, error: hodError } = await supabase
        .from("doctors")
        .select()
        .eq("role", "HOD");
      if (hodError) {
        console.error("Error fetching HODs:", hodError);
        return;
      }
      const userHod = hodData.find((hod) => hod.id === userID);
      if (userHod) {
        setHodInfo(userHod);
      } else {
        navigate("/login");
      }
      setLoading(false);
    };
    fetchHodInfo();
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

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      
      <main className="flex-1 p-6 md:p-8 lg:p-10">
        {/* Header with welcome message */}
        <header className="mb-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 md:text-4xl lg:text-5xl">
                Welcome back, <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">{hodInfo?.fullname}</span>
              </h1>
              <p className="mt-2 text-lg text-gray-500">
                Head of <span className="font-medium text-gray-700">{hodInfo?.department}</span> Department
              </p>
            </div>
            <div className="hidden items-center space-x-2 rounded-full bg-white px-4 py-2 shadow-sm md:flex">
              <div className="h-3 w-3 rounded-full bg-green-400"></div>
              <span className="text-sm font-medium text-gray-600">Active</span>
            </div>
          </div>
        </header>

        {/* Stats cards */}
        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            { 
              title: "Department", 
              value: hodInfo?.department,
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              )
            },
            { 
              title: "Experience", 
              value: `${hodInfo?.experienceyears} Years`,
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )
            },
            { 
              title: "Category", 
              value: hodInfo?.departmentCategory,
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              )
            },
          ].map((item, index) => (
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

        {/* Recent activity section */}
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

        {/* Department overview */}
        <section className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 p-8 text-center text-white shadow-lg">
          <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-white bg-opacity-10"></div>
          <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-white bg-opacity-10"></div>
          <div className="relative z-10">
            <h2 className="mb-2 text-2xl font-semibold">
              Department Overview
            </h2>
            <p className="mb-6 text-blue-100">DEPARTMENT STAFF</p>
            <p className="my-4 text-6xl font-bold">{doctors}</p>
            <p className="mb-8 text-xl font-medium text-blue-100">Doctors in your department</p>
            <Link to="/doctors">
              <button className="rounded-lg bg-white px-8 py-3 font-semibold text-blue-600 shadow-md transition-all duration-300 hover:bg-opacity-90 hover:shadow-lg">
                View Department Doctors →
              </button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;