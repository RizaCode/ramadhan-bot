// src/commands/puasa.js
module.exports = (bot) => {
  bot.onText(/\/niat/, (msg) => {
    const pesan = `🌙 *Niat Puasa Ramadhan*\n\nنَوَيْتُ صَوْمَ غَدٍ عَنْ أَدَاءِ فَرْضِ شَهْرِ رَمَضَانَ هَذِهِ السَّنَةِ لِلّٰهِ تَعَالَى\n\n*Nawaitu shauma ghadin 'an adaa'i fardhi syahri Ramadhaana haadzihis sanati lillaahi ta'aalaa.*\n\nArtinya:\n"Aku berniat puasa esok hari untuk menunaikan fardhu di bulan Ramadhan tahun ini, karena Allah Ta'ala."`;
    
    bot.sendMessage(msg.chat.id, pesan, { parse_mode: "Markdown" });
  });

  bot.onText(/\/buka/, (msg) => {
    const pesan = `🍽️ *Doa Buka Puasa*\n\nاللّٰهُمَّ لَكَ صُمْتُ وَبِكَ آمَنْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ بِرَحْمَتِكَ يَا أَرْحَمَ الرَّاحِمِيْنَ\n\n*Allahumma laka shumtu wa bika aamantu wa 'ala rizqika afthartu. Birrahmatika yaa arhamar roohimiin.*\n\nArtinya:\n"Ya Allah, untuk-Mu aku berpuasa, dan kepada-Mu aku beriman, dan dengan rezeki-Mu aku berbuka. Dengan rahmat-Mu wahai yang Maha Pengasih dan Penyayang."`;
    
    bot.sendMessage(msg.chat.id, pesan, { parse_mode: "Markdown" });
  });
};