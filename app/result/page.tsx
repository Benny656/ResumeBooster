"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ResultPage() {
  const router = useRouter();
  const [rewrittenResume, setRewrittenResume] = useState("");
  const [copied, setCopied] = useState(false);
  const [user, setUser] = useState<{ name: string, email: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error(e);
      }
    }

    const savedResume = sessionStorage.getItem("rb_rewrittenResume");
    if (savedResume) {
      setRewrittenResume(savedResume);
    }

    // Check if we need to trigger download after login
    if (sessionStorage.getItem("rb_triggerDownload") === "true") {
      sessionStorage.removeItem("rb_triggerDownload");
      if (storedUser) {
        setTimeout(() => {
          triggerPDFDownload(savedResume || "");
        }, 500);
      }
    }
  }, [router]);

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
      sessionStorage.setItem("rb_triggerDownload", "true");
      router.push("/login");
    } else {
      triggerPDFDownload();
    }
  };

  const handleBackToInput = () => {
    router.push("/");
  };

  if (!rewrittenResume) return null;

  return (
    <main className="flex flex-col items-center pt-12 px-4 pb-12 w-full max-w-full">
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
    </main>
  );
}
