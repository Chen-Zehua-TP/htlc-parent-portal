import React from 'react';
import { useAuthStore } from '../store/auth.store';
import profileImage from '../assets/graduationimage.jpg'; // Replace with your actual image path

export default function Home() {
  const { authUser } = useAuthStore();

  return (
    <div className="min-h-screen flex flex-col gap-8 px-4 py-10">
      {/* Student Profile Card */}
      <div className="bg-white shadow-lg rounded-xl p-6 md:p-10 flex flex-col md:flex-row items-center gap-8 w-full max-w-4xl mx-auto">
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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            {authUser?.studentName || 'Student Name'}
          </h1>

          <div className="mt-4 border-t pt-4">
            <p className="text-lg font-medium text-gray-700 mb-2">
              📚 {authUser?.studentLevel || 'Level not available'}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              ID: <span className="font-semibold">{authUser?.studentId || 'N/A'}</span>
            </p>
            {authUser?.phoneNumber && (
              <p className="text-sm text-gray-600">
                📞 {authUser.phoneNumber}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Courses Section */}
      {authUser?.courses && authUser.courses.length > 0 && (
        <div className="w-full max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📖 Enrolled Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {authUser.courses.map((course, index) => (
              <div key={index} className="bg-white shadow-md rounded-lg p-6 border-l-4 border-blue-500">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{course.name}</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><strong>Time:</strong> {course.time || 'N/A'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
