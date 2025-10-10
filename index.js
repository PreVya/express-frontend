require('dotenv').config();
const express = require("express");
const path = require("path");
const axios = require("axios");

const app = express();

const PORT = process.env.PORT || 3000;
const BACKEND_URL = process.env.BACKEND_URL;

// Sanity check
if (!BACKEND_URL) {
  console.error("❌ BACKEND_URL is not set! Make sure it’s in .env");
  process.exit(1);
}

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Forward form data to Flask backend
app.post("/submit", async (req, res) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/add-entry`, req.body, {
      headers: { "Content-Type": "application/json" },
      timeout: 10000,
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("❌ Error calling backend:", error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Serve frontend index.html for any non-API route
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Frontend running on http://0.0.0.0:${PORT}`);
  console.log(`↪️  Proxying backend requests to: ${BACKEND_URL}`);
});
