import { create } from 'zustand'
import { axiosInstance } from '../lib/axios.js'
import toast from 'react-hot-toast'

export const useReceiptsStore = create((set, get) => ({
  receiptsData: [],
  isLoading: false,
  error: null,
  lastStudentId: null,

  // Fetch receipts data for a student
  fetchReceipts: async (token, studentId) => {
    const state = get();
    
    // If we have cached data for this student, show it immediately
    if (state.receiptsData.length > 0 && state.lastStudentId === studentId) {
      set({ isLoading: false })
      console.log('[LOG] fetchReceipts: Showing cached data for student', studentId);
      return;
    }

    set({ isLoading: true, error: null })
    try {
      console.log('[LOG] fetchReceipts: Requesting data for student', studentId);
      
      const response = await axiosInstance.post('', {
        token: token,
        studentid: studentId
      }, {params: {route: 'receipts'}})

      console.log('[LOG] fetchReceipts response:', response.data);

      if (response.data.status === 'Success' && response.data.data) {
        set({
          receiptsData: response.data.data,
          lastStudentId: studentId,
          error: null
        })
        toast.success('Receipts data loaded successfully')
        console.log('[LOG] Receipts data fetched successfully');
      } else {
        const errorMsg = response.data.message || 'Failed to fetch receipts data'
        set({
          receiptsData: [],
          error: errorMsg
        })
        toast.error(errorMsg)
        console.log('[LOG] fetchReceipts error:', errorMsg);
      }
    } catch (error) {
      console.error('[LOG] fetchReceipts error:', error)
      const errorMsg = error.response?.data?.message || error.message || 'Failed to load receipts data'
      set({
        receiptsData: [],
        error: errorMsg
      })
      toast.error(errorMsg)
    } finally {
      set({ isLoading: false })
    }
  },

  // Clear receipts data
  clearReceipts: () => {
    set({
      receiptsData: [],
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
