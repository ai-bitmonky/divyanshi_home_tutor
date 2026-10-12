import type { Metadata } from "next";
import { ProfileScreen } from "@/components/screens/Profile";

export const metadata: Metadata = { title: "My profile · TutorForMe" };

export default function Page() {
  return <ProfileScreen />;
}
