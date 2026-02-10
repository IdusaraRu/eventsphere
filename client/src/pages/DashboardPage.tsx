import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Calendar, Users, Clock, Plus, MapPin, ArrowRight, UserPlus, Activity } from 'lucide-react';
import { StatsCard } from '../components/StatsCard';
import { EventCard } from '../components/EventCard';
import { UpcomingEvents } from '../components/UpcomingEvents';
import { EventModal } from '../components/EventModal'; // Import Modal

import { useData, Event } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

export function DashboardPage() {
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null); // Modal state

  // --- Data Access ---
  const { events: allEvents, approvals, venues } = useData();
  const { allUsers, user, pendingUsers, toggleSavedEvent } = useAuth(); // Get toggleSavedEvent

  const events = allEvents.filter(e => e.status !== 'Removed');

  // --- Role Check ---
  const isStudent = user?.role === 'student';
  const isAdmin = user?.role === 'admin';

  return <div className="space-y-8">
    {/* Header Section */}
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <motion.div initial={{
        opacity: 0,
        y: -20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5
      }}>
        <h1 className="text-3xl font-bold text-[#1e3a8a] mb-1">
          Dashboard
        </h1>
        <p className="text-gray-500">
          Welcome back, {user?.name || 'Guest'}.
        </p>
      </motion.div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#1e3a8a] transition-colors" />
          <input
            type="text"
            placeholder="Search events..."
            className="bg-white border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] w-64 transition-all shadow-sm"
          />
        </div>
      </div>
    </header>

    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard
        icon={Calendar}
        label="Total Events"
        value={events.length.toString()}
        trend=""
        color="blue"
      />
      <StatsCard
        icon={Users}
        label="Active Users"
        value={allUsers.filter(u => u.status === 'approved').length.toString()}
        trend=""
        color="green"
      />

      {/* Pending Event Approvals - Clickable for Admin/Staff */}
      {!isStudent && (
        <div
          onClick={() => {
            navigate('/approval');
          }}
          className="cursor-pointer transition-transform hover:scale-105"
        >
          <StatsCard
            icon={Clock}
            label="Pending Events"
            value={approvals.filter(a => a.status === 'pending').length.toString()}
            trend=""
            color="orange"
          />
        </div>
      )}

      {/* Pending User Approvals - Clickable for Admin Only */}
      {isAdmin && (
        <div
          onClick={() => {
            navigate('/manage', { state: { activeTab: 'requests' } });
          }}
          className="cursor-pointer transition-transform hover:scale-105"
        >
          <StatsCard
            icon={UserPlus}
            label="Pending Users"
            value={pendingUsers.length.toString()}
            trend=""
            color="purple"
          />
        </div>
      )}

      {!isAdmin && (
        <StatsCard
          icon={MapPin}
          label="Total Venues"
          value={venues.length.toString()}
          trend=""
          color="purple"
        />
      )}
    </div>

    <div className="grid grid-cols-3 gap-8">
      <div className="col-span-2 space-y-8">
        {/* Featured Event - Show only if events exist */}
        {events.length > 0 && events[0] && (
          <div
            onClick={() => setSelectedEvent(events[0])} // Open modal on click
            className="relative h-64 rounded-2xl overflow-hidden group cursor-pointer"
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${events[0].imageGradient || 'from-blue-600 to-indigo-600'}`} />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

            {/* Poster Background (optional override or blend) */}
            {events[0].posterUrl && (
              <img src={events[0].posterUrl} alt="Feature" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-75 transition-opacity" />
            )}

            <div className="absolute bottom-0 left-0 p-8 text-white relative z-10">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold mb-3 inline-block">
                Featured Event
              </span>
              <h2 className="text-3xl font-bold mb-2">{events[0].title}</h2>
              <div className="flex items-center gap-4 text-sm opacity-90">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {events[0].date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {events[0].startTime} - {events[0].endTime}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {events[0].location}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* No events placeholder */}
        {events.length === 0 && (
          <div className="h-64 rounded-2xl bg-white border border-gray-100 flex flex-col items-center justify-center text-gray-400">
            <Calendar className="w-12 h-12 mb-2 opacity-20" />
            <p>No events scheduled yet</p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#1e3a8a]">Upcoming Events</h2>
          <button
            onClick={() => navigate('/calendar')}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            View All <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {events.slice(0, 4).map(event => (
            <EventCard
              key={event.id}
              {...event}
              onClick={() => setSelectedEvent(event)} // Open modal
              onToggleSave={(e) => {
                e.stopPropagation(); // Don't open modal when clicking save
                toggleSavedEvent(event.id);
              }}
              isSaved={user?.savedEventIds?.includes(event.id)}
            />
          ))}
          {events.length === 0 && (
            <div className="col-span-2 py-12 text-center text-gray-500 bg-white rounded-xl border border-gray-100">
              No upcoming events found
            </div>
          )}
        </div>
      </div>

      <div className="space-y-8">
        <UpcomingEvents />

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-[#1e3a8a] mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/my-activity')}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-[#1e3a8a] text-gray-600 hover:text-white transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center group-hover:bg-white/20 group-hover:text-white">
                <Activity className="w-4 h-4" />
              </div>
              <span className="font-medium">My Activity</span>
            </button>
            <button
              onClick={() => navigate('/create-event')}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-[#1e3a8a] text-gray-600 hover:text-white transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center group-hover:bg-white/20 group-hover:text-white">
                <Plus className="w-4 h-4" />
              </div>
              <span className="font-medium">Create Event</span>
            </button>
            <button
              onClick={() => navigate('/venue-booking')}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-[#1e3a8a] text-gray-600 hover:text-white transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-white/20 group-hover:text-white">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="font-medium">Book Venue</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    {/* Event Details Modal */}
    <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
  </div>;
}