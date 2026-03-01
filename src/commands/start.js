module.exports = (bot) => {
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

  ⏰ Reminder: sahur, imsak & buka otomatis`,

{ parse_mode: "Markdown" }
  );
});
};