# TutorForMe — verified home tutors, right at home

A production Next.js port of the **TutorForMe Prototype v2.0**: find ID-verified home tutors in Delhi NCR,
book a free demo, pay after the demo by UPI, and follow progress on a parent dashboard.

It is **one responsive app**: below 900 px it is the mobile version (bottom tab bar, app bars, bottom sheets);
from 900 px up it is the desktop version (sticky blurred header, filter sidebar, sticky booking card, modals).

## Stack

Next.js 16 (App Router, Cache Components) · React 19 · TypeScript · Tailwind CSS 4 (brand tokens exposed via `@theme`).
No runtime dependencies beyond Next/React. All imagery is inline SVG; Inter is self-hosted (`src/app/fonts`, OFL).
State lives in one React reducer (`src/lib/store.tsx`) persisted to `localStorage` (`tutorforme-state-v1`).

## Routes

| Route | Screen |
| --- | --- |
| `/` | Landing (desktop hero, how it works, stats, testimonials, pricing) · mobile welcome |
| `/location` | Location permission over Find tutors |
| `/tutors` | Find tutors — filters, FLIP re-flow, skeletons, empty state. Deep links: `?subject=&cls=&board=&locality=&mode=` |
| `/tutors/[slug]` | Tutor profile (video, matrix, heat-map, ratings, reviews, policies, similar) |
| `/book/[slug]` | 4-step free-demo booking |
| `/classes` | Parent / student dashboard |
| `/plans` → `/checkout` → `/paid` | Plan choice, UPI-first checkout, confirmation |
| `/chat`, `/chat/[id]` | Chat (desktop two-pane; mobile list + thread) |
| `/ai` | AI Assist (with a small equation solver) |
| `/profile` | My profile (desktop side menu, mobile list) |

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run build && npm run start
```

## Deploy on Vercel

Import the repository in Vercel (framework preset: **Next.js**), keep the default build command `next build`,
and deploy. No environment variables are needed.
