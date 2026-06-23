"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Briefcase, ChevronRight, Menu, X } from 'lucide-react';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isDashboard = pathname?.includes('/dashboard') || pathname?.includes('/history');

  return (
    <div className="min-h-screen bg-animated-cream text-[var(--color-brand-black)] flex flex-col font-body">
      {/* Navigation */}
      <motion.header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${isScrolled ? 'py-4 glass-card' : 'py-6 bg-transparent'}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-[var(--color-brand-red)] text-white flex items-center justify-center group-hover:scale-105 transition-transform">
              <Briefcase size={16} strokeWidth={2.5} />
            </div>
            <span className="font-heading font-bold text-xl tracking-tight">Resume Booster</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 font-medium text-sm">
            {!isDashboard ? (
              <>
                <a href="#features" className="hover:text-[var(--color-brand-red)] transition-colors">Features</a>
                <a href="#how-it-works" className="hover:text-[var(--color-brand-red)] transition-colors">How it Works</a>
                <Link href="/login" className="hover:text-[var(--color-brand-red)] transition-colors">Log In</Link>
                <Link 
                  href="/login" 
                  className="bg-[var(--color-brand-black)] text-white px-6 py-2.5 rounded-full hover:bg-[var(--color-brand-red)] transition-colors flex items-center gap-2"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <Link href="/dashboard" className={`hover:text-[var(--color-brand-red)] transition-colors ${pathname === '/dashboard' ? 'text-[var(--color-brand-red)]' : ''}`}>Dashboard</Link>
                <Link href="/history" className={`hover:text-[var(--color-brand-red)] transition-colors ${pathname === '/history' ? 'text-[var(--color-brand-red)]' : ''}`}>History</Link>
                <div className="w-px h-4 bg-black/10 mx-2"></div>
                <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center font-heading font-bold text-xs">
                    JD
                  </div>
                </button>
              </>
            )}
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 -mr-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-[var(--color-brand-cream)]/95 backdrop-blur-xl pt-24 px-6 md:hidden flex flex-col gap-6 font-heading text-2xl"
          >
            {!isDashboard ? (
              <>
                <a href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a>
                <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>How it Works</a>
                <Link href="/login">Log In</Link>
                <Link href="/login" className="text-[var(--color-brand-red)] mt-4 flex items-center gap-2">
                  Get Started <ChevronRight size={24} />
                </Link>
              </>
            ) : (
              <>
                <Link href="/dashboard">Dashboard</Link>
                <Link href="/history">History</Link>
                <Link href="/" className="text-black/50 mt-4 text-lg">Log Out</Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-grow pt-24 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      {!isDashboard && (
        <footer className="py-12 border-t border-black/5">
          <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 opacity-50">
              <Briefcase size={16} />
              <span className="font-heading font-medium text-sm">Resume Booster &copy; 2026</span>
            </div>
            <div className="flex gap-6 text-sm opacity-50">
              <a href="#" className="hover:opacity-100 transition-opacity">Privacy</a>
              <a href="#" className="hover:opacity-100 transition-opacity">Terms</a>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
