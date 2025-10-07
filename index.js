require('dotenv').config();
const express = require("express");
const path = require("path");
const axios = require("axios"); // install axios with yarn add axios
const app = express();

const PORT = process.env.PORT || 3000;
// Backend URL from env var, default to local Flask dev
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Forward frontend form data to Flask backend
app.post("/submit", async (req, res) => {
  try {
    const resp = await axios.post(`${BACKEND_URL}/add-entry`, req.body, {
      headers: { "Content-Type": "application/json" },
      timeout: 10000
    });
    res.status(resp.status).json(resp.data);
  } catch (err) {
    if (err.response) {
      // Flask returned an error
      res.status(err.response.status).json(err.response.data);
    } else {
      // Network / other error
      res.status(500).json({ error: err.message });
    }
  }
});

// Optional: catch-all route to serve index.html for frontend routing
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.listen(PORT, () => {
  console.log(`Express frontend running at http://localhost:${PORT}`);
});
