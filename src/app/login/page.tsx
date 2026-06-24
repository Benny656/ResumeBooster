"use client";

import React from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Briefcase, Mail } from 'lucide-react';

export default function Login() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Save a mock user ID so our fetch calls can pass it in x-user-id header
    localStorage.setItem('resume_booster_user_id', 'mock_user_' + Math.random().toString(36).substring(7));
    router.push('/dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="glass-card w-full max-w-md p-10 md:p-12 rounded-[2.5rem] relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-brand-red)]/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center gap-8">
          <div className="w-16 h-16 rounded-full bg-[var(--color-brand-red)] text-white flex items-center justify-center">
            <Briefcase size={28} strokeWidth={2} />
          </div>
          
          <div>
            <h1 className="text-3xl font-heading font-bold tracking-tight mb-2">Welcome back</h1>
            <p className="opacity-60 text-sm">Enter your details to access your workspace.</p>
          </div>

          <div className="w-full space-y-4">
            <button 
              onClick={handleLogin}
              className="w-full bg-white border border-black/10 text-[var(--color-brand-black)] px-6 py-4 rounded-xl font-medium flex items-center justify-center gap-3 hover:bg-black/5 transition-colors"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
            
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-black/10"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#FBF9F6] px-4 text-black/70 font-medium tracking-wider rounded-full">Or continue with</span>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div className="space-y-2">
                <label className="text-sm font-medium ml-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-black/70" size={18} />
                  <input 
                    type="email" 
                    placeholder="name@company.com" 
                    className="w-full bg-white/50 border border-black/10 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-red)] focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>
              <button 
                type="submit"
                className="w-full bg-[var(--color-brand-black)] text-white px-6 py-4 rounded-xl font-medium hover:bg-[var(--color-brand-red)] transition-colors mt-2"
              >
                Log In
              </button>
            </form>
          </div>
          
          <p className="text-sm opacity-60">
            Don't have an account? <a href="#" className="text-[var(--color-brand-red)] font-medium hover:underline">Sign up</a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
