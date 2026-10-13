import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { AppShell } from "@/components/AppShell";
import { SvgDefs } from "@/components/Portrait";
import { ToastProvider } from "@/components/Toast";
import { BOOT_SCRIPT } from "@/lib/boot";
import { StoreProvider } from "@/lib/store";
import "./globals.css";

/* Inter (OFL), self-hosted via next/font so builds never depend on reaching Google Fonts.
   Two variable files: basic Latin + Latin-extended (which carries the ₹ sign). */
const inter = localFont({
  src: "./fonts/Inter-latin-var.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
  adjustFontFallback: false, // the system-ui fallback stack lives in --font (globals.css)
});
const interExt = localFont({
  src: "./fonts/Inter-latin-ext-var.woff2",
  variable: "--font-inter-ext",
  weight: "100 900",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: "TutorForMe — Verified home tutors, right at home",
  description: "Book a free demo class with an ID-checked home tutor near you in Delhi NCR. Pay only if you continue.",
  applicationName: "TutorForMe",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "TutorForMe" },
  formatDetection: { telephone: false },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#F4F3EE",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  /* pinch-zoom stays on for the website; the installed app turns it off client-side (NativeChrome) */
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    /* the boot script adds data-mode / data-standalone / data-splash before first paint */
    <html lang="en-IN" className={`${inter.variable} ${interExt.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
      </head>
      <body>
        {/* standalone cold-start splash (hidden unless html[data-splash]) */}
        <div className="m-splash" aria-hidden="true">
          <svg viewBox="0 0 64 64" width="84" height="84">
            <rect width="64" height="64" rx="14" fill="#1D3557" />
            <path d="M18 17h28v8H36.5v24h-9V25H18z" fill="#0A9A8A" />
          </svg>
          <span className="logo">
            Tutor<span>For</span>Me
          </span>
        </div>
        <SvgDefs />
        <StoreProvider>
          <ToastProvider>
            <AppShell>{children}</AppShell>
          </ToastProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
