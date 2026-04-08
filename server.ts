import express from "express";
import path from "path";
import { google } from "googleapis";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp, Timestamp, doc, getDoc, setDoc } from "firebase/firestore";
import fs from "fs";
import nodemailer from "nodemailer";
import { Resend } from "resend";
import "dotenv/config";

// Initialize Firebase Client SDK (more reliable for cross-project access in this environment)
const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const resend = new Resend(process.env.RESEND_API_KEY);

// Google test secret key for reCAPTCHA (always passes)
const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY || "6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe";

async function verifyRecaptcha(token: string) {
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

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Google Calendar OAuth Routes
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

  // Hidden setup route for OAuth (if not using Service Account)
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

  // Helper for Google Calendar Sync (Non-blocking)
  async function syncToGoogleCalendar(bookingData: any) {
    try {
      const auth = getGoogleAuth();
      let calendarAuth = null;

      if (auth instanceof google.auth.JWT) {
        // Service Account flow - No Firestore check needed
        calendarAuth = auth;
        console.log("Using Service Account for Google Calendar sync");
      } else {
        // OAuth flow - Requires refresh token from Firestore
        const settingsDoc = await getDoc(doc(db, "settings", "google_calendar"));
        if (settingsDoc.exists() && settingsDoc.data()?.refresh_token) {
          auth.setCredentials({ refresh_token: settingsDoc.data()?.refresh_token });
          calendarAuth = auth;
          console.log("Using OAuth for Google Calendar sync");
        }
      }

      if (calendarAuth) {
        const calendar = google.calendar({ version: "v3", auth: calendarAuth });
        const startTime = new Date(`${bookingData.appointmentDate}T${bookingData.appointmentTime}:00`);
        const endTime = new Date(startTime.getTime() + 60 * 60000);

        // Use the specific calendar ID (user's email) instead of 'primary' 
        // because 'primary' for a service account refers to its own hidden calendar.
        const targetCalendarId = process.env.GOOGLE_CALENDAR_ID || "jerryservicegarage@gmail.com";

        await calendar.events.insert({
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
        console.log("Successfully added event to Google Calendar");
      } else {
        console.log("Google Calendar sync skipped: No valid auth (Service Account or OAuth) found.");
      }
    } catch (error) {
      console.error("Background Google Calendar sync failed:", error);
    }
  }

  // Booking endpoint
  app.post("/api/bookings", async (req, res) => {
    console.log("POST /api/bookings - Start");
    try {
      const { honeypot, recaptchaToken, ...bookingData } = req.body;
      
      // 1. Honeypot Check (if filled out, it's a bot)
      if (honeypot) {
        console.log("Bot detected via honeypot in bookings");
        return res.json({ success: true, id: "bot-blocked" }); // Fake success
      }

      // 2. reCAPTCHA Check
      if (!recaptchaToken) {
        return res.status(400).json({ success: false, error: "reCAPTCHA token missing" });
      }
      const isHuman = await verifyRecaptcha(recaptchaToken);
      if (!isHuman) {
        return res.status(400).json({ success: false, error: "reCAPTCHA verification failed" });
      }

      // Save to Firestore
      console.log("Saving booking to Firestore...");
      const docRef = await addDoc(collection(db, "bookingRequests"), {
        ...bookingData,
        createdAt: serverTimestamp(),
        expiresAt: Timestamp.fromDate(new Date(Date.now() + 30 * 60000)),
      });
      console.log("Booking saved with ID:", docRef.id);

      // Trigger Google Calendar sync in background
      syncToGoogleCalendar(bookingData);

      // Send Confirmation Email via Resend
      if (process.env.RESEND_API_KEY) {
        const verifyUrl = `${process.env.APP_URL || 'http://localhost:3000'}/verify?id=${docRef.id}&token=${bookingData.verificationToken}&action=confirm`;
        
        try {
          await resend.emails.send({
            from: 'Jerry Service Garage <onboarding@resend.dev>', // Use your verified domain here in production
            to: bookingData.email,
            subject: 'Confirm your Appointment - Jerry Service Garage',
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Confirm your Appointment</h2>
                <p>Hi ${bookingData.fullName},</p>
                <p>Thank you for booking with Jerry Service Garage. Please confirm your appointment details below:</p>
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
          console.log("Confirmation email sent via Resend");
        } catch (emailError) {
          console.error("Failed to send Resend email:", emailError);
        }
      } else {
        console.log("RESEND_API_KEY not set, skipping confirmation email.");
      }

      res.json({ success: true, id: docRef.id });
    } catch (error) {
      console.error("Booking error:", error);
      res.status(500).json({ success: false, error: "Failed to create booking" });
    }
  });

  // Mock email verification endpoint
  app.post("/api/verify-booking", async (req, res) => {
    const { token } = req.body;
    res.json({ success: true });
  });

  // Contact form email endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, emailOrPhone, message, honeypot, recaptchaToken } = req.body;

      // 1. Honeypot Check
      if (honeypot) {
        console.log("Bot detected via honeypot in contact form");
        return res.json({ success: true }); // Fake success
      }

      // 2. reCAPTCHA Check
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

  // Vite middleware for development
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
