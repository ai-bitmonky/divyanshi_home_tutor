import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TutorProfile } from "@/components/screens/TutorProfile";
import { TUTORS, tutorBySlug } from "@/lib/data";

export function generateStaticParams() {
  return TUTORS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const t = tutorBySlug(slug);
  return t ? { title: `${t.name} — ${t.headline} · TutorForMe`, description: t.bio } : {};
}

export default async function TutorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!tutorBySlug(slug)) notFound();
  return <TutorProfile slug={slug} />;
}
