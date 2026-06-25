"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Check, AlertCircle, TrendingUp, CheckCircle2, ChevronLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';

const ExportActions = dynamic(() => import('@/components/dashboard/ExportActions'), { ssr: false });

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    const fetchAnalysis = async () => {
      try {
        const res = await fetch(`/api/analyze/${id}`, {
          headers: {}
        });
        
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load analysis');
        
        setAnalysisResult(data.data);
      } catch (err: any) {
        toast.error(err.message);
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalysis();
  }, [id, router]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full pt-8 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-16 h-16 border-4 border-black/10 border-t-[var(--color-brand-red)] rounded-full animate-spin mb-4"></div>
        <p className="font-heading font-bold text-lg animate-pulse">Loading analysis results...</p>
      </div>
    );
  }

  if (!analysisResult) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-12 w-full pt-8 pb-20 flex flex-col gap-8">
      
      {/* Header Navigation */}
      <button 
        onClick={() => router.push('/dashboard')}
        className="flex items-center gap-2 text-sm font-bold opacity-70 hover:opacity-100 transition-opacity w-fit"
      >
        <ChevronLeft size={16} /> Back to Dashboard
      </button>

      {/* Score Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 md:p-8 rounded-3xl flex flex-col sm:flex-row items-center gap-6 bg-gradient-to-br from-white to-white/50 shadow-xl"
      >
        <div className="relative w-32 h-32 flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-black/5" />
            <motion.circle 
              initial={{ strokeDashoffset: 251.2 }}
              animate={{ strokeDashoffset: 251.2 - (251.2 * analysisResult.score) / 100 }}
              transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
              cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" 
              strokeDasharray="251.2" 
              strokeLinecap="round"
              className="text-green-500" 
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-heading font-bold text-green-600 leading-none">{analysisResult.score}</span>
            <span className="text-xs font-bold uppercase opacity-70 mt-1">Match</span>
          </div>
        </div>
        
        <div className="flex flex-col gap-2 text-center sm:text-left">
          <h3 className="text-2xl md:text-3xl font-heading font-bold">Analysis Complete</h3>
          <p className="opacity-70 text-base leading-relaxed">
            Review your tailored feedback and download the optimized {analysisResult.template?.toLowerCase() || 'modern'} resume below.
          </p>
        </div>
      </motion.div>

      {/* Analysis Grid */}
      <div className="grid sm:grid-cols-2 gap-6">
        
        {/* Strengths */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 rounded-3xl flex flex-col gap-4"
        >
          <h4 className="font-heading font-bold flex items-center gap-2 text-green-700 text-lg">
            <CheckCircle2 size={20} /> Strengths
          </h4>
          <ul className="space-y-3">
            {analysisResult.strengths?.map((item: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                <span className="opacity-80">{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Weaknesses */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 rounded-3xl flex flex-col gap-4"
        >
          <h4 className="font-heading font-bold flex items-center gap-2 text-red-700 text-lg">
            <AlertCircle size={20} /> Areas to Improve
          </h4>
          <ul className="space-y-3">
            {analysisResult.weaknesses?.map((item: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0"></div>
                <span className="opacity-80">{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Missing Skills */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6 rounded-3xl md:col-span-2 flex flex-col gap-4"
        >
          <h4 className="font-heading font-bold flex items-center gap-2 text-lg">
            <TrendingUp size={20} /> Missing Keywords & Skills
          </h4>
          <div className="flex flex-wrap gap-2">
            {analysisResult.missingSkills?.map((skill: string, i: number) => (
              <span key={i} className="px-3 py-1.5 bg-[var(--color-brand-red)]/10 text-[var(--color-brand-red)] font-medium text-xs rounded-lg border border-[var(--color-brand-red)]/20">
                + {skill}
              </span>
            ))}
            {(!analysisResult.missingSkills || analysisResult.missingSkills.length === 0) && (
              <span className="opacity-70 text-sm italic">Great! No major keywords missing.</span>
            )}
          </div>
        </motion.div>

      </div>

      {/* Suggestions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-6 md:p-8 rounded-3xl flex flex-col gap-6"
      >
        <h4 className="font-heading font-bold text-xl flex items-center gap-2">
          <Sparkles size={20} className="text-[var(--color-brand-red)]" /> AI Suggestions
        </h4>
        <div className="space-y-4">
          {analysisResult.suggestions?.map((suggestion: string, i: number) => (
            <div key={i} className="p-4 bg-white rounded-2xl border border-black/5 shadow-sm text-sm flex gap-4">
              <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                {i + 1}
              </div>
              <p className="opacity-80 leading-relaxed pt-1">{suggestion}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Rewritten Preview Action Lazy Loaded */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <ExportActions analysisResult={analysisResult} template={analysisResult.template || 'Modern'} />
      </motion.div>

    </div>
  );
}
