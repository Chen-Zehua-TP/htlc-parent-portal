import React from 'react'
import { useAnnouncementStore } from '../store/announcement.store'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

export default function Announcement() {
  const {
    announcements,
    showModal,
    closeModal,
    currentIndex,
    nextAnnouncement,
    previousAnnouncement,
    goToAnnouncement
  } = useAnnouncementStore()

  if (!showModal || announcements.length === 0) {
    return null
  }

  const currentAnnouncement = announcements[currentIndex]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-800">Announcement</h2>
          <button
            onClick={closeModal}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            title="Close"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Image */}
          {currentAnnouncement.image && (
            <div className="mb-6">
              <img
                src={currentAnnouncement.image}
                alt="Announcement"
                className="w-full h-auto rounded-lg object-cover max-h-96"
              />
            </div>
          )}

          {/* Text */}
          <div className="mb-6">
            <p className="text-gray-700 whitespace-pre-wrap text-base leading-relaxed">
              {currentAnnouncement.text}
            </p>
          </div>

          {/* Navigation - Show only if multiple announcements */}
          {announcements.length > 1 && (
            <>
              {/* Previous/Next Buttons */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={previousAnnouncement}
                  className="p-2 hover:bg-gray-100 rounded-lg transition flex items-center gap-2"
                  title="Previous announcement"
                >
                  <ChevronLeft size={20} className="text-gray-600" />
                  <span className="text-sm text-gray-600 hidden sm:inline">Previous</span>
                </button>

                <span className="text-sm text-gray-600">
                  {currentIndex + 1} / {announcements.length}
                </span>

                <button
                  onClick={nextAnnouncement}
                  className="p-2 hover:bg-gray-100 rounded-lg transition flex items-center gap-2"
                  title="Next announcement"
                >
                  <span className="text-sm text-gray-600 hidden sm:inline">Next</span>
                  <ChevronRight size={20} className="text-gray-600" />
                </button>
              </div>

              {/* Dot Indicators */}
              <div className="flex justify-center gap-2 flex-wrap">
                {announcements.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToAnnouncement(index)}
                    className={`w-2 h-2 rounded-full transition ${
                      index === currentIndex
                        ? 'bg-yellow-500 w-6'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    title={`Go to announcement ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
