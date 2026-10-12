/* =========================================================
   TutorForMe — static data (ported 1:1 from Prototype v2.0)
   ========================================================= */

export type Mode = "Home" | "Online";
export type Board = "CBSE" | "ICSE" | "State";

export interface Review {
  name: string;
  initials: string;
  g: number;
  who: string;
  rating: number;
  when: string;
  tags: string[];
  text: string;
}

export interface Tutor {
  /** short key used for chat threads and the store */
  id: string;
  /** URL slug: /tutors/[slug] */
  slug: string;
  name: string;
  first: string;
  initials: string;
  /** portrait gradient index 0–5 */
  g: number;
  gender: "Male" | "Female";
  headline: string;
  subjects: string[];
  boards: Board[];
  classRange: [number, number];
  yearsExp: number;
  mode: Mode[];
  distanceKm: number;
  /** home-visit travel radius, 0 = online only */
  travelKm: number;
  locality: string;
  students: number;
  lessons: number;
  rating: number;
  reviews: number;
  superTutor: boolean;
  bookedThisWeek: number;
  momentum: string;
  replyTime: string;
  videoDuration: string;
  /** price per 60-min class */
  pricePerClass: number;
  /** 8-class monthly plan */
  monthlyPrice: number;
  /** Clarity, Patience, Punctuality */
  subScores: [number, number, number];
  bio: string;
  about: string;
  style: string[];
  qualifications: [string, string][];
  languages: string[];
  acceptingStudents: boolean;
  /** 7 days × 4 periods, number = open 60-min slots */
  availability: number[][];
  verified: [icon: string, title: string, detail: string][];
  ratingBreakdown: [stars: number, pct: number][];
  reviewsList: Review[];
}

export const USER = {
  first: "Divyanshi",
  name: "Divyanshi Agrahari",
  initials: "DA",
  phone: "+91 98723 46350",
  phoneLocal: "98723 46350",
  grade: "Class 12",
  board: "CBSE",
  target: "Boards",
  wallet: 450,
  city: "Sector 56, Gurgaon",
  parent: "Sunita Agrahari",
  email: "divyanshi.a@example.com",
};

export const SUBJECTS = ["Maths", "Physics", "Chemistry", "English", "Biology", "Computer"];
export const LOCALITIES = ["Sector 56", "DLF Phase 3", "Sushant Lok 1", "Golf Course Road", "Sector 45", "South City 2"];

/* Availability heat-map: next 7 days × 4 slots (number = open 60-min slots) */
export const DAYS = [
  { wd: "Tue", dd: 13 },
  { wd: "Wed", dd: 14 },
  { wd: "Thu", dd: 15 },
  { wd: "Fri", dd: 16 },
  { wd: "Sat", dd: 17 },
  { wd: "Sun", dd: 18 },
  { wd: "Mon", dd: 19 },
];
export const PERIODS: [string, string][] = [
  ["Morning", "8–11 AM"],
  ["Afternoon", "12–3 PM"],
  ["Evening", "4–7 PM"],
  ["Night", "7–9 PM"],
];
export const PTIMES = [
  ["8:00 AM", "9:00 AM", "10:00 AM"],
  ["12:00 PM", "1:00 PM", "2:00 PM"],
  ["4:00 PM", "5:00 PM", "6:00 PM"],
  ["7:00 PM", "8:00 PM", "9:00 PM"],
];
export const HEAT = [
  [0, 0, 3, 1],
  [0, 1, 2, 2],
  [0, 0, 0, 2],
  [0, 0, 3, 0],
  [3, 2, 1, 0],
  [2, 1, 0, 0],
  [0, 0, 2, 1],
];
export const GOALS = ["Board exam prep", "Homework help", "Clear concepts", "Olympiad / JEE", "Build confidence"];

export const VERIFIED: [string, string, string][] = [
  ["idcard", "Aadhaar ID", "Checked 12 Mar 2026"],
  ["grad", "Degree", "University confirmed"],
  ["shield", "Police verification", "Cleared Feb 2026"],
  ["eye", "Demo audit", "Class observed"],
];
export const RATING_BREAKDOWN: [number, number][] = [
  [5, 86],
  [4, 10],
  [3, 3],
  [2, 1],
  [1, 0],
];

