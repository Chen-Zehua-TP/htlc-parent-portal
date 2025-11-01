import React, { useEffect } from 'react';
import { useAuthStore } from '../store/auth.store';
import { useReceiptsStore } from '../store/receipts.store';
import { AlertCircle, CheckCircle, FileText } from 'lucide-react';

export default function Receipts() {
  const { authUser, token } = useAuthStore();
  const { receiptsData, isLoading, error, fetchReceipts } = useReceiptsStore();

  useEffect(() => {
    if (!authUser || !token) {
      console.log('[LOG] Receipts: User not authenticated');
      return;
    }

    console.log('[LOG] Receipts: Fetching data for student', authUser.studentId);
    fetchReceipts(token, authUser.studentId);
  }, [authUser, token]);

  // Helper function to format ISO date to "28th July 2024" format
  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
      const date = new Date(dateStr);
      const day = date.getDate();
      const month = date.toLocaleDateString('en-US', { month: 'long' });
      const year = date.getFullYear();
      
      // Add ordinal suffix (st, nd, rd, th)
      const ordinal = (n) => {
        const j = n % 10, k = n % 100;
        if (j === 1 && k !== 11) return 'st';
        if (j === 2 && k !== 12) return 'nd';
        if (j === 3 && k !== 13) return 'rd';
        return 'th';
      };
      
      return `${day}${ordinal(day)} ${month} ${year}`;
    } catch (error) {
      return dateStr;
    }
  };

  // Sort receipts data by date in descending order (most recent first)
  const sortedReceiptsData = [...receiptsData].sort((a, b) => {
    const dateKey = 'date';
    
    if (!dateKey) return 0;
    
    const dateA = new Date(a[dateKey]);
    const dateB = new Date(b[dateKey]);
    
    return dateB - dateA; // Descending order (most recent first)
  });

  // Calculate total amount
  const totalAmount = receiptsData.reduce((sum, record) => {
    const amount = parseFloat(record.amount) || 0;
    return sum + amount;
  }, 0);

  return (
    <div className="min-h-screen flex flex-col gap-8 px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 max-w-4xl mx-auto">
        🧾 Payment Receipts for {authUser?.studentName}
      </h1>

      {error ? (
        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 max-w-4xl mx-auto w-full flex gap-4 items-start">
          <AlertCircle className="size-6 text-red-500 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-red-800 mb-2">Error Loading Receipts</h3>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      ) : receiptsData.length > 0 ? (
        <div className="w-full max-w-6xl mx-auto flex flex-col gap-4">
          {/* Summary Card */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg rounded-xl p-6 md:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm md:text-base font-medium opacity-90">Total Paid</p>
                <p className="text-3xl md:text-4xl font-bold mt-2">S${totalAmount.toFixed(2)}</p>
              </div>
              <FileText className="size-12 md:size-16 opacity-50" />
            </div>
          </div>

          {/* Receipts Table */}
          <div className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col h-[70vh]">
            <div className="overflow-auto flex-1">
              <table className="w-full border-collapse">
                <thead className="bg-blue-600 text-white sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap border-b border-blue-700">Date Paid</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap border-b border-blue-700">Receipt #</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap border-b border-blue-700">Course Description</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap border-b border-blue-700">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap border-b border-blue-700">Month</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sortedReceiptsData.map((record, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                        {formatDate(record.date)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap font-medium">
                        {record.receipt || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                        {record.courseDescription || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">
                        S${parseFloat(record.amount || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {record.remark 
                        ? new Date(record.remark).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) 
                        : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Total receipts: {receiptsData.length}
          </p>
        </div>
      ) : (
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6 max-w-4xl mx-auto w-full flex gap-4 items-start">
          <CheckCircle className="size-6 text-blue-500 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-blue-800 mb-2">No Receipts Found</h3>
            <p className="text-blue-700">No payment receipts are currently available for your account.</p>
          </div>
        </div>
      )}
    </div>
  );
}
