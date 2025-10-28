import { create } from 'zustand'
import { axiosInstance } from '../lib/axios.js'
import toast from 'react-hot-toast'

export const useAttendanceStore = create((set, get) => ({
  attendanceData: [],
  isLoading: false,
  error: null,
  lastStudentId: null,

  // Fetch attendance data for a student
  fetchAttendance: async (token, studentId) => {
    const state = get();
    
    // If we have cached data for this student, show it immediately
    if (state.attendanceData.length > 0 && state.lastStudentId === studentId) {
      set({ isLoading: false })
      console.log('[LOG] fetchAttendance: Showing cached data for student', studentId);
      return;
    }

    set({ isLoading: true, error: null })
    try {
      console.log('[LOG] fetchAttendance: Requesting data for student', studentId);
      
      const response = await axiosInstance.post('', {
        token: token,
        studentid: studentId
      }, {params: {route: 'attendance'}})

      console.log('[LOG] fetchAttendance response:', response.data);

      if (response.data.status === 'Success' && response.data.data) {
        set({
          attendanceData: response.data.data,
          lastStudentId: studentId,
          error: null
        })
        toast.success('Attendance data loaded successfully')
        console.log('[LOG] Attendance data fetched successfully');
      } else {
        const errorMsg = response.data.message || 'Failed to fetch attendance data'
        set({
          attendanceData: [],
          error: errorMsg
        })
        toast.error(errorMsg)
        console.log('[LOG] fetchAttendance error:', errorMsg);
      }
    } catch (error) {
      console.error('[LOG] fetchAttendance error:', error)
      const errorMsg = error.response?.data?.message || error.message || 'Failed to load attendance data'
      set({
        attendanceData: [],
        error: errorMsg
      })
      toast.error(errorMsg)
    } finally {
      set({ isLoading: false })
    }
  },

  // Clear attendance data
  clearAttendance: () => {
    set({
      attendanceData: [],
      lastStudentId: null,
      error: null,
      isLoading: false
    })
  },

  // Reset error
  clearError: () => {
    set({ error: null })
  }
}))
