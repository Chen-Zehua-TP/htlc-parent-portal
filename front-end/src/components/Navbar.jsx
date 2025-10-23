import React from 'react';
import { useAuthStore } from '../store/auth.store.js';
import logo from '../assets/HappyTutorsLogo.png'; // ✅ Proper image import
import { LogOut, User } from 'lucide-react';

export default function Navbar() {
  const { authUser,logout } = useAuthStore(); // get auth user from your store

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
      {/* Logo */}
      <div className="text-xl font-bold text-primary flex items-center gap-2">
        <img src={logo} alt="Happy Tutors Logo" className="h-10 w-auto" />
      </div>

      {/* User info (only if logged in) */}
      {authUser && (
  <div className="flex items-center gap-6 text-sm text-gray-700">
    {/* Navigation links */}
    <nav className="flex gap-4 items-center">
      <p className="font-medium hover:text-yellow-500 hover:underline transition cursor-pointer">
        My Classes
      </p>
      <p className="font-medium hover:text-yellow-500 hover:underline transition cursor-pointer">
        Attendance
      </p>
      <p className="font-medium hover:text-yellow-500 hover:underline transition cursor-pointer">
        Payments
      </p>
    </nav>

    {/* User ID */}
    <div className="flex items-center gap-2 pl-4 border-l border-gray-300">
      <User size={20} className="text-gray-600" />
      <p className="font-medium">{authUser.studentId}</p>
    </div>

    {/* Logout icon */}
    <LogOut
      size={22}
      className="text-gray-600 cursor-pointer hover:text-red-500 transition"
      onClick={logout}
      title="Logout"
    />
  </div>
)}

    </nav>
  );
}
