import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar as CalendarIcon, Clock, MapPin, Tag, Trash2 } from 'lucide-react';
import { Event, useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

interface EventModalProps {
    event: Event | null;
    onClose: () => void;
}

export function EventModal({ event, onClose }: EventModalProps) {
    const { user } = useAuth();
    const { removeEvent } = useData();
    const isAdmin = user?.role === 'admin';

    // Close on Escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <AnimatePresence>
            {event && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        onClick={(e) => e.stopPropagation()} // Prevent close on modal click
                        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-gray-100 flex justify-between items-start shrink-0">
                            <div>
                                <span className={`inline-block px-2 py-1 rounded text-xs font-bold uppercase mb-2 bg-blue-100 text-blue-700`}>
                                    {event.category}
                                </span>
                                <h3 className="text-xl font-bold text-gray-900">
                                    {event.title}
                                </h3>
                            </div>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="overflow-y-auto">
                            {/* Event Poster if available */}
                            {event.posterUrl && (
                                <div className="w-full h-48 bg-gray-100 shrink-0">
                                    <img
                                        src={event.posterUrl}
                                        alt={event.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            <div className="p-6 space-y-4">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <CalendarIcon className="w-5 h-5 text-[#1e3a8a]" />
                                    <span>{event.date}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Clock className="w-5 h-5 text-[#1e3a8a]" />
                                    <span>{event.startTime} - {event.endTime}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <MapPin className="w-5 h-5 text-[#1e3a8a]" />
                                    <span>{event.location}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Tag className="w-5 h-5 text-[#1e3a8a]" />
                                    <span>{event.category}</span>
                                </div>

                                <p className="text-gray-600 mt-4 pt-4 border-t border-gray-100 whitespace-pre-wrap">
                                    {event.description || 'No description provided.'}
                                </p>

                                {event.organizer && (
                                    <div className="text-sm text-gray-500 pt-2 border-t border-gray-100 mt-2">
                                        <p><strong>Organizer:</strong> {event.organizer}</p>
                                        {event.organizerPhone && <p><strong>Phone:</strong> {event.organizerPhone}</p>}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 bg-gray-50 flex gap-3 shrink-0">
                            {isAdmin && (
                                <button
                                    onClick={() => {
                                        const reason = window.prompt("Reason for removal:");
                                        if (reason) {
                                            removeEvent(event.id, reason);
                                            onClose();
                                        }
                                    }}
                                    className="px-4 py-2.5 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-colors flex items-center gap-2"
                                >
                                    <Trash2 className="w-4 h-4" /> Remove
                                </button>
                            )}
                            <button
                                onClick={onClose}
                                className="flex-1 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