export const REVIEWS: Review[] = [
  { name: "Meera Sharma", initials: "MS", g: 2, who: "Parent of Riya, Class 10", rating: 5, when: "2 weeks ago", tags: ["Board exam", "Home visits"], text: "Riya was scared of numericals. In one term her Physics went from 58 to 81 in the pre-boards. He comes on time, every time." },
  { name: "Karan Mehta", initials: "KM", g: 0, who: "Parent of Aarav, Class 12", rating: 5, when: "1 month ago", tags: ["Board exam", "Concepts"], text: "Clear notes and a mini-test every Sunday. Aarav finally understands electrostatics instead of memorising it." },
  { name: "Om Singh", initials: "OS", g: 3, who: "Student, Class 12", rating: 4, when: "1 month ago", tags: ["Concepts"], text: "Explains with real-life examples. Sometimes runs 10 minutes over, which I actually like." },
  { name: "Anjali Verma", initials: "AV", g: 5, who: "Parent of Ishaan, Class 9", rating: 5, when: "2 months ago", tags: ["Home visits", "Concepts"], text: "Patient and kind. Sends a WhatsApp summary after every class so I know what was covered." },
];

export type PlanSize = 4 | 8 | 12;
/** price for n classes / month: 4 = pay as you go, 8 = save ~17%, 12 = save ~22% */
export function planPrice(hr: number, n: PlanSize | number): number {
  if (n === 4) return hr * 4;
  if (n === 8) return Math.round((hr * 8 * 5) / 6 / 100) * 100;
  return Math.round((hr * 12 * 0.78) / 100) * 100;
}

type Raw = Omit<Tutor, "slug" | "momentum" | "monthlyPrice" | "availability" | "verified" | "ratingBreakdown" | "reviewsList" | "acceptingStudents"> & { full?: boolean };

