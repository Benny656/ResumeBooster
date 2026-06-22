"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface User {
  name: string;
  email: string;
}

interface HistoryItem {
  id: string;
  jobTitle: string;
  industry: string;
  date: string;
  rewrittenResume: string;
}

const mockHistoryData: HistoryItem[] = [
  {
    id: "1",
    jobTitle: "Senior React Engineer",
    industry: "Software Development",
    date: "2026-06-22",
    rewrittenResume: `[REWRITTEN RESUME - SOFTWARE DEVELOPMENT]

SUMMARY
Highly motivated React Engineer with extensive experience building fast, modular client-side interfaces. Optimized performance for large-scale single-page apps.

EXPERIENCE
- Built 15+ complex React components using flat, modern styling methodologies.
- Reduced initial paint times by 35% using Next.js compiler optimizations.

Skills: React, JavaScript, HTML, Vanilla CSS, Next.js.`
  },
  {
    id: "2",
    jobTitle: "Growth Marketing Lead",
    industry: "Marketing",
    date: "2026-06-20",
    rewrittenResume: `[REWRITTEN RESUME - MARKETING]

SUMMARY
Result-oriented Growth Marketing Lead. Proven track record of scaling consumer acquisition channels and implementing data-driven campaigns.

EXPERIENCE
- Optimized landing pages, improving conversion rates by 12%.
- Managed monthly growth marketing pipelines across primary search and social channels.`
  }
];

export default function HistoryPage() {
  const [user, setUser] = useState<User | null>(null);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);

  // Check login state and load history on mount
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
        // If logged in, show the mock history
        setHistoryItems(mockHistoryData);
      } catch (e) {
        console.error(e);
      }
    } else {
      // If not logged in, history remains empty
      setHistoryItems([]);
    }
  }, []);

  const handleViewResult = (item: HistoryItem) => {
    // Save items to session storage to restore on homepage mount
    sessionStorage.setItem("rb_jobDescription", `Mock Job Description for ${item.jobTitle}`);
    sessionStorage.setItem("rb_industry", item.industry);
    sessionStorage.setItem("rb_rewrittenResume", item.rewrittenResume);
    
    // Redirect to home page
    window.location.href = "/";
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
        <div className="form-container" style={{ maxWidth: "600px" }}>
          <div className="header-section" style={{ marginBottom: "2rem" }}>
            <h1 className="page-title">Your History</h1>
          </div>

          {historyItems.length > 0 ? (
            <div className="history-list">
              {historyItems.map((item) => (
                <div key={item.id} className="history-item">
                  <div className="history-info">
                    <span className="history-title">
                      {item.jobTitle} • {item.industry}
                    </span>
                    <span className="history-date">Submitted: {item.date}</span>
                  </div>
                  <button
                    onClick={() => handleViewResult(item)}
                    className="btn-small-red"
                  >
                    View Result
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="page-subtext" style={{ textAlign: "center", marginTop: "2rem" }}>
              No past resumes yet. Submit one to get started.
            </p>
          )}
        </div>
      </main>
    </>
  );
}
