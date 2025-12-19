import React from 'react';
import { Clock } from 'lucide-react';
import { motion } from 'framer-motion';
const events = [{
  title: 'AI verse',
  time: '10:00 AM',
  type: 'Internal'
}, {
  title: 'Design Review: Q4',
  time: '1:30 PM',
  type: 'Review'
}, {
  title: 'Tech meetup',
  time: '3:00 PM',
  type: 'External'
}];
export function UpcomingEvents() {
  return <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-[#1e3a8a]">Upcoming Today</h3>
        <button className="text-xs font-medium text-orange-500 hover:text-orange-600 transition-colors">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {events.map((event, index) => <motion.div key={index} initial={{
        opacity: 0,
        x: 20
      }} animate={{
        opacity: 1,
        x: 0
      }} transition={{
        delay: 0.5 + index * 0.1
      }} className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
            <div className="flex flex-col items-center gap-1 min-w-[60px] pt-1">
              <span className="text-xs font-medium text-gray-500">
                {event.time.split(' ')[0]}
              </span>
              <span className="text-[10px] font-bold text-[#1e3a8a] uppercase">
                {event.time.split(' ')[1]}
              </span>
            </div>

            <div className="flex-1 relative pl-4 border-l-2 border-gray-100 group-hover:border-orange-500 transition-colors">
              <h4 className="text-sm font-medium text-gray-900 group-hover:text-[#1e3a8a] transition-colors">
                {event.title}
              </h4>
              <span className="text-xs text-gray-500 inline-flex items-center gap-1 mt-1">
                <Clock className="w-3 h-3" />
                {event.type}
              </span>
            </div>
          </motion.div>)}
      </div>

      <button className="w-full mt-6 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[#1e3a8a] hover:border-[#1e3a8a]/30 transition-all">
        Add to Calendar
      </button>
    </div>;
}