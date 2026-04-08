import express from "express";
import path from "path";
import { google } from "googleapis";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, serverTimestamp, Timestamp, doc, getDoc, setDoc, updateDoc, getDocs, query, where } from "firebase/firestore";
import fs from "fs";
import nodemailer from "nodemailer";
import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

// Initialize Firebase Client SDK
const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf-8'));
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "Jerry Service Garage <onboarding@resend.dev>";
const GARAGE_NAME = "Jerry Service Garage";
const GARAGE_ADDRESS = process.env.GARAGE_ADDRESS || "Laval, QC";
const GARAGE_PHONE = process.env.GARAGE_PHONE || "";
const BOOKING_TIMEZONE = "America/Montreal";

// Fail closed if env var is missing — never fall back to the test key
const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY;

// ================================================================
// reCAPTCHA
// ================================================================

async function verifyRecaptcha(token: string) {
  if (!RECAPTCHA_SECRET) {
    console.error("RECAPTCHA_SECRET_KEY is not set — rejecting request");
    return false;
  }
  try {
    const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET}&response=${token}`, {
      method: 'POST'
    });
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    return false;
  }
}

// ================================================================
// Google Auth
// ================================================================

function getGoogleAuth() {
  // Priority 1: Service Account (Seamless)
  if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    try {
      const key = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
      return new google.auth.JWT({
        email: key.client_email,
        key: key.private_key,
        scopes: ["https://www.googleapis.com/auth/calendar.events"]
      });
    } catch (e) {
      console.error("Failed to parse GOOGLE_SERVICE_ACCOUNT_KEY:", e);
    }
  }

  // Priority 2: OAuth2 (Requires manual connection)
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.APP_URL ? `${process.env.APP_URL}/api/auth/google/callback` : "http://localhost:3000/api/auth/google/callback"
  );
}

async function getCalendarClient() {
  const auth = getGoogleAuth();
  if (auth instanceof google.auth.JWT) {
    return google.calendar({ version: "v3", auth });
  }
  // OAuth2 flow
  const settingsDoc = await getDoc(doc(db, "settings", "google_calendar"));
  if (settingsDoc.exists() && settingsDoc.data()?.refresh_token) {
    auth.setCredentials({ refresh_token: settingsDoc.data()?.refresh_token });
    return google.calendar({ version: "v3", auth });
  }
  return null;
}

// ================================================================
// Reminder Helpers
// ================================================================

function getReminderDates(appointmentDate: Date) {
  const twentyFourHoursBefore = new Date(appointmentDate.getTime() - 24 * 60 * 60 * 1000);
  const twoHoursBefore = new Date(appointmentDate.getTime() - 2 * 60 * 60 * 1000);
  return { twentyFourHoursBefore, twoHoursBefore };
}

function canScheduleWithResend(targetDate: Date): boolean {
  const now = new Date();
  const maxDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  return targetDate > now && targetDate <= maxDate;
}

async function scheduleReminderEmail({
  to,
  subject,
  html,
  scheduledAt,
}: {
  to: string;
  subject: string;
  html: string;
  scheduledAt: Date;
}): Promise<string | null> {
  const { data, error } = await (resend.emails.send as any)({
    from: FROM_EMAIL,
    to: [to],
    subject,
    html,
    scheduledAt: scheduledAt.toISOString(),
  });
  if (error) throw error;
  return data?.id || null;
}

async function cancelScheduledEmailIfExists(emailId: string | null | undefined) {
  if (!emailId) return;
  try {
    await (resend.emails as any).cancel(emailId);
    console.log("Cancelled scheduled email:", emailId);
  } catch (err: any) {
    console.error("Failed to cancel scheduled email:", emailId, err.message);
  }
}

function buildReminderHtml({
  customerName,
  serviceName,
  formattedDateTime,
  timeLabel,
}: {
  customerName: string;
  serviceName: string;
  formattedDateTime: string;
  timeLabel: string;
}) {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Appointment Reminder</h2>
      <p>Hi ${customerName},</p>
      <p>This is a reminder that your appointment with <strong>${GARAGE_NAME}</strong> is <strong>${timeLabel}</strong>.</p>
      <ul>
        <li><strong>Service:</strong> ${serviceName}</li>
        <li><strong>Date &amp; Time:</strong> ${formattedDateTime}</li>
        <li><strong>Location:</strong> ${GARAGE_ADDRESS}</li>
        ${GARAGE_PHONE ? `<li><strong>Phone:</strong> ${GARAGE_PHONE}</li>` : ""}
      </ul>
      <p>If you need to reschedule or cancel, please contact us as soon as possible.</p>
      <p style="margin-top: 32px; font-size: 12px; color: #666;">
        ${GARAGE_NAME} — ${GARAGE_ADDRESS}
      </p>
    </div>
  `;
}

