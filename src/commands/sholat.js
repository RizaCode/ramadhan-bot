const axios = require("axios");
const { loadDB } = require("../utils/db");

module.exports = (bot) => {
  bot.onText(/\/sholat/, async (msg) => {
    const users = loadDB();
    const user = users[msg.chat.id];
    
    if (!user) return bot.sendMessage(msg.chat.id, "📍 Set lokasi dulu dengan /setkota");

    try {
      const res = await axios.get("https://api.aladhan.com/v1/timings", {
        params: { latitude: user.lat, longitude: user.lon, method: 20 }
      });
      const t = res.data.data.timings;

      bot.sendMessage(
        msg.chat.id,
        `🕌 *Jadwal Sholat*\n📍 ${user.city}\n\nSubuh: ${t.Fajr}\nDzuhur: ${t.Dhuhr}\nAshar: ${t.Asr}\nMaghrib: ${t.Maghrib}\nIsya: ${t.Isha}`,
        { parse_mode: "Markdown" }
      );
    } catch (error) {
      bot.sendMessage(msg.chat.id, "❌ Gagal mengambil jadwal sholat.");
    }
  });
};