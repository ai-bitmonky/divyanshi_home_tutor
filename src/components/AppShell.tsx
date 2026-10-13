"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import { tutorById } from "@/lib/data";
import { useActions } from "@/lib/actions";
import { useScrolled } from "@/lib/hooks";
import { useApp } from "@/lib/store";
import { Icon, type IconName } from "./Icons";
import { Avatar } from "./Portrait";
import { SignupModal } from "./SignupModal";
import { Desktop, Mobile } from "./Variant";
import { useToast } from "./Toast";

export function Logo({ href, className = "" }: { href: string; className?: string }) {
  return (
    <Link href={href} className={`logo ${className}`.trim()} aria-label="TutorForMe home">
      Tutor<span>For</span>Me
    </Link>
  );
}

/** smooth-scroll to a landing section (or go to the landing first) */
export function useScrollToSection() {
  const pathname = usePathname();
  const router = useRouter();
  return (id: string) => {
    if (pathname !== "/") {
      router.push(`/#${id}`);
      return;
    }
    const el = document.getElementById(id);
    if (!el) return;
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 84, behavior: rm ? "auto" : "smooth" });
  };
}

/** optional "Log in" ghost button, or the avatar once logged in (sign-in is never required) */
export function LoginOrAvatar() {
  const { s } = useApp();
  const pathname = usePathname();
  const { openAuth } = useActions();
  return s.loggedIn ? (
    <Link href="/profile" className={`av-btn${pathname === "/profile" ? " on" : ""}`} aria-label="My profile">
      <Avatar ini="DA" size={38} g={4} label="Divyanshi Agrahari" />
    </Link>
  ) : (
    <button type="button" className="btn btn-g btn-sm" onClick={() => openAuth("login")}>
      Log in
    </button>
  );
}

const SECTION: [string, string][] = [
  ["/tutors", "find"],
  ["/location", "find"],
  ["/book", "find"],
  ["/classes", "classes"],
  ["/plans", "classes"],
  ["/checkout", "classes"],
  ["/paid", "classes"],
  ["/chat", "chat"],
  ["/ai", "ai"],
];

/** Desktop sticky header — cream, blurred once scrolled. Marketing nav on the landing page, app nav elsewhere (works logged in or as a guest). */
function DesktopNav() {
  const pathname = usePathname();
  const scrolled = useScrolled(8);
  const { s } = useApp();
  const { bookTutor } = useActions();
  const toast = useToast();
  const scrollTo = useScrollToSection();
  const out = pathname === "/";

  if (out)
    return (
      <header className={`dnav${scrolled ? " scrolled" : ""}`}>
        <div className="in">
          <Logo href="/" />
          <nav className="dlinks" aria-label="Site">
            <Link href="/tutors">Find tutors</Link>
            <button type="button" onClick={() => scrollTo("how")}>
              How it works
            </button>
            <button type="button" onClick={() => scrollTo("pricing")}>
              Pricing
            </button>
            <button type="button" onClick={() => toast("Tutor sign-ups open on 1 Nov 2026", "grad")}>
              For tutors
            </button>
          </nav>
          <div className="dnav-r">
            <LoginOrAvatar />
            <Link href="/tutors" className="btn btn-p btn-sm">
              Book free demo
            </Link>
          </div>
        </div>
      </header>
    );

  const active = SECTION.find(([p]) => pathname.startsWith(p) || (p === "/tutors" && pathname.startsWith("/tutors")))?.[1] ?? "";
  const L: [string, string, string][] = [
    ["find", "Find tutors", "/tutors"],
    ["classes", "Classes", "/classes"],
    ["chat", "Chat", "/chat"],
    ["ai", "AI help", "/ai"],
  ];
  return (
    <header className={`dnav${scrolled ? " scrolled" : ""}`}>
      <div className="in">
        <Logo href="/tutors" />
        <nav className="dlinks" aria-label="Main">
          {L.map(([k, l, href]) => (
            <Link key={k} href={href} className={active === k ? "on" : ""} aria-current={active === k ? "page" : undefined}>
              {l}
            </Link>
          ))}
        </nav>
        <div className="dnav-r">
          <button type="button" className="icbtn flat" aria-label="Notifications" onClick={() => toast("No new notifications", "bell")}>
            <Icon name="bell" size={20} />
          </button>
          <button type="button" className="btn btn-p btn-sm" onClick={() => bookTutor(tutorById(s.tutor))}>
            Book free demo
          </button>
          <LoginOrAvatar />
        </div>
      </div>
    </header>
  );
}

const TAB_ROUTES = ["/tutors", "/location", "/classes", "/profile", "/ai", "/chat"];

/** Mobile bottom tab bar — 64px, 5 items, filled icon + label when active, teal dot for unread */
function TabBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { s, set } = useApp();
  if (!TAB_ROUTES.includes(pathname)) return null;
  const unread = Object.values(s.convos).some((c) => c.unread > 0);
  const onTutors = pathname === "/tutors" || pathname === "/location";
  const items: { id: string; label: string; icon: IconName; iconOn: IconName; on: boolean; href?: string; onClick?: () => void }[] = [
    { id: "home", label: "Home", icon: "home", iconOn: "homeF", on: onTutors && !s.filtersOpen, href: "/tutors" },
    {
      id: "search",
      label: "Search",
      icon: "search",
      iconOn: "searchF",
      on: onTutors && s.filtersOpen,
      onClick: () => {
        set({ filtersOpen: true });
        if (!onTutors) router.push("/tutors");
      },
    },
    { id: "classes", label: "Classes", icon: "calendar", iconOn: "calF", on: pathname === "/classes", href: "/classes" },
    { id: "chat", label: "Chat", icon: "chat", iconOn: "chatF", on: pathname.startsWith("/chat"), href: "/chat" },
    { id: "profile", label: "Profile", icon: "user", iconOn: "userF", on: pathname === "/profile", href: "/profile" },
  ];
  return (
    <nav className="tabbar" aria-label="Main">
      {items.map((it) => {
        const inner = (
          <>
            <Icon name={it.on ? it.iconOn : it.icon} size={24} stroke={it.on ? 2.2 : 1.8} />
            {it.label}
            {it.id === "chat" && unread && (
              <>
                <i className="tdot" />
                <span className="sr">(unread messages)</span>
              </>
            )}
          </>
        );
        return it.href ? (
          <Link
            key={it.id}
            href={it.href}
            className={`tab${it.on ? " on" : ""}`}
            aria-current={it.on ? "page" : undefined}
            onClick={() => s.filtersOpen && set({ filtersOpen: false })}
          >
            {inner}
          </Link>
        ) : (
          <button key={it.id} type="button" className={`tab${it.on ? " on" : ""}`} aria-current={it.on ? "page" : undefined} onClick={it.onClick}>
            {inner}
          </button>
        );
      })}
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  /* the nav bars read the URL, so each sits in its own Suspense boundary (prerender-safe) */
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Suspense fallback={null}>
        <Desktop>
          <DesktopNav />
        </Desktop>
      </Suspense>
      <main id="main" className="app-main">
        {children}
      </main>
      <Suspense fallback={null}>
        <Mobile>
          <TabBar />
        </Mobile>
      </Suspense>
      <SignupModal />
    </>
  );
}
