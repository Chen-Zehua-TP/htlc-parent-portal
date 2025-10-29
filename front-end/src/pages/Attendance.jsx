import React, { useEffect } from 'react';
import { useAuthStore } from '../store/auth.store';
import { useAttendanceStore } from '../store/attendance.store';
import { AlertCircle, CheckCircle } from 'lucide-react';

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
  }, [authUser, token]);

  // Sort attendance data by date in descending order (most recent first)
  const sortedAttendanceData = [...attendanceData].sort((a, b) => {
    // Try to find a date field (common naming conventions)
    const dateKey = 'date';
    
    if (!dateKey) return 0;

        // Parse DD/MM/YYYY format to Date objects
    const parseDate = (dateStr) => {
      const [day, month, year] = dateStr.split('/');
      return new Date(year, month - 1, day);
    };
    
    const dateA = parseDate(a[dateKey]);
    const dateB = parseDate(b[dateKey]);
    
    return dateB - dateA; // Descending order (most recent first)
  });

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
          <div className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col h-[70vh]">
            <div className="overflow-auto flex-1">
              <table className="w-full border-collapse">
                <thead className="bg-blue-600 text-white sticky top-0 z-10">
                  <tr>
                    {/* Get headers from first record */}
                    {Object.keys(sortedAttendanceData[0]).map((key) => (
                      <th key={key} className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap border-b border-blue-700">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sortedAttendanceData.map((record, index) => (
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
