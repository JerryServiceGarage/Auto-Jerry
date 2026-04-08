# Resend Scheduled Reminder Emails — Implementation Summary

**Date:** 2026-04-08
**Based on:** `suggestedplan.txt`

---

## What Was Built

The booking system now schedules automatic reminder emails via Resend — one **24 hours before** and one **2 hours before** every appointment. No Firebase Cloud Functions or Blaze plan required.

---

## Files Changed

| File | What Changed |
|------|-------------|
| `server.ts` | Full implementation — helpers, updated booking endpoint, 3 new API routes |
| `firestore.rules` | Added new allowed fields + new status values |
| `firebase-blueprint.json` | Updated schema to include all new fields |
| `.env.example` | Added `GARAGE_ADDRESS`, `GARAGE_PHONE`, `BACKFILL_SECRET`, `GOOGLE_CALENDAR_ID` |

---

## New Firestore Schema (`bookingRequests`)

```
appointmentAt          Timestamp   — UTC datetime of the appointment
timezone               string      — "America/Montreal" (display timezone)
googleCalendarEventId  string|null — returned from Google Calendar on creation
updatedAt              Timestamp   — last modified timestamp

resend: {
  confirmationEmailId  string|null
  reminder24h: {
    emailId      string|null
    scheduledFor Timestamp|null
    status       "scheduled" | "pendingScheduleLater" | "skipped" | "failed" | "cancelled"
  }
  reminder2h: {
    emailId      string|null
    scheduledFor Timestamp|null
    status       "scheduled" | "pendingScheduleLater" | "skipped" | "failed" | "cancelled"
  }
}
```

**Status values** (full set): `pending_verification`, `confirmed`, `booked`, `rescheduled`, `cancelled`, `completed`

---

## New Helper Functions (`server.ts`)

| Function | Purpose |
|----------|---------|
| `getReminderDates(date)` | Returns Date objects for 24h and 2h before the appointment |
| `canScheduleWithResend(date)` | Returns `true` if the date is in the future and within the 30-day Resend limit |
| `scheduleReminderEmail({to, subject, html, scheduledAt})` | Calls `resend.emails.send` with `scheduledAt` and returns the email ID |
| `cancelScheduledEmailIfExists(emailId)` | Calls `resend.emails.cancel(id)` — safe to call with `null` |
| `scheduleRemindersForAppointment({...})` | Orchestrates both reminders, returns `{ reminder24h, reminder2h }` objects |
| `buildReminderHtml({...})` | Builds the HTML for reminder emails using garage name/address/phone |

---

## Updated Booking Flow (`POST /api/bookings`)

1. Honeypot + reCAPTCHA checks (unchanged)
2. **Pre-generate Firestore doc ID** — so the confirmation email URL is correct before saving
3. **Create Google Calendar event** (now awaited, returns event ID)
4. **Send confirmation email** via Resend with the real booking URL
5. **Schedule 24h reminder** — if within 30 days, schedules immediately; otherwise stored as `pendingScheduleLater`
6. **Schedule 2h reminder** — same logic
7. **Save to Firestore** with full schema including all new fields

---

## New API Endpoints

### `POST /api/bookings/:id/reschedule`

**Body:** `{ appointmentDate: "yyyy-MM-dd", appointmentTime: "HH:mm" }`

What it does:
1. Reads the existing booking from Firestore
2. Patches the Google Calendar event with the new time
3. Cancels old 24h and 2h scheduled reminder emails
4. Schedules new reminders for the new time
5. Updates Firestore: new date/time, `status: "rescheduled"`, new reminder IDs

---

### `POST /api/bookings/:id/cancel`

What it does:
1. Reads the existing booking from Firestore
2. Deletes the Google Calendar event
3. Cancels scheduled reminder emails
4. Updates Firestore: `status: "cancelled"`, reminder statuses set to `"cancelled"`

---

### `POST /api/reminders/backfill`

**Authorization:** `Authorization: Bearer <BACKFILL_SECRET>`

What it does:
- Queries Firestore for active bookings (`booked`, `confirmed`, `rescheduled`, `pending_verification`)
- For each booking where a reminder has `status: "pendingScheduleLater"`:
  - Checks if the reminder time is now within 30 days
  - If yes, schedules the email and updates Firestore with the new email ID and `"scheduled"` status
- Returns `{ scheduled, skipped }` counts

**Use case:** Bookings made more than 30 days in advance. Run this endpoint daily (via cron on your host or a scheduled ping service) to automatically promote reminders when they enter the schedulable window.

---

## 30-Day Limit Handling

Resend only allows scheduling up to 30 days ahead.

| Scenario | Behavior |
|----------|---------|
| Appointment within 30 days | Reminder scheduled immediately on booking |
| Appointment > 30 days away | Stored as `pendingScheduleLater` |
| Backfill runs daily | Promotes `pendingScheduleLater` to `scheduled` once within 30 days |

For a garage, most bookings are within 30 days so this edge case is rarely hit.

---

## New Environment Variables

Add these to `.env.local`:

```env
# Used in reminder email body
GARAGE_ADDRESS=123 Main St, Laval, QC
GARAGE_PHONE=514-555-1234

# Protects the /api/reminders/backfill endpoint
BACKFILL_SECRET=some-random-secret-string

# Google Calendar target (optional, defaults to jerryservicegarage@gmail.com)
GOOGLE_CALENDAR_ID=jerryservicegarage@gmail.com
```

---

## Reminder Email Content

Both reminder emails include:
- Customer name
- Service booked
- Full date & time (formatted in `America/Montreal` timezone)
- Garage address
- Garage phone (if `GARAGE_PHONE` is set)
- Instruction to contact the garage to reschedule or cancel

---

## What Was NOT Changed

- Contact form (still uses Gmail/Nodemailer — unchanged)
- Frontend booking form (`Book.tsx`) — no frontend changes needed
- Verify page (`Verify.tsx`) — unchanged
- Firebase OAuth setup routes — unchanged
- reCAPTCHA logic — unchanged
- Existing env vars — all still work the same way

---

## Plan Validation

The `suggestedplan.txt` recommended this approach specifically because:
- No Firebase Blaze plan required (no Cloud Functions or Cloud Scheduler)
- Resend natively supports `scheduledAt`, `cancel`, and scheduling up to 30 days ahead
- Reminder IDs stored in Firestore allow cancel/reschedule without extra infrastructure
- Simple daily backfill covers long-range bookings without a paid scheduler
