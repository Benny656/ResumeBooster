"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const wordVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.215, 0.61, 0.355, 1] as const, // easeOutCubic
    },
  },
};

const titleWords = "Resume Booster".split(" ");
const descWords = "Paste your resume and a job description to get a rewritten, job-ready resume instantly.".split(" ");

interface User {
  name: string;
  email: string;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [industry, setIndustry] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rewrittenResume, setRewrittenResume] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [copied, setCopied] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  // Check login state on mount
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Restore state after redirecting back from login page
  useEffect(() => {
    const savedResume = sessionStorage.getItem("rb_rewrittenResume");
    if (savedResume) {
      setRewrittenResume(savedResume);
      setShowResult(true);

      const savedJob = sessionStorage.getItem("rb_jobDescription") || "";
      setJobDescription(savedJob);

      const savedInd = sessionStorage.getItem("rb_industry") || "";
      setIndustry(savedInd);

      // Clear the session values
      sessionStorage.removeItem("rb_rewrittenResume");
      sessionStorage.removeItem("rb_jobDescription");
      sessionStorage.removeItem("rb_industry");

      // Trigger download if requested
      if (sessionStorage.getItem("rb_triggerDownload") === "true") {
        sessionStorage.removeItem("rb_triggerDownload");
        const stored = localStorage.getItem("user");
        if (stored) {
          setTimeout(() => {
            triggerPDFDownload(savedResume);
          }, 500);
        }
      }
    }
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate AI rewriting process
    setTimeout(() => {
      setIsSubmitting(false);
      setRewrittenResume(
        `[REWRITTEN RESUME - ${industry.toUpperCase() || "GENERAL"} INDUSTRY]\n\n` +
        `SUMMARY\n` +
        `Highly motivated professional with experience tailored for the requested role. Skilled in aligning key methodologies with industry requirements, optimizing project deliverables, and collaborating across cross-functional teams.\n\n` +
        `PROFESSIONAL EXPERIENCE\n` +
        `- Successfully implemented strategic initiatives matching the target job description.\n` +
        `- Optimized workflows, leading to measurable efficiency improvements.\n` +
        `- Translated business goals into actionable development paths.\n\n` +
        `Job Description match score: 98%\n` +
        `Keywords optimized: Analysis, Execution, Industry Best Practices.`
      );
      setShowResult(true);
    }, 1200);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(rewrittenResume);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const triggerPDFDownload = (contentToDownload = rewrittenResume) => {
    const element = document.createElement("a");
    const file = new Blob([contentToDownload], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "rewritten_resume.pdf";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadPDF = () => {
    if (!user) {
      // Save form states so they are not lost on redirect
      sessionStorage.setItem("rb_jobDescription", jobDescription);
      sessionStorage.setItem("rb_industry", industry);
      sessionStorage.setItem("rb_rewrittenResume", rewrittenResume);
      sessionStorage.setItem("rb_triggerDownload", "true");

      // Redirect to login page
      window.location.href = "/login";
    } else {
      triggerPDFDownload();
    }
  };

  const handleBackToInput = () => {
    setShowResult(false);
  };

  const getFirstName = (fullName: string) => {
    if (!fullName) return "";
    return fullName.trim().split(" ")[0];
  };

  return (
    <>
      <nav className="w-full flex items-center justify-between h-[60px] px-6 bg-[#E63946]">
        <Link href="/" className="no-underline">
          <span className="text-xl font-bold text-[#FDF6EC] cursor-pointer">Resume Booster</span>
        </Link>
        <div className="flex items-center">
          {user ? (
            <Link href="/history" className="text-[#FDF6EC] no-underline font-medium text-base hover:text-white transition-colors cursor-pointer">
              History
            </Link>
          ) : (
            <Link href="/login" className="text-[#FDF6EC] no-underline font-medium text-base hover:text-white transition-colors cursor-pointer">
              Login
            </Link>
          )}
        </div>
      </nav>

      <main className="flex flex-col items-center pt-12 px-4 pb-12 w-full max-w-full">
        {!showResult ? (
          <>
            <motion.div 
              key={animKey}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              onClick={() => setAnimKey(prev => prev + 1)}
              className="text-center mb-10 mt-4 cursor-pointer select-none"
            >
              <h1 className="text-5xl md:text-6xl font-bold text-[#1a1a1a] mb-3 tracking-tight flex flex-wrap justify-center gap-x-3 gap-y-1">
                {titleWords.map((word, index) => (
                  <motion.span 
                    key={index} 
                    variants={wordVariants}
                    className="inline-block"
                  >
                    {word}
                  </motion.span>
                ))}
              </h1>
              <p className="text-[#1a1a1a] opacity-80 text-lg md:text-xl max-w-2xl mx-auto flex flex-wrap justify-center gap-x-2 gap-y-1 mt-4">
                {descWords.map((word, index) => (
                  <motion.span 
                    key={index} 
                    variants={wordVariants}
                    className="inline-block"
                  >
                    {word}
                  </motion.span>
                ))}
              </p>
            </motion.div>

            <form onSubmit={handleSubmit} className="w-full max-w-[800px] mx-auto flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full items-stretch">
                {/* Left Column (Upload Box) */}
                <div className="flex items-center justify-center w-full">
                  <div className={`relative flex flex-col items-center justify-center w-full max-w-[340px] aspect-square border-2 border-dashed border-[#E63946] rounded-2xl bg-transparent p-6 text-center cursor-pointer transition-colors ${resumeFile ? 'bg-[#E63946]/5' : 'hover:bg-[#E63946]/5'}`}>
                    <input
                      type="file"
                      accept=".pdf,.txt"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      id="resume-upload"
                      required
                    />
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-12 h-12 text-[#E63946] mb-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                      <span className="text-[#1a1a1a] font-medium text-base max-w-[200px] break-words">
                        {resumeFile ? resumeFile.name : "Upload Resume (.pdf or .txt)"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Column (Input Card) */}
                <div 
                  className="flex flex-col gap-5 justify-center shadow-sm"
                  style={{
                    background: "rgba(255,255,255,0.3)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.5)",
                    borderRadius: "16px",
                    padding: "24px"
                  }}
                >
                  <div className="flex flex-col gap-2">
                    <label htmlFor="job-description" className="text-[#1a1a1a] font-semibold text-sm">
                      Job Description
                    </label>
                    <textarea
                      id="job-description"
                      className="w-full h-32 p-3 rounded-lg border border-white/50 bg-white/20 text-[#1a1a1a] placeholder:text-[#1a1a1a]/50 focus:outline-none focus:ring-1 focus:ring-[#E63946] resize-none"
                      placeholder="Paste the job description here"
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="industry" className="text-[#1a1a1a] font-semibold text-sm">
                      Industry
                    </label>
                    <input
                      id="industry"
                      type="text"
                      className="w-full p-3 rounded-lg border border-white/50 bg-white/20 text-[#1a1a1a] placeholder:text-[#1a1a1a]/50 focus:outline-none focus:ring-1 focus:ring-[#E63946]"
                      placeholder="e.g. Software, Marketing"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full py-4 px-6 rounded-full bg-[#E63946] text-white font-bold text-lg hover:bg-[#d62839] active:bg-[#b51a2b] transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Rewriting..." : "Rewrite My Resume"}
              </button>
            </form>
          </>
        ) : (
          <div className="form-container" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div className="header-section" style={{ marginBottom: "1.5rem" }}>
              <h1 className="page-title">Your Rewritten Resume</h1>
            </div>

            <div className="form-group">
              <textarea
                className="result-textarea"
                value={rewrittenResume}
                readOnly
              />
            </div>

            <div className="button-row">
              <button onClick={handleCopyToClipboard} className="btn-copy">
                {copied ? "Copied!" : "Copy to Clipboard"}
              </button>
              <button onClick={handleDownloadPDF} className="btn-download">
                Download as PDF
              </button>
            </div>

            <button onClick={handleBackToInput} className="btn-back">
              ← Edit Input / Go Back
            </button>
          </div>
        )}
      </main>
    </>
  );
}
