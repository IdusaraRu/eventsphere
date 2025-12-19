import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Clock, MapPin, Calendar as CalendarIcon } from 'lucide-react';
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
// Mock data for calendar events
const calendarEvents = [{
  id: 1,
  title: 'Computer Science Seminar',
  date: 5,
  type: 'academic',
  time: '10:00 AM',
  venue: 'Hall A',
  description: 'Annual seminar on AI advancements.'
}, {
  id: 2,
  title: 'Basketball Finals',
  date: 12,
  type: 'sports',
  time: '2:00 PM',
  venue: 'Sports Complex',
  description: 'Inter-department finals.'
}, {
  id: 3,
  title: 'Art Exhibition',
  date: 15,
  type: 'cultural',
  time: '11:00 AM',
  venue: 'Main Lobby',
  description: 'Student art showcase.'
}, {
  id: 4,
  title: 'Faculty Meeting',
  date: 20,
  type: 'academic',
  time: '9:00 AM',
  venue: 'Conference Room',
  description: 'Monthly staff meeting.'
}, {
  id: 5,
  title: 'Music Concert',
  date: 25,
  type: 'cultural',
  time: '6:00 PM',
  venue: 'Auditorium',
  description: 'Spring concert series.'
}];
const typeColors = {
  academic: 'bg-blue-100 text-blue-700 border-blue-200',
  cultural: 'bg-green-100 text-green-700 border-green-200',
  sports: 'bg-orange-100 text-orange-700 border-orange-200'
};
export function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  return <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1e3a8a]">Event Calendar</h1>
          <p className="text-gray-500">Manage and view all campus events</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={goToToday} className="px-4 py-2 text-sm font-medium text-[#1e3a8a] bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            Today
          </button>
          <div className="flex items-center bg-white rounded-lg border border-gray-200 shadow-sm">
            <button onClick={prevMonth} className="p-2 hover:bg-gray-50 rounded-l-lg transition-colors">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <span className="px-4 py-2 font-semibold text-gray-900 min-w-[140px] text-center">
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <button onClick={nextMonth} className="p-2 hover:bg-gray-50 rounded-r-lg transition-colors">
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
          {days.map(day => <div key={day} className="py-3 text-center text-sm font-semibold text-gray-500">
              {day}
            </div>)}
        </div>
        <div className="grid grid-cols-7 auto-rows-[120px]">
          {Array.from({
          length: firstDayOfMonth
        }).map((_, i) => <div key={`empty-${i}`} className="border-b border-r border-gray-100 bg-gray-50/30" />)}
          {Array.from({
          length: daysInMonth
        }).map((_, i) => {
          const day = i + 1;
          const dayEvents = calendarEvents.filter(e => e.date === day);
          return <div key={day} className="border-b border-r border-gray-100 p-2 hover:bg-gray-50 transition-colors relative group">
                <span className={`text-sm font-medium ${day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() ? 'bg-[#1e3a8a] text-white w-7 h-7 flex items-center justify-center rounded-full' : 'text-gray-700'}`}>
                  {day}
                </span>
                <div className="mt-2 space-y-1">
                  {dayEvents.map(event => <button key={event.id} onClick={() => setSelectedEvent(event)} className={`w-full text-left px-2 py-1 rounded text-xs font-medium truncate border ${typeColors[event.type as keyof typeof typeColors]} hover:opacity-80 transition-opacity`}>
                      {event.title}
                    </button>)}
                </div>
              </div>;
        })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-6 items-center justify-center text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-gray-600">Academic</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-gray-600">Cultural</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500" />
          <span className="text-gray-600">Sports</span>
        </div>
      </div>

      {/* Event Details Modal */}
      <AnimatePresence>
        {selectedEvent && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{
          opacity: 0,
          scale: 0.95
        }} animate={{
          opacity: 1,
          scale: 1
        }} exit={{
          opacity: 0,
          scale: 0.95
        }} className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-start">
                <div>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-bold uppercase mb-2 ${typeColors[selectedEvent.type as keyof typeof typeColors]}`}>
                    {selectedEvent.type}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedEvent.title}
                  </h3>
                </div>
                <button onClick={() => setSelectedEvent(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <CalendarIcon className="w-5 h-5 text-[#1e3a8a]" />
                  <span>
                    {months[currentDate.getMonth()]} {selectedEvent.date},{' '}
                    {currentDate.getFullYear()}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Clock className="w-5 h-5 text-[#1e3a8a]" />
                  <span>{selectedEvent.time}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin className="w-5 h-5 text-[#1e3a8a]" />
                  <span>{selectedEvent.venue}</span>
                </div>
                <p className="text-gray-600 mt-4 pt-4 border-t border-gray-100">
                  {selectedEvent.description}
                </p>
              </div>
              <div className="p-6 bg-gray-50 flex gap-3">
                <button className="flex-1 py-2.5 bg-[#1e3a8a] text-white rounded-xl font-medium hover:bg-blue-900 transition-colors">
                  Edit Event
                </button>
                <button onClick={() => setSelectedEvent(null)} className="flex-1 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                  Close
                </button>
              </div>
            </motion.div>
          </div>}
      </AnimatePresence>
    </div>;
}