import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, AlertCircle, CheckCircle, Calendar, Clock, MapPin } from 'lucide-react';
export function CreateEventPage() {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    date: '',
    time: '',
    venue: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [conflict, setConflict] = useState(false);
  // Mock conflict check
  const checkConflict = (venue: string, time: string) => {
    if (venue === 'Hall A' && time === '10:00') {
      setConflict(true);
    } else {
      setConflict(false);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (name === 'venue' || name === 'time') {
      checkConflict(name === 'venue' ? value : formData.venue, name === 'time' ? value : formData.time);
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => setIsSubmitting(false), 2000);
  };
  return <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1e3a8a]">Create New Event</h1>
        <p className="text-gray-500">
          Fill in the details to schedule a new campus event.
        </p>
      </div>

      <motion.form initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.5
    }} onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-8">
        <div className="space-y-6">
          {/* Event Name */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Event Name
            </label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Annual Tech Symposium" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/20 outline-none transition-all" required />
          </div>

          {/* Event Type */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Event Type
            </label>
            <select name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/20 outline-none transition-all bg-white" required>
              <option value="">Select Type</option>
              <option value="academic">Academic</option>
              <option value="cultural">Cultural</option>
              <option value="sports">Sports</option>
              <option value="workshop">Workshop</option>
            </select>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/20 outline-none transition-all" required />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Time
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="time" name="time" value={formData.time} onChange={handleChange} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/20 outline-none transition-all" required />
              </div>
            </div>
          </div>

          {/* Venue Selection */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Venue</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select name="venue" value={formData.venue} onChange={handleChange} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/20 outline-none transition-all bg-white" required>
                <option value="">Select Venue</option>
                <option value="Hall A">TLH1(Capacity: 200)</option>
                <option value="Auditorium">
                  TLH2(Capacity: 200)
                </option>
                <option value="Sports Complex">
                  Indoor(Capacity: 500)
                </option>
                <option value="Conference Room">
                  TCL1 (Capacity: 100)
                </option>
                <option value="Conference Room">
                  TCL2 (Capacity: 100)
                </option>
                <option value="Conference Room">
                  Kuppi Gaha (Capacity: 150)
                </option>
              </select>
            </div>
            {conflict && <motion.div initial={{
            opacity: 0,
            height: 0
          }} animate={{
            opacity: 1,
            height: 'auto'
          }} className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm mt-2">
                <AlertCircle className="w-4 h-4" />
                <span>
                  Warning: This venue is already booked for the selected time
                  slot.
                </span>
              </motion.div>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Description
            </label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={4} placeholder="Event details, agenda, and requirements..." className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/20 outline-none transition-all resize-none" required />
          </div>

          {/* Poster Upload */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Event Poster
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#1e3a8a] hover:bg-blue-50/50 transition-all cursor-pointer">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600 font-medium">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-400 mt-1">
                SVG, PNG, JPG or GIF (max. 5MB)
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button type="submit" disabled={isSubmitting || conflict} className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all flex items-center gap-2 ${isSubmitting || conflict ? 'bg-gray-300 cursor-not-allowed shadow-none' : 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/25 hover:shadow-orange-500/40'}`}>
            {isSubmitting ? <>Processing...</> : <>
                <CheckCircle className="w-5 h-5" />
                Submit for Approval
              </>}
          </button>
        </div>
      </motion.form>
    </div>;
}