"use client";

import React, { useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { LayoutDashboard, History, LogOut, LogIn } from "lucide-react";

export function NavbarAuth() {
  const { data: session, status } = useSession();
  const [open, setOpen] = React.useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Loading skeleton — prevents layout shift / flash
  if (status === "loading") {
    return (
      <div className="w-9 h-9 rounded-full bg-black/10 animate-pulse" />
    );
  }

  // Not signed in
  if (status === "unauthenticated" || !session?.user) {
    return (
      <Link
        href="/login"
        className="bg-[var(--color-brand-black)] text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-[var(--color-brand-red)] transition-colors flex items-center gap-2"
      >
        <LogIn size={15} strokeWidth={2.5} />
        Sign In
      </Link>
    );
  }

  const user = session.user;
  const initial = user.name?.trim().charAt(0).toUpperCase() ?? "?";

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <button
        id="navbar-avatar-btn"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Open profile menu"
        aria-expanded={open}
        aria-haspopup="true"
        className="flex items-center gap-2 group"
      >
        <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-transparent group-hover:ring-[var(--color-brand-red)] transition-all duration-200 flex-shrink-0">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name ?? "Profile"}
              width={36}
              height={36}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full bg-[var(--color-brand-red)] text-white flex items-center justify-center font-heading font-bold text-sm">
              {initial}
            </div>
          )}
        </div>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="navbar-profile-dropdown"
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-[calc(100%+10px)] w-64 glass-card rounded-2xl overflow-hidden shadow-xl shadow-black/10 border border-black/5 z-50"
          >
            {/* Profile Header */}
            <div className="px-4 py-4 flex items-center gap-3 border-b border-black/5">
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name ?? "Profile"}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full bg-[var(--color-brand-red)] text-white flex items-center justify-center font-heading font-bold text-sm">
                    {initial}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="font-heading font-semibold text-sm truncate">
                  {user.name ?? "User"}
                </p>
                <p className="text-xs opacity-50 truncate">{user.email}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="py-2">
              <DropdownItem
                href="/dashboard"
                icon={<LayoutDashboard size={15} strokeWidth={2} />}
                label="Dashboard"
                onClick={() => setOpen(false)}
              />
              <DropdownItem
                href="/history"
                icon={<History size={15} strokeWidth={2} />}
                label="History"
                onClick={() => setOpen(false)}
              />
            </div>

            {/* Sign Out */}
            <div className="border-t border-black/5 py-2">
              <button
                id="navbar-signout-btn"
                onClick={() => {
                  setOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={15} strokeWidth={2} />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Small helper to keep the JSX clean
function DropdownItem({
  href,
  icon,
  label,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-black/5 transition-colors"
    >
      <span className="opacity-50">{icon}</span>
      {label}
    </Link>
  );
}
