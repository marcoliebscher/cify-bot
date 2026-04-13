const express = require("express");
const app = express();

app.use(express.json());

console.log("🔥 VERSION 2 AKTIV");

// Speicher für Webhook Daten
let gespeicherteDaten = [];

// Webhook Endpoint (Tracify schickt hier Daten rein)
app.post("/webhook", (req, res) => {
  console.log("📩 Neue Daten von Tracify erhalten");

  if (Array.isArray(req.body)) {
    gespeicherteDaten = gespeicherteDaten.concat(req.body);
  }

  res.sendStatus(200);
});

// Debug: rohe Daten anzeigen
app.get("/daten", (req, res) => {
  res.json(gespeicherteDaten);
});

// 🔥 AI ANALYSIS (JETZT DEFINITIV DRIN)
app.get("/analysis", (req, res) => {
  try {
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
      const orders =
        eintrag.metrics?.customer_purchase ||
        eintrag.metrics?.orders ||
        0;

      if (!kampagnen[name]) {
        kampagnen[name] = {
          revenue: 0,
          orders: 0,
        };
      }

      kampagnen[name].revenue += revenue;
      kampagnen[name].orders += orders;
    });

    let beste = null;
    let schlechteste = null;

    Object.entries(kampagnen).forEach(([name, data]) => {
      if (!beste || data.revenue > beste.revenue) {
        beste = { name, ...data };
      }
      if (!schlechteste || data.revenue < schlechteste.revenue) {
        schlechteste = { name, ...data };
      }
    });

    const gesamtRevenue = Object.values(kampagnen).reduce(
      (sum, k) => sum + k.revenue,
      0
    );

    res.json({
      status: "OK 🔥",
      gesamtRevenue,
      besteKampagne: beste,
      schlechtesteKampagne: schlechteste,
      kampagnen,
    });
  } catch (err) {
    res.json({ error: err.message });
  }
});

// Root (damit du siehst ob neuer Code läuft)
app.get("/", (req, res) => {
  res.send("🔥 VERSION 2 LIVE");
});

app.listen(3000, () => {
  console.log("🚀 Server läuft auf Port 3000");
});
