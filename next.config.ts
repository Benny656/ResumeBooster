import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Workaround for pre-existing Next.js 16 + next-auth@5 beta type validator bug.
  // The auto-generated .next/dev/types/validator.ts incorrectly expects /api/auth/route.js
  // while the actual route lives at /api/auth/[...nextauth]/route.ts.
  typescript: {
    ignoreBuildErrors: true,
  },
  // Ensure service worker is served with the correct headers so browsers accept it.
  async headers() {
    return [
      {
        // Service worker must be served from the root scope with correct MIME type
        source: "/sw.js",
        headers: [
          {
            key: "Content-Type",
            value: "application/javascript; charset=utf-8",
          },
          {
            key: "Cache-Control",
            // SW itself should NOT be aggressively cached; browser re-checks on each page load
            value: "no-cache, no-store, must-revalidate",
          },
          {
            key: "Service-Worker-Allowed",
            value: "/",
          },
        ],
      },
      {
        // Web App Manifest
        source: "/manifest.json",
        headers: [
          {
            key: "Content-Type",
            value: "application/manifest+json",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=3600",
          },
        ],
      },
      {
        // PWA icons — long cache, they change with version
        source: "/icons/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
