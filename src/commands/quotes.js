const { doaHarian, motivasiRamadhan } = require("../utils/data");

module.exports = (bot) => {
  bot.onText(/\/doa/, (msg) => {
    bot.sendMessage(msg.chat.id, doaHarian[Math.floor(Math.random() * doaHarian.length)]);
  });

  bot.onText(/\/motivasi/, (msg) => {
    bot.sendMessage(msg.chat.id, motivasiRamadhan[Math.floor(Math.random() * motivasiRamadhan.length)]);
  });
};