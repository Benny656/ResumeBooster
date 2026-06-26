"use client";

import { WifiOff, Sparkles, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function OfflinePage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ backgroundColor: "#F8F4EE" }}
    >
      {/* Brand mark */}
      <div className="mb-10 flex flex-col items-center gap-4">
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl"
          style={{ backgroundColor: "#111111" }}
        >
          <span
            className="text-3xl font-bold tracking-tight"
            style={{ color: "#FFFFFF", fontFamily: "'Space Grotesk', sans-serif" }}
          >
            RB
          </span>
        </div>
        <span
          className="text-2xl font-bold tracking-tight"
          style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#111111" }}
        >
          ResumeBooster
        </span>
      </div>

      {/* Offline icon */}
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center mb-8"
        style={{ backgroundColor: "rgba(193,18,31,0.08)" }}
      >
        <WifiOff size={40} style={{ color: "#C1121F" }} />
      </div>

      {/* Heading */}
      <h1
        className="text-4xl md:text-5xl font-bold mb-4 leading-tight"
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          color: "#111111",
          letterSpacing: "-0.02em",
        }}
      >
        You&apos;re offline
      </h1>

      <p className="text-lg mb-3 max-w-md" style={{ color: "#111111", opacity: 0.65 }}>
        It looks like your internet connection is unavailable right now.
      </p>

      {/* AI features notice */}
      <div
        className="flex items-start gap-3 rounded-2xl px-6 py-4 mb-10 max-w-md text-left"
        style={{
          backgroundColor: "rgba(193,18,31,0.06)",
          border: "1px solid rgba(193,18,31,0.15)",
        }}
      >
        <Sparkles
          size={18}
          className="shrink-0 mt-0.5"
          style={{ color: "#C1121F" }}
        />
        <p className="text-sm leading-relaxed" style={{ color: "#111111", opacity: 0.75 }}>
          <span className="font-semibold" style={{ opacity: 1 }}>
            AI features require an internet connection.
          </span>{" "}
          Resume analysis, generation, and optimization will be available once
          you&apos;re back online.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => window.location.reload()}
          className="flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold transition-all hover:scale-105 active:scale-95 shadow-xl"
          style={{
            backgroundColor: "#111111",
            color: "#FFFFFF",
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          <RefreshCw size={18} />
          Try Again
        </button>

        <Link
          href="/"
          className="flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold transition-all hover:scale-105 active:scale-95"
          style={{
            backgroundColor: "rgba(255,255,255,0.7)",
            color: "#111111",
            border: "1px solid rgba(17,17,17,0.1)",
            fontFamily: "'Space Grotesk', sans-serif",
            backdropFilter: "blur(8px)",
          }}
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
