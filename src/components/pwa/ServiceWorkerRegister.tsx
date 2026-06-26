"use client";

import { useEffect } from "react";

/**
 * ServiceWorkerRegister
 * Mounts once in the root layout to register /sw.js.
 * Renders nothing — purely a side-effect component.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    const register = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });

        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              // New SW installed — optionally notify user to refresh
              console.log("[SW] New version available. Refresh to update.");
            }
          });
        });

        console.log("[SW] Registered successfully. Scope:", registration.scope);
      } catch (error) {
        console.warn("[SW] Registration failed:", error);
      }
    };

    // Defer registration until after page load to not block LCP
    if (document.readyState === "complete") {
      register();
    } else {
      window.addEventListener("load", register);
    }

    return () => {
      window.removeEventListener("load", register);
    };
  }, []);

  return null;
}