const RAW: Raw[] = [
  {
    id: "ashish", name: "Ashish Agrahari", first: "Ashish", initials: "AA", g: 1, gender: "Male", headline: "Physics & Chemistry mentor",
    subjects: ["Physics", "Chemistry", "Maths"], boards: ["CBSE", "ICSE"], classRange: [9, 12], yearsExp: 10, mode: ["Home", "Online"],
    distanceKm: 3.2, travelKm: 5, locality: "Sector 56", students: 64, lessons: 1420, rating: 4.9, reviews: 128, superTutor: true,
    bookedThisWeek: 6, replyTime: "~1 hr", videoDuration: "1:12", pricePerClass: 600, subScores: [4.9, 4.8, 4.7],
    bio: "IIT Delhi graduate who turns scary numericals into simple stories. Weekly tests, clear notes and calm board-exam prep.",
    about: "Ashish has taught Physics and Chemistry for 10 years — in coaching centres, online and mostly in students’ homes. He starts every topic with an everyday example, then solves numericals step by step until the student can do them alone. A short test every Sunday shows what is clear and what needs one more round.",
    style: ["Step-by-step numericals", "Sunday mini-tests", "Everyday examples", "WhatsApp notes after class"],
    qualifications: [["B.Tech, IIT Delhi", "2014 · checked with the university"], ["CBSE Board Exam Mentor", "Certified 2019"], ["1,420 lessons on TutorForMe", "Since 2021"]],
    languages: ["English", "Hindi"],
  },
  {
    id: "priya", name: "Priya Sharma", first: "Priya", initials: "PS", g: 3, gender: "Female", headline: "Maths teacher",
    subjects: ["Maths"], boards: ["CBSE", "ICSE"], classRange: [6, 10], yearsExp: 8, mode: ["Home", "Online"],
    distanceKm: 1.4, travelKm: 4, locality: "Sushant Lok 1", students: 51, lessons: 1180, rating: 4.9, reviews: 96, superTutor: true,
    bookedThisWeek: 4, replyTime: "~30 min", videoDuration: "0:58", pricePerClass: 550, subScores: [4.9, 5.0, 4.8],
    bio: "Makes Maths feel like a game. Uses drawings and short daily practice so children stop fearing word problems.",
    about: "Priya taught Maths at a CBSE school in Gurgaon for 5 years before moving to home tuition. She draws every word problem first, then turns it into numbers. Children get 10 short sums a day, not 50 long ones.",
    style: ["Draw the problem first", "10 sums a day", "Mental maths games", "Monthly parent call"],
    qualifications: [["M.Sc. Mathematics, DU", "2016 · checked with the university"], ["B.Ed.", "2017"], ["1,180 lessons on TutorForMe", "Since 2022"]],
    languages: ["English", "Hindi"],
  },
  {
    id: "aman", name: "Aman Jaiswal", first: "Aman", initials: "AJ", g: 0, gender: "Male", headline: "English & Computer mentor",
    subjects: ["English", "Computer"], boards: ["CBSE"], classRange: [6, 12], yearsExp: 6, mode: ["Home", "Online"],
    distanceKm: 2.1, travelKm: 5, locality: "DLF Phase 3", students: 38, lessons: 760, rating: 4.6, reviews: 54, superTutor: false,
    bookedThisWeek: 3, replyTime: "~2 hrs", videoDuration: "1:05", pricePerClass: 500, subScores: [4.6, 4.7, 4.5],
    bio: "Grammar, essays and Python made simple with short quizzes and lots of practice. Great for Class 9–12 projects.",
    about: "Aman teaches English and Computer Science. He uses short quizzes and real projects — a school timetable in Python, a letter to the editor — so students learn by doing.",
    style: ["Short quizzes", "Real mini-projects", "Essay feedback in 24 hrs"],
    qualifications: [["B.Tech, Computer Science", "2018"], ["Certified English Trainer (TESOL)", "2020"]],
    languages: ["English", "Hindi"],
  },
  {
    id: "rajesh", name: "Rajesh Singh", first: "Rajesh", initials: "RS", g: 2, gender: "Male", headline: "Chemistry & Biology teacher",
    subjects: ["Chemistry", "Biology"], boards: ["CBSE"], classRange: [11, 12], yearsExp: 12, mode: ["Home"],
    distanceKm: 4.4, travelKm: 6, locality: "Golf Course Road", students: 88, lessons: 2310, rating: 4.8, reviews: 152, superTutor: true,
    bookedThisWeek: 5, replyTime: "~1 hr", videoDuration: "1:30", pricePerClass: 750, subScores: [4.8, 4.7, 4.9],
    bio: "Board-exam specialist with neat notes and a full mock test every month. Many students aim for NEET.",
    about: "Rajesh has prepared Class 11–12 students for boards and NEET for 12 years. Clear notes, diagrams for every reaction and one full mock test a month.",
    style: ["Diagram-first notes", "Monthly mock test", "NEET-style MCQs"],
    qualifications: [["M.Sc. Chemistry", "2012"], ["CBSE Board Exam Mentor", "2018"]],
    languages: ["English", "Hindi"],
  },
  {
    id: "neha", name: "Neha Kapoor", first: "Neha", initials: "NK", g: 5, gender: "Female", headline: "Spoken English coach",
    subjects: ["English"], boards: ["State", "CBSE"], classRange: [6, 10], yearsExp: 5, mode: ["Home", "Online"],
    distanceKm: 6.8, travelKm: 8, locality: "Sector 45", students: 29, lessons: 540, rating: 4.7, reviews: 41, superTutor: false,
    bookedThisWeek: 2, replyTime: "~1 hr", videoDuration: "0:45", pricePerClass: 500, subScores: [4.7, 4.9, 4.6],
    bio: "Builds speaking confidence with role-plays, reading aloud and fun debates. Shy children open up fast.",
    about: "Neha focuses on speaking. Every class has a role-play, a short read-aloud and one new idiom. Parents get a 1-minute voice note of progress each week.",
    style: ["Role-play", "Read-aloud", "Weekly voice note to parents"],
    qualifications: [["M.A. English", "2019"], ["Cambridge CELTA", "2021"]],
    languages: ["English", "Hindi", "Punjabi"],
  },
  {
    id: "vikram", name: "Vikram Rao", first: "Vikram", initials: "VR", g: 4, gender: "Male", headline: "Maths & Physics for JEE",
    subjects: ["Maths", "Physics"], boards: ["CBSE"], classRange: [11, 12], yearsExp: 14, mode: ["Online"],
    distanceKm: 8.5, travelKm: 0, locality: "DLF Phase 1", students: 72, lessons: 2650, rating: 4.9, reviews: 184, superTutor: true,
    bookedThisWeek: 0, replyTime: "~3 hrs", videoDuration: "1:20", pricePerClass: 800, subScores: [5.0, 4.8, 4.9], full: true,
    bio: "Ex-coaching faculty for JEE Main and Advanced. Problem-solving drills, timed tests and doubt sessions.",
    about: "Vikram taught JEE batches for 9 years and now takes a few students online. Timed drills, error logs and one doubt session a week.",
    style: ["Timed drills", "Error log", "Weekly doubt session"],
    qualifications: [["B.Tech, NIT Warangal", "2010"], ["9 yrs JEE coaching faculty", "2012–2021"]],
    languages: ["English", "Telugu", "Hindi"],
  },
];

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const TUTORS: Tutor[] = RAW.map(({ full, ...t }) => ({
  ...t,
  slug: slugify(t.name),
  acceptingStudents: !full,
  momentum: full ? "Full until 1 Nov" : `Booked ${t.bookedThisWeek}× this week`,
  monthlyPrice: planPrice(t.pricePerClass, 8),
  availability: HEAT,
  verified: VERIFIED,
  ratingBreakdown: RATING_BREAKDOWN,
  reviewsList: REVIEWS,
}));

