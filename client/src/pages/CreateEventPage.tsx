import React, { useState, useEffect } from 'react';

import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar, Clock, MapPin, Upload, AlertCircle, CheckCircle, User, Phone } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

export function CreateEventPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addApproval, venues, checkConflict } = useData();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    organizerName: '',
    organizerPhone: '',
    date: '',
    startTime: '',
    endTime: '',
    venue: '',
    description: '',
    expectedAttendees: '',
    category: 'Academic',
    poster: null as File | null
  });
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [conflict, setConflict] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (location.state?.venue) {
      setFormData(prev => ({ ...prev, venue: location.state.venue }));
    }
  }, [location.state]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Check for conflict immediately if relevant fields change
    if (['date', 'startTime', 'endTime', 'venue'].includes(name)) {
      const newDate = name === 'date' ? value : formData.date;
      const newStart = name === 'startTime' ? value : formData.startTime;
      const newEnd = name === 'endTime' ? value : formData.endTime;
      const newVenue = name === 'venue' ? value : formData.venue;

      if (newDate && newStart && newEnd && newVenue) {
        setConflict(checkConflict(newDate, newStart, newEnd, newVenue));
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, poster: file }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setPosterPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (checkConflict(formData.date, formData.startTime, formData.endTime, formData.venue)) {
      alert(`Conflict detected! An event is already scheduled at ${formData.venue} during this time.`);
      setIsSubmitting(false);
      return;
    }

    let finalPosterUrl = undefined;

    // Upload Image if present
    if (formData.poster) {
      const uploadData = new FormData();
      uploadData.append('poster', formData.poster);
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: uploadData
        });
        if (res.ok) {
          const data = await res.json();
          finalPosterUrl = data.url;
        } else {
          console.error("Image upload failed");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }

    await addApproval({
      event: formData.name,
      organizer: formData.organizerName,
      organizerPhone: formData.organizerPhone,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      venue: formData.venue,
      category: formData.category,
      description: formData.description,
      posterUrl: finalPosterUrl,
      createdByEmail: user?.email
    });

    setTimeout(() => {
      setIsSubmitting(false);
      alert('Event proposal submitted successfully!');
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Propose New Event</h1>
        <p className="text-gray-600 mb-8">
          Fill out the form below to propose a new event. Your proposal will be reviewed by an administrator.
        </p>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Event Details Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Event Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Event Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/20 outline-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/20 outline-none bg-white"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Sports">Sports</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Organizer Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="organizerName"
                      value={formData.organizerName}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/20 outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Mobile Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      name="organizerPhone"
                      value={formData.organizerPhone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/20 outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/20 outline-none resize-none"
                  required
                />
              </div>
            </div>

            {/* Date & Time Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Schedule & Location</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/20 outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Start Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="time"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/20 outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">End Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="time"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/20 outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Venue</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      name="venue"
                      value={formData.venue}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2 rounded-xl border focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/20 outline-none bg-white ${conflict ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
                      required
                    >
                      <option value="">Select Venue</option>
                      {venues.map((v) => (
                        <option key={v.name} value={v.name}>
                          {v.name} (Cap: {v.capacity})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              {conflict && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  Time slot unavailable at this venue
                </p>
              )}
            </div>

            {/* Poster Upload */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Event Poster
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#1e3a8a] hover:bg-blue-50/50 transition-all cursor-pointer relative overflow-hidden group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                {posterPreview ? (
                  <div className="relative">
                    <img src={posterPreview} alt="Preview" className="max-h-64 mx-auto rounded-lg shadow-sm" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                      <p className="text-white font-medium">Click to change</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 font-medium">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      SVG, PNG, JPG or GIF (max. 5MB)
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || conflict}
                className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all flex items-center gap-2 ${isSubmitting || conflict ? 'bg-gray-300 cursor-not-allowed shadow-none' : 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/25 hover:shadow-orange-500/40'}`}
              >
                {isSubmitting ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Submit for Approval</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}