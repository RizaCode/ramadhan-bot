const axios = require("axios");
const { loadDB, saveDB } = require("../utils/db");

module.exports = (bot) => {
  bot.onText(/\/setkota/, (msg) => {
    bot.sendMessage(msg.chat.id, "📍 Kirim lokasi kamu\n📎 → Location → Send current location");
  });

  bot.on("location", async (msg) => {
    const chatId = msg.chat.id;
    const lat = msg.location.latitude;
    const lon = msg.location.longitude;
    const users = loadDB();

    try {
      const geo = await axios.get("https://nominatim.openstreetmap.org/reverse", {
        params: { lat, lon, format: "json" },
        headers: { "User-Agent": "ramadhan-bot" }
      });

      const city = geo.data.address.city || geo.data.address.town || geo.data.address.village || "Lokasi kamu";

      users[chatId] = { lat, lon, city, reminder: true, lastSent: {} };
      saveDB(users);

      bot.sendMessage(chatId, `✅ Lokasi diset: *${city}*`, { parse_mode: "Markdown" });
    } catch {
      bot.sendMessage(chatId, "❌ Gagal membaca lokasi.");
    }
  });
};