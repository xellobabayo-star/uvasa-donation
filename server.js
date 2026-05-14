import express from "express";
import crypto from "crypto";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Health check — wajib untuk Render
app.get("/health", (_req, res) => res.json({ status: "ok" }));

let lastDonation = { platform: null, username: null, amount: 0, message: "", currency: "Rp" };

// SocialBuzz
app.post("/webhook/socialbuzz", (req, res) => {
  console.log("💖 SocialBuzz:", req.body);
  lastDonation = { platform: "socialbuzz", currency: "Rp", ...req.body };
  res.json({ success: true });
});

// Saweria
app.post("/webhook/saweria", (req, res) => {
  console.log("💖 Saweria:", req.body);

  if (process.env.SAWERIA_STREAMING_KEY) {
    const valid = validateSaweriaSignature(
      req.body,
      req.headers["saweria-callback-signature"],
      process.env.SAWERIA_STREAMING_KEY
    );
    if (!valid) return res.status(400).json({ error: "Invalid signature" });
  }

  const { donator_name, amount_raw, message } = req.body;
  lastDonation = { platform: "saweria", username: donator_name, amount: amount_raw, message, currency: "Rp" };
  res.json({ success: true });
});

// BagiBagi
app.post("/webhook/bagibagi", (req, res) => {
  console.log("💖 BagiBagi:", req.body);

  if (process.env.BAGIBAGI_WEBHOOK_TOKEN) {
    const valid = validateBagibagiSignature(
      req.body,
      req.headers["x-bagibagi-signature"],
      process.env.BAGIBAGI_WEBHOOK_TOKEN
    );
    if (!valid) return res.status(400).json({ error: "Invalid signature" });
  }

  const { name, amount, message } = req.body;
  lastDonation = { platform: "bagibagi", username: name, amount, message, currency: "Rp" };
  res.json({ success: true });
});

// Data endpoint
app.get("/data", (_req, res) => res.json(lastDonation));

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

// ── Helpers ──────────────────────────────────────────────────
function validateSaweriaSignature(body, signature, key) {
  if (!signature || !key) return true;
  try {
    const payload = [body.version, body.id, body.amount_raw, body.donator_name, body.donator_email].join("");
    const computed = crypto.createHmac("sha256", key).update(payload).digest("hex");
    return computed === signature;
  } catch { return false; }
}

function validateBagibagiSignature(body, signature, token) {
  if (!signature || !token) return true;
  try {
    const computed = crypto.createHmac("sha256", token).update(JSON.stringify(body)).digest("hex");
    return computed === signature;
  } catch { return false; }
}
