const cron = require("node-cron");
const axios = require("axios");
const { loadDB, saveDB } = require("../utils/db");
const { isRamadhan } = require("../utils/hijri");

function getNowJakarta() {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
}

module.exports = (bot) => {
  cron.schedule("* * * * *", async () => {
    if (!isRamadhan()) return;
    const users = loadDB();
    const now = getNowJakarta();
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const today = now.toISOString().slice(0, 10);
    let dbChanged = false;

    for (const chatId in users) {
      const u = users[chatId];
      if (!u.reminder) continue;

      if (u.lastDate !== today) {
        u.lastSent = {};
        u.lastDate = today;
        dbChanged = true;
      }

      try {
        const res = await axios.get("https://api.aladhan.com/v1/timings", {
          params: { latitude: u.lat, longitude: u.lon, method: 20 }
        });
        const t = res.data.data.timings;

        const toMin = (timeStr) => {
          const [h, m] = timeStr.split(":").map(Number);
          return h * 60 + m;
        };

        const subuh = toMin(t.Fajr);
        const maghrib = toMin(t.Maghrib);

        if (Math.abs(nowMin - (subuh - 45)) <= 0 && !u.lastSent.sahur) {
          const pesanSahur = `🌙 *Waktu Sahur*\n\nJangan lupa membaca niat puasa:\n\nنَوَيْتُ صَوْمَ غَدٍ عَنْ أَدَاءِ فَرْضِ شَهْرِ رَمَضَانَ هَذِهِ السَّنَةِ لِلّٰهِ تَعَالَى\n\n*Nawaitu shauma ghadin 'an adaa'i fardhi syahri Ramadhaana haadzihis sanati lillaahi ta'aalaa.*\n\nArtinya:\n"Aku berniat puasa esok hari untuk menunaikan fardhu di bulan Ramadhan tahun ini, karena Allah Ta'ala."`;
          bot.sendMessage(chatId, pesanSahur, { parse_mode: "Markdown" });
          u.lastSent.sahur = true;
          dbChanged = true;
        }

        if (Math.abs(nowMin - (subuh - 10)) <= 0 && !u.lastSent.imsak) {
          bot.sendMessage(chatId, "🛑 *Imsak*\n10 menit lagi Subuh", { parse_mode: "Markdown" });
          u.lastSent.imsak = true;
          dbChanged = true;
        }

        if (Math.abs(nowMin - maghrib) <= 0 && !u.lastSent.buka) {
          const pesanBuka = `🍽️ *Waktunya Berbuka*\n\nSelamat berbuka puasa! Jangan lupa berdoa:\n\nذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ، وَثَبَتَ الأَجْرُ إِنْ شَاءَ اللهُ\n\n*Dzahabaz zhama'u wabtallatil 'uruuqu wa tsabatal ajru, insyaa Allah.*\n\nArtinya:\n"Telah hilang rasa haus, dan urat-urat telah basah serta pahala telah ditetapkan, insya Allah."`;
          bot.sendMessage(chatId, pesanBuka, { parse_mode: "Markdown" });
          u.lastSent.buka = true;
          dbChanged = true;
        }
        
      } catch (error) {
        console.error(`Gagal ambil cron API untuk ${chatId}`);
      }
    }

    if (dbChanged) saveDB(users);
  });
};