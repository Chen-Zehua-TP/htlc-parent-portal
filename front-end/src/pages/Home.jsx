import React from 'react';
import { useAuthStore } from '../store/auth.store';
import profileImage from '../assets/graduationimage.jpg'; // Replace with your actual image path

export default function Home() {
  const { authUser } = useAuthStore();

  return (
    <div className="min-h-screen  flex items-center justify-center px-4 py-10">
      <div className="bg-white shadow-lg rounded-xl p-6 md:p-10 flex flex-col md:flex-row items-center gap-8 w-full max-w-4xl">
        {/* Profile Image */}
        <div className="flex-shrink-0">
          <img
            src={profileImage}
            alt="Student Avatar"
            className="w-40 h-40 md:w-48 md:h-48 rounded-full border-4 border-white shadow-md object-cover"
          />
        </div>

        {/* Student Info */}
        <div className="text-center md:text-left w-full">
          <h1 className="text-3xl md:text-4xl font-bold text-black-500">
            {authUser?.studentName || 'Student Name'}
          </h1>

          <div className="mt-4 border-t pt-4">
            <p className="text-lg font-medium text-gray-700 mb-1">
              {authUser?.studentLevel || 'Level not available'}
            </p>
            <p className="text-sm text-gray-500">
              Student ID : {authUser?.studentId || 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
