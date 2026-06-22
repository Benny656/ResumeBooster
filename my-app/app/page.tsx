"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

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
      <nav className="navbar">
        <Link href="/" style={{ textDecoration: "none" }}>
          <span className="navbar-logo" style={{ cursor: "pointer" }}>Resume Booster</span>
        </Link>
        <div className="navbar-right">
          {user ? (
            <Link href="/history" className="navbar-link">
              History
            </Link>
          ) : (
            <Link href="/login" className="navbar-link">
              Login
            </Link>
          )}
        </div>
      </nav>

      <main className="main-container">
        {!showResult ? (
          <>
            <div className="header-section">
              <h1 className="page-title">Resume Booster</h1>
              <p className="page-subtext">
                Paste your resume and a job description. Get a rewritten, job-ready resume instantly.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="form-container">
              <div className="form-group">
                <span className="form-label">Upload Resume</span>
                <div className="file-upload-wrapper">
                  <div className={`file-upload-button ${resumeFile ? "file-selected" : ""}`}>
                    <span>{resumeFile ? resumeFile.name : "Choose .pdf or .txt file"}</span>
                    <span style={{ fontSize: "0.85rem", opacity: 0.6 }}>Browse</span>
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.txt"
                    onChange={handleFileChange}
                    className="file-upload-input"
                    id="resume-upload"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="job-description" className="form-label">
                  Job Description
                </label>
                <textarea
                  id="job-description"
                  className="input-textarea"
                  placeholder="Paste the job description here"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="industry" className="form-label">
                  Industry
                </label>
                <input
                  id="industry"
                  type="text"
                  className="input-text"
                  placeholder="e.g. Software, Marketing"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn-submit" disabled={isSubmitting}>
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
