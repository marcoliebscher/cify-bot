const express = require("express");
const app = express();

app.use(express.json());

let gespeicherteDaten = [];

app.post("/webhook", (req, res) => {
  console.log("📩 Neue Daten von Tracify erhalten");

  if (Array.isArray(req.body)) {
    gespeicherteDaten = gespeicherteDaten.concat(req.body);
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

  let kampagnen = {};

  gespeicherteDaten.forEach((eintrag) => {
    const name = eintrag.dimensions?.campaignName || "Unbekannt";
    const revenue = eintrag.metrics?.revenue || 0;

    if (!kampagnen[name]) {
      kampagnen[name] = { revenue: 0 };
    }

    kampagnen[name].revenue += revenue;
  });

  res.json(kampagnen);
});

app.get("/", (req, res) => {
  res.send("ICH BIN NEU 🔥");
});

app.listen(3000, () => {
  console.log("🚀 Server läuft");
});
