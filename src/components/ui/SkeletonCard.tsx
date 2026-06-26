"use client";

import React from "react";

export function SkeletonCard() {
  return (
    <div className="glass-card p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden">
      <div className="flex items-center gap-6">
        {/* Circle score skeleton */}
        <div className="w-16 h-16 rounded-full skeleton flex-shrink-0" />

        {/* Text lines skeleton */}
        <div className="flex flex-col gap-3">
          <div className="skeleton h-5 w-40 rounded-lg" />
          <div className="skeleton h-3.5 w-56 rounded-lg" />
        </div>
      </div>

      {/* Right side skeleton */}
      <div className="flex items-center gap-3">
        <div className="skeleton h-7 w-28 rounded-lg" />
        <div className="skeleton h-9 w-9 rounded-full" />
      </div>
    </div>
  );
}

/** Renders `count` skeleton cards stacked */
export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
