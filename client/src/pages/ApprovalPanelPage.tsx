import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, X, Calendar, Trash2, MapPin, Plus, Edit, Download, FileSpreadsheet } from 'lucide-react';

import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

export function ApprovalPanelPage() {
  const { approvals, approveEvent, rejectEvent, venues, addVenue, removeVenue, removeEvent, updateVenue } = useData();
  const { user, allUsers } = useAuth();
  const location = useLocation();

  // State for active tab management
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected' | 'removed' | 'venues' | 'users'>(
    location.pathname === '/users' ? 'users' : 'pending'
  );

  useEffect(() => {
    if (location.pathname === '/users') {
      setActiveTab('users');
    } else if (location.pathname === '/approval') {
      setActiveTab('pending');
    }
  }, [location.pathname]);

  // Venue Management State
  const [newVenueName, setNewVenueName] = useState('');
  const [newVenueCapacity, setNewVenueCapacity] = useState('');
  const [editingVenue, setEditingVenue] = useState<{ name: string, capacity: number } | null>(null);

  const isAdmin = user?.role === 'admin';

  // --- Event Actions ---

  const handleEventApprove = (id: number) => {
    const notes = window.prompt("Add an approval note (optional):");
    // Color: Approve action uses Green to signify success/go-ahead
    approveEvent(id, user?.name || 'Admin', notes || undefined);
    alert('Event Approved!');
  };

  const handleEventReject = (id: number) => {
    const notes = window.prompt("Add a rejection note (optional):");
    // Color: Reject action uses Red to signify stop/danger
    rejectEvent(id, notes || undefined);
    alert('Event Rejected!');
  };

  // --- Venue Actions ---

  const handleAddVenue = (e: React.FormEvent) => {
    e.preventDefault();
    if (newVenueName.trim() && newVenueCapacity) {
      if (editingVenue) {
        updateVenue(editingVenue.name, newVenueName.trim(), parseInt(newVenueCapacity));
        alert('Venue updated successfully!');
      } else {
        addVenue({
          name: newVenueName.trim(),
          capacity: parseInt(newVenueCapacity)
        });
        alert('Venue added successfully!');
      }
      setNewVenueName('');
      setNewVenueCapacity('');
      setEditingVenue(null);
    }
  };

  const handleEditClick = (venue: { name: string, capacity: number }) => {
    setEditingVenue(venue);
    setNewVenueName(venue.name);
    setNewVenueCapacity(venue.capacity.toString());
  };

  const handleCancelEdit = () => {
    setEditingVenue(null);
    setNewVenueName('');
    setNewVenueCapacity('');
  };

  const handleRemoveVenue = (venueName: string) => {
    if (window.confirm(`Are you sure you want to remove ${venueName}?`)) {
      removeVenue(venueName);
    }
  };

  // --- User Management (Admin Portal) ---

  // Function to download User Data as CSV (Excel compatible)
  const downloadUsersCSV = () => {
    // CSV Header
    const headers = ['ID,Name,Email,Role,Status,Department,Last Login\n'];
    // CSV Rows
    const rows = allUsers.map(u =>
      `${u.id},"${u.name}",${u.email},${u.role},${u.status},"${u.department || '-'}",${u.lastLogin || '-'}`
    ).join('\n');

    // Create Blob and Trigger Download
    const csvContent = headers + rows;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EventSphere_Users_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          {/* Color: Primary brand color #1e3a8a (Dark Blue) for headers */}
          <h1 className="text-3xl font-bold text-[#1e3a8a]">Approval Panel</h1>
          <p className="text-gray-500">Review pending requests and manage resources</p>
        </div>

        {/* Admin Navigation Tabs */}
        {isAdmin && (
          <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-100 overflow-x-auto">
            {['pending', 'approved', 'rejected', 'removed', 'venues', 'users'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                // Color: Active tab is brand blue, inactive is gray.
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap capitalize ${activeTab === tab
                  ? 'bg-[#1e3a8a] text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* --- PENDING EVENTS TAB --- */}
      {activeTab === 'pending' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Pending Events</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {approvals.filter(a => a.status === 'pending').map((approval) => (
              <motion.div
                key={approval.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-[#1e3a8a]">{approval.event}</h3>
                  <div className="flex items-center gap-3">
                    {/* Color: Tags use light purple background for contrast */}
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold uppercase">
                      {approval.category}
                    </span>
                    <span className="text-sm text-gray-500">{new Date().toLocaleDateString()}</span>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {approval.date} • {approval.startTime} - {approval.endTime}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {approval.venue}
                    </div>
                  </div>
                  <p className="text-gray-600 max-w-2xl">{approval.description}</p>

                  {approval.posterUrl && (
                    <div className="mt-3 mb-2">
                      <img src={approval.posterUrl} alt="Event Poster" className="h-32 rounded-lg shadow-sm border border-gray-100 object-cover" />
                      <a href={approval.posterUrl} download={`Poster-${approval.event}.png`} className="inline-flex items-center gap-1 text-xs text-blue-600 mt-1 hover:underline">
                        <Download className="w-3 h-3" /> Download Poster
                      </a>
                    </div>
                  )}

                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-gray-400">
                      Requested by: {approval.organizer} ({approval.organizerPhone})
                    </p>
                    {approval.createdAt && (
                      <p className="text-xs text-gray-400">
                        Submitted: {new Date(approval.createdAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Color: Action buttons use semantic colors (Green=Approve, Red=Reject) */}
                  <button
                    onClick={() => handleEventApprove(approval.id)}
                    className="p-2 rounded-xl bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                    title="Approve"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleEventReject(approval.id)}
                    className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                    title="Reject"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
            {approvals.filter(a => a.status === 'pending').length === 0 && (
              <div className="p-12 text-center text-gray-500">
                No pending event requests
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- APPROVED EVENTS TAB --- */}
      {activeTab === 'approved' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            {/* Color: Success green for section header */}
            <h2 className="text-lg font-bold text-green-700">Approved Events History</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {approvals.filter(a => a.status === 'approved').map((approval) => (
              <div
                key={approval.id}
                className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-[#1e3a8a]">{approval.event}</h3>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase">
                      Approved
                    </span>
                    <span className="text-sm text-gray-500">{approval.date}</span>
                  </div>
                  <p className="text-gray-600 max-w-2xl text-sm">{approval.description}</p>
                  {approval.adminNotes && (
                    <p className="text-sm text-green-600 italic">Note: {approval.adminNotes}</p>
                  )}
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-gray-400">
                      Organizer: {approval.organizer}
                    </p>
                  </div>
                </div>
                {/* Admin can remove approved events */}
                <button
                  onClick={() => {
                    const reason = window.prompt("Reason for removal:");
                    if (reason) {
                      removeEvent(approval.id, reason);
                    }
                  }}
                  className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors border border-transparent hover:border-red-100 flex items-center gap-1"
                  title="Remove Event"
                >
                  <Trash2 className="w-4 h-4" /> <span className="text-sm font-medium">Remove</span>
                </button>
              </div>
            ))}
            {approvals.filter(a => a.status === 'approved').length === 0 && (
              <div className="p-12 text-center text-gray-500">
                No approved events found.
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- REJECTED EVENTS TAB --- */}
      {activeTab === 'rejected' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            {/* Color: Threat red for rejected section */}
            <h2 className="text-lg font-bold text-red-700">Rejected Requests</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {approvals.filter(a => a.status === 'rejected').map((approval) => (
              <div
                key={approval.id}
                // Color: Light red background tint for rejected items
                className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-red-50/10"
              >
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-gray-700">{approval.event}</h3>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold uppercase">
                      Rejected
                    </span>
                    <span className="text-sm text-gray-500">{approval.date}</span>
                  </div>
                  <p className="text-gray-600 max-w-2xl text-sm">{approval.description}</p>

                  <div className="mt-2 p-3 bg-red-50 border border-red-100 rounded-lg">
                    <span className="font-bold text-red-800 text-sm block">Rejection Reason:</span>
                    <p className="text-red-700 text-sm">{approval.adminNotes || 'No reason provided.'}</p>
                  </div>
                </div>
              </div>
            ))}
            {approvals.filter(a => a.status === 'rejected').length === 0 && (
              <div className="p-12 text-center text-gray-500">
                No rejected requests found.
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- REMOVED EVENTS TAB --- */}
      {activeTab === 'removed' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-red-600 flex items-center gap-2">
              <Trash2 className="w-5 h-5" /> Removed Events Archive
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {approvals.filter(a => a.status === 'removed').map((approval) => (
              <div
                key={approval.id}
                className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50"
              >
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-gray-700 line-through decoration-red-500 decoration-2">{approval.event}</h3>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold uppercase">
                      REMOVED
                    </span>
                    <span className="text-sm text-gray-400">Originally for: {approval.date}</span>
                  </div>
                  <p className="text-gray-500 max-w-2xl text-sm">{approval.description}</p>
                  <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-lg">
                    <span className="font-bold text-red-800 text-sm block">Reason for Removal:</span>
                    <p className="text-red-700 text-sm">{approval.adminNotes || 'No reason provided.'}</p>
                  </div>
                </div>
              </div>
            ))}
            {approvals.filter(a => a.status === 'removed').length === 0 && (
              <div className="p-12 text-center text-gray-500">
                No removed events found.
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- VENUES TAB --- */}
      {activeTab === 'venues' && isAdmin && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-[#1e3a8a] mb-4">
              {editingVenue ? 'Edit Venue' : 'Add New Venue'}
            </h3>
            <form onSubmit={handleAddVenue} className="flex gap-4 items-center">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Venue Name"
                  value={newVenueName}
                  onChange={(e) => setNewVenueName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/20 outline-none"
                  required
                />
              </div>
              <div className="relative w-48">
                <input
                  type="number"
                  placeholder="Capacity"
                  value={newVenueCapacity}
                  onChange={(e) => setNewVenueCapacity(e.target.value)}
                  className="w-full pl-3 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/20 outline-none"
                  required
                  min="1"
                />
              </div>
              <button type="submit" className="px-6 py-3 bg-[#1e3a8a] text-white rounded-xl font-medium hover:bg-blue-900 transition-colors flex items-center gap-2">
                {editingVenue ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                {editingVenue ? 'Update' : 'Add Venue'}
              </button>
              {editingVenue && (
                <button type="button" onClick={handleCancelEdit} className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                  Cancel
                </button>
              )}
            </form>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Venue Name</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Capacity</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {venues.map((venue, index) => (
                    <motion.tr
                      key={venue.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                            <MapPin className="w-4 h-4" />
                          </div>
                          {venue.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-600">{venue.capacity}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleEditClick(venue)} className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleRemoveVenue(venue.name)} className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- USERS TAB (NEW ADMIN PORTAL) --- */}
      {activeTab === 'users' && isAdmin && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-[#1e3a8a]">User Management Portal</h3>
            {/* Download Button */}
            <button
              onClick={downloadUsersCSV}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
              title="Download as Excel/CSV"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Download Excel</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#1e3a8a]/5">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#1e3a8a] uppercase tracking-wider">User Info</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#1e3a8a] uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#1e3a8a] uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#1e3a8a] uppercase tracking-wider">Last Login</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {allUsers.map((u, index) => (
                    <motion.tr
                      key={u.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold">
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{u.name}</div>
                            <div className="text-sm text-gray-500">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-md text-xs font-medium uppercase
                          ${u.role === 'admin' ? 'bg-blue-100 text-blue-700' :
                            u.role === 'faculty' ? 'bg-purple-100 text-purple-700' :
                              'bg-orange-100 text-orange-700'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {/* Color: Status indicators (Green=Active, Yellow=Pending) */}
                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border
                          ${u.status === 'approved' ? 'bg-green-50 text-green-700 border-green-200' :
                            u.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                              'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'approved' ? 'bg-green-500' :
                            u.status === 'rejected' ? 'bg-red-500' :
                              'bg-yellow-500'
                            }`}></span>
                          {u.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {u.lastLogin || 'Never'}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">Showing {allUsers.length} registered users.</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}