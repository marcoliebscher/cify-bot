const express = require("express");
const app = express();

app.use(express.text({ type: "*/*" }));

console.log("🔥 STABLE VERSION AKTIV");

let gespeicherteDaten = [];

app.post("/webhook", (req, res) => {
  console.log("📩 Webhook hit");

  try {
    if (!req.body) {
      console.log("⚠️ Kein Body erhalten");
      return res.sendStatus(200);
    }

    let body = req.body;

    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch (e) {
        console.log("⚠️ Kein gültiges JSON:", body);
        return res.sendStatus(200);
      }
    }

    console.log("✅ BODY OK");

    gespeicherteDaten.push(body);

    console.log("📦 Gesamt:", gespeicherteDaten.length);

  } catch (err) {
    console.log("❌ Fehler:", err.message);
  }

  res.sendStatus(200);
});

app.get("/daten", (req, res) => {
  res.json(gespeicherteDaten);
});

app.get("/analysis", (req, res) => {
  if (gespeicherteDaten.length === 0) {
    return res.json({ message: "Keine Daten vorhanden" });
  }

  res.json(gespeicherteDaten);
});

app.get("/", (req, res) => {
  res.send("🔥 SERVER STABIL");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("🚀 Server läuft");
});
