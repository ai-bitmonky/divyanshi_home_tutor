import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchParamsSync, TutorsScreen } from "@/components/screens/Tutors";

export const metadata: Metadata = { title: "Find tutors · TutorForMe" };

export default function TutorsPage() {
  return (
    <>
      {/* URL deep links (?subject=…) are read client-side; the rest of the page is prerendered */}
      <Suspense fallback={null}>
        <SearchParamsSync />
      </Suspense>
      <TutorsScreen />
    </>
  );
}
