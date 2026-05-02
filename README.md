# Habit Tracker PWA

A mobile-first Progressive Web App for tracking daily habits, built with Next.js, TypeScript, and Tailwind CSS.

## Project Overview

Habit Tracker allows users to sign up, log in, create and manage daily habits, mark habits complete, and view current streaks. All data is persisted locally using localStorage. The app is installable as a PWA and loads the cached app shell offline.

## Setup Instructions

1. Clone the repository
2. Install dependencies:
```bash
   npm install
```
3. Install Playwright browsers:
```bash
   npx playwright install chromium
```

## Run Instructions

Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

To build for production:
```bash
npm run build
npm run start
```

## Test Instructions

Run unit and integration tests with coverage:
```bash
npm run test:unit
```

Run integration tests only:
```bash
npm run test:integration
```

Run end-to-end tests:
```bash
npm run test:e2e
```

Run all tests:
```bash
npm test
```

## Local Persistence Structure

All data is stored in the browser's localStorage under three keys:

**`habit-tracker-users`** — Array of registered users:
```json
[{ "id": "uuid", "email": "string", "password": "string", "createdAt": "ISO string" }]
```

**`habit-tracker-session`** — Currently logged in user:
```json
{ "userId": "string", "email": "string" }
```

**`habit-tracker-habits`** — Array of all habits across all users:
```json
[{ "id": "uuid", "userId": "string", "name": "string", "description": "string", "frequency": "daily", "createdAt": "ISO string", "completions": ["YYYY-MM-DD"] }]
```

## PWA Implementation

The app is configured as a PWA using:

- **`public/manifest.json`** — Defines app name, icons, theme color, display mode, and start URL
- **`public/sw.js`** — A custom service worker that caches the app shell on install and serves cached pages when offline
- **`src/components/shared/ServiceWorkerRegistration.tsx`** — Registers the service worker on the client side via `useEffect`

The service worker uses a cache-first strategy for the app shell routes (`/`, `/login`, `/signup`, `/dashboard`) and falls back to the network for everything else.

## Trade-offs and Limitations

- **Plain text password storage** — Passwords are stored as plain text in localStorage.
  A production app would hash passwords with bcrypt. This was an intentional spec
  requirement to keep auth local and deterministic.

- **No real database** — localStorage is not a real database. Data is tied to a single
  browser on a single device. Clearing browser storage wipes all users and habits.
  This was a spec constraint to keep persistence front-end only.

- **Service worker conflicts with Next.js client-side navigation** — During development,
  the service worker intercepted Next.js internal `/_next/` requests, breaking
  client-side routing. This was fixed by explicitly excluding `/_next/` and `/api/`
  paths from the service worker fetch handler.

- **Splash screen redirect inconsistency** — Next.js App Router aggressively caches
  client components, causing the splash screen's `useEffect` to not re-run on
  subsequent visits to `/`. This was mitigated using `useRef` to prevent double
  redirects and `router.replace` instead of `router.push` to avoid history stack issues.

- **localStorage not available during SSR** — Next.js renders pages on the server by
  default where localStorage does not exist. Every component that reads localStorage
  required the `use client` directive and had to be wrapped in `useEffect` or
  `try/catch` to avoid server-side crashes.

- **PWA icon 404 blocking navigation** — Missing PWA icons caused a 404 error that
  interfered with service worker registration and briefly blocked client-side
  navigation until the icons were correctly placed in `public/icons/`.

- **npm dependency installation failures** — Slow network and npm cache corruption
  caused package installations to hang indefinitely. Required clearing the npm cache
  with `npm cache clean --force` before installations would complete.

## Test File Map

| Test File | Behavior Verified |
|-----------|------------------|
| `tests/unit/slug.test.ts` | `getHabitSlug` converts habit names to URL-friendly slugs |
| `tests/unit/validators.test.ts` | `validateHabitName` rejects empty and too-long names |
| `tests/unit/streaks.test.ts` | `calculateCurrentStreak` counts consecutive completion days |
| `tests/unit/habits.test.ts` | `toggleHabitCompletion` adds and removes completion dates |
| `tests/integration/auth-flow.test.tsx` | Signup, login, duplicate email, and invalid credentials |
| `tests/integration/habit-form.test.tsx` | Create, edit, delete, and complete habits via UI |
| `tests/e2e/app.spec.ts` | Full user flows from splash screen to logout including PWA offline |