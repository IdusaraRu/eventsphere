import React, { Fragment } from 'react';
import { Plus, Download, Share2, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
const actions = [{
  icon: Plus,
  label: 'New Event',
  primary: true,
  path: '/create-event'
}, {
  icon: Download,
  label: 'Export',
  primary: false,
  path: '#'
}, {
  icon: Share2,
  label: 'Share',
  primary: false,
  path: '#'
}, {
  icon: Filter,
  label: 'Filter',
  primary: false,
  path: '#'
}];
export function QuickActions() {
  return <div className="flex items-center gap-3">
      {actions.map((action, index) => {
      const ButtonContent = <motion.button initial={{
        opacity: 0,
        scale: 0.8
      }} animate={{
        opacity: 1,
        scale: 1
      }} transition={{
        delay: 0.2 + index * 0.05
      }} whileHover={{
        scale: 1.05
      }} whileTap={{
        scale: 0.95
      }} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${action.primary ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25 hover:bg-orange-600 hover:shadow-orange-500/40' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-[#1e3a8a] hover:border-[#1e3a8a]/20'}`}>
            <action.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{action.label}</span>
          </motion.button>;
      return action.path !== '#' ? <Link key={action.label} to={action.path}>
            {ButtonContent}
          </Link> : <Fragment key={action.label}>{ButtonContent}</Fragment>;
    })}
    </div>;
}