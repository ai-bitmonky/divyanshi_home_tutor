import type { MetadataRoute } from "next";

/** Web app manifest → /manifest.webmanifest (installable PWA; opens straight into Find tutors) */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/tutors?source=pwa",
    name: "TutorForMe",
    short_name: "TutorForMe",
    description: "Book a free demo class with an ID-checked home tutor near you in Delhi NCR. Pay only if you continue.",
    start_url: "/tutors?source=pwa",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#F4F3EE",
    theme_color: "#F4F3EE",
    categories: ["education"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
