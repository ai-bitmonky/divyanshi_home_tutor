"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SLIDES, TESTIMONIALS, tutorById } from "@/lib/data";
import { useActions } from "@/lib/actions";
import { useReducedMotion } from "@/lib/hooks";
import { useApp } from "@/lib/store";
import { Logo, useScrollToSection } from "../AppShell";
import { HowIllustration, WelcomeIllustration } from "../Illustration";
import { Icon } from "../Icons";
import { Avatar, Star1 } from "../Portrait";
import { SearchPill, tutorsHref } from "../SearchPill";
import { SearchSheet } from "../SearchSheet";
import { SignupCard } from "../SignupModal";
import { StatStrip } from "../StatStrip";
import { useToast } from "../Toast";
import { TutorCard } from "../TutorCard";

const QUICK: [string, string][] = [
  ["Maths", "Maths · Class 10"],
  ["Physics", "Physics · Class 12"],
  ["English", "Spoken English"],
  ["Chemistry", "Chemistry · Class 11"],
];
const STEPS: [string, string, string][] = [
  ["Book a free demo", "Pick a slot that suits you. The first class is free.", "₹0 · No card needed"],
  ["Meet your tutor, switch free", "The tutor comes home. Not the right fit? Switch to another tutor at no cost.", "Right-Fit Promise"],
  ["Watch grades grow", "Weekly reports, attendance and homework in one simple view.", "Parent dashboard"],
];

