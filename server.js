const express = require("express");
const app = express();

app.use(express.text({ type: "*/*" }));

let gespeicherteDaten = [];

console.log("🔥 FIXED VERSION AKTIV");

// Webhook
app.post("/webhook", (req, res) => {
  console.log("📩 Webhook hit");

  try {
    if (!req.body) {
      console.log("⚠️ Kein Body");
      return res.sendStatus(200);
    }

    let body = req.body;

    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch (e) {
        console.log("⚠️ Kein JSON");
        return res.sendStatus(200);
      }
    }

    gespeicherteDaten.push(body);

    console.log("📦 Daten gespeichert:", gespeicherteDaten.length);

  } catch (err) {
    console.log("❌ Fehler:", err.message);
  }

  res.sendStatus(200);
});

// Debug
app.get("/daten", (req, res) => {
  res.json(gespeicherteDaten);
});

// Root
app.get("/", (req, res) => {
  res.send("🔥 SERVER LÄUFT FIXED");
});

// 🚨 DAS IST DER WICHTIGE TEIL
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server läuft auf Port ${PORT}`);
});
