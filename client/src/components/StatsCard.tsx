import React from 'react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  icon: React.ElementType;
  label: string; // Changed from title to label
  value: string;
  trend: string;
  trendUp?: boolean;
  color: 'blue' | 'green' | 'orange' | 'purple';
  delay?: number;
}

export function StatsCard({ icon: Icon, label, value, trend, color, delay = 0 }: StatsCardProps) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-emerald-50 text-emerald-600',
    orange: 'bg-orange-50 text-orange-600',
    purple: 'bg-violet-50 text-violet-600'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${colors[color]} flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>
        <span className={`text-sm font-medium ${trend.startsWith('+') ? 'text-emerald-600' : 'text-red-500'}`}>
          {trend}
        </span>
      </div>
      <div>
        <p className="text-gray-500 text-sm font-medium mb-1">{label}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      </div>
    </motion.div>
  );
}