"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, FileText, Briefcase, Settings, ChevronDown, Check, AlertCircle, TrendingUp, Download, CheckCircle2, RotateCcw, Upload, X, File as FileIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { toast } from 'sonner';

export default function Dashboard() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [template, setTemplate] = useState('Modern');
  const [industry, setIndustry] = useState('Technology');
  const [resume, setResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);

  const [selectedBuilderTemplate, setSelectedBuilderTemplate] = useState<string | null>(null);
  const [builderData, setBuilderData] = useState({
    fullName: '', email: '', phone: '', location: '', summary: '', education: '', experience: '', skills: '', projects: '', certifications: ''
  });
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);

  const builderTemplates = [
    { id: 'Student', desc: 'Clean & education-focused', bestFor: 'College Students, Fresh Graduates', usedBy: 'Students, Entry-Level', focus: 'Education, Projects, Skills', image: '/sturem.jpg' },
    { id: 'Professional', desc: 'Traditional & structured', bestFor: 'General Job Applications', usedBy: 'Most Professionals', focus: 'Work Experience, Achievements, Skills', image: '/profrem.png' },
    { id: 'Tech', desc: 'Code & impact focused', bestFor: 'Software Engineering, AI/ML, Data Science, IT', usedBy: 'Developers, Engineers, Tech Professionals', focus: 'Projects, Technologies, Impact', image: '/techrem.jpg' },
    { id: 'Modern', desc: 'Creative & visual', bestFor: 'Design, Marketing, Creative Roles', usedBy: 'Designers, Content Creators, Product Teams', focus: 'Portfolio, Experience, Personal Brand', image: '/modrem.png' },
    { id: 'Executive', desc: 'Leadership & results oriented', bestFor: 'Senior Roles, Management', usedBy: 'Managers, Directors, Executives', focus: 'Leadership, Strategy, Business Impact', image: '/exerem.jpeg' }
  ];

  const carouselRef = useRef<HTMLDivElement>(null);
  const [isHoveringCarousel, setIsHoveringCarousel] = useState(false);

  useEffect(() => {
    if (isHoveringCarousel) return;
    let animationFrameId: number;
    const scroll = () => {
      if (carouselRef.current) {
        carouselRef.current.scrollLeft += 1;
        if (carouselRef.current.scrollLeft >= carouselRef.current.scrollWidth / 2) {
          carouselRef.current.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };
    animationFrameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHoveringCarousel]);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
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

  const wrapText = (text: string, maxWidth: number, font: any, fontSize: number) => {
    const lines: string[] = [];
    const paragraphs = text.split('\n');
    
    for (const paragraph of paragraphs) {
      if (!paragraph.trim()) {
        lines.push('');
        continue;
      }
      const words = paragraph.split(' ');
      let currentLine = words[0] || '';
      
      for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = font.widthOfTextAtSize(currentLine + ' ' + word, fontSize);
        if (width < maxWidth) {
          currentLine += ' ' + word;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }
      lines.push(currentLine);
    }
    return lines;
  };

  const exportPDF = async () => {
    if (!analysisResult?.rewrittenResume) return;
    try {
      const pdfDoc = await PDFDocument.create();
      let page = pdfDoc.addPage([595.28, 841.89]);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      
      const { width, height } = page.getSize();
      const margin = 50;
      let y = height - margin;
      
      page.drawText('Optimized Resume', { x: margin, y, size: 24, font: boldFont, color: rgb(0, 0, 0) });
      y -= 40;
      
      const fontSize = 11;
      const text = analysisResult.rewrittenResume;
      const lines = wrapText(text, width - margin * 2, font, fontSize);
      
      for (const line of lines) {
        if (y < margin) {
          page = pdfDoc.addPage([595.28, 841.89]);
          y = height - margin;
        }
        page.drawText(line, { x: margin, y, size: fontSize, font, color: rgb(0.1, 0.1, 0.1) });
        y -= fontSize + 4;
      }
      
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'optimized-resume.pdf';
      a.click();
    } catch (err) {
      toast.error('Failed to export PDF');
      console.error(err);
    }
  };

  const exportDOCX = async () => {
    if (!analysisResult?.rewrittenResume) return;
    try {
      const text = analysisResult.rewrittenResume;
      const paragraphs = text.split('\n').map((line: string) => {
        return new Paragraph({
          children: [new TextRun({ text: line, size: 22 })],
          spacing: { after: 120 }
        });
      });

      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              children: [new TextRun({ text: 'Optimized Resume', bold: true, size: 32 })],
              spacing: { after: 400 }
            }),
            ...paragraphs
          ],
        }]
      });

      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'optimized-resume.docx';
      a.click();
    } catch (err) {
      toast.error('Failed to export DOCX');
      console.error(err);
    }
  };

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
              
              {/* Upload Area */}
              {!uploadedFile ? (
                <div className="border-2 border-dashed border-black/10 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 bg-white/30 hover:bg-white/50 transition-colors relative">
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
                      <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center text-black/60">
                        <Upload size={24} />
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-sm">Click to upload or drag and drop</p>
                        <p className="text-xs opacity-60 mt-1">PDF, DOCX, or TXT (max 5MB)</p>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="bg-white/80 border border-green-500/30 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <FileIcon size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold truncate max-w-[200px]">{uploadedFile.name}</p>
                      <p className="text-xs opacity-60">Text extracted successfully</p>
                    </div>
                  </div>
                  <button onClick={removeFile} className="p-2 hover:bg-black/5 rounded-full transition-colors text-black/60">
                    <X size={18} />
                  </button>
                </div>
              )}

              <textarea 
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                className="w-full h-48 bg-white/50 border border-black/10 rounded-2xl p-5 resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-red)] focus:bg-white transition-all text-sm leading-relaxed"
                placeholder="Paste your resume text here, or generate a draft below..."
              ></textarea>
            </div>



            <div className="flex flex-col gap-4">
              <label className="font-heading font-bold text-lg flex items-center gap-2">
                <Briefcase size={20} className="text-[var(--color-brand-red)]" /> Target Job Description
              </label>
              <textarea 
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full h-16 bg-white/50 border border-black/10 rounded-2xl p-5 resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-red)] focus:bg-white transition-all text-sm leading-relaxed"
                placeholder="Paste the job description here..."
              ></textarea>
            </div>

            {/* Resume Template Builder */}
            <div className="flex flex-col gap-6 pt-4 border-t border-black/5">
              <div className="flex items-end justify-between gap-4 mb-2">
                <div className="flex flex-col gap-1">
                  <h3 className="font-heading font-bold text-xl">Don't have a resume? Start with a professional template.</h3>
                  <p className="opacity-60 text-sm">Choose a resume structure and let AI help you build a strong first draft.</p>
                </div>
                <div className="hidden md:flex items-center gap-2">
                  <button onClick={() => scrollCarousel('left')} className="p-2 rounded-full border border-black/10 hover:bg-black/5 transition-colors">
                    <ChevronLeft size={20} />
                  </button>
                  <button onClick={() => scrollCarousel('right')} className="p-2 rounded-full border border-black/10 hover:bg-black/5 transition-colors">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

              {/* Horizontal Carousel */}
              <div 
                ref={carouselRef} 
                onMouseEnter={() => setIsHoveringCarousel(true)}
                onMouseLeave={() => setIsHoveringCarousel(false)}
                onTouchStart={() => setIsHoveringCarousel(true)}
                onTouchEnd={() => setIsHoveringCarousel(false)}
                className="flex overflow-x-auto gap-6 pb-6 -mx-6 px-6 md:-mx-8 md:px-8 hide-scrollbar" 
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                <style dangerouslySetInnerHTML={{__html: `
                  .flex.overflow-x-auto::-webkit-scrollbar { display: none; }
                `}} />
                {[...builderTemplates, ...builderTemplates].map((t, idx) => {
                  const isSelected = selectedBuilderTemplate === t.id;
                  return (
                    <motion.div 
                      key={`${t.id}-${idx}`}
                      onClick={() => setSelectedBuilderTemplate(t.id)}
                      className={`group min-w-[300px] md:min-w-[340px] flex flex-col cursor-pointer rounded-3xl overflow-hidden transition-all duration-300 border-2 ${isSelected ? 'border-[var(--color-brand-red)] shadow-2xl scale-[1.02] -translate-y-2' : 'border-black/5 hover:border-black/20 hover:shadow-xl hover:-translate-y-1'}`}
                    >
                      {/* Image Preview Container */}
                      <div className="relative h-72 md:h-80 w-full bg-black/5 overflow-hidden border-b border-black/5">
                        <Image src={t.image} alt={`${t.id} Template`} fill sizes="(max-width: 768px) 100vw, 350px" className="object-cover object-top opacity-95 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
                          <h4 className="font-heading font-bold text-2xl text-white">{t.id}</h4>
                          {isSelected && <div className="bg-white rounded-full p-1"><CheckCircle2 size={20} className="text-[var(--color-brand-red)]" /></div>}
                        </div>
                      </div>
                      
                      {/* Template Details */}
                      <div className="p-6 bg-white/95 flex-1 flex flex-col justify-between">
                        <p className="text-sm opacity-80 mb-5 font-medium">{t.desc}</p>
                        <div className="flex flex-col gap-3 text-xs">
                          <div className="flex gap-3"><span className="opacity-50 font-bold uppercase tracking-wider min-w-[70px]">Best For</span><span className="font-medium text-black/80">{t.bestFor}</span></div>
                          <div className="flex gap-3"><span className="opacity-50 font-bold uppercase tracking-wider min-w-[70px]">Used By</span><span className="font-medium text-black/80">{t.usedBy}</span></div>
                          <div className="flex gap-3"><span className="opacity-50 font-bold uppercase tracking-wider min-w-[70px]">Focus</span><span className="font-medium text-black/80">{t.focus}</span></div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Dynamic Form */}
              <AnimatePresence>
                {selectedBuilderTemplate && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-white/50 border border-black/10 rounded-3xl p-6 md:p-8 flex flex-col gap-6 mt-2">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-[var(--color-brand-red)]/10 text-[var(--color-brand-red)] flex items-center justify-center">
                          <Sparkles size={20} />
                        </div>
                        <h4 className="font-heading font-bold text-xl">Build a Resume with AI</h4>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        {['fullName', 'email', 'phone', 'location'].map((field) => (
                          <div key={field} className="flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase tracking-wider opacity-60">{field.replace(/([A-Z])/g, ' $1').trim()}</label>
                            <input 
                              type="text" 
                              value={(builderData as any)[field]}
                              onChange={(e) => setBuilderData({...builderData, [field]: e.target.value})}
                              className="w-full bg-white border border-black/10 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-red)] text-sm"
                            />
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-col gap-4">
                        {[
                          { id: 'summary', rows: 3 },
                          { id: 'education', rows: 3 },
                          { id: 'experience', rows: 4 },
                          { id: 'skills', rows: 3 },
                          { id: 'projects', rows: 3 },
                          { id: 'certifications', rows: 2 }
                        ].map((field) => (
                          <div key={field.id} className="flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase tracking-wider opacity-60">{field.id}</label>
                            <textarea 
                              rows={field.rows}
                              value={(builderData as any)[field.id]}
                              onChange={(e) => setBuilderData({...builderData, [field.id]: e.target.value})}
                              className="w-full bg-white border border-black/10 rounded-xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-red)] text-sm leading-relaxed"
                            ></textarea>
                          </div>
                        ))}
                      </div>

                      <button 
                        onClick={handleGenerateDraft}
                        disabled={isGeneratingDraft}
                        className="w-full mt-2 bg-[var(--color-brand-black)] text-white py-4 rounded-2xl font-bold text-base hover:bg-[var(--color-brand-red)] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                      >
                        {isGeneratingDraft ? (
                          <><div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> Generating...</>
                        ) : (
                          <><Sparkles size={18} /> Generate Resume Draft</>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
                <div className="flex items-center gap-3">
                  <button 
                    className="whitespace-nowrap bg-white text-[var(--color-brand-black)] px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-transform"
                    onClick={exportPDF}
                  >
                    <Download size={18} /> PDF
                  </button>
                  <button 
                    className="whitespace-nowrap bg-white/20 text-white hover:bg-white hover:text-[var(--color-brand-black)] px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all"
                    onClick={exportDOCX}
                  >
                    <Download size={18} /> DOCX
                  </button>
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
