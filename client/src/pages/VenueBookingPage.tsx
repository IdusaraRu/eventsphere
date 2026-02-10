import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, CheckCircle, XCircle, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

export function VenueBookingPage() {
  const navigate = useNavigate();
  const { venues, events } = useData();
  const [filterDate, setFilterDate] = useState('');
  const [filterCapacity, setFilterCapacity] = useState('Any Capacity');

  const filteredVenues = venues.filter(venue => {
    if (filterCapacity === 'Any Capacity') return true;
    if (filterCapacity === '50-100') return venue.capacity >= 50 && venue.capacity <= 100;
    if (filterCapacity === '100-500') return venue.capacity > 100 && venue.capacity <= 500;
    if (filterCapacity === '500+') return venue.capacity > 500;
    return true;
  });

  const handleBookVenue = (venueName: string) => {
    navigate('/create-event', { state: { venue: venueName } });
  };

  const getVenueStatus = (venueName: string) => {
    // If a date is selected, check if there are ANY bookings for this venue on that date
    // This is a simple check; for real implementation we'd check time slots
    if (!filterDate) return 'available';

    const isBooked = events.some(e => e.location === venueName && e.date === filterDate && e.status !== 'Removed');
    return isBooked ? 'booked' : 'available';
  };

  return <div className="space-y-8">
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h1 className="text-3xl font-bold text-[#1e3a8a]">Venue Booking</h1>
        <p className="text-gray-500">
          Find and book available spaces for your events.
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 px-3 border-r border-gray-200">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-600">Filters</span>
        </div>
        <div className="relative">
          <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} className="pl-2 pr-2 py-1 text-sm border-none focus:ring-0 text-gray-600" />
        </div>
        <select
          value={filterCapacity}
          onChange={(e) => setFilterCapacity(e.target.value)}
          className="text-sm border-none focus:ring-0 text-gray-600 bg-transparent outline-none"
        >
          <option>Any Capacity</option>
          <option>50-100</option>
          <option>100-500</option>
          <option>500+</option>
        </select>
      </div>
    </div>

    {/* Venues Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredVenues.map((venue, index) => {
        const status = getVenueStatus(venue.name);
        // Mocking images based on index or name for variety
        const imageGradient = index % 2 === 0 ? 'bg-gradient-to-br from-blue-500 to-indigo-600' : 'bg-gradient-to-br from-purple-500 to-pink-500';

        return (
          <motion.div key={venue.name} initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: index * 0.1
          }} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden group hover:shadow-lg transition-all">
            <div className={`h-48 w-full ${imageGradient} relative`}>
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md border border-white/20 shadow-sm flex items-center gap-1 ${status === 'available' ? 'bg-green-500/90 text-white' : 'bg-gray-500/90 text-white'}`}>
                  {status === 'available' ? <>
                    <CheckCircle className="w-3 h-3" /> Available
                  </> : <>
                    <XCircle className="w-3 h-3" /> Booked
                  </>}
                </span>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {venue.name}
              </h3>

              <div className="flex items-center gap-2 text-gray-500 text-sm mb-6">
                <Users className="w-4 h-4 text-[#1e3a8a]" />
                <span>Capacity: {venue.capacity} people</span>
              </div>

              <button
                onClick={() => handleBookVenue(venue.name)}
                // Simply warn/disable if booked on that date? Or allow booking another slot? 
                // User said "if only the time ranges... are crashing". 
                // Since we can't select time here easily, let's allow clicking "Book Venue" always, 
                // and let Create Page handle conflict. So no disabled state here really, or maybe just warn.
                // But for UI feedback, if 'booked' (fully booked?), maybe grey out? 
                // Actually, getting precise 'booked' status for a WHOLE day is hard without times.
                // I will leave it enabled effectively, or just visual.
                disabled={false}
                className={`w-full py-2.5 rounded-xl font-medium transition-all bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/25`}
              >
                Book Venue
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  </div>;
}