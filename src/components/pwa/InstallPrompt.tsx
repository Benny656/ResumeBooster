"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
  prompt(): Promise<void>;
}

const DISMISS_KEY = "rb_install_prompt_dismissed";

/**
 * InstallPrompt
 * Shows a subtle, dismissible "Install App" banner at the bottom of the screen
 * when the browser fires the beforeinstallprompt event.
 * Persists dismissal in localStorage so it doesn't re-appear every session.
 */
export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Don't show if already dismissed this session
    if (typeof window === "undefined") return;

    const dismissed = localStorage.getItem(DISMISS_KEY);
    if (dismissed === "true") return;

    // Check if already running as standalone PWA
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Small delay so the page loads first — less intrusive
      setTimeout(() => setIsVisible(true), 3000);
    };

    const handleAppInstalled = () => {
      setIsVisible(false);
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsVisible(false);
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem(DISMISS_KEY, "true");
  };

  if (!isVisible || isInstalled || !deferredPrompt) return null;

  return (
    <div
      role="dialog"
      aria-label="Install ResumeBooster"
      aria-live="polite"
      style={{
        position: "fixed",
        bottom: "1.5rem",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        width: "calc(100% - 2rem)",
        maxWidth: "420px",
        backgroundColor: "#111111",
        borderRadius: "1.25rem",
        padding: "1rem 1.25rem",
        display: "flex",
        alignItems: "center",
        gap: "0.875rem",
        boxShadow: "0 20px 60px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.2)",
        animation: "slideUpIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      }}
    >
      <style>{`
        @keyframes slideUpIn {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>

      {/* Icon */}
      <div
        style={{
          width: "2.5rem",
          height: "2.5rem",
          borderRadius: "0.625rem",
          backgroundColor: "#C1121F",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Download size={18} color="#FFFFFF" />
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            margin: 0,
            fontSize: "0.875rem",
            fontWeight: 700,
            color: "#FFFFFF",
            fontFamily: "'Space Grotesk', sans-serif",
            lineHeight: 1.3,
          }}
        >
          Install ResumeBooster
        </p>
        <p
          style={{
            margin: "0.125rem 0 0",
            fontSize: "0.75rem",
            color: "rgba(255,255,255,0.6)",
            fontFamily: "'Outfit', sans-serif",
            lineHeight: 1.4,
          }}
        >
          Add to home screen for quick access
        </p>
      </div>

      {/* Install button */}
      <button
        id="pwa-install-btn"
        onClick={handleInstall}
        style={{
          backgroundColor: "#FFFFFF",
          color: "#111111",
          border: "none",
          borderRadius: "2rem",
          padding: "0.5rem 1rem",
          fontSize: "0.8125rem",
          fontWeight: 700,
          cursor: "pointer",
          flexShrink: 0,
          fontFamily: "'Space Grotesk', sans-serif",
          transition: "opacity 0.15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        Install
      </button>

      {/* Dismiss button */}
      <button
        id="pwa-dismiss-btn"
        onClick={handleDismiss}
        aria-label="Dismiss install prompt"
        style={{
          background: "none",
          border: "none",
          color: "rgba(255,255,255,0.5)",
          cursor: "pointer",
          padding: "0.25rem",
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
          transition: "color 0.15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.9)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
      >
        <X size={18} />
      </button>
    </div>
  );
}
