import type { Metadata } from "next";
import { AiScreen } from "@/components/screens/Ai";

export const metadata: Metadata = { title: "AI Assist · TutorForMe" };

export default function Page() {
  return <AiScreen />;
}
