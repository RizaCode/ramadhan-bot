require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");

// Inisialisasi Bot
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
console.log("✅ Ramadhan Companion Bot aktif!");

// Daftarkan semua file perintah (Commands)
require("./src/commands/start")(bot);
require("./src/commands/location")(bot);
require("./src/commands/sholat")(bot);
require("./src/commands/quotes")(bot);
require("./src/commands/reminder")(bot);
require("./src/commands/quran")(bot);

// Jalankan Cron Job (Scheduler)
require("./src/cron/scheduler")(bot);

bot.on("polling_error", (error) => {
  // Menampilkan pesan error aslinya, bukan {}
  console.log("Polling Error:", error.message || error);
});