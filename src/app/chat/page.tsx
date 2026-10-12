import type { Metadata } from "next";
import { ChatScreen } from "@/components/screens/Chat";

export const metadata: Metadata = { title: "Chat · TutorForMe" };

export default function Page() {
  return <ChatScreen />;
}
