import React, { useEffect, useState } from "react";
import { supabase } from "../helper/supabaseClient";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import { Bar, Pie, Doughnut, Line } from "react-chartjs-2";
import Chart from 'chart.js/auto';
import { CategoryScale } from 'chart.js';

// Register the category scale
Chart.register(CategoryScale);

const Dashboard = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [allDoctors, setAllDoctors] = useState([]);
  const [departmentDoctors, setDepartmentDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [doctorCount, setDoctorCount] = useState(null);
  const [hodCount, setHodCount] = useState(null);
  const navigate = useNavigate();

  // Beautiful color palette
  const colors = {
    blue: '#3B82F6',
    indigo: '#6366F1',
    purple: '#8B5CF6',
    pink: '#EC4899',
    red: '#EF4444',
    orange: '#F97316',
    yellow: '#F59E0B',
    green: '#10B981',
    teal: '#14B8A6',
    cyan: '#06B6D4'
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !sessionData?.session) {
          throw new Error("Session error");
        }

        // Fetch all doctors
        const { data: doctorsData, error: doctorsError } = await supabase
          .from("doctors")
          .select("*");

        if (doctorsError) throw doctorsError;

        // Set user info
        const userID = sessionData.session.user.id;
        const currentUser = doctorsData.find(doctor => doctor.id === userID);
        if (!currentUser) throw new Error("User not found");

        setUserInfo(currentUser);
        setHodCount(doctorsData.filter(d => d.role === "HOD").length);

        // Set department doctors if HOD
        if (currentUser.role === "HOD" && currentUser.department) {
          const deptDoctors = doctorsData.filter(
            doctor => doctor.department === currentUser.department
          );
          setDepartmentDoctors(deptDoctors);
        }

      } catch (error) {
        console.error("Error fetching data:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Chart data functions
  const getDepartmentData = () => {
    const departments = {};
    allDoctors.forEach(doctor => {
      if (doctor.department) {
        departments[doctor.department] = (departments[doctor.department] || 0) + 1;
      }
    });

    const colorKeys = Object.keys(colors);
    return {
      labels: Object.keys(departments),
      datasets: [{
        label: 'Doctors by Department',
        data: Object.values(departments),
        backgroundColor: Object.keys(departments).map((_, i) => colors[colorKeys[i % colorKeys.length]]),
        borderColor: '#ffffff',
        borderWidth: 2,
        borderRadius: 8
      }]
    };
  };

  const getRoleData = () => {
    const roles = {
      'HOD': hodCount,
      'Doctor': allDoctors.filter(d => d.role === 'Doctor').length,
    };

    return {
      labels: Object.keys(roles),
      datasets: [{
        data: Object.values(roles),
        backgroundColor: [colors.red, colors.blue, colors.yellow],
        borderColor: '#ffffff',
        borderWidth: 2
      }]
    };
  };

  const getDepartmentActivityData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return {
      labels: months,
      datasets: [
        {
          label: 'Consultations',
          data: months.map(() => Math.floor(Math.random() * 20) + 10),
          backgroundColor: colors.blue + '40',
          borderColor: colors.blue,
          borderWidth: 2,
          tension: 0.4,
          fill: true
        },
        {
          label: 'Appointments',
          data: months.map(() => Math.floor(Math.random() * 30) + 15),
          backgroundColor: colors.green + '40',
          borderColor: colors.green,
          borderWidth: 2,
          tension: 0.4,
          fill: true
        }
      ]
    };
  };

  const getDoctorPerformanceData = () => {
    return {
      labels: departmentDoctors.map(d => d.fullname),
      datasets: [{
        label: 'Performance Score',
        data: departmentDoctors.map(() => Math.floor(Math.random() * 40) + 60),
        backgroundColor: departmentDoctors.map((_, i) => {
          const colorKeys = Object.keys(colors);
          return colors[colorKeys[i % colorKeys.length]];
        }),
        borderColor: '#ffffff',
        borderWidth: 2,
        borderRadius: 4
      }]
    };
  };

  useEffect(() => {
    const fetchHods = async () => {
      try {
        const response = await fetch('https://health-care-webmind.onrender.com/api/trusty/gethods');

        const data = await response.json();
        setHodCount(data.hodsData.length);

      } catch (error) {
        console.error('Error fetching HODs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHods();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await fetch("https://health-care-webmind.onrender.com/api/trusty/getdoctors");
      if (!response.ok) throw new Error("Failed to fetch doctors");

      const data = await response.json();
      setDoctorCount(data.doctorsData.length);
      setAllDoctors(data.doctorsData);
      // console.log();

    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-lg font-medium text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">User data not available</h2>
          <p className="mt-2 text-gray-600">Please try logging in again</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 rounded-lg bg-blue-600 px-6 py-2 text-white transition-all hover:bg-blue-700 hover:shadow-md"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Stats cards configuration
  const stats = userInfo?.role === "HOD" ? [
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
      title: "Department Doctors",
      value: departmentDoctors.length,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
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
  ] : [
    {
      title: "Total Doctors",
      value: doctorCount,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      title: "Total HODs",
      value: hodCount,
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

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 lg:p-10">
        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 md:text-4xl lg:text-5xl">
                Welcome back, <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">{userInfo?.fullname}</span>
              </h1>
              <p className="mt-2 text-lg text-gray-500">
                {userInfo?.role === "HOD" ? (
                  <>Head of <span className="font-medium text-gray-700">{userInfo?.department}</span> Department</>
                ) : (
                  <>System <span className="font-medium text-gray-700">Trustee</span></>
                )}
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
          {stats.map((item, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1"
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

        {/* Charts Section */}
        <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {userInfo?.role === "Trustee" ? (
            <>
              <div className="rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
                <h3 className="mb-4 text-lg font-semibold text-gray-800">Doctors by Department</h3>
                <div className="h-80">
                  <Bar
                    data={getDepartmentData()}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top',
                          labels: {
                            font: {
                              size: 12,
                              weight: 'bold'
                            }
                          }
                        },
                        tooltip: {
                          backgroundColor: 'rgba(0, 0, 0, 0.9)',
                          titleFont: { size: 14, weight: 'bold' },
                          bodyFont: { size: 12 },
                          padding: 12,
                          cornerRadius: 8,
                          displayColors: true,
                          callbacks: {
                            label: (context) => `${context.dataset.label}: ${context.raw}`
                          }
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                          },
                          ticks: {
                            font: {
                              weight: 'bold'
                            }
                          }
                        },
                        x: {
                          grid: {
                            display: false
                          },
                          ticks: {
                            font: {
                              weight: 'bold'
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
              </div>

              <div className="rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
                <h3 className="mb-4 text-lg font-semibold text-gray-800">Role Distribution</h3>
                <div className="h-80">
                  <Doughnut
                    data={getRoleData()}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'right',
                          labels: {
                            font: {
                              size: 12,
                              weight: 'bold'
                            }
                          }
                        },
                        tooltip: {
                          backgroundColor: 'rgba(0, 0, 0, 0.9)',
                          titleFont: { size: 14, weight: 'bold' },
                          bodyFont: { size: 12 },
                          padding: 12,
                          cornerRadius: 8,
                          displayColors: true,
                          callbacks: {
                            label: (context) => {
                              const total = context.dataset.data.reduce((a, b) => a + b, 0);
                              const percentage = Math.round((context.raw / total) * 100);
                              return `${context.label}: ${context.raw} (${percentage}%)`;
                            }
                          }
                        }
                      },
                      cutout: '70%'
                    }}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
                <h3 className="mb-4 text-lg font-semibold text-gray-800">Department Activity</h3>
                <div className="h-80">
                  <Line
                    data={getDepartmentActivityData()}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top',
                          labels: {
                            font: {
                              size: 12,
                              weight: 'bold'
                            }
                          }
                        },
                        tooltip: {
                          backgroundColor: 'rgba(0, 0, 0, 0.9)',
                          titleFont: { size: 14, weight: 'bold' },
                          bodyFont: { size: 12 },
                          padding: 12,
                          cornerRadius: 8,
                          displayColors: true
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                          },
                          ticks: {
                            font: {
                              weight: 'bold'
                            }
                          }
                        },
                        x: {
                          grid: {
                            display: false
                          },
                          ticks: {
                            font: {
                              weight: 'bold'
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
              </div>

              <div className="rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
                <h3 className="mb-4 text-lg font-semibold text-gray-800">Doctor Performance</h3>
                <div className="h-80">
                  <Bar
                    data={getDoctorPerformanceData()}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false
                        },
                        tooltip: {
                          backgroundColor: 'rgba(0, 0, 0, 0.9)',
                          titleFont: { size: 14, weight: 'bold' },
                          bodyFont: { size: 12 },
                          padding: 12,
                          cornerRadius: 8,
                          displayColors: true,
                          callbacks: {
                            label: (context) => `${context.label}: ${context.raw}% score`
                          }
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          max: 100,
                          grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                          },
                          ticks: {
                            font: {
                              weight: 'bold'
                            }
                          }
                        },
                        x: {
                          grid: {
                            display: false
                          },
                          ticks: {
                            font: {
                              weight: 'bold'
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Recent activity section */}
        {userInfo?.role === "HOD" && (
          <section className="mb-12">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-800">
                Department Doctors
              </h2>
              <Link to="/doctors" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {departmentDoctors.slice(0, 3).map((doctor) => (
                <div
                  key={doctor.id}
                  className="flex items-center rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1"
                >
                  <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">
                    {doctor.fullname.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800">
                      {doctor.fullname}
                    </h3>
                    <p className="text-gray-600">{doctor.specialization || "General Physician"}</p>
                  </div>
                  <Link
                    to={`/doctor-profile/${doctor.id}`}
                    className="rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 transition-all hover:bg-blue-100 hover:shadow-sm"
                  >
                    View Profile
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Trustee-specific content */}
        {userInfo?.role === "Trustee" && (
          <section className="mb-12">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-800">
                Doctor Management
              </h2>
              <Link to="/doctors" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                View All Doctors
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {allDoctors.slice(0, 3).map((doctor) => (
                <div
                  key={doctor.id}
                  className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1"
                >
                  <div className="mb-4 flex items-center">
                    <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">
                      {doctor.fullname.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{doctor.fullname}</h3>
                      <p className="text-sm text-gray-500">{doctor.role} - {doctor.department}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      to={`/doctor-profile/${doctor.id}`}
                      className="flex-1 rounded-lg bg-blue-50 px-3 py-1 text-center text-sm font-medium text-blue-600 transition-all hover:bg-blue-100 hover:shadow-sm"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete ${doctor.fullname}?`)) {
                          // Call delete function
                        }
                      }}
                      className="flex-1 rounded-lg bg-red-50 px-3 py-1 text-center text-sm font-medium text-red-600 transition-all hover:bg-red-100 hover:shadow-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Overview section */}
        <section className={`relative overflow-hidden rounded-xl p-8 text-center text-white shadow-lg ${userInfo?.role === "HOD"
          ? "bg-gradient-to-r from-blue-600 to-cyan-500"
          : "bg-gradient-to-r from-indigo-600 to-purple-500"
          }`}>
          <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-white bg-opacity-10"></div>
          <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-white bg-opacity-10"></div>
          <div className="relative z-10">
            <h2 className="mb-2 text-2xl font-semibold">
              {userInfo?.role === "HOD" ? "Department Overview" : "System Overview"}
            </h2>
            <p className="mb-6 text-blue-100">
              {userInfo?.role === "HOD" ? "DEPARTMENT STAFF" : "TOTAL STAFF"}
            </p>

            {userInfo?.role === "HOD" ? (
              <>
                <p className="my-4 text-6xl font-bold">{departmentDoctors.length}</p>
                <p className="mb-8 text-xl font-medium text-blue-100">Doctors in your department</p>
                <Link to="/doctors">
                  <button className="rounded-lg bg-white px-8 py-3 font-semibold text-blue-600 shadow-md transition-all duration-300 hover:bg-opacity-90 hover:shadow-lg">
                    View Department Doctors →
                  </button>
                </Link>
              </>
            ) : (
              <>
                <div className="flex justify-center space-x-12 my-4">
                  <div>
                    <p className="text-6xl font-bold">{doctorCount}</p>
                    <p className="text-xl font-medium text-indigo-100">Doctors</p>
                  </div>
                  <div>
                    <p className="text-6xl font-bold">{hodCount}</p>
                    <p className="text-xl font-medium text-indigo-100">HODs</p>
                  </div>
                </div>
                <div className="flex justify-center space-x-4">
                  <Link to="/doctors">
                    <button className="rounded-lg bg-white px-8 py-3 font-semibold text-indigo-600 shadow-md transition-all duration-300 hover:bg-opacity-90 hover:shadow-lg">
                      View All Doctors →
                    </button>
                  </Link>
                  <Link to="/hods">
                    <button className="rounded-lg bg-indigo-700 px-8 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:bg-opacity-90 hover:shadow-lg">
                      View All HOD's →
                    </button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;