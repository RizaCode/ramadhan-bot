// src/utils/hijri.js
const isRamadhan = () => {
  try {
    // Mencoba mengambil bulan hijriah
    const month = new Intl.DateTimeFormat('id-ID-u-ca-islamic', { month: 'numeric' }).format(new Date());
    return month === '9'; 
  } catch (error) {
    // Jika terjadi error, kemungkinan besar karena lingkungan tidak mendukung kalender Hijriah
    console.error("Warning: Server tidak mendukung kalender Hijriah.");
    return true; 
  }
};

module.exports = { isRamadhan };