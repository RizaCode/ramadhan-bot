require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

console.log("✅ Ramadhan Companion Bot aktif!");

// ================= DATA =================
const userLocations = {};

// Doa random
const doaHarian = [
  "🤲 Ya Allah, terimalah amal ibadah kami hari ini.",
  "🤲 Ya Allah, kuatkan iman dan istiqomahkan kami.",
  "🤲 Ya Allah, ampunilah dosa-dosa kami dan orang tua kami.",
  "🤲 Ya Allah, berkahi Ramadhan kami dengan kebaikan."
];

// Motivasi random
const motivasiRamadhan = [
  "🌙 Ramadhan bukan tentang sempurna, tapi istiqomah.",
  "✨ Sedikit tapi rutin lebih dicintai Allah.",
  "💖 Jangan lelah berbuat baik, Allah melihat.",
  "🕌 Jadikan Ramadhan titik balik hidupmu."
];

// ================= START =================
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    `🌙 *Ramadhan Companion Bot 🇮🇩*

Assalamu’alaikum 🤍  
Aku siap menemani ibadahmu selama Ramadhan.

📌 *Command:*
/doa - Doa harian random  
/motivasi - Motivasi Ramadhan  
/setkota - Set lokasi otomatis  
/sholat - Jadwal sholat hari ini

Semoga bermanfaat ✨`,
    { parse_mode: "Markdown" }
  );
});

// ================= SET KOTA =================
bot.onText(/\/setkota/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "📍 Silakan kirim lokasi kamu.\nTekan 📎 → Location → Send current location"
  );
});

// ================= TERIMA LOKASI =================
bot.on("location", async (msg) => {
  const chatId = msg.chat.id;
  const lat = msg.location.latitude;
  const lon = msg.location.longitude;

  try {
    // Reverse geocoding (nama lokasi)
    const geo = await axios.get(
      "https://nominatim.openstreetmap.org/reverse",
      {
        params: {
          lat,
          lon,
          format: "json"
        },
        headers: {
          "User-Agent": "ramadhan-bot"
        }
      }
    );

    const city =
      geo.data.address.city ||
      geo.data.address.town ||
      geo.data.address.village ||
      "Lokasi kamu";

    userLocations[chatId] = { lat, lon, city };

    bot.sendMessage(chatId, `✅ Kota berhasil diset otomatis!\n📍 *${city}*`, {
      parse_mode: "Markdown"
    });
  } catch (err) {
    bot.sendMessage(chatId, "❌ Gagal membaca lokasi.");
  }
});

// ================= SHOLAT =================
bot.onText(/\/sholat/, async (msg) => {
  const chatId = msg.chat.id;

  if (!userLocations[chatId]) {
    return bot.sendMessage(chatId, "📍 Silakan set lokasi dulu dengan /setkota");
  }

  const { lat, lon, city } = userLocations[chatId];

  try {
    const res = await axios.get("https://api.aladhan.com/v1/timings", {
      params: {
        latitude: lat,
        longitude: lon,
        method: 20 // Kemenag Indonesia
      }
    });

    const t = res.data.data.timings;

    const text = `
🕌 *Jadwal Sholat Hari Ini*
📍 *${city}*

Subuh   : ${t.Fajr}
Dzuhur  : ${t.Dhuhr}
Ashar   : ${t.Asr}
Maghrib : ${t.Maghrib}
Isya    : ${t.Isha}

🤍 Semoga ibadahmu lancar
`;

    bot.sendMessage(chatId, text, { parse_mode: "Markdown" });
  } catch (err) {
    console.error(err.message);
    bot.sendMessage(chatId, "❌ Gagal mengambil jadwal sholat.");
  }
});

// ================= DOA =================
bot.onText(/\/doa/, (msg) => {
  const random = doaHarian[Math.floor(Math.random() * doaHarian.length)];
  bot.sendMessage(msg.chat.id, random);
});

// ================= MOTIVASI =================
bot.onText(/\/motivasi/, (msg) => {
  const random =
    motivasiRamadhan[Math.floor(Math.random() * motivasiRamadhan.length)];
  bot.sendMessage(msg.chat.id, random);
});