function DesktopLanding() {
  const { openAuth } = useActions();
  const toast = useToast();
  const scrollTo = useScrollToSection();
  const stack = ["rajesh", "ashish", "priya"].map(tutorById);
  return (
    <div className="lp d-only">
      <section className="hero">
        <div className="hero-l">
          <span className="eyebrow">
            <i className="live" />
            Verified home tutors · Delhi NCR
          </span>
          <h1 className="t-display hero-h">
            <span className="ln">The right tutor,</span>
            <span className="ln">
              right at <em>home.</em>
            </span>
          </h1>
          <p className="t-blg hero-sub">Book a free demo class with an ID-checked tutor near you. Pay only if you continue.</p>
          <SearchPill />
          <div className="qchips">
            <span className="t-sm muted">Popular:</span>
            {QUICK.map(([sub, l]) => (
              <Link key={sub} className="chip" href={tutorsHref({ subject: sub })}>
                {l}
              </Link>
            ))}
          </div>
          <div className="trustrow">
            <span>
              <Star1 size={16} /> <b>4.8</b> average rating
            </span>
            <span>
              <Icon name="users" size={16} /> <b>12,000+</b> parents
            </span>
            <span>
              <Icon name="shield" size={16} /> <b>ID-verified</b> tutors
            </span>
          </div>
        </div>
        <div className="hero-r" aria-label="Tutors near Sector 56">
          <div className="stack">
            {stack.map((t, i) => (
              <div key={t.id} className={`sc sc${i}`}>
                <TutorCard t={t} />
              </div>
            ))}
          </div>
          <div className="fpill">
            <Icon name="clock" size={14} /> Replies in ~30 min
          </div>
          <div className="ftoast" role="img" aria-label="Notification: demo booked">
            <span className="okm">
              <Icon name="check" size={18} stroke={2.8} />
            </span>
            <div>
              <b>Demo booked ✓</b>
              <span>Riya&apos;s mum · Priya, Wed 5:00 PM</span>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-sec" id="how" style={{ paddingTop: 0 }}>
        <div className="lp-in">
          <div className="sec-head">
            <span className="t-cap">How it works</span>
            <h2 className="t-h1">Three steps. No guesswork.</h2>
            <p className="t-blg muted">The same three steps you will see in the app. Hover the picture to see each one.</p>
          </div>
          <div className="how">
            <HowIllustration />
            <ol className="how-steps stag run">
              {STEPS.map(([t, d, b], k) => (
                <li key={t} style={{ ["--i" as string]: k }}>
                  <span className="hn">{k + 1}</span>
                  <div>
                    <h3 className="t-h3">{t}</h3>
                    <p>{d}</p>
                    <span className="badge badge-t">
                      <Icon name="check" size={13} stroke={2.6} /> {b}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="stats-sec" aria-label="TutorForMe in numbers">
        <div className="lp-in">
          <StatStrip />
          <p className="src">
            <b>Source:</b> TutorForMe parent survey, Sep 2026 (2,140 parents) · tutor count as of 1 Oct 2026.
          </p>
        </div>
      </section>

      <section className="lp-sec" style={{ paddingTop: 0 }}>
        <div className="lp-in">
          <div className="sec-head">
            <span className="t-cap">Parents say</span>
            <h2 className="t-h1">Real tutors. Real results.</h2>
          </div>
          <div className="testis">
            {TESTIMONIALS.map((x) => (
              <figure key={x.name} className="testi">
                <span className="badge badge-t out">
                  <Icon name="trend" size={14} /> {x.outcome}
                </span>
                <q>{x.text}</q>
                <figcaption className="who">
                  <Avatar ini={x.initials} size={44} g={x.g} label={x.name} />
                  <div>
                    <b>{x.name}</b>
                    <span>
                      {x.where} · about {x.tutor}
                    </span>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-sec" id="pricing" style={{ paddingTop: 0 }}>
        <div className="lp-in">
          <div className="price-band">
            <div>
              <span className="t-cap" style={{ color: "var(--teal-d)" }}>
                Pricing
              </span>
              <h2 className="t-h2" style={{ margin: "8px 0" }}>
                Pay per class — only after the demo.
              </h2>
              <p className="muted">Tutors charge ₹500–₹800 per 60-min class. Choose a monthly pack. Pay by UPI.</p>
            </div>
            <div className="pb-tiers">
              <div>
                <b>4</b>
                <span>classes / month</span>
              </div>
              <div className="mc">
                <span className="ribbon">
                  <Icon name="star" size={11} stroke={2.6} />
                  Most chosen
                </span>
                <b>8</b>
                <span>classes / month · save 17%</span>
              </div>
              <div>
                <b>12</b>
                <span>classes / month · save 22%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-sec" style={{ paddingTop: 0 }}>
        <div className="lp-in">
          <div className="fcta">
            <div>
              <h2 className="t-h1">Meet your tutor this week.</h2>
              <p className="t-blg">Free demo · ₹0 · No card needed. Switch tutor free, any time.</p>
            </div>
            <div className="row">
              <button type="button" className="btn btn-p btn-lg" onClick={() => openAuth("demo")}>
                Book free demo <span className="zero">₹0</span>
              </button>
              <Link href="/tutors" className="btn btn-g btn-lg">
                Browse tutors
              </Link>
            </div>
          </div>
        </div>
      </section>
      <footer className="lfoot">
        <div className="logo">
          Tutor<span>For</span>Me
        </div>
        <nav aria-label="Footer">
          <button type="button" onClick={() => scrollTo("how")}>
            How it works
          </button>
          <button type="button" onClick={() => scrollTo("pricing")}>
            Pricing
          </button>
          <button type="button" onClick={() => toast("Tutor sign-ups open on 1 Nov 2026", "grad")}>
            For tutors
          </button>
          <button type="button" onClick={() => toast("Write to hello@tutorforme.in", "mail")}>
            Contact
          </button>
        </nav>
        <span>© 2026 TutorForMe · Gurgaon</span>
      </footer>
    </div>
  );
}

/** Mobile welcome: illustration, rotating headline, single search field → sheet, sign-up card */
function MobileWelcome() {
  const { set } = useApp();
  const { openAuth } = useActions();
  const rm = useReducedMotion();
  const [slide, setSlide] = useState(0);
  const [fade, setFade] = useState(false);
  const [auto, setAuto] = useState(true);

  const show = (i: number) => {
    setFade(true);
    setTimeout(() => {
      setSlide(i);
      setFade(false);
    }, 200);
  };

  useEffect(() => {
    if (!auto || rm) return;
    const id = setInterval(() => {
      setFade(true);
      setTimeout(() => {
        setSlide((x) => (x + 1) % SLIDES.length);
        setFade(false);
      }, 200);
    }, 4500);
    return () => clearInterval(id);
  }, [auto, rm]);

  const s = SLIDES[slide];
  return (
    <div className="m-welcome m-only">
      <div className="mw-top">
        <Logo href="/" />
        <button type="button" className="btn btn-g btn-sm" onClick={() => openAuth("login")}>
          Log in
        </button>
      </div>
      <span className="eyebrow">
        <i className="live" />
        Verified home tutors · Delhi NCR
      </span>
      <div className="illus-wrap">
        <WelcomeIllustration />
      </div>
      <h1 className={`w-h${fade ? " w-fade" : ""}`} aria-live="polite">
        {s.h}
      </h1>
      <p className={`w-p${fade ? " w-fade" : ""}`}>{s.p}</p>
      <div className="dots" role="group" aria-label="Slides">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`dot${i === slide ? " on" : ""}`}
            aria-label={`Show slide ${i + 1}`}
            aria-pressed={i === slide}
            onClick={() => {
              setAuto(false);
              show(i);
            }}
          />
        ))}
      </div>
      <button type="button" className="msearch" aria-haspopup="dialog" onClick={() => set({ searchSheet: true })}>
        <Icon name="search" size={20} />
        <span>Subject, class or locality</span>
        <span className="msearch-go">
          <Icon name="arrowR" size={18} stroke={2.2} />
        </span>
      </button>
      <div className="mtrust">
        <span>
          <Star1 size={14} /> 4.8
        </span>
        <span>
          <Icon name="users" size={15} /> 12,000+ parents
        </span>
        <span>
          <Icon name="shield" size={15} /> ID-verified
        </span>
      </div>
      <SignupCard inline />
      <SearchSheet />
    </div>
  );
}

export function Landing() {
  return (
    <>
      <DesktopLanding />
      <MobileWelcome />
    </>
  );
}
