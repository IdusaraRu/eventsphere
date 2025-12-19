import React from 'react';
import { ArrowUpRight, ArrowDownRight, BoxIcon } from 'lucide-react';
import { motion } from 'framer-motion';
interface StatsCardProps {
  title: string;
  value: string;
  trend: string;
  trendUp: boolean;
  icon: BoxIcon;
  color: 'blue' | 'green' | 'orange' | 'purple';
  delay?: number;
}
const colorMap = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-emerald-50 text-emerald-600',
  orange: 'bg-orange-50 text-orange-600',
  purple: 'bg-purple-50 text-purple-600'
};
export function StatsCard({
  title,
  value,
  trend,
  trendUp,
  icon: Icon,
  color,
  delay = 0
}: StatsCardProps) {
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.5,
    delay
  }} whileHover={{
    y: -5
  }} className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-gray-100 group hover:shadow-md transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${colorMap[color]} ring-1 ring-inset ring-black/5`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg ${trendUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
          {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {trend}
        </div>
      </div>

      <div>
        <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-bold text-gray-900 tracking-tight">
          {value}
        </p>
      </div>
    </motion.div>;
}