import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Key, Trash2, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useLocation } from 'react-router-dom';

export function ManagePage() {
    const { allUsers, pendingUsers, approveUser, rejectUser, removeUser, user: currentUser } = useAuth();
    const { events, updateEvent } = useData();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState<'users' | 'requests' | 'history'>('users');

    useEffect(() => {
        if (location.state && (location.state as any).activeTab) {
            setActiveTab((location.state as any).activeTab);
        }
    }, [location.state]);

    const isAdmin = currentUser?.role === 'admin';

    const handleExportCSV = () => {
        // Headers
        const headers = ['Event ID', 'Title', 'Date', 'Time', 'Venue', 'Organizer', 'Approved By', 'Status', 'Notes', 'Poster Data'];

        // Rows
        const rows = events.map(e => [
            e.id,
            `"${e.title}"`,
            e.date,
            `${e.startTime}-${e.endTime}`,
            `"${(e as any).venue || e.location}"`,
            `"${e.organizer}"`,
            `"${e.approvedBy || 'Admin'}"`,
            e.status,
            `"${e.adminNotes || ''}"`,
            `"${e.posterUrl || 'No Poster'}"`
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "events_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Only Admin sees users management
    // Staff/Faculty might see approved history? "admin or staff can make a note... when event is approved".
    // Assuming Staff also has access to this "Manage" page but limited view.
    // Actually usually only Admin manages users.
    // Let's assume Admin sees everything. Staff sees "Approved History" only or similar?
    // User prompt said "create a another page named manage and bring the manage users...".

    // Actually in DataContext, `events` ARE approved events. `approvals` are pending.

    const handleResetPassword = (id: string) => {
        // In a real app this would trigger an email.
        alert(`Password reset link sent to user ${id} (Simulated).`);
    };

    const handleAddNote = (eventId: number, currentNote?: string) => {
        const note = window.prompt("Enter note for this event:", currentNote);
        if (note !== null) {
            updateEvent(eventId, { adminNotes: note });
            alert("Note updated!");
        }
    };

    if (!isAdmin && currentUser?.role !== 'faculty') { // Assuming faculty = staff for now, or maybe only Admin
        return <div className="p-8 text-center text-gray-500">Access Denied</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#1e3a8a]">Management Console</h1>
                    <p className="text-gray-500">Manage users and review event history</p>
                </div>

                <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-100">
                    {isAdmin && (
                        <>
                            <button
                                onClick={() => setActiveTab('users')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'users' ? 'bg-[#1e3a8a] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                All Users
                            </button>
                            <button
                                onClick={() => setActiveTab('requests')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'requests' ? 'bg-[#1e3a8a] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                User Requests
                                {pendingUsers.length > 0 && (
                                    <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                                        {pendingUsers.length}
                                    </span>
                                )}
                            </button>
                        </>
                    )}
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'history' ? 'bg-[#1e3a8a] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        Approved History
                    </button>
                </div>
            </div>

            {/* Users List */}
            {activeTab === 'users' && isAdmin && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Login</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {allUsers.map((u) => (
                                    <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-xs">
                                                    {u.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{u.name}</p>
                                                    <p className="text-xs text-gray-500">{u.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                                u.role === 'faculty' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                {u.role}
                                            </span>
                                            {u.occupation && <div className="text-xs text-gray-400 mt-1">{u.occupation}</div>}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {u.lastLogin || 'Never'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => handleResetPassword(u.id)} className="p-1 text-blue-600 hover:bg-blue-50 rounded" title="Reset Password">
                                                    <Key className="w-4 h-4" />
                                                </button>
                                                {u.id !== currentUser?.id && (
                                                    <button onClick={() => {
                                                        if (window.confirm(`Remove user ${u.name}?`)) removeUser(u.id);
                                                    }} className="p-1 text-red-600 hover:bg-red-50 rounded" title="Remove User">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* User Requests */}
            {activeTab === 'requests' && isAdmin && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="divide-y divide-gray-100">
                        {pendingUsers.map((pUser) => (
                            <motion.div
                                key={pUser.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="p-6 flex items-center justify-between"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-[#1e3a8a] font-bold">
                                        {pUser.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{pUser.name}</h3>
                                        <p className="text-sm text-gray-500">{pUser.email}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-medium uppercase">
                                                {pUser.role}
                                            </span>
                                            {pUser.occupation && (
                                                <span className="text-xs text-gray-400">
                                                    • {pUser.occupation}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => approveUser(pUser.id)}
                                        className="px-4 py-2 bg-green-50 text-green-600 rounded-lg text-sm font-medium hover:bg-green-100"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => rejectUser(pUser.id)}
                                        className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                        {pendingUsers.length === 0 && (
                            <div className="p-12 text-center text-gray-500">
                                No pending user requests
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Approved History */}
            {activeTab === 'history' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-900">Approved Event History</h2>
                        <button onClick={handleExportCSV} className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors">
                            <Download className="w-4 h-4" />
                            Export CSV
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Event</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Approved By</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Notes</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {events.map((event) => (
                                    <tr key={event.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{event.title}</div>
                                            <div className="text-xs text-gray-500">{event.organizer}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {event.date}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <div className="flex flex-col">
                                                <span className="font-medium">{event.approvedBy || 'Admin'}</span>
                                                {event.approvalDate && (
                                                    <span className="text-xs text-gray-400">
                                                        {new Date(event.approvalDate).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 italic">
                                            {event.adminNotes || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleAddNote(event.id)}
                                                className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                                            >
                                                Edit Note
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {events.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                            No approved events found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
