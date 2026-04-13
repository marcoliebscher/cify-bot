const express = require("express");
const app = express();

app.use(express.text({ type: "*/*" }));

let gespeicherteDaten = [];

console.log("🔥 FINAL VERSION AKTIV");

app.post("/webhook", (req, res) => {
  console.log("📩 Webhook hit");

  try {
    let body = req.body;

    // Falls string → parse
    if (typeof body === "string") {
      body = JSON.parse(body);
    }

    console.log("RAW BODY:", body);

    // 🔥 einfach ALLES speichern
    gespeicherteDaten.push(body);

    console.log("📦 Gesamt Einträge:", gespeicherteDaten.length);

  } catch (err) {
    console.log("❌ Fehler:", err.message);
  }

  res.sendStatus(200);
});

app.get("/daten", (req, res) => {
  res.json(gespeicherteDaten);
});

app.get("/", (req, res) => {
  res.send("🔥 läuft");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("🚀 Server läuft");
});
