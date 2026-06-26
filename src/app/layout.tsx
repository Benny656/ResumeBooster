import "@/app/globals.css";
import { MainLayout } from "@/components/layout/MainLayout";
import { Providers } from "@/components/Providers";
import { ServiceWorkerRegister } from "@/components/pwa/ServiceWorkerRegister";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "ResumeBooster — AI Resume Optimizer",
  description:
    "AI-powered ATS Resume Analyzer and Resume Builder. Upload your resume, paste a job description, and get an instant match score with AI-generated improvements.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ResumeBooster",
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  themeColor: "#111111",
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <MainLayout>{children}</MainLayout>
        </Providers>
        <ServiceWorkerRegister />
        <InstallPrompt />
      </body>
    </html>
  );
}
