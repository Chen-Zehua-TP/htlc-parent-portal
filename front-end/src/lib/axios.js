import axios from 'axios'

// API calls go to frontend dev server at /api, which proxies to GAS backend
// In production, you'll need to set up a backend server or update this URL
const API_BASE_URL = import.meta.env.VITE_API_URL || "/api"

export const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: false
})

// Add token to every request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
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