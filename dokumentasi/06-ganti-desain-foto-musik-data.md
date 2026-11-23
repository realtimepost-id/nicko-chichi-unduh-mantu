# 06 — Mengganti desain final, foto, musik, dan data

## Desain final
Desain yang dipublikasikan: **Dark Luxury Editorial (Theme No. 2)** (`finalDesign: 'dark-luxury-editorial'` di `config/invitation.js`). Pilihan client — jangan diganti. Desain lain tetap ada di `src/designs/` hanya sebagai arsip/referensi dan **tidak ikut ter-deploy**: `npm run build` hanya menulis 1 desain ke `dist/`. Env `FINAL_DESIGN` sudah dihapus agar desain tidak bisa terganti tanpa sengaja.

## Mengganti foto
Letakkan di `public/assets/img/` dengan nama yang sama:
| File | Ukuran | Dipakai untuk |
|---|---|---|
| `p1.jpg` … `p5.jpg` | 1100×1650 (2:3 potret) | cover, hero, galeri, lightbox |
| `p1-s.jpg` … `p5-s.jpg` | 560×840 | thumbnail galeri |
| `bride.webp`, `groom.webp` | 640×960, **latar transparan** | profil mempelai |
| `og.jpg` | 1200×630 | pratinjau WhatsApp/sosmed |
Ubah teks alt dan titik fokus crop (`pos`, mis. `'50% 34%'` = posisi wajah) di `photos` pada `config/invitation.js`.
Kompres foto baru (≈150–250 KB per `pN.jpg`) agar cepat dibuka di HP.

## Mengganti musik
Ganti `public/assets/audio/music.mp3` (MP3, disarankan < 5 MB). Musik saat ini adalah **klip 30 detik** yang diambil dari video yang Anda kirim dan diputar berulang (loop) — lihat catatan hak cipta di `08-…`.

## Mengganti data undangan
Semua teks, tanggal (`start`/`end` format `+07:00`), alamat, rekening, cerita, nama orang tua ada di `config/invitation.js`. Ubah `slug` hanya jika memakai database baru (slug = prefix kunci Redis).
