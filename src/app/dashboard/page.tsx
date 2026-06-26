"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, FileText, Briefcase, Upload, X, File as FileIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import type { ResumeCarouselHandle } from '@/components/dashboard/ResumeCarousel';

const ResumeCarousel = dynamic(() => import('@/components/dashboard/ResumeCarousel'), { ssr: false });
const TemplateBuilderForm = dynamic(() => import('@/components/dashboard/TemplateBuilderForm'), { ssr: false });

export default function Dashboard() {
  const router = useRouter();
  
  const RESUME_MAX = 15000;
  const JD_MAX = 5000;
  const FILE_MAX_MB = 5;

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [template, setTemplate] = useState('Modern');
  const [industry, setIndustry] = useState('Technology');
  const [resume, setResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);

  const [selectedBuilderTemplate, setSelectedBuilderTemplate] = useState<string | null>(null);
  const [builderData, setBuilderData] = useState({
    fullName: '', email: '', phone: '', location: '', summary: '', education: '', experience: '', skills: '', projects: '', certifications: ''
  });
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);

  const carouselRef = useRef<ResumeCarouselHandle>(null);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      carouselRef.current.scroll(direction);
    }
  };

  const handleGenerateDraft = async () => {
    if (!selectedBuilderTemplate || !builderData.fullName.trim()) {
      toast.error('Please select a template and enter at least your Full Name.');
      return;
    }
    
    setIsGeneratingDraft(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateType: selectedBuilderTemplate, ...builderData })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Generation failed');
      }

      const data = await response.json();
      setResume(data.resume);
      toast.success('Resume draft generated successfully! You can now edit it.');
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during generation.');
      console.error(error);
    } finally {
      setIsGeneratingDraft(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side file size guard (5 MB)
    if (file.size > FILE_MAX_MB * 1024 * 1024) {
      toast.error(`File is too large. Please upload a file under ${FILE_MAX_MB} MB.`);
      e.target.value = '';
      return;
    }

    setUploadedFile(file);
    setIsExtracting(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/extract', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setResume(data.text);
      toast.success('Resume text extracted successfully. You can now edit it.');
    } catch (err: any) {
      toast.error(err.message || 'Failed to extract text from file.');
      setUploadedFile(null);
    } finally {
      setIsExtracting(false);
      e.target.value = ''; // Reset file input
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setResume('');
  };

  const handleGenerate = async () => {
    if (!resume.trim() || !jobDescription.trim()) {
      toast.error("Please provide both your resume and the job description.");
      return;
    }

    // Client-side length guardrails
    if (resume.length > RESUME_MAX) {
      toast.error(`Your resume is too long (${resume.length.toLocaleString()} chars). Please trim it to under ${RESUME_MAX.toLocaleString()} characters (~10 pages) for best results.`);
      return;
    }
    if (jobDescription.length > JD_MAX) {
      toast.error(`The job description is too long (${jobDescription.length.toLocaleString()} chars). Please trim it to under ${JD_MAX.toLocaleString()} characters.`);
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
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
      
      if (data.id) {
        router.push(`/results/${data.id}`);
      } else {
        toast.error("Analysis completed but no ID returned.");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred during analysis.");
      console.error(error);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 w-full pt-8 pb-20 flex flex-col gap-12">
      
      {/* Welcome Section */}
      <section className="flex flex-col gap-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold mb-2">Workspace</h1>
          <p className="opacity-70 text-sm">Optimize your resume for your next big opportunity.</p>
        </div>
      </section>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-12 gap-8 w-full min-w-0">
        
        {/* Input Column */}
        <div className="lg:col-span-12 flex flex-col gap-6 w-full min-w-0">
          
          <div className="glass-card p-4 sm:p-6 md:p-8 rounded-3xl flex flex-col gap-6 relative overflow-hidden w-full min-w-0">
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
              
              {/* Upload Area */}
              {!uploadedFile ? (
                <div className="border-2 border-dashed border-black/10 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center gap-3 bg-white/30 hover:bg-white/50 transition-colors relative w-full text-center">
                  <input 
                    type="file" 
                    accept=".pdf,.docx,.txt"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    disabled={isExtracting}
                  />
                  {isExtracting ? (
                    <>
                      <div className="w-8 h-8 border-3 border-black/10 border-t-[var(--color-brand-red)] rounded-full animate-spin"></div>
                      <p className="text-sm font-medium opacity-70">Extracting text...</p>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center text-black/70">
                        <Upload size={24} />
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-sm">Click to upload or drag and drop</p>
                        <p className="text-xs opacity-70 mt-1">PDF, DOCX, or TXT (max 5MB)</p>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="bg-white/80 border border-green-500/30 rounded-xl p-4 flex items-center justify-between w-full min-w-0 overflow-hidden">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                      <FileIcon size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold truncate max-w-[200px]">{uploadedFile.name}</p>
                      <p className="text-xs opacity-70">Text extracted successfully</p>
                    </div>
                  </div>
                  <button onClick={removeFile} aria-label="Remove uploaded file" title="Remove" className="p-2 hover:bg-black/5 rounded-full transition-colors text-black/70">
                    <X size={18} />
                  </button>
                </div>
              )}

              <textarea
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                className={`w-full min-w-0 h-48 bg-white/50 border rounded-2xl p-4 sm:p-5 resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-red)] focus:bg-white transition-all text-sm leading-relaxed ${
                  resume.length > RESUME_MAX ? 'border-red-400 focus:ring-red-400' : 'border-black/10'
                }`}
                placeholder="Paste your resume text here, or generate a draft below..."
              />
              {/* Character count warning */}
              {resume.length > RESUME_MAX * 0.85 && (
                <p className={`text-xs font-medium mt-1 ${
                  resume.length > RESUME_MAX ? 'text-red-500' : 'text-orange-500'
                }`}>
                  {resume.length.toLocaleString()} / {RESUME_MAX.toLocaleString()} characters
                  {resume.length > RESUME_MAX && ' — Please shorten your resume before submitting.'}
                </p>
              )}
            </div>



            <div className="flex flex-col gap-4">
              <label className="font-heading font-bold text-lg flex items-center gap-2">
                <Briefcase size={20} className="text-[var(--color-brand-red)]" /> Target Job Description
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className={`w-full min-w-0 h-24 bg-white/50 border rounded-2xl p-4 sm:p-5 resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-red)] focus:bg-white transition-all text-sm leading-relaxed ${
                  jobDescription.length > JD_MAX ? 'border-red-400 focus:ring-red-400' : 'border-black/10'
                }`}
                placeholder="Paste the job description here..."
              />
              {/* Character count warning */}
              {jobDescription.length > JD_MAX * 0.85 && (
                <p className={`text-xs font-medium mt-1 ${
                  jobDescription.length > JD_MAX ? 'text-red-500' : 'text-orange-500'
                }`}>
                  {jobDescription.length.toLocaleString()} / {JD_MAX.toLocaleString()} characters
                  {jobDescription.length > JD_MAX && ' — Please shorten the job description before submitting.'}
                </p>
              )}
            </div>

            {/* Resume Template Builder */}
            <div className="flex flex-col gap-6 pt-4 border-t border-black/5 w-full min-w-0 overflow-hidden">
              <div className="flex items-end justify-between gap-4 mb-2">
                <div className="flex flex-col gap-1">
                  <h3 className="font-heading font-bold text-xl">Don't have a resume? Start with a professional template.</h3>
                  <p className="opacity-70 text-sm">Choose a resume structure and let AI help you build a strong first draft.</p>
                </div>
                <div className="hidden md:flex items-center gap-2">
                  <button onClick={() => scrollCarousel('left')} aria-label="Previous template" title="Previous" className="p-2 rounded-full border border-black/10 hover:bg-black/5 transition-colors">
                    <ChevronLeft size={20} />
                  </button>
                  <button onClick={() => scrollCarousel('right')} aria-label="Next template" title="Next" className="p-2 rounded-full border border-black/10 hover:bg-black/5 transition-colors">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

              {/* Horizontal Carousel extracted to a lazy loaded component */}
              <ResumeCarousel 
                ref={carouselRef}
                selectedBuilderTemplate={selectedBuilderTemplate}
                setSelectedBuilderTemplate={setSelectedBuilderTemplate}
              />

              {/* Dynamic Form extracted to a lazy loaded component */}
              <TemplateBuilderForm
                selectedBuilderTemplate={selectedBuilderTemplate}
                builderData={builderData}
                setBuilderData={setBuilderData}
                handleGenerateDraft={handleGenerateDraft}
                isGeneratingDraft={isGeneratingDraft}
              />
            </div>
            
            <button 
              onClick={handleGenerate}
              disabled={isAnalyzing}
              className="w-full min-w-0 mt-4 bg-[var(--color-brand-black)] text-white py-4 sm:py-5 rounded-2xl font-bold text-base sm:text-lg hover:bg-[var(--color-brand-red)] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-xl shadow-black/10"
            >
              <Sparkles size={20} className="shrink-0" /> <span className="truncate">Generate Analysis</span>
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}
