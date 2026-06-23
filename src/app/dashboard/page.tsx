"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, FileText, Briefcase, Settings, ChevronDown, Check, AlertCircle, TrendingUp, Download, CheckCircle2, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

export default function Dashboard() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [template, setTemplate] = useState('Modern');
  const [industry, setIndustry] = useState('Technology');
  const [resume, setResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleGenerate = async () => {
    if (showResults) {
      setShowResults(false);
      setAnalysisResult(null);
      return;
    }

    if (!resume.trim() || !jobDescription.trim()) {
      toast.error("Please provide both your resume and the job description.");
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const userId = localStorage.getItem('resume_booster_user_id') || 'anonymous';
      
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId
        },
        body: JSON.stringify({
          resume,
          jobDescription,
          industry,
          template
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Analysis failed");
      }

      const data = await response.json();
      setAnalysisResult(data);
      setShowResults(true);
    } catch (error: any) {
      toast.error(error.message || "An error occurred during analysis.");
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 w-full pt-8 flex flex-col gap-12">
      
      {/* Welcome Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">Workspace</h1>
          <p className="opacity-60 text-sm">Optimize your resume for your next big opportunity.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-lg bg-black/5 hover:bg-black/10 transition-colors text-sm font-medium flex items-center gap-2">
            <Settings size={16} /> Preferences
          </button>
        </div>
      </section>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Input Column */}
        <div className={`${showResults ? 'lg:col-span-5' : 'lg:col-span-12'} transition-all duration-700 ease-[0.16,1,0.3,1] flex flex-col gap-6`}>
          
          <div className="glass-card p-6 md:p-8 rounded-3xl flex flex-col gap-6 relative overflow-hidden">
            {isAnalyzing && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 border-4 border-black/10 border-t-[var(--color-brand-red)] rounded-full animate-spin"></div>
                <div className="font-heading font-bold text-lg animate-pulse">Analyzing your profile...</div>
              </div>
            )}

            <div className="flex flex-col gap-4">
              <label className="font-heading font-bold text-lg flex items-center gap-2">
                <FileText size={20} className="text-[var(--color-brand-red)]" /> Current Resume
              </label>
              <textarea 
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                className="w-full h-48 bg-white/50 border border-black/10 rounded-2xl p-5 resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-red)] focus:bg-white transition-all text-sm leading-relaxed"
                placeholder="Paste your resume text here..."
              ></textarea>
            </div>

            <div className="flex flex-col gap-4">
              <label className="font-heading font-bold text-lg flex items-center gap-2">
                <Briefcase size={20} className="text-[var(--color-brand-red)]" /> Target Job Description
              </label>
              <textarea 
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full h-48 bg-white/50 border border-black/10 rounded-2xl p-5 resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-red)] focus:bg-white transition-all text-sm leading-relaxed"
                placeholder="Paste the job description here..."
              ></textarea>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider opacity-60">Industry</label>
                <div className="relative">
                  <select 
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full appearance-none bg-white border border-black/10 rounded-xl py-3 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-red)] text-sm font-medium"
                  >
                    <option>Technology</option>
                    <option>Finance</option>
                    <option>Healthcare</option>
                    <option>Creative</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider opacity-60">Template</label>
                <div className="relative">
                  <select 
                    value={template}
                    onChange={(e) => setTemplate(e.target.value)}
                    className="w-full appearance-none bg-white border border-black/10 rounded-xl py-3 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-red)] text-sm font-medium"
                  >
                    <option>Modern</option>
                    <option>Professional</option>
                    <option>Minimal</option>
                    <option>Tech</option>
                    <option>Student</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none" />
                </div>
              </div>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={isAnalyzing}
              className="w-full mt-4 bg-[var(--color-brand-black)] text-white py-5 rounded-2xl font-bold text-lg hover:bg-[var(--color-brand-red)] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-xl shadow-black/10"
            >
              {showResults ? (
                <><RotateCcw size={20} /> Reset Analysis</>
              ) : (
                <><Sparkles size={20} /> Generate Analysis</>
              )}
            </button>

          </div>
        </div>

        {/* Results Column */}
        <AnimatePresence>
          {showResults && analysisResult && (
            <motion.div 
              initial={{ opacity: 0, x: 20, width: 0 }}
              animate={{ opacity: 1, x: 0, width: 'auto' }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 flex flex-col gap-6"
            >
              
              {/* Score Card */}
              <div className="glass-card p-8 rounded-3xl flex items-center gap-8 bg-gradient-to-br from-white to-white/50">
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
                    <span className="text-xs font-bold uppercase opacity-50 mt-1">Match</span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <h3 className="text-2xl font-heading font-bold">Analysis Complete</h3>
                  <p className="opacity-70 text-sm leading-relaxed">
                    Review your tailored feedback and the generated resume below.
                  </p>
                </div>
              </div>

              {/* Analysis Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                
                {/* Strengths */}
                <div className="glass-card p-6 rounded-3xl flex flex-col gap-4">
                  <h4 className="font-heading font-bold flex items-center gap-2 text-green-700">
                    <CheckCircle2 size={18} /> Strengths
                  </h4>
                  <ul className="space-y-3">
                    {analysisResult.strengths.map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="opacity-80">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Weaknesses */}
                <div className="glass-card p-6 rounded-3xl flex flex-col gap-4">
                  <h4 className="font-heading font-bold flex items-center gap-2 text-red-700">
                    <AlertCircle size={18} /> Areas to Improve
                  </h4>
                  <ul className="space-y-3">
                    {analysisResult.weaknesses.map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0"></div>
                        <span className="opacity-80">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Missing Skills */}
                <div className="glass-card p-6 rounded-3xl md:col-span-2 flex flex-col gap-4">
                  <h4 className="font-heading font-bold flex items-center gap-2">
                    <TrendingUp size={18} /> Missing Keywords
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.missingSkills.map((skill: string, i: number) => (
                      <span key={i} className="px-3 py-1.5 bg-[var(--color-brand-red)]/10 text-[var(--color-brand-red)] font-medium text-xs rounded-lg border border-[var(--color-brand-red)]/20">
                        + {skill}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* Suggestions */}
              <div className="glass-card p-6 md:p-8 rounded-3xl flex flex-col gap-6">
                <h4 className="font-heading font-bold text-xl flex items-center gap-2">
                  <Sparkles size={20} className="text-[var(--color-brand-red)]" /> AI Suggestions
                </h4>
                <div className="space-y-4">
                  {analysisResult.suggestions.map((suggestion: string, i: number) => (
                    <div key={i} className="p-4 bg-white rounded-2xl border border-black/5 shadow-sm text-sm flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <p className="opacity-80 leading-relaxed pt-1">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rewritten Preview Action */}
              <div className="bg-[var(--color-brand-black)] text-white p-8 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
                <div>
                  <h4 className="font-heading font-bold text-xl mb-1">Your Optimized Resume is Ready</h4>
                  <p className="text-white/60 text-sm">We've applied all suggestions to a {template.toLowerCase()} template.</p>
                </div>
                <button 
                  className="whitespace-nowrap bg-white text-[var(--color-brand-black)] px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-transform"
                  onClick={() => {
                    const blob = new Blob([analysisResult.rewrittenResume], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'rewritten-resume.txt';
                    a.click();
                  }}
                >
                  <Download size={18} /> Download
                </button>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
