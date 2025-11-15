import { create } from 'zustand'
import { axiosInstance } from '../lib/axios.js'
import toast from 'react-hot-toast'

export const useAttendanceStore = create((set, get) => ({
  attendanceData: [],
  isLoading: false,
  error: null,
  failedAttempts: 0,

  // Fetch attendance data for a student
  fetchAttendance: async (token) => {
    const state = get();
    
    // If we have cached data, show it immediately
    if (state.attendanceData.length > 0) {
      set({ isLoading: false })
      console.log('[LOG] fetchAttendance: Showing cached data');
      return;
    }

    // If already failed twice, don't retry
    if (state.failedAttempts >= 2) {
      console.log('[LOG] fetchAttendance: Maximum failed attempts reached, stopping retries');
      set({ isLoading: false })
      return;
    }

    set({ isLoading: true, error: null })
    try {
      console.log('[LOG] fetchAttendance: Requesting data with verified token (Attempt ' + (state.failedAttempts + 1) + ')');
      
      const response = await axiosInstance.post('', {
        token: token
      }, {params: {route: 'attendance'}})

      console.log('[LOG] fetchAttendance response:', response.data);

      if (response.data.status === 'Success' && response.data.data) {
        set({
          attendanceData: response.data.data,
          error: null,
          failedAttempts: 0
        })
        toast.success('Attendance data loaded successfully')
        console.log('[LOG] Attendance data fetched successfully');
      } else {
        const errorMsg = response.data.message || 'Failed to fetch attendance data'
        const newAttempts = state.failedAttempts + 1
        set({
          attendanceData: [],
          error: errorMsg,
          failedAttempts: newAttempts
        })
        toast.error(errorMsg)
        console.log('[LOG] fetchAttendance error:', errorMsg, '(Attempt ' + newAttempts + '/2)');
      }
    } catch (error) {
      console.error('[LOG] fetchAttendance error:', error)
      const errorMsg = error.response?.data?.message || error.message || 'Failed to load attendance data'
      const newAttempts = state.failedAttempts + 1
      set({
        attendanceData: [],
        error: errorMsg,
        failedAttempts: newAttempts
      })
      toast.error(errorMsg)
      console.log('[LOG] fetchAttendance error (Attempt ' + newAttempts + '/2):', errorMsg);
    } finally {
      set({ isLoading: false })
    }
  },

  // Clear attendance data
  clearAttendance: () => {
    set({
      attendanceData: [],
      error: null,
      isLoading: false,
      failedAttempts: 0
    })
  },

  // Reset error
  clearError: () => {
    set({ error: null })
  }
}))
