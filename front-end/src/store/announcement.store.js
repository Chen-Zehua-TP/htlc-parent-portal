import { create } from 'zustand'
import { axiosInstance } from '../lib/axios.js'
import toast from 'react-hot-toast'

export const useAnnouncementStore = create((set) => ({
  announcements: [],
  isLoading: false,
  error: null,
  currentIndex: 0,
  showModal: false,

  // Fetch announcements from backend
  fetchAnnouncements: async () => {
    set({ isLoading: true, error: null })
    try {
      console.log('[LOG] fetchAnnouncements called')
      const response = await axiosInstance.post('', {}, { params: { route: 'announcements' } })

      console.log('[LOG] announcements response:', response.data)

      if (response.data.status === 'Success' && Array.isArray(response.data.announcements)) {
        set({
          announcements: response.data.announcements,
          currentIndex: 0,
          error: null
        })
        console.log('[LOG] Announcements loaded successfully')
      } else {
        set({ announcements: [], error: 'Failed to load announcements' })
      }
    } catch (error) {
      console.log('[LOG] fetchAnnouncements error:', error)
      set({ announcements: [], error: error.message })
    } finally {
      set({ isLoading: false })
    }
  },

  // Open announcement modal
  openModal: () => {
    set({ showModal: true })
  },

  // Close announcement modal
  closeModal: () => {
    set({ showModal: false })
  },

  // Move to next announcement
  nextAnnouncement: () => {
    set((state) => ({
      currentIndex: (state.currentIndex + 1) % state.announcements.length
    }))
  },

  // Move to previous announcement
  previousAnnouncement: () => {
    set((state) => ({
      currentIndex:
        state.currentIndex === 0
          ? state.announcements.length - 1
          : state.currentIndex - 1
    }))
  },

  // Go to specific announcement
  goToAnnouncement: (index) => {
    set((state) => ({
      currentIndex: Math.min(Math.max(index, 0), state.announcements.length - 1)
    }))
  }
}))
