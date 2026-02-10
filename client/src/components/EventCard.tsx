import React from 'react';
import { Calendar, MapPin, Users, MoreHorizontal, Bookmark } from 'lucide-react';
import { motion } from 'framer-motion';
interface EventCardProps {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  category: string;
  status: 'Live' | 'Upcoming' | 'Ended' | 'Removed'; // Updated
  imageGradient: string;
  delay?: number;
  posterUrl?: string;
  onClick?: () => void;
  onToggleSave?: (e: React.MouseEvent) => void;
  isSaved?: boolean;
}

export function EventCard({
  title,
  date,
  startTime,
  endTime,
  location,
  category,
  status,
  imageGradient,
  delay = 0,
  posterUrl,
  onClick,
  onToggleSave,
  isSaved
}: EventCardProps) {
  return <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4, delay }}
    whileHover={{ scale: 1.01, y: -2 }}
    onClick={onClick}
    className="group relative flex flex-col rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
  >
    {/* Image Area */}
    <div className={`h-40 w-full bg-gradient-to-br ${imageGradient} relative`}>
      {posterUrl && (
        <img src={posterUrl} alt={title} className="absolute inset-0 w-full h-full object-cover" />
      )}
      <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300" />

      {/* Top Actions */}
      <div className="absolute top-4 right-4 flex gap-2">
        {onToggleSave && (
          <button
            onClick={(e) => {
              e.stopPropagation(); // Stop click from triggering card opens
              if (onToggleSave) onToggleSave(e);
            }}
            className={`p-2 rounded-full backdrop-blur-md transition-colors shadow-sm ${isSaved ? 'bg-orange-500 text-white' : 'bg-white/30 text-white hover:bg-white/50'}`}
            title={isSaved ? "Unsave Event" : "Save Event"}
          >
            <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        )}
        <button className="p-2 rounded-full bg-white/30 backdrop-blur-md text-white hover:bg-white/50 transition-colors shadow-sm">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>
      <div className="absolute top-4 left-4">
        <span className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md border border-white/20 shadow-sm ${status === 'Live' ? 'bg-red-500 text-white animate-pulse' :
          status === 'Removed' ? 'bg-gray-800 text-white' :
            status === 'Upcoming' ? 'bg-blue-500 text-white' : 'bg-gray-500 text-white'
          }`}>
          {status === 'Live' ? '● LIVE' : status === 'Removed' ? 'REMOVED' : status}
        </span>
      </div>
    </div>

    {/* Content */}
    <div className="p-5 flex-1 flex flex-col">
      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#1e3a8a] transition-colors">
        {title}
      </h3>

      <div className="space-y-3 mt-auto">
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <Calendar className="w-4 h-4 text-[#0891b2]" />
          <span>{date} • {startTime} - {endTime}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <MapPin className="w-4 h-4 text-orange-500" />
          <span>{location}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <Users className="w-4 h-4 text-[#1e3a8a]" />
          <span>{category}</span>
        </div>
      </div>

      {/* Action Area */}
      <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
        <div className="flex -space-x-2">
          {[1, 2, 3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200" />)}
          <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] text-gray-600 font-medium">
            +42
          </div>
        </div>
      </div>
    </div>
  </motion.div>;
}