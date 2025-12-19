import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, User, ArrowRight, GraduationCap } from 'lucide-react';
export function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<'student' | 'faculty' | 'admin'>('student');
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };
  return <div className="min-h-screen w-full bg-[#f8fafc] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-blue-100/50 blur-[80px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-orange-100/50 blur-[80px]" />
      </div>

      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.5
    }} className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8 relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#1e3a8a] rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-blue-900/20">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#1e3a8a]">Welcome Back</h1>
          <p className="text-gray-500 mt-2">Sign in to EventSphere Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Role Selector */}
          <div className="grid grid-cols-3 gap-2 p-1 bg-gray-50 rounded-xl border border-gray-100">
            {(['student', 'faculty', 'admin'] as const).map(r => <button key={r} type="button" onClick={() => setRole(r)} className={`py-2 px-3 rounded-lg text-sm font-medium capitalize transition-all ${role === r ? 'bg-white text-[#1e3a8a] shadow-sm ring-1 ring-gray-200' : 'text-gray-500 hover:text-gray-700'}`}>
                {r}
              </button>)}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Email or Student ID
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" placeholder="Enter your ID" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/20 outline-none transition-all text-gray-900 placeholder-gray-400" required />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <a href="#" className="text-xs font-medium text-[#0891b2] hover:text-[#06b6d4]">
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="password" placeholder="••••••••" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/20 outline-none transition-all text-gray-900 placeholder-gray-400" required />
              </div>
            </div>
          </div>

          <button type="submit" className="w-full py-3.5 rounded-xl bg-orange-500 text-white font-bold shadow-lg shadow-orange-500/25 hover:bg-orange-600 hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-2 group">
            Sign In
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Don't have an account?{' '}
            <a href="#" className="font-medium text-[#1e3a8a] hover:underline">
              Contact Administration
            </a>
          </p>
        </div>
      </motion.div>
    </div>;
}