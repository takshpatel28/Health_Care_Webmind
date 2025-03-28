import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../helper/supabaseClient';

const Sidebar = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/login");
    };

    return (
        <div className="sticky top-16 h-[calc(100vh-4rem)] w-72 flex-shrink-0 border-r border-gray-200 bg-white p-6 shadow-sm">
            {/* Logo and app name */}
            <div className="mb-10 flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-2xl font-bold text-white">DM</div>
                <div className="ml-3 text-xl font-semibold text-gray-800">DoctorMS</div>
            </div>
            
            {/* Navigation - INCLUDING DOCTORS LINK */}
            <nav className="flex h-[calc(100%-12rem)] flex-col">
                <ul className="flex-1 space-y-1 overflow-y-auto">
                    {[
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
                        },
                        // { 
                        //     name: "Settings", 
                        //     icon: (
                        //         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        //         </svg>
                        //     ),
                        //     path: "/settings"
                        // },
                        // { 
                        //     name: "Department Doctors", 
                        //     icon: (
                        //         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        //             <path d="M12 14l9-5-9-5-9 5 9 5z" />
                        //             <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                        //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                        //         </svg>
                        //     ),
                        //     path: "/department-doctors"
                        // },
                    ].map((item, index) => (
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
                    <div className="mb-4 flex items-center rounded-lg bg-gray-50 p-4">
                        <div className="h-10 w-10 rounded-full bg-blue-100"></div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-800">Head of Department</p>
                            <p className="text-xs text-gray-500">Administrator</p>
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