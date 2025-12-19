import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { CalendarPage } from './pages/CalendarPage';
import { CreateEventPage } from './pages/CreateEventPage';
import { VenueBookingPage } from './pages/VenueBookingPage';
import { ApprovalPanelPage } from './pages/ApprovalPanelPage';
import { NotificationsPage } from './pages/NotificationsPage';
function Layout({
  children
}: {
  children: React.ReactNode;
}) {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login' || location.pathname === '/';
  if (isLoginPage) {
    return <>{children}</>;
  }
  return <div className="min-h-screen bg-[#f8fafc] text-gray-900 font-sans">
      <Sidebar />
      <main className="pl-64 relative z-10">
        <div className="max-w-7xl mx-auto p-8">{children}</div>
      </main>
    </div>;
}
export function App() {
  return <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/create-event" element={<CreateEventPage />} />
          <Route path="/venue-booking" element={<VenueBookingPage />} />
          <Route path="/approval" element={<ApprovalPanelPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
        </Routes>
      </Layout>
    </Router>;
}