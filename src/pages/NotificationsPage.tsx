import React from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCircle, AlertTriangle, Info, Clock } from 'lucide-react';
const notifications = [{
  id: 1,
  title: 'Event Approved',
  description: 'Your request for "Tech Summit" has been approved.',
  time: '2 hours ago',
  type: 'success'
}, {
  id: 2,
  title: 'Venue Maintenance',
  description: 'Sports Complex will be closed for maintenance on Oct 30.',
  time: '5 hours ago',
  type: 'warning'
}, {
  id: 3,
  title: 'New Registration',
  description: 'John Doe registered for "Cultural Fest".',
  time: '1 day ago',
  type: 'info'
}, {
  id: 4,
  title: 'Reminder',
  description: 'Submit budget report for "Annual Meet" by tomorrow.',
  time: '1 day ago',
  type: 'info'
}, {
  id: 5,
  title: 'Event Rejected',
  description: 'Request for "Late Night Party" was rejected.',
  time: '2 days ago',
  type: 'error'
}];
const iconMap = {
  success: {
    icon: CheckCircle,
    color: 'text-green-500',
    bg: 'bg-green-100'
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-orange-500',
    bg: 'bg-orange-100'
  },
  info: {
    icon: Info,
    color: 'text-blue-500',
    bg: 'bg-blue-100'
  },
  error: {
    icon: AlertTriangle,
    color: 'text-red-500',
    bg: 'bg-red-100'
  }
};
export function NotificationsPage() {
  return <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#1e3a8a]">Notifications</h1>
        <p className="text-gray-500">
          Stay updated with latest alerts and activities.
        </p>
      </div>

      <div className="space-y-4">
        {notifications.map((item, index) => {
        const Style = iconMap[item.type as keyof typeof iconMap];
        const Icon = Style.icon;
        return <motion.div key={item.id} initial={{
          opacity: 0,
          x: -20
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          delay: index * 0.1
        }} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex gap-4 hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 rounded-xl ${Style.bg} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-6 h-6 ${Style.color}`} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-gray-900">{item.title}</h3>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.time}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mt-1">{item.description}</p>
              </div>
            </motion.div>;
      })}
      </div>
    </div>;
}