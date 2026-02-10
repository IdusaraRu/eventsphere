import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, AlertCircle, Bookmark } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { EventCard } from '../components/EventCard';

export function MyActivityPage() {
    // 1. Subscribe to DataContext
    const { approvals, events } = useData();
    const { user, toggleSavedEvent } = useAuth();
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'saved' | 'removed'>('all');

    // 2. Filter approvals for the current logged-in user
    const myRequests = approvals.filter(a => {
        // If the approval tracks which account created it, use that for strict matching
        if (a.createdByEmail && user?.email) {
            return a.createdByEmail === user.email;
        }
        // Fallback: match by name or email stored in 'organizer' field (legacy behavior)
        return a.organizer === user?.name || a.organizer === user?.email;
    });

    // 3. Apply status filter
    const filteredRequests = myRequests.filter(req => {
        if (filter === 'all') return true;
        return req.status === filter;
    });

    // 4. Get Saved Events
    const savedEvents = events.filter(e => user?.savedEventIds?.includes(e.id));

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#1e3a8a]">My Activity</h1>
                    <p className="text-gray-500">Track your proposals and saved events</p>
                </div>

                <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-100 overflow-x-auto">
                    {(['all', 'pending', 'approved', 'rejected', 'removed', 'saved'] as const).map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize whitespace-nowrap ${filter === status
                                ? 'bg-[#1e3a8a] text-white shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            {status === 'saved' ? <span className="flex items-center gap-1"><Bookmark className="w-4 h-4" /> Saved</span> : status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Switch */}
            {filter === 'saved' ? (
                // --- SAVED EVENTS VIEW ---
                <div className="space-y-4">
                    {savedEvents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {savedEvents.map(event => (
                                <EventCard
                                    key={event.id}
                                    {...event}
                                    isSaved={true}
                                    onToggleSave={(e) => {
                                        e.preventDefault();
                                        toggleSavedEvent(event.id);
                                    }}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center text-gray-500 bg-white rounded-2xl border border-gray-100">
                            <Bookmark className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p>No saved events found.</p>
                            <p className="text-sm text-gray-400">Mark events as saved from the Dashboard to see them here.</p>
                        </div>
                    )}
                </div>
            ) : (
                // --- REQUESTS LIST VIEW ---
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="divide-y divide-gray-100">
                        {filteredRequests.map((req) => (
                            <motion.div
                                key={req.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="p-6 transition-colors hover:bg-gray-50/50"
                            >
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Poster Thumbnail */}
                                    {req.posterUrl && (
                                        <div className="shrink-0 w-24 h-32 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                            <img src={req.posterUrl} alt="Poster" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                    {!req.posterUrl && (
                                        <div className="shrink-0 w-24 h-32 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center text-gray-300">
                                            <Calendar className="w-8 h-8" />
                                        </div>
                                    )}

                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-xl font-bold text-[#1e3a8a]">{req.event}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${req.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                        req.status === 'rejected' || req.status === 'removed' ? 'bg-red-100 text-red-700' :
                                                            'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        {req.status}
                                                    </span>
                                                    <span className="text-sm text-gray-500">
                                                        Submitted on {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : 'Unknown'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                {req.date}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-4 h-4 text-gray-400" />
                                                {req.startTime} - {req.endTime}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4 text-gray-400" />
                                                {req.venue}
                                            </div>
                                        </div>

                                        {/* Admin Notes */}
                                        {(req.adminNotes || req.status === 'rejected' || req.status === 'removed') && (
                                            <div className={`mt-4 p-4 rounded-xl text-sm ${req.status === 'rejected' || req.status === 'removed' ? 'bg-red-50 text-red-800 border-red-100' : 'bg-blue-50 text-blue-800 border-blue-100'} border`}>
                                                <span className="font-bold block mb-1">
                                                    {req.status === 'rejected' ? 'Rejection Reason:' : req.status === 'removed' ? 'Removal Reason:' : 'Admin Note:'}
                                                </span>
                                                {req.adminNotes || 'No specific notes provided.'}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {filteredRequests.length === 0 && (
                            <div className="p-12 text-center text-gray-500">
                                <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                <p>No activity found.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
