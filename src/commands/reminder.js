const { loadDB, saveDB } = require("../utils/db");

module.exports = (bot) => {
  bot.onText(/\/reminderon/, (msg) => {
    const users = loadDB();
    if (!users[msg.chat.id]) return bot.sendMessage(msg.chat.id, "📍 Set lokasi dulu dengan /setkota");
    
    users[msg.chat.id].reminder = true;
    saveDB(users);
    bot.sendMessage(msg.chat.id, "✅ Reminder diaktifkan");
  });

  bot.onText(/\/reminderoff/, (msg) => {
    const users = loadDB();
    if (!users[msg.chat.id]) return;
    
    users[msg.chat.id].reminder = false;
    saveDB(users);
    bot.sendMessage(msg.chat.id, "⛔ Reminder dimatikan");
  });
};