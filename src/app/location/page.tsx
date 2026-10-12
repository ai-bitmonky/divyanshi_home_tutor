import type { Metadata } from "next";
import { LocationScreen } from "@/components/screens/Location";

export const metadata: Metadata = { title: "Allow location · TutorForMe" };

export default function LocationPage() {
  return <LocationScreen />;
}
