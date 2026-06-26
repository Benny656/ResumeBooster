"use client";

import React from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { Compass, LayoutDashboard } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center text-center min-h-[70vh] px-6 gap-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center gap-6"
      >
        {/* Big 404 */}
        <div className="relative select-none">
          <span
            className="font-heading font-bold text-[10rem] leading-none text-[var(--color-brand-black)] opacity-5"
            aria-hidden="true"
          >
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-black/5 flex items-center justify-center">
              <Compass size={44} className="text-black/30" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="flex flex-col gap-3 max-w-sm">
          <h1 className="font-heading font-bold text-3xl text-[var(--color-brand-black)]">
            Page not found
          </h1>
          <p className="text-sm opacity-60 leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved. Let&apos;s get you back on track.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 flex-wrap justify-center mt-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 bg-[var(--color-brand-black)] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[var(--color-brand-red)] transition-colors"
          >
            <LayoutDashboard size={14} />
            Go to Dashboard
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 border border-black/15 text-[var(--color-brand-black)] px-6 py-2.5 rounded-full text-sm font-medium hover:bg-black/5 transition-colors"
          >
            Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
