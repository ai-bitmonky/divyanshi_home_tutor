import type { Metadata } from "next";
import { ClassesScreen } from "@/components/screens/Classes";

export const metadata: Metadata = { title: "Classes · TutorForMe" };

export default function Page() {
  return <ClassesScreen />;
}
