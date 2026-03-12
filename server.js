import express from "express";
import crypto from "crypto";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let lastDonation = { platform: null, username: null, amount: 0, message: "" };

// Existing SocialBuzz webhook
app.post("/webhook/socialbuzz", (req, res) => {
  console.log("💖 New donation from SocialBuzz:", req.body);
  lastDonation = { platform: "socialbuzz", ...req.body };
  res.json({ success: true });
});

// New Saweria webhook
app.post("/webhook/saweria", (req, res) => {
  console.log("💖 New donation from Saweria:", req.body);
  
  // Validate signature if streaming key is set
  if (process.env.SAWERIA_STREAMING_KEY) {
    const isValid = validateSaweriaSignature(req.body, req.headers['saweria-callback-signature'], process.env.SAWERIA_STREAMING_KEY);
    if (!isValid) {
      console.log("❌ Invalid Saweria signature");
      return res.status(400).json({ error: "Invalid signature" });
    }
    console.log("✅ Valid Saweria signature");
  }

  const { donator_name, amount_raw, message } = req.body;
  lastDonation = { platform: "saweria", username: donator_name, amount: amount_raw, message };
  res.json({ success: true });
});

// New BagiBagi webhook
app.post("/webhook/bagibagi", (req, res) => {
  console.log("💖 New donation from BagiBagi:", req.body);
  
  // Validate signature if webhook token is set
  if (process.env.BAGIBAGI_WEBHOOK_TOKEN) {
    const isValid = validateBagibagiSignature(req.body, req.headers['x-bagibagi-signature'], process.env.BAGIBAGI_WEBHOOK_TOKEN);
    if (!isValid) {
      console.log("❌ Invalid BagiBagi signature");
      return res.status(400).json({ error: "Invalid signature" });
    }
    console.log("✅ Valid BagiBagi signature");
  }

  const { name, amount, message } = req.body;
  lastDonation = { platform: "bagibagi", username: name, amount, message };
  res.json({ success: true });
});

app.get("/data", (req, res) => {
  res.json(lastDonation);
});

app.listen(3000, () => console.log("✅ Multi-platform webhook server running"));

// Signature validation functions
function validateSaweriaSignature(body, signature, key) {
  if (!signature || !key) return true; // Skip if no signature or key
  
  try {
    // Saweria uses: HMAC-SHA256 of concatenated string
    // callback_payload = [version, id, amount_raw, donator_name, donator_email]
    const payload = [
      body.version,
      body.id,
      body.amount_raw,
      body.donator_name,
      body.donator_email
    ].join("");

    const computed = crypto
      .createHmac("sha256", key)
      .update(payload)
      .digest("hex");

    return computed === signature;
  } catch (error) {
    console.error("Signature validation error:", error);
    return false;
  }
}

function validateBagibagiSignature(body, signature, token) {
  if (!signature || !token) return true; // Skip if no signature or token
  
  try {
    // BagiBagi uses: HMAC-SHA256 of JSON stringified body
    const computed = crypto
      .createHmac("sha256", token)
      .update(JSON.stringify(body))
      .digest("hex");

    return computed === signature;
  } catch (error) {
    console.error("Signature validation error:", error);
    return false;
  }
}
