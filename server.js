const express = require("express");

const app = express();

app.use(express.json());

// 🔥 Webhook Endpoint
app.post("/webhook", (req, res) => {
  console.log("📩 Neue Daten von Tracify:");

  const data = req.body;

  console.log(JSON.stringify(data, null, 2));

  // optional speichern (später wichtig für Claude)
  
  res.send("ok");
});

// Test Route
app.get("/", (req, res) => {
  res.send("Server läuft 🚀");
});

app.listen(3000, () => {
  console.log("🚀 Server läuft auf Port 3000");
});