async function scheduleRemindersForAppointment({
  customerEmail,
  customerName,
  serviceName,
  appointmentDate,
}: {
  customerEmail: string;
  customerName: string;
  serviceName: string;
  appointmentDate: Date;
}) {
  const { twentyFourHoursBefore, twoHoursBefore } = getReminderDates(appointmentDate);
  const formattedDateTime = appointmentDate.toLocaleString("en-CA", {
    timeZone: BOOKING_TIMEZONE,
    dateStyle: "full",
    timeStyle: "short",
  });

  let reminder24h: {
    emailId: string | null;
    scheduledFor: Date;
    status: string;
  } = { emailId: null, scheduledFor: twentyFourHoursBefore, status: "skipped" };

  let reminder2h: {
    emailId: string | null;
    scheduledFor: Date;
    status: string;
  } = { emailId: null, scheduledFor: twoHoursBefore, status: "skipped" };

  // 24-hour reminder
  if (canScheduleWithResend(twentyFourHoursBefore)) {
    try {
      const emailId = await scheduleReminderEmail({
        to: customerEmail,
        subject: `Reminder: Your garage appointment is tomorrow`,
        html: buildReminderHtml({ customerName, serviceName, formattedDateTime, timeLabel: "tomorrow" }),
        scheduledAt: twentyFourHoursBefore,
      });
      reminder24h = { emailId, scheduledFor: twentyFourHoursBefore, status: "scheduled" };
      console.log("Scheduled 24h reminder:", emailId);
    } catch (err: any) {
      console.error("Failed to schedule 24h reminder:", err.message);
      reminder24h = { emailId: null, scheduledFor: twentyFourHoursBefore, status: "failed" };
    }
  } else if (twentyFourHoursBefore > new Date()) {
    reminder24h = { emailId: null, scheduledFor: twentyFourHoursBefore, status: "pendingScheduleLater" };
    console.log("24h reminder stored as pendingScheduleLater (beyond 30-day window)");
  }

  // 2-hour reminder
  if (canScheduleWithResend(twoHoursBefore)) {
    try {
      const emailId = await scheduleReminderEmail({
        to: customerEmail,
        subject: `Reminder: Your garage appointment is in 2 hours`,
        html: buildReminderHtml({ customerName, serviceName, formattedDateTime, timeLabel: "in 2 hours" }),
        scheduledAt: twoHoursBefore,
      });
      reminder2h = { emailId, scheduledFor: twoHoursBefore, status: "scheduled" };
      console.log("Scheduled 2h reminder:", emailId);
    } catch (err: any) {
      console.error("Failed to schedule 2h reminder:", err.message);
      reminder2h = { emailId: null, scheduledFor: twoHoursBefore, status: "failed" };
    }
  } else if (twoHoursBefore > new Date()) {
    reminder2h = { emailId: null, scheduledFor: twoHoursBefore, status: "pendingScheduleLater" };
    console.log("2h reminder stored as pendingScheduleLater (beyond 30-day window)");
  }

  return { reminder24h, reminder2h };
}

// ================================================================
// Google Calendar Helpers
// ================================================================

