require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const cron = require("node-cron");
const fs = require("fs");

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
console.log("✅ Ramadhan Companion Bot aktif!");

// ================= DATABASE (JSON) =================
const DB_FILE = "./users.json";
let users = fs.existsSync(DB_FILE)
  ? JSON.parse(fs.readFileSync(DB_FILE))
  : {};

const saveDB = () => {
  fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2));
};

// ================= RANDOM DATA =================
const doaHarian = [
  "🤲 Ya Allah, terimalah amal ibadah kami.",
  "🤲 Ya Allah, kuatkan iman kami.",
  "🤲 Ya Allah, berkahi Ramadhan kami."
];

const motivasiRamadhan = [
  "🌙 Ramadhan adalah waktu memperbaiki diri.",
  "✨ Istiqomah lebih baik dari sempurna.",
  "🕌 Allah melihat usaha kecilmu."
];

// ================= START =================
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    `🌙 Ramadhan Companion Bot 🇮🇩

Assalamu’alaikum 🤍  
Aku siap menemani ibadahmu selama Ramadhan.

📌 Command:
/doa - Doa harian random  
/motivasi - Motivasi Ramadhan  
/setkota - Set lokasi otomatis  
/sholat - Jadwal sholat hari ini
/reminderon - Nyalakan reminder sahur, imsak & buka
/reminderoff - Matikan reminder sahur, imsak & buka 

⏰ Reminder: sahur, imsak & buka otomatis`,

{ parse_mode: "Markdown" }
  );
});

// ================= SET KOTA =================
bot.onText(/\/setkota/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "📍 Kirim lokasi kamu\n📎 → Location → Send current location"
  );
});

// ================= TERIMA LOKASI =================
bot.on("location", async (msg) => {
  const chatId = msg.chat.id;
  const lat = msg.location.latitude;
  const lon = msg.location.longitude;

  try {
    const geo = await axios.get("https://nominatim.openstreetmap.org/reverse", {
      params: { lat, lon, format: "json" },
      headers: { "User-Agent": "ramadhan-bot" }
    });

    const city =
      geo.data.address.city ||
      geo.data.address.town ||
      geo.data.address.village ||
      "Lokasi kamu";

    users[chatId] = {
      lat,
      lon,
      city,
      reminder: true,
      lastSent: {}
    };

    saveDB();

    bot.sendMessage(chatId, `✅ Lokasi diset: *${city}*`, {
      parse_mode: "Markdown"
    });
  } catch {
    bot.sendMessage(chatId, "❌ Gagal membaca lokasi.");
  }
});

// ================= SHOLAT =================
bot.onText(/\/sholat/, async (msg) => {
  const user = users[msg.chat.id];
  if (!user) return bot.sendMessage(msg.chat.id, "📍 Set lokasi dulu");

  const res = await axios.get("https://api.aladhan.com/v1/timings", {
    params: { latitude: user.lat, longitude: user.lon, method: 20 }
  });

  const t = res.data.data.timings;

  bot.sendMessage(
    msg.chat.id,
    `🕌 *Jadwal Sholat*
📍 ${user.city}

Subuh: ${t.Fajr}
Dzuhur: ${t.Dhuhr}
Ashar: ${t.Asr}
Maghrib: ${t.Maghrib}
Isya: ${t.Isha}`,
    { parse_mode: "Markdown" }
  );
});

// ================= DOA & MOTIVASI =================
bot.onText(/\/doa/, (msg) =>
  bot.sendMessage(
    msg.chat.id,
    doaHarian[Math.floor(Math.random() * doaHarian.length)]
  )
);

bot.onText(/\/motivasi/, (msg) =>
  bot.sendMessage(
    msg.chat.id,
    motivasiRamadhan[Math.floor(Math.random() * motivasiRamadhan.length)]
  )
);

// ================= REMINDER TOGGLE =================
bot.onText(/\/reminderon/, (msg) => {
  if (!users[msg.chat.id]) return;
  users[msg.chat.id].reminder = true;
  saveDB();
  bot.sendMessage(msg.chat.id, "✅ Reminder diaktifkan");
});

bot.onText(/\/reminderoff/, (msg) => {
  if (!users[msg.chat.id]) return;
  users[msg.chat.id].reminder = false;
  saveDB();
  bot.sendMessage(msg.chat.id, "⛔ Reminder dimatikan");
});

// ================= CRON =================
cron.schedule("* * * * *", async () => {
  const now = getNowJakarta();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const today = now.toISOString().slice(0, 10);

  for (const chatId in users) {
    const u = users[chatId];
    if (!u.reminder) continue;

    // reset harian
    if (u.lastDate !== today) {
      u.lastSent = {};
      u.lastDate = today;
    }

    const res = await axios.get("https://api.aladhan.com/v1/timings", {
      params: { latitude: u.lat, longitude: u.lon, method: 20 }
    });

    const t = res.data.data.timings;

    const toMin = (t) => {
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m;
    };

    const subuh = toMin(t.Fajr);
    const maghrib = toMin(t.Maghrib);

    if (Math.abs(nowMin - (subuh - 45)) <= 0 && !u.lastSent.sahur) {
      bot.sendMessage(chatId, "🌙 *Waktu Sahur*\nJangan lupa niat 🤍", { parse_mode: "Markdown" });
      u.lastSent.sahur = true;
    }

    if (Math.abs(nowMin - (subuh - 10)) <= 0 && !u.lastSent.imsak) {
      bot.sendMessage(chatId, "🛑 *Imsak*\n10 menit lagi Subuh", { parse_mode: "Markdown" });
      u.lastSent.imsak = true;
    }

    if (Math.abs(nowMin - maghrib) <= 0 && !u.lastSent.buka) {
      bot.sendMessage(chatId, "🍽️ *Waktunya Berbuka*\nAllahumma laka shumtu", { parse_mode: "Markdown" });
      u.lastSent.buka = true;
    }

    saveDB();
  }
});