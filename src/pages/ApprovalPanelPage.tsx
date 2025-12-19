import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Eye, MoreHorizontal } from 'lucide-react';
const approvals = [{
  id: 1,
  event: 'Tech Innovation Summit',
  organizer: 'John Smith',
  date: 'Oct 24, 2024',
  venue: 'Main Auditorium',
  status: 'pending'
}, {
  id: 2,
  event: 'Cultural Fest Prep',
  organizer: 'Sarah Johnson',
  date: 'Nov 10, 2024',
  venue: 'Student Center',
  status: 'approved'
}, {
  id: 3,
  event: 'Basketball Practice',
  organizer: 'Mike Brown',
  date: 'Oct 25, 2024',
  venue: 'Sports Complex',
  status: 'rejected'
}, {
  id: 4,
  event: 'Guest Lecture: AI',
  organizer: 'Prof. Davis',
  date: 'Oct 28, 2024',
  venue: 'Hall A',
  status: 'pending'
}, {
  id: 5,
  event: 'Charity Fundraiser',
  organizer: 'Student Council',
  date: 'Nov 05, 2024',
  venue: 'Open Grounds',
  status: 'pending'
}];
export function ApprovalPanelPage() {
  return <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-[#1e3a8a]">Approval Panel</h1>
          <p className="text-gray-500">Review and manage event requests.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-left">
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Event Name
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Organizer
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Date
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Venue
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Status
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {approvals.map((item, index) => <motion.tr key={item.id} initial={{
              opacity: 0,
              y: 10
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: index * 0.05
            }} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900">
                      {item.event}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{item.organizer}</td>
                  <td className="px-6 py-4 text-gray-600">{item.date}</td>
                  <td className="px-6 py-4 text-gray-600">{item.venue}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                      ${item.status === 'pending' ? 'bg-orange-100 text-orange-800' : item.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
                        <Eye className="w-4 h-4" />
                      </button>
                      {item.status === 'pending' && <>
                          <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Approve">
                            <Check className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Reject">
                            <X className="w-4 h-4" />
                          </button>
                        </>}
                    </div>
                  </td>
                </motion.tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>;
}