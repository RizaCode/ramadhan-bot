// src/utils/hijri.js
const isRamadhan = () => {
  // Menggunakan API bawaan JavaScript untuk kalender Islam
  const month = new Intl.DateTimeFormat('id-ID-u-ca-islamic', { month: 'numeric' }).format(new Date());
  
  // Dalam kalender Hijriah, Ramadhan adalah bulan ke-9
  return month === '9'; 
};

module.exports = { isRamadhan };