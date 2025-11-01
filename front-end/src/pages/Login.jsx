import React, { useState } from 'react';
import { Eye, EyeOff, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../store/auth.store.js';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [formData, setFormData] = useState({ studentid: '', pincode: '' });
  const { login, isLoggingIn } = useAuthStore();

  const branches = [
    { name: 'Jurong West', phone: '65206146' },
    { name: 'Bukit Batok', phone: '65630672' },
    { name: 'Bukit Gombak', phone: '66120314' },
    { name: 'Tampines', phone: '88050232' },
    { name: 'Bedok Reservoir', phone: '68027696' },
    { name: 'Tiong Bahru', phone: '88010944' },
  ];

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

  const handleForgotPasscode = () => {
    setShowBranchModal(true);
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

            <button
              type="button"
              onClick={handleForgotPasscode}
              className="text-sm text-gray-600 hover:underline"
            >
              Forgot Passcode?
            </button>
          </div>
        </form>
      </div>

      {/* Branch Selection Modal */}
      {showBranchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Select Your Branch
              </h2>
              <button
                onClick={() => setShowBranchModal(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={24} />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Contact your branch to reset your passcode:
            </p>

            <ul className="space-y-3 mb-6">
              {branches.map((branch) => (
                <li key={branch.phone}>
                  <a
                    href={`https://wa.me/${branch.phone}?text=Hi%20i%20forgot%20my%20PIN%20for%20parent%20portal`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition"
                  >
                    <span className="font-medium text-gray-800">
                      {branch.name}
                    </span>
                    <span className="text-green-600 font-semibold">
                      WhatsApp →
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <button
              onClick={() => setShowBranchModal(false)}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-semibold transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
