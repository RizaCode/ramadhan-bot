// src/commands/quran.js
const axios = require("axios");

module.exports = (bot) => {
  // Menangkap perintah dengan argumen angka (contoh: /quran 1)
  bot.onText(/\/quran (\d+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const nomorSurah = match[1];

    if (nomorSurah < 1 || nomorSurah > 114) {
      return bot.sendMessage(chatId, "⚠️ Nomor surah tidak valid. Masukkan angka 1 - 114.");
    }

    try {
      const res = await axios.get(`https://equran.id/api/v2/surat/${nomorSurah}`);
      const data = res.data.data;

      // Ambil maksimal 3 ayat pertama untuk preview
      let previewAyat = "";
      const batasAyat = data.ayat.length > 3 ? 3 : data.ayat.length;
      for (let i = 0; i < batasAyat; i++) {
        previewAyat += `${data.ayat[i].teksArab}\n_${data.ayat[i].teksLatin}_\nArtinya: "${data.ayat[i].teksIndonesia}"\n\n`;
      }

      const pesan = `📖 *Surah ${data.namaLatin} (${data.nama})*\n` +
                    `Arti: ${data.arti}\n` +
                    `Jumlah Ayat: ${data.jumlahAyat} | Turun di: ${data.tempatTurun}\n\n` +
                    `*Preview Ayat 1-${batasAyat}:*\n\n${previewAyat}` +
                    `🎧 [Dengarkan Murottal](${data.audioFull['05']})`;

      bot.sendMessage(chatId, pesan, { parse_mode: "Markdown", disable_web_page_preview: true });
    } catch (error) {
      console.error(error);
      bot.sendMessage(chatId, "❌ Gagal mengambil data Surah. Pastikan nomor surah benar atau API sedang gangguan.");
    }
  });

  // Fallback jika user hanya mengetik /quran tanpa menyertakan angka
  bot.onText(/^\/quran$/, (msg) => {
     bot.sendMessage(
       msg.chat.id, 
       "📖 *Cara Penggunaan Fitur Al-Qur'an:*\n\nKetik `/quran <nomor_surah>`\nContoh: `/quran 1` untuk Surah Al-Fatihah, `/quran 36` untuk Yasin.", 
       { parse_mode: "Markdown" }
     );
  });
};