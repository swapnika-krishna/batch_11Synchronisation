import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Welcome Email
  app.post("/api/welcome", async (req, res) => {
    const { email, displayName } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    try {
      // Create a test account if no real credentials are provided
      // In a real app, use process.env.SMTP_HOST, etc.
      let transporter;
      
      if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || "smtp.gmail.com",
          port: 587,
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });
      } else {
        // Fallback or Dev mode: log to console or use ethereal
        console.log(`[Email Simulation] To: ${email}, Subject: Welcome to SyncMaster!`);
        return res.json({ success: true, message: "Welcome email simulation successful" });
      }

      const info = await transporter.sendMail({
        from: '"SyncMaster Team" <no-reply@syncmaster.edu>',
        to: email,
        subject: "Welcome to SyncMaster! 🚀",
        text: `Hello ${displayName || "Explorer"},\n\nWelcome to SyncMaster! Grow up by learning and mastering OS process synchronization. Dive into our simulator and ace the quizzes to climb the ranks!\n\nBest regards,\nThe SyncMaster Team`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h1 style="color: #0f172a;">Welcome to SyncMaster, ${displayName || "Explorer"}! 🚀</h1>
            <p>We're thrilled to have you on board. Our platform is designed to help you <strong>grow up by learning</strong> the complex world of OS process synchronization.</p>
            <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0;"><strong>Start your journey:</strong></p>
              <ul style="margin-top: 10px;">
                <li>Explore core concepts like Peterson's Algorithm and Mutexes.</li>
                <li>Visualise real-time execution in our Simulator.</li>
                <li>Challenge yourself with over 50+ quiz questions.</li>
                <li>Track your growth, gain ratings, and climb the ranks!</li>
              </ul>
            </div>
            <p>Happy Learning!</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 12px; color: #64748b;">SyncMaster - The Ultimate OS Learning Platform</p>
          </div>
        `,
      });

      console.log("Message sent: %s", info.messageId);
      res.json({ success: true, messageId: info.messageId });
    } catch (error) {
      console.error("Email error:", error);
      res.status(500).json({ error: "Failed to send email" });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
