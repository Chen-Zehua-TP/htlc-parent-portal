import React, { useState } from 'react';
import { useAuthStore } from '../store/auth.store.js';
import { useAnnouncementStore } from '../store/announcement.store.js';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/htlc-full-logo.png'; // ✅ Proper image import
import { LogOut, User, Menu, X, Bell } from 'lucide-react';

export default function Navbar() {
  const { authUser, logout } = useAuthStore(); // get auth user from your store
  const { announcements, openModal } = useAnnouncementStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md px-4 md:px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      {/* Logo */}
      <div className="text-xl font-bold text-primary flex items-center gap-2">
        <img src={logo} alt="Happy Tutors Logo" className="h-10 w-auto" />
      </div>

      {/* Desktop Navigation (hidden on mobile) */}
      {authUser && (
        <div className="hidden md:flex items-center gap-6 text-sm text-gray-700">
          {/* Navigation links */}
          <nav className="flex gap-4 items-center">
            <p 
              className="font-medium hover:text-yellow-500 hover:underline transition cursor-pointer"
              onClick={() => navigate('/')}
            >
              Dashboard
            </p>
            <p 
              className="font-medium hover:text-yellow-500 hover:underline transition cursor-pointer"
              onClick={() => navigate('/attendance')}
            >
              Attendance
            </p>
            <p 
              className="font-medium hover:text-yellow-500 hover:underline transition cursor-pointer"
              onClick={() => navigate('/receipts')}
            >
              Receipts
            </p>
          </nav>

          {/* Announcement icon */}
          {announcements.length > 0 && (
            <div className="relative">
              <Bell
                size={22}
                className="text-gray-600 cursor-pointer hover:text-yellow-500 transition"
                onClick={openModal}
                title="View announcements"
              />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {announcements.length}
              </span>
            </div>
          )}

          {/* User ID */}
          <div className="flex items-center gap-2 pl-4 border-l border-gray-300">
            <User size={20} className="text-gray-600" />
            <p className="font-medium">{authUser.studentId}</p>
          </div>

          {/* Logout icon */}
          <LogOut
            size={22}
            className="text-gray-600 cursor-pointer hover:text-red-500 transition"
            onClick={handleLogout}
            title="Logout"
          />
        </div>
      )}

      {/* Mobile Menu Toggle Button (visible only on mobile) */}
      {authUser && (
        <button 
          className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          title="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X size={24} className="text-gray-600" />
          ) : (
            <Menu size={24} className="text-gray-600" />
          )}
        </button>
      )}

      {/* Mobile Navigation Menu */}
      {authUser && mobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white shadow-lg md:hidden">
          <div className="flex flex-col gap-4 p-4 border-t border-gray-200">
            {/* Navigation links */}
            <p 
              className="font-medium text-gray-700 hover:text-yellow-500 transition cursor-pointer py-2"
              onClick={() => {
                navigate('/');
                setMobileMenuOpen(false);
              }}
            >
              Dashboard
            </p>
            <p 
              className="font-medium text-gray-700 hover:text-yellow-500 transition cursor-pointer py-2"
              onClick={() => {
                navigate('/attendance');
                setMobileMenuOpen(false);
              }}
            >
              Attendance
            </p>
            <p 
              className="font-medium text-gray-700 hover:text-yellow-500 transition cursor-pointer py-2"
              onClick={() => {
                navigate('/receipts');
                setMobileMenuOpen(false);
              }}
            >
              Receipts
            </p>

            {/* Divider */}
            <div className="border-t border-gray-200 my-2"></div>

            {/* Announcement button */}
            {announcements.length > 0 && (
              <button
                className="flex items-center gap-2 text-yellow-600 hover:text-yellow-700 font-medium py-2 transition w-full"
                onClick={() => {
                  openModal();
                  setMobileMenuOpen(false);
                }}
              >
                <Bell size={18} />
                Announcements ({announcements.length})
              </button>
            )}

            {/* User ID */}
            <div className="flex items-center gap-2 py-2 text-gray-700">
              <User size={18} className="text-gray-600" />
              <p className="font-medium text-sm">{authUser.studentId}</p>
            </div>

            {/* Logout button */}
            <button
              className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium py-2 transition w-full"
              onClick={handleLogout}
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
