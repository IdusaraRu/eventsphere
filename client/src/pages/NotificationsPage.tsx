import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, Info, Clock, Send, Users, User as UserIcon } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

const iconMap = {
  success: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-100' },
  warning: { icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-100' },
  info: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-100' },
  alert: { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-100' }
};

export function NotificationsPage() {
  const { broadcasts, sendBroadcast } = useData();
  const { user, allUsers } = useAuth();
  const isAdmin = user?.role === 'admin';

  // State for Admin Broadcast Form
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [target, setTarget] = useState<'all' | 'staff' | 'selected'>('all');
  const [type, setType] = useState<'info' | 'warning' | 'alert' | 'success'>('info');
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;
    if (target === 'selected' && selectedRecipients.length === 0) {
      alert('Please select at least one recipient.');
      return;
    }

    sendBroadcast({
      title,
      message,
      sender: user?.name || 'Admin',
      target,
      type,
      recipients: target === 'selected' ? selectedRecipients : undefined
    });

    // Reset form
    setTitle('');
    setMessage('');
    setTarget('all');
    setSelectedRecipients([]);
    alert('Notification sent successfully!');
  };

  const toggleRecipient = (email: string) => {
    setSelectedRecipients(prev =>
      prev.includes(email) ? prev.filter(e => e !== email) : [...prev, email]
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#1e3a8a]">Notifications</h1>
        <p className="text-gray-500">
          Stay updated with latest alerts and campus announcements.
        </p>
      </div>

      {/* Admin Broadcast Panel */}
      {isAdmin && (
        <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-[#1e3a8a] flex items-center gap-2">
            <Send className="w-5 h-5" /> Send Broadcast Message
          </h2>
          <form onSubmit={handleSend} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#1e3a8a] outline-none"
                required
              />
              <select
                value={type}
                onChange={e => setType(e.target.value as any)}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#1e3a8a] outline-none"
              >
                <option value="info">Info (Blue)</option>
                <option value="success">Success (Green)</option>
                <option value="warning">Warning (Orange)</option>
                <option value="alert">Alert (Red)</option>
              </select>
            </div>

            <textarea
              placeholder="Message content..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#1e3a8a] outline-none h-24 resize-none"
              required
            />

            {/* Target Selection */}
            <div className="space-y-3">
              <div className="flex items-center gap-4 flex-wrap">
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input
                    type="radio"
                    name="target"
                    checked={target === 'all'}
                    onChange={() => setTarget('all')}
                  />
                  All Users
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input
                    type="radio"
                    name="target"
                    checked={target === 'staff'}
                    onChange={() => setTarget('staff')}
                  />
                  Staff Only
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input
                    type="radio"
                    name="target"
                    checked={target === 'selected'}
                    onChange={() => setTarget('selected')}
                  />
                  Select Users
                </label>
              </div>

              {/* User List for Specific Selection */}
              {target === 'selected' && (
                <div className="p-3 border border-gray-200 rounded-xl bg-gray-50 max-h-40 overflow-y-auto">
                  <p className="text-xs text-gray-500 mb-2 font-medium">Select Recipients:</p>
                  <div className="space-y-1">
                    {allUsers.filter(u => u.role !== 'admin').map(u => (
                      <label key={u.id} className="flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-100 p-1 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedRecipients.includes(u.email)}
                          onChange={() => toggleRecipient(u.email)}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span>{u.name} <span className="text-gray-400 text-xs">({u.email})</span></span>
                      </label>
                    ))}
                    {allUsers.filter(u => u.role !== 'admin').length === 0 && (
                      <p className="text-xs text-gray-400 italic">No non-admin users found.</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-2 bg-[#1e3a8a] text-white rounded-xl font-medium hover:bg-blue-900 transition-colors"
              >
                Send Notification
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Notification List */}
      <div className="space-y-4">
        <AnimatePresence>
          {broadcasts.length === 0 ? (
            <div className="text-center py-10 text-gray-400">No notifications yet.</div>
          ) : (
            broadcasts.map((item, index) => {
              // Filter logic: 
              // 1. Staff only -> check user role
              if (item.target === 'staff' && user?.role === 'student') return null;
              // 2. Selected -> check if user email is in recipients list
              if (item.target === 'selected') {
                // If I am admin, I probably want to see what I sent? Or maybe not cluttter?
                // Let's say Admin sees all. User sees if in recipients.
                if (!isAdmin && (!user || !item.recipients?.includes(user.email))) return null;
              }

              const Style = iconMap[item.type] || iconMap.info;
              const Icon = Style.icon;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex gap-4 hover:shadow-md transition-shadow relative"
                >
                  <div className={`w-12 h-12 rounded-xl ${Style.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-6 h-6 ${Style.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-900">{item.title}</h3>
                        <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full">
                          From: {item.sender}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(item.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mt-2">{item.message}</p>
                    {item.target === 'staff' && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-orange-600 font-bold uppercase">
                        <Users className="w-3 h-3" /> Staff Internal
                      </div>
                    )}
                    {item.target === 'selected' && isAdmin && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-purple-600 font-bold uppercase">
                        <UserIcon className="w-3 h-3" /> Private Message ({item.recipients?.length} recipients)
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}