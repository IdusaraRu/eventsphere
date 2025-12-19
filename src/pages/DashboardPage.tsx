import React from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, Users, DollarSign } from 'lucide-react';
import { StatsCard } from '../components/StatsCard';
import { EventCard } from '../components/EventCard';
import { UpcomingEvents } from '../components/UpcomingEvents';
import { QuickActions } from '../components/QuickActions';
export function DashboardPage() {
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
            Dashboard Overview
          </h1>
          <p className="text-gray-500">
            Welcome back, here's what's happening on campus today.
          </p>
        </motion.div>

        <div className="flex items-center gap-4">
          <div className="relative hidden md:block group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#1e3a8a] transition-colors" />
            <input type="text" placeholder="Search events..." className="bg-white border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] w-64 transition-all shadow-sm" />
          </div>
          <QuickActions />
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard title="Total Events" value="1,284" trend="+12.5%" trendUp={true} icon={Calendar} color="blue" delay={0.1} />
        <StatsCard title="Active Attendees" value="45.2k" trend="+8.2%" trendUp={true} icon={Users} color="green" delay={0.2} />
        <StatsCard title="Pending Approvals" value="24" trend="-2.4%" trendUp={false} icon={DollarSign} color="orange" delay={0.3} />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Active Events */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-[#1e3a8a]">
              Featured Campus Events
            </h2>
            <div className="flex gap-2">
              <button className="px-3 py-1 rounded-lg text-xs font-medium bg-[#1e3a8a] text-white shadow-sm">
                All
              </button>
              <button className="px-3 py-1 rounded-lg text-xs font-medium text-gray-500 hover:text-[#1e3a8a] hover:bg-white transition-colors">
                Academic
              </button>
              <button className="px-3 py-1 rounded-lg text-xs font-medium text-gray-500 hover:text-[#1e3a8a] hover:bg-white transition-colors">
                Cultural
              </button>
              <button className="px-3 py-1 rounded-lg text-xs font-medium text-gray-500 hover:text-[#1e3a8a] hover:bg-white transition-colors">
                Sports
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <EventCard title="Tech Innovation Summit 2024" date="Oct 24 - 26, 2024" location="Main Auditorium" attendees={2450} status="Live" imageGradient="from-blue-600 to-indigo-600" delay={0.4} />
            <EventCard title="Annual Cultural Fest" date="Nov 12 - 14, 2024" location="University Grounds" attendees={1800} status="Upcoming" imageGradient="from-emerald-500 to-teal-600" delay={0.5} />
            <EventCard title="Inter-University Debate" date="Dec 05, 2024" location="Lecture Hall A" attendees={520} status="Upcoming" imageGradient="from-violet-600 to-fuchsia-600" delay={0.6} />
            <EventCard title="Sports Championship" date="Jan 15 - 18, 2025" location="Sports Complex" attendees={3100} status="Upcoming" imageGradient="from-orange-500 to-red-500" delay={0.7} />
          </div>
        </div>

        {/* Right Column: Sidebar Widgets */}
        <div className="space-y-8">
          <UpcomingEvents />

          {/* Activity Feed Widget */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.8
        }} className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-[#1e3a8a] mb-4">
              Recent Activity
            </h3>
            <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
              {[{
              text: 'New registration for Tech Summit',
              time: '2m ago',
              color: 'bg-blue-500'
            }, {
              text: 'Venue booking approved: Hall B',
              time: '1h ago',
              color: 'bg-green-500'
            }, {
              text: 'New event proposal pending',
              time: '3h ago',
              color: 'bg-orange-500'
            }].map((item, i) => <div key={i} className="relative pl-8">
                  <div className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-white shadow-sm ${item.color}`} />
                  <p className="text-sm text-gray-700 font-medium">
                    {item.text}
                  </p>
                  <span className="text-xs text-gray-400">{item.time}</span>
                </div>)}
            </div>
          </motion.div>
        </div>
      </div>
    </div>;
}