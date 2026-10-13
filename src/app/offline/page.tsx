import type { Metadata } from "next";
import { OfflineScreen } from "@/components/screens/Offline";

export const metadata: Metadata = { title: "Offline · TutorForMe" };

/** Served by the service worker when a page can't be reached and isn't cached */
export default function OfflinePage() {
  return <OfflineScreen />;
}
