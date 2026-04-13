const express = require("express");
const axios = require("axios");

const app = express();

let SESSION_TOKEN = null;

// 🔑 Login (OHNE HASH – funktioniert meist direkt)
async function login() {
  const EMAIL = process.env.EMAIL;
  const PASSWORD = process.env.PASSWORD;

  if (!EMAIL || !PASSWORD) {
    throw new Error("ENV Variablen fehlen!");
  }

  const response = await axios.post(
    "https://hive2.tracify.ai/v1/tracify/api/account/login",
    {
      email: EMAIL,
      password: PASSWORD,
    }
  );

  SESSION_TOKEN = response.data.result.session;
  console.log("✅ Token geholt");
}

// 📊 Endpoint
app.get("/kampagnen", async (req, res) => {
  try {
    if (!SESSION_TOKEN) {
      await login();
    }

    const SITE_ID = process.env.SITE_ID;
    const PRESET_ID = process.env.PRESET_ID;

    const response = await axios.get(
      "https://tracify-api.tracify.ai/analytics/api/v1/kpis/channels/",
      {
        headers: {
          Authorization: SESSION_TOKEN,
        },
        params: {
          site_id: SITE_ID,
          preset_id: PRESET_ID,
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.log("❌ ERROR:", err.response?.data || err.message);
    res.send(err.response?.data || err.message);
  }
});

app.listen(3000, () => {
  console.log("🚀 Server läuft");
});
