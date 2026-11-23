# 05 — Panduan admin (NICKO & CHICHI — UNDUH MANTU)

Alamat: `https://DOMAIN/admin` (lokal: `http://localhost:3000/admin/`). Login memakai password yang Anda hash/atur di environment. Sesi berlaku 12 jam dan disimpan di server; tombol **Keluar** langsung menghapusnya.

| Tab | Fungsi |
|---|---|
| **Ringkasan** | Total RSVP, hadir, tidak hadir, **estimasi total tamu** (jumlah tamu pada RSVP "Hadir"), jumlah ucapan, tiket, check-in |
| **RSVP** | Cari nama/pesan, filter status, hapus, **Ekspor CSV** |
| **Ucapan** | Cari/filter, **Sembunyikan** (hilang dari publik, data tetap ada) atau Hapus, Ekspor CSV |
| **Tamu & Tiket** | Tambah tamu (nama, WhatsApp, grup, jumlah) → otomatis dibuatkan tiket; **Salin tautan** pribadi (`?to=Nama&t=KODE`) atau kirim via **WhatsApp** dengan teks siap pakai (ubah template di `waTemplate`, `config/invitation.js`); ekspor tamu/tiket |
| **Validasi Tiket** | Masukkan kode 10 karakter atau tempel tautan tiket → status valid/sudah check-in → **Check-in sekarang**. **Daftar tiket** (cari, filter status, **Lihat QR**, **Check-in**) dan riwayat check-in + tombol batalkan. Check-in ganda ditolak dan waktu check-in pertama tidak berubah |

## Alur tiket QR
1. Tamu mengisi RSVP "Hadir" → server membuat kode tiket → tiket + QR tampil dan bisa disimpan sebagai PNG. Atau admin membuat tamu & mengirim tautan pribadi (`?t=KODE`) yang langsung menampilkan tiket tamu.
2. Di lokasi, pindai QR dengan kamera HP → terbuka URL `…/?t=KODE`; salin kodenya (atau lihat kode di bawah QR) ke tab **Validasi Tiket**.
3. QR hanya berisi URL + kode acak; tidak ada nama/rekening/data pribadi. Hanya admin (login) yang dapat melakukan check-in.

## Keamanan singkat
Password tidak ada di frontend · sesi cookie `HttpOnly; Secure; SameSite=Strict` · login dibatasi 6 percobaan/15 menit/IP · semua aksi tulis admin menolak origin asing dan butuh header anti-CSRF · RSVP/ucapan: honeypot, jeda minimal pengisian, rate limit, validasi & pembersihan input · ekspor CSV aman dari formula injection.