export const tutorById = (id: string) => TUTORS.find((t) => t.id === id) ?? TUTORS[0];
export const tutorBySlug = (slug: string) => TUTORS.find((t) => t.slug === slug);

export const TESTIMONIALS = [
  { name: "Meera Sharma", where: "Sector 56", initials: "MS", g: 2, tutor: "Ashish Agrahari", outcome: "Physics 58 → 81", text: "Riya went from 58 to 81 in Physics in one term with Ashish sir. He made numericals feel like stories." },
  { name: "Rohit Malhotra", where: "DLF Phase 3", initials: "RM", g: 0, tutor: "Priya Sharma", outcome: "Maths C → A", text: "Priya ma’am made Kabir like Maths again. He moved from a C to an A in Class 8 — and now asks for extra sums." },
  { name: "Farah Khan", where: "Sushant Lok 1", initials: "FK", g: 4, tutor: "Neha Kapoor", outcome: "Stage-ready in 8 weeks", text: "Zoya was too shy to answer in class. After two months with Neha she spoke at her school assembly." },
];

export const STATS: { value: number; dec?: number; suffix: string; label: string }[] = [
  { value: 12000, suffix: "+", label: "parents booked a demo" },
  { value: 4.8, dec: 1, suffix: " / 5", label: "average class rating" },
  { value: 94, suffix: "%", label: "saw better marks within 3 months" },
  { value: 1800, suffix: "+", label: "verified tutors in Delhi NCR" },
];

export const SLIDES = [
  { h: "Verified tutors, right at home", p: "ID-checked tutors near you. Book a free demo in 60 seconds." },
  { h: "Try free, then decide", p: "The first class is free. Pay only if you want to continue." },
  { h: "See progress every week", p: "Simple reports show what was learned and what needs work." },
];

export const PLANS: PlanSize[] = [4, 8, 12];

/* Chat */
export interface Msg {
  f: "t" | "u";
  x: string;
  t: string;
  /** message body is trusted HTML (AI answers) */
  h?: boolean;
}
export interface Convo {
  name: string;
  initials: string;
  g: number;
  role: string;
  online: boolean;
  quick?: boolean;
  quickUsed?: boolean;
  unread: number;
  day: string;
  msgs: Msg[];
}
export const initialConvos = (): Record<string, Convo> => ({
  ashish: {
    name: "Ashish Agrahari", initials: "AA", g: 1, role: "Physics & Chemistry mentor", online: true, quick: true, unread: 0, day: "TODAY, 9:30 AM",
    msgs: [
      { f: "t", x: "Hello. I see you're looking for help with Class 12 Physics.", t: "9:30 AM" },
      { f: "u", x: "Yes. I'm struggling with the mechanics module.", t: "9:31 AM" },
      { f: "t", x: "I understand. Mechanics feels hard because of the force diagrams, but we can make them simple together.", t: "9:31 AM" },
      { f: "t", x: "To plan the demo, do you want weekly homework support or board-exam preparation?", t: "9:32 AM" },
    ],
  },
  aman: {
    name: "Aman Jaiswal", initials: "AJ", g: 0, role: "English & Computer mentor", online: false, unread: 0, day: "YESTERDAY",
    msgs: [
      { f: "t", x: "Hi Divyanshi! I checked your essay. Great structure this time.", t: "Yesterday" },
      { f: "u", x: "Thank you sir! See you on Saturday.", t: "Yesterday" },
      { f: "t", x: "See you. Please revise reported speech before class.", t: "Yesterday" },
    ],
  },
  support: {
    name: "TutorForMe Support", initials: "TS", g: 3, role: "Usually replies in 5 min", online: true, unread: 1, day: "MONDAY",
    msgs: [{ f: "t", x: "Welcome to TutorForMe! Your first demo class is free — no card needed. Right-Fit Promise: you can switch tutor free at any time.", t: "Mon" }],
  },
});
export const CONVO_ORDER = ["ashish", "aman", "support"];
export const CHAT_IDS = ["support", ...TUTORS.map((t) => t.id)];

