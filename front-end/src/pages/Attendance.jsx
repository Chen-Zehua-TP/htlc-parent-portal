import React, { useEffect } from 'react';
import { useAuthStore } from '../store/auth.store';
import { useAttendanceStore } from '../store/attendance.store';
import { Loader, AlertCircle, CheckCircle } from 'lucide-react';

export default function Attendance() {
  const { authUser, token } = useAuthStore();
  const { attendanceData, isLoading, error, fetchAttendance } = useAttendanceStore();

  useEffect(() => {
    if (!authUser || !token) {
      console.log('[LOG] Attendance: User not authenticated');
      return;
    }

    console.log('[LOG] Attendance: Fetching data for student', authUser.studentId);
    fetchAttendance(token, authUser.studentId);
  }, [authUser, token, fetchAttendance]);

  // Show cached data immediately, even if loading new data
  const hasData = attendanceData.length > 0;

  if (isLoading && !hasData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin size-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col gap-8 px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 max-w-4xl mx-auto">
        📋 Attendance Record for {authUser?.studentName}
      </h1>

      {error ? (
        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 max-w-4xl mx-auto w-full flex gap-4 items-start">
          <AlertCircle className="size-6 text-red-500 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-red-800 mb-2">Error Loading Attendance</h3>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      ) : attendanceData.length > 0 ? (
        <div className="w-full max-w-6xl mx-auto flex flex-col gap-4">
          {isLoading && (
            <div className="mb-4 flex items-center gap-2 text-sm text-blue-600">
              <Loader className="animate-spin size-4" />
              Refreshing attendance data...
            </div>
          )}
          <div className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col h-[70vh]">
            <div className="overflow-auto flex-1">
              <table className="w-full border-collapse">
                <thead className="bg-blue-600 text-white sticky top-0 z-10">
                  <tr>
                    {/* Get headers from first record */}
                    {Object.keys(attendanceData[0]).map((key) => (
                      <th key={key} className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap border-b border-blue-700">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {attendanceData.map((record, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition">
                      {Object.values(record).map((value, cellIndex) => (
                        <td key={cellIndex} className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                          {value !== null ? String(value) : '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Total records: {attendanceData.length}
          </p>
        </div>
      ) : (
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6 max-w-4xl mx-auto w-full flex gap-4 items-start">
          <CheckCircle className="size-6 text-blue-500 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-blue-800 mb-2">No Attendance Records</h3>
            <p className="text-blue-700">No attendance data is currently available for your account.</p>
          </div>
        </div>
      )}
    </div>
  );
}
