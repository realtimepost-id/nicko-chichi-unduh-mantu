# 08 — Tindakan manual & hal yang perlu konfirmasi (NICKO & CHICHI — UNDUH MANTU)

## A. Yang HARUS Anda lakukan
1. Buat database Upstash **baru khusus project ini** (`02-…`), isi `UPSTASH_REDIS_REST_URL/TOKEN` di Vercel.
2. Buat `ADMIN_PASSWORD_HASH` dan `SESSION_SECRET` sendiri (`03-…`). Jangan memakai nilai yang sama dengan project lain.
3. Isi `SITE_URL` dengan domain final (wajib agar preview WhatsApp memakai gambar yang benar).
4. Setelah deploy, jalankan checklist di `09-…` dari HP asli.
5. Hapus data uji (RSVP/ucapan/tiket percobaan) sebelum undangan disebar.

## B. NEEDS CLIENT CONFIRMATION
| # | Item | Keadaan sekarang |
|---|---|---|
| 1 | **Jam selesai acara** | Tidak diberikan client. Dipakai asumsi: Unduh Mantu 10.00–14.00 WIB. Dipakai untuk file kalender dan status hitung mundur ("sedang berlangsung" → "telah berlangsung"). Teks di undangan tetap "selesai". Ubah `end` di `config/invitation.js` setelah ada jam pasti. |
| 2 | **Pin Google Maps** | Memakai pencarian alamat teks (tidak ada koordinat). Titik bisa kurang tepat. Kirimkan tautan pin Google Maps rumah, lalu ganti `mapQuery`. |
| 3 | **Teks bawaan** (salam, kalimat pembuka/penutup, ayat QS. Ar-Rum: 21, catatan hadiah/RSVP) | Ditambahkan oleh pembuat awal, bukan teks asli client. Minta persetujuan (`copy`, `quote`). |
| 4 | **Love Story** | Love Story project ini menulis *"18 Juli 2026"* untuk Lamaran, sedangkan project Wedding Day hanya menulis *"bulan Juli"*. Mohon konfirmasi apakah perbedaan ini disengaja. Teks tidak diubah. |
| 5 | **Musik** | Berasal dari klip video vendor lain; judul/artis tidak diketahui dan kemungkinan berhak cipta. Ganti `public/assets/audio/music.mp3` dengan lagu berlisensi bila perlu. |
| 6 | **Maksimal tamu per RSVP = 5** | Asumsi. Ubah `maxGuests`. |
| 7 | **Foto potret (cut-out)** | Latar dihapus otomatis; cek tepinya di HP, ganti `bride.webp`/`groom.webp` bila kurang rapi. |

## C. Asumsi teknis
- Satu RSVP = satu pasangan (nama + perangkat). Mengirim ulang dari perangkat yang sama dengan nama yang sama memperbarui data; orang lain dengan nama sama mendapat RSVP & tiket sendiri.
- Halaman `noindex` (privasi). Preview WhatsApp tetap berfungsi.
- Pemindaian QR memakai kamera bawaan HP (membuka tautan tiket); admin memvalidasi dengan menempel kode/tautan di tab **Validasi Tiket** atau menekan **Check-in** pada Daftar tiket. Tidak ada pemindai kamera di dalam admin.
- Tidak ada pengiriman WhatsApp/email otomatis; admin menekan tombol WhatsApp untuk membuka chat.
