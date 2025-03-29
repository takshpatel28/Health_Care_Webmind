import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../helper/supabaseClient';

const Sidebar = () => {
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserRole = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                const { data } = await supabase
                    .from('doctors')
                    .select('role')
                    .eq('id', session.user.id)
                    .single();
                setUserRole(data?.role);
            }
            setLoading(false);
        };

        fetchUserRole();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                supabase
                    .from('doctors')
                    .select('role')
                    .eq('id', session.user.id)
                    .single()
                    .then(({ data }) => setUserRole(data?.role));
            } else {
                setUserRole(null);
            }
        });

        return () => subscription?.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/login");
    };

    if (loading) {
        return (
            <div className="sticky top-16 h-[calc(100vh-4rem)] w-72 flex-shrink-0 border-r border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    const navItems = [
        {
            name: "Dashboard",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
            ),
            path: "/dashboard"
        },
        {
            name: "Doctors Department",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
            path: "/doctors"
        }
    ];

    // Add HOD's Department section only for Trustee
    if (userRole === "Trustee") {
        navItems.push({
            name: "HOD's Department",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            ),
            path: "/hods"
        });
    }

    return (
        <div className="sticky top-16 h-[calc(100vh-4rem)] w-72 flex-shrink-0 border-r border-gray-200 bg-white p-6 shadow-sm">
            {/* Logo and app name */}
            <div className="mb-10 flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-2xl font-bold text-white">DM</div>
                <div className="ml-3 text-xl font-semibold text-gray-800">DoctorMS</div>
            </div>

            {/* Navigation */}
            <nav className="flex h-[calc(100%-12rem)] flex-col">
                <ul className="flex-1 space-y-1 overflow-y-auto">
                    {navItems.map((item, index) => (
                        <li key={index}>
                            <button
                                onClick={() => navigate(item.path)}
                                className="flex w-full items-center rounded-lg px-4 py-3 text-left font-medium text-gray-600 transition-all duration-300 hover:bg-blue-50 hover:text-blue-600"
                            >
                                <span className="mr-3 opacity-70">
                                    {item.icon}
                                </span>
                                {item.name}
                            </button>
                        </li>
                    ))}
                </ul>

                {/* User profile and logout */}
                <div className="mt-auto pt-4">
                    <div
                        className="mb-4 flex items-center rounded-lg bg-gray-50 p-4 cursor-pointer hover:bg-gray-100"
                        onClick={() => navigate('/profile')}
                    >
                        <div className="h-10 w-10 rounded-full bg-blue-100"></div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-800">
                                {userRole === "HOD" ? "Head of Department" :
                                    userRole === "Trustee" ? "Trustee" :
                                        userRole === "Doctor" ? "Doctor" : "User"}
                            </p>
                            <p className="text-xs text-gray-500">
                                {userRole === "HOD" ? "Administrator" :
                                    userRole === "Trustee" ? "Supervisor" :
                                        userRole === "Doctor" ? "Medical Staff" : "Guest"}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center justify-center rounded-lg bg-red-50 px-4 py-3 font-medium text-red-600 transition-all hover:bg-red-100 hover:shadow-sm"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                    </button>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;