export const REPLIES: Record<string, string> = {
  "View Study Plan": "Here is a simple 4-week plan: Week 1 – forces and free-body diagrams. Week 2 – Newton's laws with daily practice. Week 3 – work, energy and power. Week 4 – a full mock test and doubt clearing.",
  "Make a call": "Sure! I am free for a quick call today between 4:00 PM and 6:00 PM. Tap the phone icon above and I will pick up.",
  "About Price": "I charge ₹600 per 60-min class. Most parents pick 8 classes a month for ₹4,000. The first demo class is free.",
};
export const CANNED = [
  "Got it! I will prepare a short mechanics plan focused on free-body diagrams. See you at the free demo.",
  "Good question. Let us cover that in the demo class. I will bring practice problems that match your school syllabus.",
  "Noted. I will share a few practice sheets here before our first class.",
];

/* Classes dashboard */
export const DASHBOARD = {
  progress: [
    ["Physics", 72, "+14 since Aug"],
    ["Chemistry", 64, "+9 since Aug"],
    ["Maths", 81, "+6 since Aug"],
  ] as [string, number, string][],
  attendance: [1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  streak: 9,
  homework: [
    ["a", "Physics: numericals 4.1–4.10", "Due Wed 14 Oct"],
    ["b", "Chemistry: revise Le Chatelier", "Due Thu 15 Oct"],
    ["c", "Maths: worksheet 7", "Due Fri 16 Oct"],
  ] as [string, string, string][],
  lastClass: { tutorId: "aman", title: "English · Aman Jaiswal", when: "Sat 10 Oct · 5:00–6:00 PM" },
};

/* ---------- helpers ---------- */
export const inr = (n: number) => "₹" + Math.round(Number(n)).toLocaleString("en-IN");
export const clsRange = (t: Pick<Tutor, "classRange">) =>
  t.classRange[0] === t.classRange[1] ? `Class ${t.classRange[0]}` : `Class ${t.classRange[0]}–${t.classRange[1]}`;

export interface Pick3 {
  d: number;
  p: number;
  t: number;
}
export const slotDay = (p: Pick3) => `${DAYS[p.d].wd} ${DAYS[p.d].dd} Oct`;
export const slotTime = (p: Pick3) => PTIMES[p.p][p.t] ?? PTIMES[p.p][0];
export const dateLabel = (p: Pick3) => `${slotDay(p)} · ${slotTime(p)}`;

export function nextSlots(heat: number[][] = HEAT): Pick3[] {
  const out: Pick3[] = [];
  for (let d = 0; d < DAYS.length && out.length < 3; d++) {
    for (const p of [2, 3, 1, 0]) {
      if (heat[d][p]) {
        out.push({ d, p, t: 0 });
        break;
      }
    }
  }
  return out;
}

export interface Filters {
  q: string;
  subject: string;
  price: number;
  mode: "Home" | "Online" | "Both";
  locality: string;
  dist: "3" | "5" | "10";
  board: string;
  cls: string;
  gender: string;
  lang: string;
  sort: "rec" | "near" | "rating" | "low" | "high";
}
export const DEFAULT_FILTERS: Filters = {
  q: "", subject: "", price: 1000, mode: "Both", locality: "Sector 56", dist: "5", board: "Any", cls: "Any", gender: "Any", lang: "Any", sort: "rec",
};
export const CLS_MAP: Record<string, [number, number]> = { "6–8": [6, 8], "9–10": [9, 10], "11–12": [11, 12] };
export const SORTS: [Filters["sort"], string][] = [
  ["rec", "Recommended"],
  ["near", "Nearest first"],
  ["rating", "Highest rated"],
  ["low", "Price: low to high"],
  ["high", "Price: high to low"],
];

export function filterTutors(f: Filters): Tutor[] {
  const q = f.q.trim().toLowerCase();
  const sub = f.subject.trim().toLowerCase();
  const r = TUTORS.filter(
    (t) =>
      t.pricePerClass <= f.price &&
      t.distanceKm <= +f.dist &&
      (f.mode === "Both" || t.mode.includes(f.mode)) &&
      (f.board === "Any" || (t.boards as string[]).includes(f.board)) &&
      (f.gender === "Any" || t.gender === f.gender) &&
      (f.lang === "Any" || t.languages.includes(f.lang)) &&
      (f.cls === "Any" ||
        (() => {
          const [a, b] = CLS_MAP[f.cls] ?? [0, 99];
          return t.classRange[0] <= b && t.classRange[1] >= a;
        })()) &&
      (!q || `${t.name} ${t.headline} ${t.subjects.join(" ")} ${t.locality}`.toLowerCase().includes(q)) &&
      (!sub || t.subjects.some((s) => s.toLowerCase().includes(sub))),
  );
  const score = (t: Tutor) => t.rating * 100 + t.bookedThisWeek * 10 - t.distanceKm;
  const by: Record<Filters["sort"], (a: Tutor, b: Tutor) => number> = {
    low: (a, b) => a.pricePerClass - b.pricePerClass,
    high: (a, b) => b.pricePerClass - a.pricePerClass,
    rating: (a, b) => b.rating - a.rating,
    near: (a, b) => a.distanceKm - b.distanceKm,
    rec: (a, b) => (a.acceptingStudents ? 0 : 1) - (b.acceptingStudents ? 0 : 1) || score(b) - score(a),
  };
  return r.sort(by[f.sort] ?? by.rec);
}

export function similarTutors(t: Tutor): Tutor[] {
  const sim = TUTORS.filter((x) => x.id !== t.id && x.acceptingStudents && x.subjects.some((s) => t.subjects.includes(s)));
  return [...sim, ...TUTORS.filter((x) => x.id !== t.id && x.acceptingStudents && !sim.includes(x))].slice(0, 3);
}

export function nowT(): string {
  const d = new Date();
  let h = d.getHours();
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ap = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${mm} ${ap}`;
}

/* tiny equation solver + canned answers for AI Assist (from v2.0) */
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);
export function aiAnswer(q: string): string {
  const s = q.toLowerCase();
  const eq = s.replace(/\s+/g, "").match(/^(-?\d*)x([+-]\d+)?=(-?\d+)$/);
  if (eq) {
    const a = eq[1] === "" ? 1 : eq[1] === "-" ? -1 : +eq[1];
    const b = +(eq[2] || 0);
    const c = +eq[3];
    const x = (c - b) / a;
    return `<b>Let's solve ${esc(q)} step by step</b><ol><li>Move ${b} to the other side: ${a === 1 ? "" : a}x = ${c} ${b < 0 ? "+ " + -b : "− " + b} = <b>${c - b}</b></li><li>Divide both sides by ${a}: x = ${c - b} ÷ ${a}</li><li>So <b>x = ${Number.isInteger(x) ? x : x.toFixed(2)}</b></li></ol>Check: put x back in the equation and both sides match. Want a harder one?`;
  }
  if (/tip|revis|exam|study/.test(s))
    return `<b>3 simple revision tips</b><ol><li>Study in 25-minute blocks with a 5-minute break.</li><li>After each topic, close the book and write what you remember.</li><li>Solve one past-paper question every day.</li></ol>Shall I build a weekly plan for Physics?`;
  return `<b>Newton's Second Law: F = m × a</b><br>Force equals mass times acceleration. Example: you push a 2 kg trolley and it speeds up by 3 m/s every second. So F = 2 × 3 = <b>6 N</b>.<ol><li>Find the mass (in kg)</li><li>Find the acceleration (in m/s²)</li><li>Multiply them to get force (in newtons)</li></ol>Want a practice question, or should I connect you with Ashish for a live session?`;
}
