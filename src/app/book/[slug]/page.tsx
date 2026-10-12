import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookingFlow } from "@/components/screens/Booking";
import { TUTORS, tutorBySlug } from "@/lib/data";

export function generateStaticParams() {
  return TUTORS.filter((t) => t.acceptingStudents).map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const t = tutorBySlug(slug);
  return t ? { title: `Book a free demo with ${t.name} · TutorForMe` } : {};
}

export default async function BookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = tutorBySlug(slug);
  if (!t || !t.acceptingStudents) notFound();
  return <BookingFlow slug={slug} />;
}
