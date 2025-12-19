import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, CheckCircle, XCircle, Filter } from 'lucide-react';
const venues = [{
  id: 1,
  name: 'TLH 1',
  capacity: 1000,
  status: 'available',
  image: 'bg-gradient-to-br from-blue-500 to-indigo-600'
}, {
  id: 2,
  name: 'TLH2',
  capacity: 200,
  status: 'booked',
  image: 'bg-gradient-to-br from-emerald-500 to-teal-600'
}, {
  id: 3,
  name: 'Indoor',
  capacity: 500,
  status: 'available',
  image: 'bg-gradient-to-br from-orange-500 to-red-500'
}, {
  id: 4,
  name: 'TCL 1',
  capacity: 50,
  status: 'available',
  image: 'bg-gradient-to-br from-purple-500 to-pink-500'
}, {
  id: 5,
  name: 'Kuppi gaha',
  capacity: 800,
  status: 'booked',
  image: 'bg-gradient-to-br from-cyan-500 to-blue-500'
}, {
  id: 6,
  name: 'TCL2',
  capacity: 60,
  status: 'available',
  image: 'bg-gradient-to-br from-slate-500 to-gray-600'
}];
export function VenueBookingPage() {
  const [filterDate, setFilterDate] = useState('');
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
          <select className="text-sm border-none focus:ring-0 text-gray-600 bg-transparent">
            <option>Any Capacity</option>
            <option>50-100</option>
            <option>100-500</option>
            <option>500+</option>
          </select>
        </div>
      </div>

      {/* Venues Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {venues.map((venue, index) => <motion.div key={venue.id} initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: index * 0.1
      }} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden group hover:shadow-lg transition-all">
            <div className={`h-48 w-full ${venue.image} relative`}>
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md border border-white/20 shadow-sm flex items-center gap-1 ${venue.status === 'available' ? 'bg-green-500/90 text-white' : 'bg-gray-500/90 text-white'}`}>
                  {venue.status === 'available' ? <>
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

              <button disabled={venue.status === 'booked'} className={`w-full py-2.5 rounded-xl font-medium transition-all ${venue.status === 'available' ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/25' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                {venue.status === 'available' ? 'Book Venue' : 'Unavailable'}
              </button>
            </div>
          </motion.div>)}
      </div>
    </div>;
}