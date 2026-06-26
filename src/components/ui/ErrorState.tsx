"use client";

import React from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message?: string;
  /** Label for the primary action (e.g. "Try Again") */
  retryLabel?: string;
  onRetry?: () => void;
  /** Label for the secondary nav link (e.g. "Back to Dashboard") */
  backLabel?: string;
  backHref?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  retryLabel,
  onRetry,
  backLabel = "Back to Dashboard",
  backHref = "/dashboard",
}: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center text-center py-20 px-6 gap-5"
    >
      {/* Icon bubble */}
      <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
        <AlertTriangle size={36} className="text-red-500" strokeWidth={1.5} />
      </div>

      {/* Text */}
      <div className="flex flex-col gap-2 max-w-sm">
        <h3 className="font-heading font-bold text-xl text-[var(--color-brand-black)]">
          {title}
        </h3>
        <p className="text-sm opacity-60 leading-relaxed">{message}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 mt-2 flex-wrap justify-center">
        {retryLabel && onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 bg-[var(--color-brand-black)] text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-[var(--color-brand-red)] transition-colors"
          >
            <RefreshCw size={14} />
            {retryLabel}
          </button>
        )}
        {backHref && backLabel && (
          <Link
            href={backHref}
            className="flex items-center gap-2 border border-black/15 text-[var(--color-brand-black)] px-5 py-2.5 rounded-full text-sm font-medium hover:bg-black/5 transition-colors"
          >
            <ArrowLeft size={14} />
            {backLabel}
          </Link>
        )}
      </div>
    </motion.div>
  );
}
