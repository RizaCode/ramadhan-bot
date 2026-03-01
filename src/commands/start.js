const { isRamadhan } = require("../utils/hijri");

module.exports = (bot) => {
  if(!isRamadhan()){
    return bot.sendMessag(
      msg.chat.id,
      `Mohon maaf, saat ini belum memasuki bulan Ramadhan. Bot akan aktif secara otomatis saat Ramadhan tiba. Sampai jumpa di Ramadhan Tahun Depan, Terima kasih atas pengertiannya 🤍`
    )
  }
  bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
  `🌙 Ramadhan Companion Bot 🇮🇩

🤍 Assalamu’alaikum 🤍  
Aku siap menemani ibadahmu selama Ramadhan.

📌 Command:
/doa - Doa harian random  
/motivasi - Motivasi Ramadhan  
/setkota - Set lokasi otomatis  
/sholat - Jadwal sholat hari ini
/reminderon - Nyalakan reminder sahur, imsak & buka
/reminderoff - Matikan reminder sahur, imsak & buka
/quran <masukkan-nomor-surah> - Bacaan Surah Al-Qur'an

⏰ Reminder: sahur, imsak & buka otomatis`,

{ parse_mode: "Markdown" }
  );
});
};