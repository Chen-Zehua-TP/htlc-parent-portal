import {create} from 'zustand'
import { axiosInstance } from '../lib/axios.js'
import toast from "react-hot-toast";

// Helper function to map student data array to object
function mapStudentData(dataArray) {
  if (!Array.isArray(dataArray) || dataArray.length < 3) {
    return null;
  }

  return {
    studentId: dataArray[0],
    studentName: dataArray[1],
    studentLevel: dataArray[2],
    phoneNumber: dataArray[3] || null,
    courses: extractCourses(dataArray)
  };
}

// Helper function to extract courses from the data array
function extractCourses(dataArray) {
  const courses = [];
  for (let i = 4; i < dataArray.length; i += 4) {
    if (dataArray[i]) {
      courses.push({
        name: dataArray[i],
        classId: dataArray[i + 1],
        time: dataArray[i + 2],
        date: dataArray[i + 3]
      });
    }
  }
  return courses;
}

export const useAuthStore = create((set) => ({
    authUser: null,
    isLoading: false,
    error: null,
    token: localStorage.getItem('authToken') || null,

    // Initialize auth from token on app load
    initializeAuth: async () => {
      const token = localStorage.getItem('authToken')
      if (token) {
        set({ isLoading: true })
        try {
          console.log('[LOG] initializeAuth: Validating stored token');
          const response = await axiosInstance.post('', { token }, { params: { route: 'login' } })
          
          if (response.data.status === "Success" && response.data.data) {
            const userData = mapStudentData(response.data.data)
            if (userData) {
              set({ 
                authUser: userData, 
                token: token,
                error: null 
              })
              console.log('[LOG] initializeAuth: Token validated, user restored');
            }
          } else {
            localStorage.removeItem('authToken')
            set({ token: null, authUser: null })
            console.log('[LOG] initializeAuth: Token validation failed');
          }
        } catch (error) {
          localStorage.removeItem('authToken')
          set({ token: null, authUser: null, error: 'Session expired. Please login again.' })
          console.log('[LOG] initializeAuth error:', error)
        } finally {
          set({ isLoading: false })
        }
      } else {
        set({ isLoading: false })
      }
    },

    login: async (formdata) => {
      set({ isLoading: true, error: null })
      try {
        console.log('[LOG] login called with formData:', formdata);
        const response = await axiosInstance.post('', formdata, { params: { route: 'login' } })
        
        console.log('[LOG] login response:', response.data);
        
        if (response.data.status === "Success" && response.data.data) {
          const userData = mapStudentData(response.data.data)
          const token = response.data.token
          
          if (userData && token) {
            // Store token in localStorage
            localStorage.setItem('authToken', token)
            
            set({ 
              authUser: userData, 
              token: token,
              error: null 
            })
            toast.success(`Welcome, ${userData.studentName}!`)
            console.log('[LOG] Login successful, token stored');
          } else {
            toast.error('Invalid response format')
            set({ authUser: null, error: 'Invalid response' })
          }
        } else {
          toast.error(response.data.message || 'Login failed')
          set({ authUser: null, error: response.data.message })
        }
        
      } catch (error) {
        console.log('[LOG] login error:', error)
        const errorMsg = error.response?.data?.message || 'Login failed - Please check your credentials'
        toast.error(errorMsg)
        set({ authUser: null, error: errorMsg })
      } finally {
        set({ isLoading: false })
      }
    },

    logout: () => {
      try {
        console.log('[LOG] logout called');
        localStorage.removeItem('authToken')
        set({ authUser: null, token: null, error: null })
        toast.success('Logged out successfully')
      } catch (error) {
        console.log('[LOG] error in logging out', error)
        toast.error(error.message)
      }
    }
}))
