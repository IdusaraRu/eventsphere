import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { CalendarPage } from './pages/CalendarPage';
import { CreateEventPage } from './pages/CreateEventPage';
import { VenueBookingPage } from './pages/VenueBookingPage';
import { ApprovalPanelPage } from './pages/ApprovalPanelPage';
import { ManagePage } from './pages/ManagePage';
import { ContactPage } from './pages/ContactPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { MyActivityPage } from './pages/MyActivityPage';
import { useAuth } from './context/AuthContext';
import { Navigate } from 'react-router-dom';

function Layout({
  children
}: {
  children: React.ReactNode;
}) {
  const location = useLocation();
  const { user } = useAuth();
  const isPublicPage = location.pathname === '/login' || location.pathname === '/' || location.pathname === '/register';

  if (isPublicPage) {
    if (user && location.pathname !== '/register') {
      // Optional: Redirect to dashboard if already logged in and visiting login page
      return <Navigate to="/dashboard" />;
    }
    return <>{children}</>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <div className="min-h-screen bg-[#f8fafc] text-gray-900 font-sans">
    <Sidebar />
    <main className="pl-64 relative z-10">
      <div className="max-w-7xl mx-auto p-8">{children}</div>
    </main>
  </div>;
}
import { AuthProvider } from './context/AuthContext';

import { DataProvider } from './context/DataContext';

import { RegisterPage } from './pages/RegisterPage';

export function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/create-event" element={<CreateEventPage />} />
              <Route path="/venue-booking" element={<VenueBookingPage />} />
              <Route path="/approval" element={<ApprovalPanelPage />} />
              <Route path="/users" element={<ApprovalPanelPage />} />

              <Route path="/manage" element={<ManagePage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/my-activity" element={<MyActivityPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Routes>
          </Layout>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}