async function createGoogleCalendarEvent(bookingData: any): Promise<string | null> {
  try {
    const calendarClient = await getCalendarClient();
    if (!calendarClient) {
      console.log("Google Calendar sync skipped: No valid auth found.");
      return null;
    }

    const startTime = new Date(`${bookingData.appointmentDate}T${bookingData.appointmentTime}:00`);
    const endTime = new Date(startTime.getTime() + 60 * 60000);
    const targetCalendarId = process.env.GOOGLE_CALENDAR_ID || "jerryservicegarage@gmail.com";

    const result = await calendarClient.events.insert({
      calendarId: targetCalendarId,
      requestBody: {
        summary: `Service: ${bookingData.serviceName} - ${bookingData.fullName}`,
        description: `
Phone: ${bookingData.phone}
Email: ${bookingData.email}
Vehicle: ${bookingData.vehicleYear} ${bookingData.vehicleMake} ${bookingData.vehicleModel}
Notes: ${bookingData.notes || 'None'}
        `.trim(),
        start: { dateTime: startTime.toISOString() },
        end: { dateTime: endTime.toISOString() },
      },
    });

    const eventId = result.data.id || null;
    console.log("Created Google Calendar event:", eventId);
    return eventId;
  } catch (error) {
    console.error("Google Calendar event creation failed:", error);
    return null;
  }
}

async function updateGoogleCalendarEvent(
  eventId: string,
  bookingData: { appointmentDate: string; appointmentTime: string; serviceName: string; fullName: string; phone: string; email: string; vehicleYear: string; vehicleMake: string; vehicleModel: string; notes?: string }
): Promise<void> {
  try {
    const calendarClient = await getCalendarClient();
    if (!calendarClient) return;

    const targetCalendarId = process.env.GOOGLE_CALENDAR_ID || "jerryservicegarage@gmail.com";
    const startTime = new Date(`${bookingData.appointmentDate}T${bookingData.appointmentTime}:00`);
    const endTime = new Date(startTime.getTime() + 60 * 60000);

    await calendarClient.events.patch({
      calendarId: targetCalendarId,
      eventId,
      requestBody: {
        summary: `Service: ${bookingData.serviceName} - ${bookingData.fullName}`,
        start: { dateTime: startTime.toISOString() },
        end: { dateTime: endTime.toISOString() },
      },
    });
    console.log("Updated Google Calendar event:", eventId);
  } catch (error) {
    console.error("Google Calendar event update failed:", error);
  }
}

async function deleteGoogleCalendarEvent(eventId: string): Promise<void> {
  try {
    const calendarClient = await getCalendarClient();
    if (!calendarClient) return;

    const targetCalendarId = process.env.GOOGLE_CALENDAR_ID || "jerryservicegarage@gmail.com";
    await calendarClient.events.delete({ calendarId: targetCalendarId, eventId });
    console.log("Deleted Google Calendar event:", eventId);
  } catch (error) {
    console.error("Google Calendar event delete failed:", error);
  }
}

