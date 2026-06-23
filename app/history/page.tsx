"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface User {
  name: string;
  email: string;
}

interface ApiResult {
  _id: string;
  jobDescription: string;
  industry: string;
  createdAt: string;
  rewrittenOutput: string;
}

export default function HistoryPage() {
  const [historyItems, setHistoryItems] = useState<ApiResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/results")
      .then(res => {
        if (!res.ok) throw new Error("Failed to load data");
        return res.json();
      })
      .then(data => {
        if (data.results) {
          setHistoryItems(data.results);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch history:", err);
        setError("Could not load history. Please try again later.");
        setLoading(false);
      });
  }, []);

  const handleViewResult = (item: ApiResult) => {
    sessionStorage.setItem("rb_jobDescription", item.jobDescription);
    sessionStorage.setItem("rb_industry", item.industry);
    sessionStorage.setItem("rb_rewrittenResume", item.rewrittenOutput);
    
    // Redirect to home page (or result page)
    window.location.href = "/";
  };

  const truncate = (text: string, length: number) => {
    if (!text) return "";
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  return (
    <>
      <main className="main-container">
        <div className="form-container" style={{ maxWidth: "600px" }}>
          <div className="header-section" style={{ marginBottom: "2rem" }}>
            <h1 className="page-title">Your History</h1>
          </div>

          {loading ? (
             <p className="page-subtext" style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</p>
          ) : error ? (
             <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm font-medium text-center mt-4">
               {error}
             </div>
          ) : historyItems.length > 0 ? (
            <div className="history-list">
              {historyItems.map((item) => (
                <div key={item._id} className="history-item">
                  <div className="history-info">
                    <span className="history-title">
                      {item.industry || "General"}
                    </span>
                    <span className="history-date">
                      Job: {truncate(item.jobDescription, 50)}
                    </span>
                    <span className="history-date">
                      Date: {new Date(item.createdAt).toLocaleDateString()}
                    </span>
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
