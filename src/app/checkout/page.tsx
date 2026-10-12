import type { Metadata } from "next";
import { CheckoutScreen } from "@/components/screens/Payments";

export const metadata: Metadata = { title: "Checkout · TutorForMe" };

export default function Page() {
  return <CheckoutScreen />;
}
