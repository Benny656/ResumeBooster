"use client";

import React from "react";
import { motion } from "motion/react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  React.useEffect(() => {
    console.error("[GlobalError boundary]", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F8F4EE",
          fontFamily: "'Outfit', sans-serif",
        }}
      >
        <div
          style={{
            textAlign: "center",
            padding: "2rem",
            maxWidth: "480px",
            width: "100%",
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "#FEF2F2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem",
            }}
          >
            <AlertTriangle size={36} color="#EF4444" strokeWidth={1.5} />
          </div>
          <h1
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: "1.5rem",
              letterSpacing: "-0.02em",
              color: "#111111",
              margin: "0 0 0.75rem",
            }}
          >
            Something went wrong
          </h1>
          <p
            style={{
              fontSize: "0.9rem",
              color: "#111111",
              opacity: 0.55,
              lineHeight: 1.6,
              margin: "0 0 2rem",
            }}
          >
            An unexpected error occurred. Our team has been notified. You can
            try refreshing the page or go back to the home screen.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={reset}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "#111111",
                color: "#fff",
                border: "none",
                borderRadius: "999px",
                padding: "0.625rem 1.25rem",
                fontSize: "0.875rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <RefreshCw size={14} />
              Try Again
            </button>
            <a
              href="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                border: "1px solid rgba(17,17,17,0.15)",
                borderRadius: "999px",
                padding: "0.625rem 1.25rem",
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "#111111",
                textDecoration: "none",
              }}
            >
              <Home size={14} />
              Go Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
