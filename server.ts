import express from "express";
import path from "path";
import { google } from "googleapis";
import admin from "firebase-admin";
import fs from "fs";
import "dotenv/config";

// Initialize Firebase Admin
const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf-8'));
admin.initializeApp({
  projectId: firebaseConfig.projectId,
});
const db = admin.firestore();
db.settings({ databaseId: firebaseConfig.firestoreDatabaseId });

function getOAuth2Client() {
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
    const oauth2Client = getOAuth2Client();
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: ["https://www.googleapis.com/auth/calendar.events"],
      prompt: "consent select_account",
    });
    res.json({ url });
  });

  app.get("/api/auth/google/callback", async (req, res) => {
    const { code } = req.query;
    try {
      const oauth2Client = getOAuth2Client();
      const { tokens } = await oauth2Client.getToken(code as string);
      if (tokens.refresh_token) {
        await db.collection("settings").doc("google_calendar").set({
          refresh_token: tokens.refresh_token,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
      res.send(`
        <html>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS' }, '*');
                window.close();
              } else {
                window.location.href = '/';
              }
            </script>
            <p>Authentication successful. This window should close automatically.</p>
          </body>
        </html>
      `);
    } catch (error) {
      console.error("OAuth callback error:", error);
      res.status(500).send("Authentication failed");
    }
  });

  // Booking endpoint
  app.post("/api/bookings", async (req, res) => {
    try {
      const bookingData = req.body;
      
      // Save to Firestore
      const docRef = await db.collection("bookingRequests").add({
        ...bookingData,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        expiresAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 30 * 60000)),
      });

      // Try to add to Google Calendar
      try {
        const settingsDoc = await db.collection("settings").doc("google_calendar").get();
        if (settingsDoc.exists && settingsDoc.data()?.refresh_token) {
          const oauth2Client = getOAuth2Client();
          oauth2Client.setCredentials({ refresh_token: settingsDoc.data()?.refresh_token });
          const calendar = google.calendar({ version: "v3", auth: oauth2Client });
          
          const startTime = new Date(`${bookingData.appointmentDate}T${bookingData.appointmentTime}:00`);
          const endTime = new Date(startTime.getTime() + 60 * 60000); // 1 hour duration

          await calendar.events.insert({
            calendarId: "primary",
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
        }
      } catch (calError) {
        console.error("Failed to add to Google Calendar:", calError);
        // Continue even if calendar fails
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
  });
}

startServer();
