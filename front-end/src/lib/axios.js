import axios from 'axios'

// Direct query to Google Apps Script backend (no proxy)
const API_BASE_URL = import.meta.env.VITE_GAS_BACKEND_URL

export const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: false,
    headers: {
      // Use text/plain to bypass CORS preflight for Google Apps Script
      // GAS doesn't handle application/json preflight requests well
      'Content-Type': 'text/plain;charset=utf-8'
    }
})

// Add token to every request (via request body, not headers, to avoid CORS preflight)
axiosInstance.interceptors.request.use((config) => {
  // Don't add Authorization header as it triggers CORS preflight
  // Token is sent in the request body instead for Google Apps Script
  return config
})

// Handle token expiration
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      console.log('[LOG] 401 Unauthorized - Token invalid or expired');
      localStorage.removeItem('authToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)