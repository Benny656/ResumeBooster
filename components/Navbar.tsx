"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface User {
  name: string;
  email: string;
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  return (
    <nav className="w-full flex items-center justify-between h-[60px] px-6 bg-[#E63946]">
      <Link href="/" className="no-underline">
        <span className="text-xl font-bold text-[#FDF6EC] cursor-pointer">Resume Booster</span>
      </Link>
      <div className="flex items-center">
        {user ? (
          <Link href="/history" className="text-[#FDF6EC] no-underline font-medium text-base hover:text-white transition-colors cursor-pointer">
            History
          </Link>
        ) : (
          <Link href="/login" className="text-[#FDF6EC] no-underline font-medium text-base hover:text-white transition-colors cursor-pointer">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
