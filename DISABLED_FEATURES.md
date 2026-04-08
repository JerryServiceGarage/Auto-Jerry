# Disabled Features

Features temporarily commented out at the client's request. All code is preserved and can be re-enabled by searching for the marker tags listed below.

---

## Booking Feature

**Status:** Disabled  
**Date:** 2026-04-08  
**Search marker:** `BOOKING DISABLED`

### What was commented out

| File | What |
|------|------|
| `src/App.tsx` | `import Book` and `import Verify`, routes `/book` and `/verify` |
| `src/components/Layout.tsx` | "Book" nav link, desktop "Book Online" button, mobile menu "Book Online" button, mobile sticky bar "Book Online" button |
| `src/pages/Home.tsx` | "Book Online" button in hero section |
| `src/pages/Services.tsx` | Entire "Ready to Book?" CTA section at the bottom |

### What was NOT touched (still present, just unreachable)
- `src/pages/Book.tsx` — full booking form page
- `src/pages/Verify.tsx` — booking verification page
- `server.ts` — all booking API endpoints (`POST /api/bookings`, reschedule, cancel, verify, reminders)

---

## Send Us a Message (Contact Form)

**Status:** Disabled  
**Date:** 2026-04-08  
**Search marker:** `SEND MESSAGE DISABLED`

### What was commented out

| File | What |
|------|------|
| `src/pages/Contact.tsx` | All form-related imports (`useForm`, `zod`, `ReCAPTCHA`, `Input`, `Label`, `Textarea`, etc.), `formSchema`, all form state and `onSubmit` handler, the entire contact form card (right column) |

### Layout change
The Contact page grid was changed from `lg:grid-cols-2` to a single centered column (`max-w-2xl mx-auto`) since only the info card and map remain visible.

### What remains visible on the Contact page
- Phone number + call button
- Address + directions link
- Business hours
- Embedded Google Map

---

## Re-enabling

To restore either feature:
1. Search the codebase for the marker (`BOOKING DISABLED` or `SEND MESSAGE DISABLED`)
2. Uncomment all flagged lines/blocks
3. For the Contact page, revert the grid class back to `grid grid-cols-1 lg:grid-cols-2 gap-12`
4. See the **Before Re-enabling** section below for required steps before going live

---

## Security Fixes — 2026-04-08

Pre-launch security audit was performed. The following issues were found and fixed.

### Fixed

| # | File | Issue | Fix |
|---|------|-------|-----|
| 1 | `server.ts:26` | reCAPTCHA secret defaulted to Google's public test key (`6LeIxAcT...`), meaning all reCAPTCHA checks passed silently if `RECAPTCHA_SECRET_KEY` was not set in `.env.local` | Removed the fallback. `verifyRecaptcha()` now returns `false` immediately if the env var is missing |
| 2 | `server.ts:618` | Backfill endpoint guard used `&&` — if `BACKFILL_SECRET` was not set, the condition short-circuited and the endpoint was fully open to anyone | Changed to `\|\|` so the endpoint rejects all requests unless the secret is set **and** the header matches |
| 3 | `server.ts:699` | `/api/verify-booking` accepted any request and returned `{ success: true }` regardless of token validity | Now returns `400` if `id`/`token` are missing, and `503` while booking is disabled |
| 4 | `firestore.rules:125` | `bookingRequests` had `allow read: if true` — any client could read all customer bookings (names, phones, emails, vehicle info) | Changed to `allow read: if false` |
| 5 | `firestore.rules:127` | `bookingRequests` had `allow update: if true` — any client could cancel or modify any booking directly, bypassing the server | Changed to `allow update: if false` |
| 6 | `firestore.rules:131` | `settings` had `allow read, write: if true` — anyone could read or overwrite the stored Google OAuth refresh token | Changed to `allow read, write: if false` |

### Known Remaining Issue (not fixed — requires architectural change)

The Express server uses the **Firebase Client SDK** (not Admin SDK), so it is subject to Firestore security rules. With rules now locked, the server's cancel/reschedule/backfill operations that read from Firestore will fail.

**This does not affect the current state** because booking is disabled on the frontend. But before booking is re-enabled:

- Migrate `server.ts` to use `firebase-admin` (Admin SDK), which runs with elevated privileges and bypasses Firestore rules entirely
- Once Admin SDK is in place, the locked rules are correct — the only writes that should ever happen client-side are new booking creates

---

## Before Re-enabling

When re-enabling booking or the contact form, complete these steps first:

1. **Migrate server to Firebase Admin SDK** — replace `firebase/app` + `firebase/firestore` imports in `server.ts` with `firebase-admin`. This unlocks Firestore reads/updates server-side while keeping the rules locked for clients.
2. **Set all required env vars** — `RECAPTCHA_SECRET_KEY`, `BACKFILL_SECRET`, `RESEND_API_KEY`, `GOOGLE_SERVICE_ACCOUNT_KEY` must all be set. The server now fails closed if any are missing.
3. **Implement `/api/verify-booking`** — once Admin SDK is in place, read the booking doc, compare the stored `verificationToken` against the submitted token, and update status to `confirmed`.
4. **Deploy updated Firestore rules** — run `firebase deploy --only firestore:rules` after any rules change.
