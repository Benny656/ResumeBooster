"use client";

import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, Sparkles, FileText, Target, Zap, RotateCcw, Clock, Download } from 'lucide-react';
import Link from 'next/link';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';

const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

export default function Landing() {
  return (
    <div className="flex flex-col gap-32 md:gap-48 overflow-x-hidden w-full">
      
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
          <div className="flex flex-col gap-8 max-w-2xl relative z-10">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 border border-black/5 text-sm font-medium w-fit backdrop-blur-md"
            >
              <Sparkles size={16} className="text-[var(--color-brand-red)]" />
              <span>AI-Powered Resume Optimization</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-heading font-bold leading-[1.05] tracking-tight">
              Land the job with a <span className="text-[var(--color-brand-red)]">perfectly tailored</span> resume.
            </h1>
            
            <p className="text-lg md:text-xl opacity-70 leading-relaxed max-w-lg">
              Upload your resume and the job description. Our AI analyzes, scores, and rewrites your experience to match exactly what hiring managers are looking for.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/login" className="bg-[var(--color-brand-black)] text-white px-8 py-4 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-[var(--color-brand-red)] transition-all hover:scale-105 active:scale-95 shadow-xl shadow-black/10">
                Optimize My Resume <ArrowRight size={18} />
              </Link>
              <a href="#how-it-works" className="bg-white/50 backdrop-blur-md px-8 py-4 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-white transition-all border border-black/5">
                See How It Works
              </a>
            </div>

          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-[400px] md:h-[600px] w-full flex items-center justify-center perspective-[1000px] overflow-hidden hidden md:flex"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-brand-red)] to-orange-400 rounded-3xl blur-[100px] opacity-20 transform scale-90"></div>
            
            {/* Resumes Fanned Out */}
            <div className="absolute inset-0 flex items-center justify-center z-10" style={{ transform: 'rotate(-15deg) translateX(-60px) translateY(20px)' }}>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="w-[80%] max-w-[340px] aspect-[1/1.4] rounded-2xl shadow-2xl border border-white/20 overflow-hidden"
              >
                <img src="/rem1.jpg" alt="Resume 1" className="w-full h-full object-cover" />
              </motion.div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center z-20" style={{ transform: 'translateZ(20px)' }}>
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="w-[80%] max-w-[340px] aspect-[1/1.4] rounded-2xl shadow-2xl border border-white/20 overflow-hidden"
              >
                <img src="/rem2.jpg" alt="Resume 2" className="w-full h-full object-cover" />
              </motion.div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center z-30" style={{ transform: 'rotate(15deg) translateX(60px) translateY(10px)' }}>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="w-[80%] max-w-[340px] aspect-[1/1.4] rounded-2xl shadow-2xl border border-white/20 overflow-hidden"
              >
                <img src="/rem3.jpg" alt="Resume 3" className="w-full h-full object-cover" />
              </motion.div>
            </div>

            {/* Badges */}
            <motion.div 
              animate={{ y: -12 }}
              transition={{ duration: 4, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
              style={{ willChange: 'transform' }}
              className="absolute top-10 left-0 z-40 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <Target size={24} />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-600">Match Score</div>
                <div className="text-2xl font-heading font-bold text-green-600">94%</div>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: 15 }}
              transition={{ duration: 5, repeat: Infinity, repeatType: "mirror", ease: "easeInOut", delay: 1 }}
              style={{ willChange: 'transform' }}
              className="absolute bottom-20 right-0 z-40 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <Sparkles size={24} />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-600">AI Analysis</div>
                <div className="text-lg font-heading font-bold text-blue-600">12 Suggestions</div>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: -10 }}
              transition={{ duration: 4.5, repeat: Infinity, repeatType: "mirror", ease: "easeInOut", delay: 2 }}
              style={{ willChange: 'transform' }}
              className="absolute top-48 right-0 z-40 bg-[var(--color-brand-black)] p-4 rounded-2xl shadow-xl flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white">
                <Download size={24} />
              </div>
              <div>
                <div className="text-sm font-bold text-white/60">Ready to</div>
                <div className="text-lg font-heading font-bold text-white">Download PDF</div>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 md:px-12 max-w-7xl mx-auto w-full">
        <FadeIn className="flex flex-col items-center text-center gap-4 mb-20">
          <h2 className="text-4xl md:text-5xl font-heading font-bold tracking-tight">Precision tools for the modern job hunt</h2>
          <p className="text-lg opacity-60 max-w-2xl">Stop guessing what the ATS wants. Our AI engine breaks down the job description and builds you the perfect bridge to an interview.</p>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: <Target />, title: "Resume Match Score", desc: "Get an instant percentage score showing exactly how well your current resume aligns with the target role." },
            { icon: <Zap />, title: "Missing Skills Detection", desc: "Instantly identify the keywords and technologies you need to add to pass the ATS filters." },
            { icon: <Sparkles />, title: "AI Suggestions", desc: "Receive line-by-line recommendations to make your bullet points more impactful and results-oriented." },
            { icon: <RotateCcw />, title: "Resume Rewriting", desc: "Let our AI instantly rewrite your experience section to directly address the employer's needs." },
            { icon: <FileText />, title: "Template Selection", desc: "Export your newly optimized content into beautifully crafted, ATS-friendly templates." },
            { icon: <Clock />, title: "Analysis History", desc: "Keep track of every role you've applied for with saved resume iterations and scores." }
          ].map((feature, idx) => (
            <FadeIn key={idx} delay={idx * 0.1}>
              <div className="glass-card p-8 rounded-3xl h-full hover:-translate-y-2 transition-transform duration-300">
                <div className="w-14 h-14 rounded-2xl bg-[var(--color-brand-red)]/10 text-[var(--color-brand-red)] flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-heading font-bold mb-3">{feature.title}</h3>
                <p className="opacity-60 leading-relaxed">{feature.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="px-6 md:px-12 max-w-7xl mx-auto w-full py-24">
        <FadeIn>
          <div className="bg-[var(--color-brand-black)] text-white rounded-[3rem] p-12 md:p-24 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-brand-red)] rounded-full blur-[120px] opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row gap-20">
              <div className="md:w-1/3 flex flex-col gap-6">
                <h2 className="text-4xl md:text-5xl font-heading font-bold tracking-tight">How it works</h2>
                <p className="text-white/60 text-lg">Five simple steps to a resume that stands out from the pile and gets you interviews.</p>
                <Link href="/login" className="inline-flex items-center gap-2 text-[var(--color-brand-red)] hover:text-white transition-colors font-medium mt-4 w-fit">
                  Start optimizing now <ArrowRight size={18} />
                </Link>
              </div>
              
              <div className="md:w-2/3 flex flex-col gap-12">
                {[
                  { step: "01", title: "Paste Resume", desc: "Upload your current PDF or just paste the text." },
                  { step: "02", title: "Add Job Description", desc: "Paste the exact listing you're applying for." },
                  { step: "03", title: "Select Template", desc: "Choose a premium design for your industry." },
                  { step: "04", title: "Get AI Analysis", desc: "Watch as our engine scores and critiques your fit." },
                  { step: "05", title: "Improve Resume", desc: "Apply 1-click rewrites and download your new resume." }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-6 group">
                    <div className="text-3xl font-heading font-bold text-white/40 group-hover:text-[var(--color-brand-red)] transition-colors">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="text-2xl font-heading font-bold mb-2">{item.title}</h3>
                      <p className="text-white/60">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Final CTA Section */}
      <section className="px-6 md:px-12 max-w-4xl mx-auto w-full text-center pb-32">
        <FadeIn className="flex flex-col items-center gap-10">
          <h2 className="text-5xl md:text-7xl font-heading font-bold tracking-tight leading-[1.1]">
            Ready to land your <br/><span className="text-[var(--color-brand-red)]">dream role?</span>
          </h2>
          <p className="text-xl opacity-60 max-w-2xl">
            Join thousands of professionals who have upgraded their careers with Resume Booster.
          </p>
          <Link href="/login" className="bg-[var(--color-brand-black)] text-white px-10 py-5 rounded-full text-lg font-medium hover:bg-[var(--color-brand-red)] transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-black/10">
            Create Free Account
          </Link>
        </FadeIn>
      </section>

    </div>
  );
}
