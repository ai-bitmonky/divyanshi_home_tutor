import type { Metadata } from "next";
import { PlansScreen } from "@/components/screens/Payments";

export const metadata: Metadata = { title: "Choose a plan · TutorForMe" };

export default function Page() {
  return <PlansScreen />;
}
