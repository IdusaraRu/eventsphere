import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Color: Defines user roles for access control and UI differentiation (Admin=Blue/Red, Faculty=Green, Student=Orange)
type UserRole = 'student' | 'faculty' | 'admin';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    occupation?: string;
    department?: string;
    status: 'pending' | 'approved' | 'rejected';
    lastLogin?: string;
    savedEventIds?: number[];
}

interface AuthContextType {
    user: User | null;
    pendingUsers: User[];
    allUsers: User[];
    loading: boolean;
    login: (email: string) => Promise<{ success: boolean; message: string }>;
    logout: () => void;
    register: (name: string, email: string, role: UserRole, occupation?: string, department?: string) => Promise<{ success: boolean; message: string }>;
    approveUser: (id: string) => Promise<void>;
    rejectUser: (id: string) => Promise<void>;
    removeUser: (id: string) => Promise<void>;
    toggleSavedEvent: (eventId: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    // Current logged-in user (Session)
    const [user, setUser] = useState<User | null>(() => {
        const saved = localStorage.getItem('eventsphere_currentUser');
        return saved ? JSON.parse(saved) : null;
    });

    // All registered users (Admin view)
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch all users on mount (Admin feature)
    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/users');
            if (res.ok) {
                const data = await res.json();
                setAllUsers(data);
            }
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Session persistence
    useEffect(() => {
        if (user) {
            localStorage.setItem('eventsphere_currentUser', JSON.stringify(user));
        } else {
            localStorage.removeItem('eventsphere_currentUser');
        }
    }, [user]);

    const pendingUsers = allUsers.filter(u => u.status === 'pending');

    const login = async (email: string) => {
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();

            if (res.ok && data.success) {
                // Color: Login success triggers dashboard view (Blue theme)
                setUser(data.user);
                // Also refresh user list in case lastLogin updated
                fetchUsers();
                return { success: true, message: 'Login successful' };
            } else {
                return { success: false, message: data.message || 'Login failed' };
            }
        } catch (error) {
            return { success: false, message: 'Network error during login' };
        }
    };

    const logout = () => {
        setUser(null);
    };

    const register = async (name: string, email: string, role: UserRole, occupation?: string, department?: string) => {
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, role, occupation, department })
            });
            const data = await res.json();

            if (res.ok && data.success) {
                // Refresh list so admin sees new pending user immediately
                fetchUsers();
                return { success: true, message: data.message };
            } else {
                return { success: false, message: data.message || 'Registration failed' };
            }
        } catch (error) {
            return { success: false, message: 'Network error during registration' };
        }
    };

    // Admin Actions
    const approveUser = async (id: string) => {
        try {
            const res = await fetch(`/api/users/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'approved' })
            });
            if (res.ok) {
                // Update local list to reflect change immediately (Color: Green badge)
                setAllUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'approved' } : u));
            }
        } catch (e) { console.error(e); }
    };

    const rejectUser = async (id: string) => {
        try {
            const res = await fetch(`/api/users/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'rejected' })
            });
            if (res.ok) {
                // Update local list (Color: Red badge)
                setAllUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'rejected' } : u));
            }
        } catch (e) { console.error(e); }
    };

    const removeUser = async (id: string) => {
        try {
            const res = await fetch(`/api/users/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                setAllUsers(prev => prev.filter(u => u.id !== id));
            }
        } catch (e) { console.error(e); }
    };

    const toggleSavedEvent = (eventId: number) => {
        // This is still local-only as per current scope, unless we add API for it.
        // Keeping it local to user session for now or update user object.
        if (!user) return;

        // Logic to update user state locally
        const currentSaved = user.savedEventIds || [];
        const isSaved = currentSaved.includes(eventId);
        let newSaved;
        if (isSaved) {
            newSaved = currentSaved.filter(id => id !== eventId);
        } else {
            newSaved = [...currentSaved, eventId];
        }
        const updatedUser = { ...user, savedEventIds: newSaved };
        setUser(updatedUser);

        // Ideally send this to backend too (PUT /api/users/:id)
    };

    return (
        <AuthContext.Provider value={{
            user,
            pendingUsers,
            allUsers,
            loading,
            login,
            logout,
            register,
            approveUser,
            rejectUser,
            removeUser,
            toggleSavedEvent
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
