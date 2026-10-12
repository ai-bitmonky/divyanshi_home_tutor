import type { Metadata } from "next";
import { ChatScreen } from "@/components/screens/Chat";
import { CHAT_IDS } from "@/lib/data";

export function generateStaticParams() {
  return CHAT_IDS.map((id) => ({ id }));
}

export const metadata: Metadata = { title: "Chat · TutorForMe" };

export default async function ChatThreadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ChatScreen id={id} />;
}
