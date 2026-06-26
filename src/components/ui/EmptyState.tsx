"use client";

import React from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  message: string;
  ctaLabel?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  message,
  ctaLabel,
  ctaHref,
  onCtaClick,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center text-center py-20 px-6 gap-5"
    >
      {/* Icon bubble */}
      <div className="w-20 h-20 rounded-full bg-black/5 flex items-center justify-center">
        <Icon size={36} className="text-black/30" strokeWidth={1.5} />
      </div>

      {/* Text */}
      <div className="flex flex-col gap-2 max-w-xs">
        <h3 className="font-heading font-bold text-xl text-[var(--color-brand-black)]">
          {title}
        </h3>
        <p className="text-sm opacity-60 leading-relaxed">{message}</p>
      </div>

      {/* CTA */}
      {(ctaLabel && ctaHref) ? (
        <Link
          href={ctaHref}
          className="mt-2 bg-[var(--color-brand-black)] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[var(--color-brand-red)] transition-colors"
        >
          {ctaLabel}
        </Link>
      ) : ctaLabel && onCtaClick ? (
        <button
          onClick={onCtaClick}
          className="mt-2 bg-[var(--color-brand-black)] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[var(--color-brand-red)] transition-colors"
        >
          {ctaLabel}
        </button>
      ) : null}
    </motion.div>
  );
}
