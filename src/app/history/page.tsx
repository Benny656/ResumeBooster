"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, MoreVertical, Trash2, ExternalLink, Calendar, Target, Briefcase } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function History() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const userId = localStorage.getItem('resume_booster_user_id') || 'anonymous';
      const res = await fetch('/api/history', {
        headers: {
          'x-user-id': userId
        }
      });
      if (!res.ok) throw new Error("Failed to load history");
      const data = await res.json();
      setHistory(data.data || []);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this analysis?")) return;
    
    try {
      const userId = localStorage.getItem('resume_booster_user_id') || 'anonymous';
      const res = await fetch(`/api/history?id=${id}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': userId
        }
      });
      if (!res.ok) throw new Error("Failed to delete");
      
      toast.success("Analysis deleted");
      fetchHistory(); // Refresh
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 w-full pt-8 flex flex-col gap-10">
      
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">Analysis History</h1>
          <p className="opacity-70 text-sm">Review your past optimizations and track your progress.</p>
        </div>
      </section>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/70" size={18} />
          <input 
            type="text" 
            placeholder="Search by industry or template..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/50 border border-black/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-red)] transition-all text-sm"
          />
        </div>
        <button className="bg-white border border-black/10 px-4 py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:bg-black/5 transition-colors shrink-0">
          <Filter size={18} /> Filter
        </button>
      </div>

      {/* History List */}
      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="text-center opacity-50 py-10">Loading history...</div>
        ) : history.length === 0 ? (
          <div className="text-center opacity-50 py-10">No history found. Try generating a resume first!</div>
        ) : (
          history.filter(item => 
            item.industry.toLowerCase().includes(search.toLowerCase()) || 
            item.template.toLowerCase().includes(search.toLowerCase())
          ).map((item, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              key={item._id} 
              onClick={() => router.push(`/results/${item._id}`)}
              className="glass-card p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:bg-white/80 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-6">
                
                {/* Score Badge */}
                <div className="relative w-16 h-16 flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-black/5" />
                    <circle 
                      cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" 
                      strokeDasharray="251.2" 
                      strokeDashoffset={251.2 - (251.2 * item.score) / 100}
                      strokeLinecap="round"
                      className={item.score >= 90 ? "text-green-500" : item.score >= 80 ? "text-yellow-500" : "text-orange-500"} 
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-heading font-bold">{item.score}</span>
                  </div>
                </div>

                {/* Details */}
                <div className="flex flex-col gap-1">
                  <h3 className="font-heading font-bold text-lg">Resume Optimization</h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs font-medium opacity-70">
                    <span className="flex items-center gap-1.5"><Target size={14} /> {item.industry}</span>
                    <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-black/5 rounded-lg text-xs font-medium mr-4">{item.template} Template</span>
                
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDelete(item._id); }} 
                  aria-label="Delete analysis" 
                  title="Delete" 
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 text-[var(--color-brand-black)]"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

    </div>
  );
}
