const express = require("express");
const app = express();

// WICHTIG: nimmt ALLES an (auch non-json)
app.use(express.text({ type: "*/*" }));

console.log("🔥 VERSION 4 AKTIV");

// Speicher
let gespeicherteDaten = [];

// Webhook
app.post("/webhook", (req, res) => {
  console.log("📩 Neue Daten von Tracify erhalten");

  try {
    let data;

    // Falls String → parse versuchen
    if (typeof req.body === "string") {
      data = JSON.parse(req.body);
    } else {
      data = req.body;
    }

    console.log("TYPE:", typeof data);

    if (Array.isArray(data)) {
      gespeicherteDaten = gespeicherteDaten.concat(data);
    } else if (Array.isArray(data.results)) {
      gespeicherteDaten = gespeicherteDaten.concat(data.results);
    } else {
      console.log("⚠️ Unbekanntes Format:", data);
    }

    console.log("📊 Gespeichert:", gespeicherteDaten.length);
  } catch (err) {
    console.log("❌ Parse Fehler:", err.message);
  }

  res.sendStatus(200);
});

// Daten anzeigen
app.get("/daten", (req, res) => {
  res.json(gespeicherteDaten);
});

// Analyse
app.get("/analysis", (req, res) => {
  if (gespeicherteDaten.length === 0) {
    return res.json({ message: "Keine Daten vorhanden" });
  }

  let kampagnen = {};

  gespeicherteDaten.forEach((eintrag) => {
    const name = eintrag.dimensions?.campaignName || "Unbekannt";
    const revenue =
      eintrag.metrics?.customer_revenue ||
      eintrag.metrics?.revenue ||
      0;

    if (!kampagnen[name]) {
      kampagnen[name] = 0;
    }

    kampagnen[name] += revenue;
  });

  res.json(kampagnen);
});

// Root
app.get("/", (req, res) => {
  res.send("🔥 VERSION 4 LIVE");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("🚀 Server läuft");
});
