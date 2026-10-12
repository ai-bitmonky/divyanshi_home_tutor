import type { Metadata } from "next";
import { PaidScreen } from "@/components/screens/Payments";

export const metadata: Metadata = { title: "Payment done · TutorForMe" };

export default function Page() {
  return <PaidScreen />;
}
