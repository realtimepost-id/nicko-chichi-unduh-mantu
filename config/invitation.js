/* ============================================================
   DATA UNDANGAN — NICKO & CHICHI · UNDUH MANTU
   Ubah data di file ini saja. Desain tidak perlu disentuh.
   ============================================================ */
module.exports = {
  slug: 'nicko-chichi-unduh-mantu',           // prefix kunci Redis (berbeda dari proyek Wedding Day)
  projectLabel: 'Nicko & Chichi — Unduh Mantu',
  names: 'Nicko & Chichi',
  title: 'The Wedding of Nicko & Chichi',
  description: 'Undangan Unduh Mantu Nicko Dwi Yumile & Chichi Sevia Mardaleina · Kamis, 24 Desember 2026 · Gandusari, Trenggalek',
  siteUrl: '',                               // opsional, mis. https://nicko-chichi.vercel.app (atau isi env SITE_URL di Vercel)

  /* >>> DESAIN FINAL YANG DIPUBLIKASIKAN <<<
     Pilih satu: modern-royal | dark-luxury-editorial | minimalist-monochrome | earthy-romantic | contemporary-heritage
     Bisa juga ditimpa lewat Environment Variable FINAL_DESIGN. */
  finalDesign: 'dark-luxury-editorial',

  maxGuests: 5,
  order: ['groom', 'bride'],
  couple: {
    groom: { name: 'Nicko Dwi Yumile', nick: 'Nicko', role: 'Putra', parents: 'Bapak Supriyanto & Ibu Suyatmi' },
    bride: { name: 'Chichi Sevia Mardaleina', nick: 'Chichi', role: 'Putri', parents: 'Bapak Gatot Sumarno & Ibu Sunarti' },
  },

  events: [
    { id: 'unduh-mantu', title: 'Unduh Mantu', dateText: 'Kamis, 24 Desember 2026', timeText: '10.00 WIB – selesai', start: '2026-12-24T10:00:00+07:00', end: '2026-12-24T14:00:00+07:00',
      venue: 'Kediaman Mempelai Pria', address: 'RT. 13 RW. 05 Dusun Jatirejo Desa Gandusari Kec. Gandusari Kab. Trenggalek' },
  ],
  mapQuery: 'RT. 13 RW. 05 Dusun Jatirejo, Desa Gandusari, Kecamatan Gandusari, Kabupaten Trenggalek, Jawa Timur',

  story: [
    { label: '2025', text: 'Tahun 2025 menjadi awal perkenalan kami berdua berkat teman kami, tidak langsung memutuskan untuk saling mencintai,' },
    { label: 'April 2026', text: 'selang 1 tahun kemudian ditahun 2026 kurang lebih pada bulan April 2026 akhirnya memutuskan untuk saling mencintai satu sama lain,' },
    { label: '18 Juli 2026', text: 'berlanjut pada 18 Juli 2026 kami melangsungkan Lamaran.' },
    { label: 'Kini', text: 'Hingga saat ini, tibalah waktunya bagi kami untuk menyempurnakan ikatan suci atas nama Ibadah.' },
  ],

  gifts: [
    { bank: 'Bank BRI', number: '655901023757538', owner: 'Nicko Dwi Yumile' },
    { bank: 'Bank Mandiri', number: '1710016663406', owner: 'Nicko Dwi Yumile' },
  ],
  giftAddress: 'RT. 13 RW. 05 Dusun Jatirejo Desa Gandusari Kec. Gandusari Kab. Trenggalek',

  copy: {
    salam: "Assalamu'alaikum Warahmatullahi Wabarakatuh",
    intro: 'Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk hadir pada acara Unduh Mantu kami.',
    closing: 'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kedua mempelai.',
    wassalam: "Wassalamu'alaikum Warahmatullahi Wabarakatuh",
    families: ['Keluarga Bapak Supriyanto & Ibu Suyatmi', 'Keluarga Bapak Gatot Sumarno & Ibu Sunarti'],
    giftNote: 'Doa restu Anda adalah hadiah terindah bagi kami. Namun jika berkenan memberi tanda kasih, Anda dapat menggunakan informasi berikut.',
    rsvpNote: 'Mohon konfirmasi kehadiran Anda agar kami dapat menyiapkan penyambutan terbaik.',
  },
  quote: { ar: 'وَمِنْ اٰيٰتِهٖٓ اَنْ خَلَقَ لَكُمْ مِّنْ اَنْفُسِكُمْ اَزْوَاجًا لِّتَسْكُنُوْٓا اِلَيْهَا وَجَعَلَ بَيْنَكُمْ مَّوَدَّةً وَّرَحْمَةً ۗ اِنَّ فِيْ ذٰلِكَ لَاٰيٰتٍ لِّقَوْمٍ يَّتَفَكَّرُوْنَ',
    id: 'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.', src: 'QS. Ar-Rum: 21' },

  photos: [
    { alt: 'Nicko dan Chichi berdiri berdampingan', pos: '50% 34%' },
    { alt: 'Chichi duduk di samping Nicko dengan rangkaian bunga merah marun', pos: '50% 36%' },
    { alt: 'Nicko dan Chichi bergandengan tangan', pos: '50% 33%' },
    { alt: 'Nicko dan Chichi berjalan sambil saling menatap', pos: '50% 30%' },
    { alt: 'Nicko dan Chichi dalam cahaya sorot lembut', pos: '50% 36%' },
  ],
  waTemplate: "Assalamu'alaikum Wr. Wb.\n\nKepada Yth. {nama}\n\nDengan memohon rahmat Allah SWT, kami mengundang Anda ke acara Unduh Mantu Nicko & Chichi (Kamis, 24 Desember 2026). Buka undangan digital kami:\n{link}\n\nMerupakan kebahagiaan bagi kami apabila Anda berkenan hadir dan memberikan doa restu.\n\nWassalamu'alaikum Wr. Wb.",
};
