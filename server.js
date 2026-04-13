const express = require("express");

const app = express();
app.use(express.json());

// 🔥 Speicher (einfach im RAM)
let gespeicherteDaten = [];

// Webhook
app.post("/webhook", (req, res) => {
  console.log("📩 Neue Daten von Tracify");

  const data = req.body;

  gespeicherteDaten.push(...data.results);

  console.log("💾 Daten gespeichert:", gespeicherteDaten.length);

  res.send("ok");
});

// 👉 Daten abrufen (wichtig für später)
app.get("/daten", (req, res) => {
  res.json(gespeicherteDaten);
});

app.get("/", (req, res) => {
  res.send("Server läuft 🚀");
});

app.listen(3000, () => {
  console.log("🚀 Server läuft auf Port 3000");
});
