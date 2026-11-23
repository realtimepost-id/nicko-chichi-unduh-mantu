# NICKO & CHICHI — UNDUH MANTU

Undangan pernikahan digital premium — **project mandiri**: kode, repository GitHub, project Vercel, database Upstash, admin, domain, dan environment variable terpisah dari project `chichi-nicko-wedding-day`.

**Acara:** Unduh Mantu (10.00 WIB), Kamis 24 Desember 2026, Kediaman Mempelai Pria (Dusun Jatirejo, Desa Gandusari, Kec. Gandusari, Trenggalek)

**Desain final:** Dark Luxury Editorial (Theme No. 2) — `src/designs/dark-luxury-editorial/`

## Isi project
- Fitur: cover + nama tamu (`?to=`), musik (hanya setelah tamu menekan tombol), hitung mundur WIB, profil mempelai, acara + Google Maps + kalender (Google Calendar & .ics), love story, galeri + lightbox, RSVP, buku tamu, tiket QR, hadiah (salin rekening & alamat).
- Admin (`/admin`): login, statistik, kelola RSVP/ucapan/tamu, daftar tiket + QR, check-in, ekspor CSV, logout.
- Backend: fungsi serverless Vercel (`api/`) + Upstash Redis via REST (tanpa dependensi npm). Prefix Redis: `inv:nicko-chichi-unduh-mantu:`.

## Mulai cepat
```bash
npm install
npm run dev     # http://localhost:3000  (admin: /admin/ , password lokal bawaan: admin12345)
npm test        # uji backend otomatis
npm run build   # hasil produksi → dist/ (hanya desain final)
```

## Dokumentasi (`dokumentasi/`)
| File | Isi |
|---|---|
| `01-setup-lokal.md` | Menjalankan di komputer |
| `02-database-upstash.md` | Membuat database Upstash + skema |
| `03-environment-variables.md` | Semua variabel lingkungan |
| `04-deployment-github-vercel.md` | Langkah 1–14: ZIP → GitHub → Vercel → tes production |
| `05-panduan-admin.md` | Memakai dashboard admin & tiket QR |
| `06-ganti-desain-foto-musik-data.md` | Mengubah data, foto, musik |
| `07-laporan-pengujian.md` | Hasil pengujian (PASS / FAIL / NOT TESTED / MANUAL) |
| `08-tindakan-manual-dan-catatan.md` | Yang harus Anda lakukan/konfirmasi |
| `09-domain-keamanan-backup.md` | Domain, troubleshooting, checklist keamanan & production, backup |
