const express = require("express");
const app = express();

app.use(express.json());

console.log("🔥 VERSION 3 AKTIV");

// Speicher
let gespeicherteDaten = [];

// Webhook
app.post("/webhook", (req, res) => {
  console.log("📩 Neue Daten von Tracify erhalten");

  // DEBUG
  console.log("BODY:", JSON.stringify(req.body).slice(0, 200));

  if (Array.isArray(req.body)) {
    gespeicherteDaten = gespeicherteDaten.concat(req.body);
  } else if (Array.isArray(req.body.results)) {
    gespeicherteDaten = gespeicherteDaten.concat(req.body.results);
  } else {
    console.log("⚠️ Unbekanntes Format");
  }

  console.log("📊 Gespeicherte Einträge:", gespeicherteDaten.length);

  res.sendStatus(200);
});

// Daten anzeigen
app.get("/daten", (req, res) => {
  res.json(gespeicherteDaten);
});

// Analyse
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

// Root
app.get("/", (req, res) => {
  res.send("🔥 VERSION 3 LIVE");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("🚀 Server läuft");
});
