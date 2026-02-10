import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface Venue {
    name: string;
    capacity: number;
}

export interface Event {
    id: number;
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    location: string;
    attendees: number;
    status: 'Live' | 'Upcoming' | 'Ended' | 'Removed';
    imageGradient: string;
    category: string;
    description?: string;
    organizer: string;
    organizerPhone: string;
    approvedBy?: string;
    approvalDate?: string;
    adminNotes?: string;
    posterUrl?: string;
    createdByEmail?: string;
}

export interface Approval {
    id: number;
    event: string;
    organizer: string;
    organizerPhone: string;
    date: string;
    startTime: string;
    endTime: string;
    venue: string;
    category: string;
    description: string;
    status: 'pending' | 'approved' | 'rejected' | 'removed';
    poster?: File | null;
    posterUrl?: string;
    createdAt?: string; // Made optional for legacy, but we'll set it
    adminNotes?: string;
    createdByEmail?: string;
}

// ...

// ... (interfaces)

export interface BroadcastMessage {
    id: number;
    title: string;
    message: string;
    sender: string;
    date: string;
    target: 'all' | 'staff' | 'selected';
    type: 'info' | 'warning' | 'alert' | 'success';
    recipients?: string[];
}

interface DataContextType {
    events: Event[];
    approvals: Approval[];
    venues: Venue[];
    broadcasts: BroadcastMessage[]; // Persisted messages
    addApproval: (approval: Omit<Approval, 'id' | 'status'>) => void;
    approveEvent: (id: number, approverName: string, notes?: string) => void;
    rejectEvent: (id: number, notes?: string) => void;
    addVenue: (venue: Venue) => void;
    updateVenue: (oldName: string, newName: string, newCapacity: number) => void;
    removeVenue: (venueName: string) => void;
    sendBroadcast: (message: Omit<BroadcastMessage, 'id' | 'date'>) => void; // Admin action
    notifications: string[]; // Transient alerts
    upcomingToday: Event[];
    checkConflict: (date: string, startTime: string, endTime: string, venue: string) => boolean;
    updateEvent: (id: number, updates: Partial<Event>) => void;
    removeEvent: (id: number, reason: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// --- DATABASE EXPLANATION ---
// In this project, we are using the browser's "LocalStorage" as our Database.
// 1. Persistence: Data stored here survives page reloads and browser restarts.
// 2. Simulation: effectively acts like a NoSQL database (JSON document store).
// 3. Limitations: It is client-side only (stored on THIS computer). In a real production app, 
//    we would replace these calls with API requests to a backend server (e.g., Firebase, SQL).
// Initial constants removed


export function DataProvider({ children }: { children: ReactNode }) {
    // --- DATABASE CONNECTIONS (Backend API) ---
    const [events, setEvents] = useState<Event[]>([]);
    const [approvals, setApprovals] = useState<Approval[]>([]);
    const [venues, setVenues] = useState<Venue[]>([]);
    const [broadcasts, setBroadcasts] = useState<BroadcastMessage[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch Initial Data from Backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/data');
                if (res.ok) {
                    const data = await res.json();
                    setEvents(data.events || []);
                    setApprovals(data.approvals || []);
                    setVenues(data.venues || []);
                    // broadcasts might not be in the main data endpoint depending on server implementation
                    // but for now we initialize empty or could add to server
                }
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const upcomingToday = events.filter(event => {
        const today = new Date();
        const eventDate = new Date(event.date);
        return eventDate.toDateString() === today.toDateString();
    });

    const addApproval = async (approvalData: Omit<Approval, 'id' | 'status'>) => {
        try {
            const res = await fetch('/api/approvals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(approvalData)
            });
            if (res.ok) {
                const newApproval = await res.json();
                setApprovals(prev => [...prev, newApproval]);
                setNotifications(prev => [`Event proposal submitted: ${newApproval.event}`, ...prev]);
            }
        } catch (error) {
            console.error("Error adding approval:", error);
        }
    };

    const [notifications, setNotifications] = useState<string[]>([]);

    // Check for reminder notifications
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const fourHoursLater = new Date(now.getTime() + 4 * 60 * 60 * 1000);

            events.forEach(event => {
                const [year, month, day] = event.date.split('-').map(Number);
                const [hours, minutes] = event.startTime.split(':').map(Number);

                if (!year || !month || !day || hours === undefined) return;

                const eventDate = new Date(year, month - 1, day, hours, minutes);

                if (eventDate > now && eventDate <= fourHoursLater) {
                    const msg = `Reminder: ${event.title} is starting soon at ${event.startTime}`;
                    setNotifications(prev => {
                        if (!prev.includes(msg)) return [msg, ...prev];
                        return prev;
                    });
                }
            });
        }, 60000);
        return () => clearInterval(interval);
    }, [events]);

    const addVenue = async (venue: Venue) => {
        try {
            // Check locally first to avoid unnecessary call? Or let server handle dupes.
            // Server doesn't check dupes in my implementation, just pushes.
            // I'll keep local check or move it to server.
            // Let's keep it simple: call API.
            const res = await fetch('/api/venues', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(venue)
            });
            if (res.ok) {
                const newVenue = await res.json();
                setVenues(prev => [...prev, newVenue]);
                setNotifications(prev => [`New venue ${venue.name} added!`, ...prev]);
            }
        } catch (error) {
            console.error("Error adding venue:", error);
        }
    };

    const updateVenue = async (oldName: string, newName: string, newCapacity: number) => {
        try {
            const res = await fetch(`/api/venues/${encodeURIComponent(oldName)}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newName, capacity: newCapacity })
            });
            if (res.ok) {
                setVenues(prev => prev.map(v =>
                    v.name === oldName ? { name: newName, capacity: newCapacity } : v
                ));
                setNotifications(prev => [`Venue updated.`, ...prev]);
            }
        } catch (error) {
            console.error("Error updating venue:", error);
        }
    };

    const removeVenue = async (venueName: string) => {
        try {
            const res = await fetch(`/api/venues/${encodeURIComponent(venueName)}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                setVenues(prev => prev.filter(v => v.name !== venueName));
                setNotifications(prev => [`Venue removed.`, ...prev]);
            }
        } catch (error) {
            console.error("Error removing venue:", error);
        }
    };

    // Broadcast (Admin Notification)
    const sendBroadcast = (msg: Omit<BroadcastMessage, 'id' | 'date'>) => {
        const newBroadcast: BroadcastMessage = {
            ...msg,
            id: Date.now(),
            date: new Date().toISOString()
        };
        setBroadcasts(prev => [newBroadcast, ...prev]);
        // Also show immediate alert
        setNotifications(prev => [`New Announcement: ${msg.title}`, ...prev]);
    };

    const checkConflict = (date: string, startTime: string, endTime: string, venue: string) => {
        return events.some(e => {
            if (e.date !== date || e.location !== venue) return false;
            return (startTime < e.endTime) && (endTime > e.startTime);
        });
    };

    // --- Event Approval Logic ---
    // This function is called by the Admin from the ApprovalPanel.
    // It handles legitimate event creation and status updates.
    const approveEvent = async (id: number, approverName: string, notes?: string) => {
        try {
            const res = await fetch(`/api/approvals/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'approved', approvedBy: approverName, adminNotes: notes })
            });

            if (res.ok) {
                // Refresh all data because approval creates a public event too
                const dataRes = await fetch('/api/data');
                const data = await dataRes.json();
                setEvents(data.events || []);
                setApprovals(data.approvals || []);

                // Notify
                setNotifications(prev => [`Event approved.`, ...prev]);
            }
        } catch (error) {
            console.error("Error approving event:", error);
        }
    };

    // --- Event Rejection Logic ---
    // Called when Admin rejects a request.
    const rejectEvent = async (id: number, notes?: string) => {
        try {
            const res = await fetch(`/api/approvals/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'rejected', adminNotes: notes })
            });
            if (res.ok) {
                const { approval } = await res.json();
                setApprovals(prev => prev.map(a => a.id === id ? approval : a));
                setNotifications(prev => [`Event rejected.`, ...prev]);
            }
        } catch (error) {
            console.error("Error rejecting event:", error);
        }
    };

    const updateEvent = (id: number, updates: Partial<Event>) => {
        setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
    };

    const removeEvent = async (id: number, reason: string) => {
        try {
            const res = await fetch(`/api/approvals/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'removed', adminNotes: reason })
            });

            if (res.ok) {
                // Refresh data to reflect removal in both lists
                const dataRes = await fetch('/api/data');
                const data = await dataRes.json();
                setEvents(data.events || []);
                setApprovals(data.approvals || []);

                setNotifications(prev => [`Event removed by Admin.`, ...prev]);
            }
        } catch (error) {
            console.error("Error removing event:", error);
        }
    };

    return (
        <DataContext.Provider value={{
            events,
            approvals,
            venues,
            broadcasts,
            addApproval,
            approveEvent,
            rejectEvent,
            addVenue,
            updateVenue,
            removeVenue,
            sendBroadcast,
            upcomingToday,
            checkConflict,
            notifications,
            updateEvent,
            removeEvent
        }}>
            {children}
        </DataContext.Provider>
    );
}

export function useData() {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
}

