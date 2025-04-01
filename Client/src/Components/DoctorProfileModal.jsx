import React from "react";

const DoctorProfileModal = ({ doctor, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Doctor Profile</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600">
              {doctor.fullname?.charAt(0)?.toUpperCase() || 'D'}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">{doctor.fullname}</h3>
              <p className="text-gray-600">{doctor.role}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Department</p>
              <p className="font-medium text-gray-800">{doctor.department || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Specialization</p>
              <p className="font-medium text-gray-800">{doctor.specialization || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="font-medium text-gray-800">{doctor.email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Phone</p>
              <p className="font-medium text-gray-800">{doctor.phone || 'N/A'}</p>
            </div>
          </div>
          
          <div className="pt-4">
            <button
              onClick={onClose}
              className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfileModal;