import Link from "next/link";
import { EmptyIllustration } from "@/components/Illustration";

export default function NotFound() {
  return (
    <div className="wrap nf">
      <div className="empty" style={{ maxWidth: 520, margin: "48px auto" }}>
        <EmptyIllustration />
        <b>This page is not on the map.</b>
        <p>The link may be old, or the tutor may have moved. Let&apos;s get you back to verified tutors near you.</p>
        <div className="row" style={{ justifyContent: "center", marginTop: 16, gap: 8, flexWrap: "wrap" }}>
          <Link href="/tutors" className="btn btn-p btn-sm">
            Find tutors
          </Link>
          <Link href="/" className="btn btn-s btn-sm">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
