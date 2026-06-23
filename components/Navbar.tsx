"use client";

import React from "react";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between h-[60px] px-6 bg-[#E63946]">
      <Link href="/" className="no-underline">
        <span className="text-xl font-bold text-[#FDF6EC] cursor-pointer">Resume Booster</span>
      </Link>
      <div className="flex items-center">
        <Link href="/history" className="text-[#FDF6EC] no-underline font-medium text-base hover:text-white transition-colors cursor-pointer">
          History
        </Link>
      </div>
    </nav>
  );
}