// ================================================================
// Server
// ================================================================

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // ── Health ──────────────────────────────────────────────────────
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // ── Google Calendar OAuth Routes ────────────────────────────────
  app.get("/api/auth/google/url", (req, res) => {
    const auth = getGoogleAuth();
    if (auth instanceof google.auth.JWT) {
      return res.status(400).json({ error: "Service Account is active. No OAuth needed." });
    }
    const url = auth.generateAuthUrl({
      access_type: "offline",
      scope: ["https://www.googleapis.com/auth/calendar.events"],
      prompt: "consent select_account",
    });
    res.json({ url });
  });

  app.get("/setup-calendar", (req, res) => {
    const auth = getGoogleAuth();
    if (auth instanceof google.auth.JWT) {
      return res.send("Service Account is already active. No setup needed.");
    }
    const url = auth.generateAuthUrl({
      access_type: "offline",
      scope: ["https://www.googleapis.com/auth/calendar.events"],
      prompt: "consent select_account",
    });
    res.redirect(url);
  });

  app.get("/api/auth/google/callback", async (req, res) => {
    const { code } = req.query;
    try {
      const auth = getGoogleAuth();
      if (!(auth instanceof google.auth.OAuth2)) {
        throw new Error("OAuth not configured");
      }
      const { tokens } = await auth.getToken(code as string);
      if (tokens.refresh_token) {
        await setDoc(doc(db, "settings", "google_calendar"), {
          refresh_token: tokens.refresh_token,
          updatedAt: serverTimestamp(),
        });
      }
      res.send(`
        <html>
          <body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f4f4f5;">
            <div style="background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); text-align: center;">
              <h1 style="color: #18181b; margin-bottom: 1rem;">Connection Successful!</h1>
              <p style="color: #71717a; margin-bottom: 2rem;">Your Google Calendar is now connected to Auto Jerry.</p>
              <a href="/" style="background: #ef4444; color: white; padding: 0.75rem 1.5rem; border-radius: 6px; text-decoration: none; font-weight: 600;">Back to Home</a>
            </div>
          </body>
        </html>
      `);
    } catch (error) {
      console.error("OAuth callback error:", error);
      res.status(500).send("Authentication failed");
    }
  });

  // ── Booking: Create ─────────────────────────────────────────────
  app.post("/api/bookings", async (req, res) => {
    console.log("POST /api/bookings - Start");
    try {
      const { honeypot, recaptchaToken, ...bookingData } = req.body;

      // Honeypot check
      if (honeypot) {
        console.log("Bot detected via honeypot in bookings");
        return res.json({ success: true, id: "bot-blocked" });
      }

      // reCAPTCHA check
      if (!recaptchaToken) {
        return res.status(400).json({ success: false, error: "reCAPTCHA token missing" });
      }
      const isHuman = await verifyRecaptcha(recaptchaToken);
      if (!isHuman) {
        return res.status(400).json({ success: false, error: "reCAPTCHA verification failed" });
      }

      // Build UTC appointment timestamp
      const appointmentDate = new Date(`${bookingData.appointmentDate}T${bookingData.appointmentTime}:00`);

      // Pre-generate the Firestore doc ref so we have the ID for the confirmation email URL
      const docRef = doc(collection(db, "bookingRequests"));

      // Create Google Calendar event
      const googleCalendarEventId = await createGoogleCalendarEvent(bookingData);

      // Send confirmation email via Resend
      let confirmationEmailId: string | null = null;
      if (process.env.RESEND_API_KEY) {
        const verifyUrl = `${process.env.APP_URL || 'http://localhost:3000'}/verify?id=${docRef.id}&token=${bookingData.verificationToken}&action=confirm`;
        try {
          const { data: confirmData } = await resend.emails.send({
            from: FROM_EMAIL,
            to: bookingData.email,
            subject: 'Confirm your Appointment - Jerry Service Garage',
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Confirm your Appointment</h2>
                <p>Hi ${bookingData.fullName},</p>
                <p>Thank you for booking with ${GARAGE_NAME}. Please confirm your appointment details below:</p>
                <ul>
                  <li><strong>Service:</strong> ${bookingData.serviceName}</li>
                  <li><strong>Date:</strong> ${bookingData.appointmentDate}</li>
                  <li><strong>Time:</strong> ${bookingData.appointmentTime}</li>
                  <li><strong>Vehicle:</strong> ${bookingData.vehicleYear} ${bookingData.vehicleMake} ${bookingData.vehicleModel}</li>
                </ul>
                <p>Click the link below to confirm your appointment:</p>
                <a href="${verifyUrl}" style="display: inline-block; background-color: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 16px;">Confirm Appointment</a>
                <p style="margin-top: 32px; font-size: 12px; color: #666;">If you did not request this booking, please ignore this email.</p>
              </div>
            `
          });
          confirmationEmailId = (confirmData as any)?.id || null;
          console.log("Confirmation email sent via Resend:", confirmationEmailId);
        } catch (emailError) {
          console.error("Failed to send Resend confirmation email:", emailError);
        }
      } else {
        console.log("RESEND_API_KEY not set, skipping confirmation email.");
      }

      // Schedule reminder emails
      let reminder24hData = { emailId: null as string | null, scheduledFor: null as Date | null, status: "skipped" };
      let reminder2hData = { emailId: null as string | null, scheduledFor: null as Date | null, status: "skipped" };

      if (process.env.RESEND_API_KEY) {
        const { reminder24h, reminder2h } = await scheduleRemindersForAppointment({
          customerEmail: bookingData.email,
          customerName: bookingData.fullName,
          serviceName: bookingData.serviceName,
          appointmentDate,
        });
        reminder24hData = reminder24h;
        reminder2hData = reminder2h;
      }

      // Save to Firestore (using pre-generated ref)
      console.log("Saving booking to Firestore...");
      await setDoc(docRef, {
        ...bookingData,
        appointmentAt: Timestamp.fromDate(appointmentDate),
        timezone: BOOKING_TIMEZONE,
        googleCalendarEventId: googleCalendarEventId || null,
        resend: {
          confirmationEmailId,
          reminder24h: {
            emailId: reminder24hData.emailId,
            scheduledFor: reminder24hData.scheduledFor ? Timestamp.fromDate(reminder24hData.scheduledFor) : null,
            status: reminder24hData.status,
          },
          reminder2h: {
            emailId: reminder2hData.emailId,
            scheduledFor: reminder2hData.scheduledFor ? Timestamp.fromDate(reminder2hData.scheduledFor) : null,
            status: reminder2hData.status,
          },
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        expiresAt: Timestamp.fromDate(new Date(Date.now() + 30 * 60000)),
      });
      console.log("Booking saved with ID:", docRef.id);

      res.json({ success: true, id: docRef.id, googleCalendarEventId });
    } catch (error) {
      console.error("Booking error:", error);
      res.status(500).json({ success: false, error: "Failed to create booking" });
    }
  });

  // ── Booking: Reschedule ─────────────────────────────────────────
  app.post("/api/bookings/:id/reschedule", async (req, res) => {
    const { id } = req.params;
    const { appointmentDate: newDate, appointmentTime: newTime } = req.body;

    if (!newDate || !newTime) {
      return res.status(400).json({ success: false, error: "appointmentDate and appointmentTime are required" });
    }

    try {
      const docRef = doc(db, "bookingRequests", id);
      const snap = await getDoc(docRef);
      if (!snap.exists()) {
        return res.status(404).json({ success: false, error: "Booking not found" });
      }

      const appointment = snap.data();
      const newAppointmentDate = new Date(`${newDate}T${newTime}:00`);

      // Update Google Calendar event
      if (appointment.googleCalendarEventId) {
        await updateGoogleCalendarEvent(appointment.googleCalendarEventId, {
          ...appointment,
          appointmentDate: newDate,
          appointmentTime: newTime,
        } as any);
      }

      // Cancel old reminder emails
      await cancelScheduledEmailIfExists(appointment.resend?.reminder24h?.emailId);
      await cancelScheduledEmailIfExists(appointment.resend?.reminder2h?.emailId);

      // Schedule new reminders
      const { reminder24h, reminder2h } = await scheduleRemindersForAppointment({
        customerEmail: appointment.email,
        customerName: appointment.fullName,
        serviceName: appointment.serviceName,
        appointmentDate: newAppointmentDate,
      });

      // Update Firestore
      await updateDoc(docRef, {
        appointmentDate: newDate,
        appointmentTime: newTime,
        appointmentAt: Timestamp.fromDate(newAppointmentDate),
        status: "rescheduled",
        resend: {
          confirmationEmailId: appointment.resend?.confirmationEmailId || null,
          reminder24h: {
            emailId: reminder24h.emailId,
            scheduledFor: reminder24h.scheduledFor ? Timestamp.fromDate(reminder24h.scheduledFor) : null,
            status: reminder24h.status,
          },
          reminder2h: {
            emailId: reminder2h.emailId,
            scheduledFor: reminder2h.scheduledFor ? Timestamp.fromDate(reminder2h.scheduledFor) : null,
            status: reminder2h.status,
          },
        },
        updatedAt: serverTimestamp(),
      });

      console.log(`Booking ${id} rescheduled to ${newDate} ${newTime}`);
      res.json({ success: true });
    } catch (error) {
      console.error("Reschedule error:", error);
      res.status(500).json({ success: false, error: "Failed to reschedule booking" });
    }
  });

  // ── Booking: Cancel ─────────────────────────────────────────────
  app.post("/api/bookings/:id/cancel", async (req, res) => {
    const { id } = req.params;

    try {
      const docRef = doc(db, "bookingRequests", id);
      const snap = await getDoc(docRef);
      if (!snap.exists()) {
        return res.status(404).json({ success: false, error: "Booking not found" });
      }

      const appointment = snap.data();

      // Delete Google Calendar event
      if (appointment.googleCalendarEventId) {
        await deleteGoogleCalendarEvent(appointment.googleCalendarEventId);
      }

      // Cancel scheduled reminder emails
      await cancelScheduledEmailIfExists(appointment.resend?.reminder24h?.emailId);
      await cancelScheduledEmailIfExists(appointment.resend?.reminder2h?.emailId);

      // Update Firestore
      await updateDoc(docRef, {
        status: "cancelled",
        "resend.reminder24h.status": appointment.resend?.reminder24h?.emailId ? "cancelled" : appointment.resend?.reminder24h?.status,
        "resend.reminder2h.status": appointment.resend?.reminder2h?.emailId ? "cancelled" : appointment.resend?.reminder2h?.status,
        updatedAt: serverTimestamp(),
      });

      console.log(`Booking ${id} cancelled`);
      res.json({ success: true });
    } catch (error) {
      console.error("Cancel error:", error);
      res.status(500).json({ success: false, error: "Failed to cancel booking" });
    }
  });

  // ── Reminders: Backfill (pendingScheduleLater) ──────────────────
  // POST /api/reminders/backfill
  // Protected by a shared secret in the Authorization header.
  app.post("/api/reminders/backfill", async (req, res) => {
    const authHeader = req.headers["authorization"];
    const expectedSecret = process.env.BACKFILL_SECRET;

    if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    try {
      const pendingSnap = await getDocs(
        query(collection(db, "bookingRequests"), where("status", "in", ["booked", "confirmed", "rescheduled", "pending_verification"]))
      );

      let scheduled = 0;
      let skipped = 0;

      for (const docSnap of pendingSnap.docs) {
        const appointment = docSnap.data();
        const docRef = doc(db, "bookingRequests", docSnap.id);

        const appointmentDate: Date = appointment.appointmentAt?.toDate?.() || new Date(appointment.appointmentDate + "T" + appointment.appointmentTime + ":00");
        const { twentyFourHoursBefore, twoHoursBefore } = getReminderDates(appointmentDate);

        let updated = false;
        const updates: Record<string, any> = {};

        // Check 24h reminder
        if (appointment.resend?.reminder24h?.status === "pendingScheduleLater" && canScheduleWithResend(twentyFourHoursBefore)) {
          try {
            const formattedDateTime = appointmentDate.toLocaleString("en-CA", { timeZone: BOOKING_TIMEZONE, dateStyle: "full", timeStyle: "short" });
            const emailId = await scheduleReminderEmail({
              to: appointment.email,
              subject: `Reminder: Your garage appointment is tomorrow`,
              html: buildReminderHtml({ customerName: appointment.fullName, serviceName: appointment.serviceName, formattedDateTime, timeLabel: "tomorrow" }),
              scheduledAt: twentyFourHoursBefore,
            });
            updates["resend.reminder24h.emailId"] = emailId;
            updates["resend.reminder24h.status"] = "scheduled";
            updates["resend.reminder24h.scheduledFor"] = Timestamp.fromDate(twentyFourHoursBefore);
            updated = true;
            scheduled++;
            console.log(`Backfill: scheduled 24h reminder for booking ${docSnap.id}`);
          } catch (err: any) {
            console.error(`Backfill: failed 24h for ${docSnap.id}:`, err.message);
          }
        } else {
          skipped++;
        }

        // Check 2h reminder
        if (appointment.resend?.reminder2h?.status === "pendingScheduleLater" && canScheduleWithResend(twoHoursBefore)) {
          try {
            const formattedDateTime = appointmentDate.toLocaleString("en-CA", { timeZone: BOOKING_TIMEZONE, dateStyle: "full", timeStyle: "short" });
            const emailId = await scheduleReminderEmail({
              to: appointment.email,
              subject: `Reminder: Your garage appointment is in 2 hours`,
              html: buildReminderHtml({ customerName: appointment.fullName, serviceName: appointment.serviceName, formattedDateTime, timeLabel: "in 2 hours" }),
              scheduledAt: twoHoursBefore,
            });
            updates["resend.reminder2h.emailId"] = emailId;
            updates["resend.reminder2h.status"] = "scheduled";
            updates["resend.reminder2h.scheduledFor"] = Timestamp.fromDate(twoHoursBefore);
            updated = true;
            scheduled++;
            console.log(`Backfill: scheduled 2h reminder for booking ${docSnap.id}`);
          } catch (err: any) {
            console.error(`Backfill: failed 2h for ${docSnap.id}:`, err.message);
          }
        }

        if (updated) {
          updates["updatedAt"] = serverTimestamp();
          await updateDoc(docRef, updates);
        }
      }

      console.log(`Backfill complete: ${scheduled} reminders scheduled, ${skipped} skipped`);
      res.json({ success: true, scheduled, skipped });
    } catch (error) {
      console.error("Backfill error:", error);
      res.status(500).json({ success: false, error: "Backfill failed" });
    }
  });

  // ── Verify booking ──────────────────────────────────────────────
  // TODO: Booking is currently disabled. When re-enabled, validate the token
  // against the Firestore document here (requires Admin SDK for server-side reads).
  app.post("/api/verify-booking", async (req, res) => {
    const { id, token } = req.body;
    if (!id || !token) {
      return res.status(400).json({ success: false, error: "Missing id or token" });
    }
    return res.status(503).json({ success: false, error: "Booking verification is currently disabled" });
  });

  // ── Contact form ────────────────────────────────────────────────
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, emailOrPhone, message, honeypot, recaptchaToken } = req.body;

      if (honeypot) {
        console.log("Bot detected via honeypot in contact form");
        return res.json({ success: true });
      }

      if (!recaptchaToken) {
        return res.status(400).json({ success: false, error: "reCAPTCHA token missing" });
      }
      const isHuman = await verifyRecaptcha(recaptchaToken);
      if (!isHuman) {
        return res.status(400).json({ success: false, error: "reCAPTCHA verification failed" });
      }

      if (!process.env.GMAIL_APP_PASSWORD) {
        console.warn("GMAIL_APP_PASSWORD is not set. Skipping email send.");
        return res.json({ success: true, warning: "Email not sent (missing password)" });
      }

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "jerryservicegarage@gmail.com",
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });

      await transporter.sendMail({
        from: '"Jerry Service Garage Website" <jerryservicegarage@gmail.com>',
        to: "jerryservicegarage@gmail.com",
        subject: `New Contact Message from ${name}`,
        text: `Name: ${name}\nContact Info: ${emailOrPhone}\n\nMessage:\n${message}`,
      });

      res.json({ success: true });
    } catch (error) {
      console.error("Error sending contact email:", error);
      res.status(500).json({ success: false, error: "Failed to send email" });
    }
  });

  // ── Static / Vite ───────────────────────────────────────────────
  app.use(express.static(path.join(process.cwd(), 'public')));

  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Using Google Client ID: ${process.env.GOOGLE_CLIENT_ID}`);
  });
}

startServer();
