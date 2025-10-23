import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../store/auth.store.js';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ studentid: '', pincode: '' });
  const { login, isLoggingIn } = useAuthStore();

  const validateForm = () => {
    if (!formData.studentid || !formData.pincode) {
      toast.error('Student ID and Passcode are required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await login(formData);
    } catch {
      toast.error('Login failed');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <div className="bg-white w-full max-w-lg p-10 rounded-xl shadow-xl">
        <h2 className="text-3xl font-bold text-center mb-8">
          Sign in to our Portal
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Student ID */}
          <div className="form-control mb-5">
            <input
              type="text"
              placeholder="Please Enter Your Student ID"
              className="input input-bordered w-full"
              value={formData.studentid}
              onChange={(e) =>
                setFormData({ ...formData, studentid: e.target.value })
              }
            />
          </div>

          {/* Pincode */}
          <div className="form-control mb-5">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Please Enter Your Password"
                className="input input-bordered w-full pr-10"
                value={formData.pincode}
                onChange={(e) =>
                  setFormData({ ...formData, pincode: e.target.value })
                }
              />
              <span
                className="absolute right-3 top-3 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>
          </div>

          {/* Submit & Forgot Link */}
          <div className="flex justify-between items-center mt-6">
            <button
              type="submit"
              disabled={isLoggingIn}
              className="bg-black text-white px-6 py-2 rounded font-semibold hover:bg-gray-800 transition"
            >
              {isLoggingIn ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                'LOGIN'
              )}
            </button>

            <a href="#" className="text-sm text-gray-600 hover:underline">
              Forgot Passcode?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
