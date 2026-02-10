import { useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';

export function UpcomingEvents() {
  const { upcomingToday } = useData();
  const navigate = useNavigate();

  return <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-bold text-[#1e3a8a]">Upcoming Today</h3>
      <button onClick={() => navigate('/calendar')} className="text-xs font-medium text-orange-500 hover:text-orange-600 transition-colors">
        View All
      </button>
    </div>

    <div className="space-y-4">
      {upcomingToday.length > 0 ? (
        upcomingToday.map((event, index) => <motion.div key={event.id} initial={{
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
              {event.startTime}
            </span>
            <span className="text-[10px] font-bold text-[#1e3a8a] uppercase">
              {parseInt(event.startTime.split(':')[0]) >= 12 ? 'PM' : 'AM'}
            </span>
          </div>

          <div className="flex-1 relative pl-4 border-l-2 border-gray-100 group-hover:border-orange-500 transition-colors">
            <h4 className="text-sm font-medium text-gray-900 group-hover:text-[#1e3a8a] transition-colors">
              {event.title}
            </h4>
            <span className="text-xs text-gray-500 inline-flex items-center gap-1 mt-1">
              <Clock className="w-3 h-3" />
              {event.category}
            </span>
          </div>
        </motion.div>)
      ) : (
        <p className="text-sm text-gray-500 text-center py-4">No events scheduled for today.</p>
      )}
    </div>

    <button onClick={() => navigate('/calendar')} className="w-full mt-6 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[#1e3a8a] hover:border-[#1e3a8a]/30 transition-all">
      Add to Calendar
    </button>
  </div>;
}