import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Clock, MapPin, Calendar as CalendarIcon, Tag } from 'lucide-react';
import { useData } from '../context/DataContext';

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function CalendarPage() {
  const { events } = useData();
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
          // Filter events for this specific day
          // NOTE: e.date in our data is a string like "2023-10-15" (ideal) or based on previous logic "YYYY-MM-DD".
          // In CreateEventPage, input type='date' produces YYYY-MM-DD.
          // So we need to match e.date with formatted date.

          const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

          const dayEvents = events.filter(e => e.date === formattedDate);

          return <div key={day} className="border-b border-r border-gray-100 p-2 hover:bg-gray-50 transition-colors relative group">
            <span className={`text-sm font-medium ${day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear() ? 'bg-[#1e3a8a] text-white w-7 h-7 flex items-center justify-center rounded-full' : 'text-gray-700'}`}>
              {day}
            </span>
            <div className="mt-2 space-y-1 overflow-y-auto max-h-[80px]">
              {dayEvents.map(event => <button key={event.id} onClick={() => setSelectedEvent(event)} className={`w-full text-left px-2 py-1 rounded text-xs font-medium truncate border bg-blue-100 text-blue-700 border-blue-200 hover:opacity-80 transition-opacity`}>
                {event.title}
              </button>)}
            </div>
          </div>;
        })}
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
              <span className={`inline-block px-2 py-1 rounded text-xs font-bold uppercase mb-2 bg-blue-100 text-blue-700`}>
                {selectedEvent.category}
              </span>
              <h3 className="text-xl font-bold text-gray-900">
                {selectedEvent.title}
              </h3>
            </div>
            <button onClick={() => setSelectedEvent(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Event Poster if available */}
          {selectedEvent.posterUrl && (
            <div className="w-full h-48 bg-gray-100">
              <img
                src={selectedEvent.posterUrl}
                alt={selectedEvent.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3 text-gray-600">
              <CalendarIcon className="w-5 h-5 text-[#1e3a8a]" />
              <span>
                {selectedEvent.date}
              </span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Clock className="w-5 h-5 text-[#1e3a8a]" />
              <span>{selectedEvent.startTime} - {selectedEvent.endTime}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <MapPin className="w-5 h-5 text-[#1e3a8a]" />
              <span>{selectedEvent.location}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Tag className="w-5 h-5 text-[#1e3a8a]" />
              <span>{selectedEvent.category}</span>
            </div>
            <p className="text-gray-600 mt-4 pt-4 border-t border-gray-100">
              {selectedEvent.description}
            </p>
            {selectedEvent.organizer && (
              <div className="text-sm text-gray-500 pt-2">
                Organizer: {selectedEvent.organizer} ({selectedEvent.organizerPhone})
              </div>
            )}
          </div>
          <div className="p-6 bg-gray-50 flex gap-3">
            <button onClick={() => setSelectedEvent(null)} className="flex-1 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
              Close
            </button>
          </div>
        </motion.div>
      </div>}
    </AnimatePresence>
  </div>;
}