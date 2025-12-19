import React from 'react';
import { LayoutDashboard, Calendar, PlusCircle, MapPin, CheckSquare, Bell, User, LogOut, CalendarDays } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
const navItems = [{
  icon: LayoutDashboard,
  label: 'Dashboard',
  path: '/dashboard'
}, {
  icon: CalendarDays,
  label: 'Events',
  path: '/events' // Placeholder for events list if needed, or just keep as is
}, {
  icon: PlusCircle,
  label: 'Create Event',
  path: '/create-event'
}, {
  icon: MapPin,
  label: 'Venue Booking',
  path: '/venue-booking'
}, {
  icon: Calendar,
  label: 'Calendar',
  path: '/calendar'
}, {
  icon: CheckSquare,
  label: 'Approvals',
  path: '/approval'
}, {
  icon: Bell,
  label: 'Notifications',
  path: '/notifications'
}];
export function Sidebar() {
  const location = useLocation();
  return <motion.aside initial={{
    x: -20,
    opacity: 0
  }} animate={{
    x: 0,
    opacity: 1
  }} transition={{
    duration: 0.5
  }} className="fixed left-0 top-0 h-full w-64 bg-[#1e3a8a] text-white flex flex-col z-50 shadow-xl">
      {/* Logo Area */}
      <div className="p-8 flex items-center gap-3 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center shadow-lg">
          <div className="w-3 h-3 bg-white rounded-full" />
        </div>
        <span className="text-xl font-bold text-white tracking-tight">
          EventSphere
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map(item => {
        const isActive = location.pathname === item.path;
        return <Link key={item.label} to={item.path} className="block">
              <motion.div whileHover={{
            x: 4
          }} whileTap={{
            scale: 0.98
          }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive ? 'bg-white/10 text-white shadow-inner border border-white/10' : 'text-blue-200 hover:text-white hover:bg-white/5'}`}>
                <item.icon className={`w-5 h-5 ${isActive ? 'text-orange-400' : 'text-blue-300 group-hover:text-white'}`} />
                <span className="font-medium text-sm">{item.label}</span>
                {isActive && <motion.div layoutId="activeIndicator" className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-400 shadow-[0_0_8px_rgba(249,115,22,0.6)]" />}
              </motion.div>
            </Link>;
      })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-white/10 mx-4 mb-4">
        <Link to="/profile" className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-400 to-pink-500 p-[2px]">
            <div className="w-full h-full rounded-full bg-[#1e3a8a] flex items-center justify-center overflow-hidden">
              <span className="text-xs font-bold text-white">JD</span>
            </div>
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-white">Jane Doe</p>
            <p className="text-xs text-blue-300">Faculty Admin</p>
          </div>
          <LogOut className="w-4 h-4 text-blue-300 group-hover:text-white transition-colors" />
        </Link>
      </div>
    </motion.aside>;
}