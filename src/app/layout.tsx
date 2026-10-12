import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { AppShell } from "@/components/AppShell";
import { SvgDefs } from "@/components/Portrait";
import { ToastProvider } from "@/components/Toast";
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
  icons: { icon: [{ url: "/favicon.svg", type: "image/svg+xml" }] },
};

export const viewport: Viewport = {
  themeColor: "#F4F3EE",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${inter.variable} ${interExt.variable}`}>
      <body>
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
