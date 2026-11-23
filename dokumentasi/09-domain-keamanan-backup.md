# 09 — Domain, troubleshooting, keamanan, checklist production, backup (NICKO & CHICHI — UNDUH MANTU)

## Custom domain
1. Vercel → project `nicko-chichi-unduh-mantu` → **Settings → Domains → Add** → masukkan domain (mis. `nicko-chichi.example.com`).
2. Atur DNS di penyedia domain sesuai instruksi Vercel (CNAME `cname.vercel-dns.com` untuk subdomain, atau A record untuk apex).
3. Tunggu status *Valid Configuration* (HTTPS otomatis).
4. Isi `SITE_URL=https://nicko-chichi.example.com` (tanpa `/` di akhir) di **Environment Variables** → **Redeploy**.
5. Domain project ini **tidak boleh** dipakai project `chichi-nicko-wedding-day`.

## Troubleshooting
| Gejala | Solusi |
|---|---|
| `/admin` tampil tanpa gaya / kosong | Pastikan memakai versi ini (path aset admin absolut); Redeploy |
| RSVP: "Database belum terhubung" | Isi `UPSTASH_REDIS_REST_URL/TOKEN` di Vercel → Redeploy |
| RSVP ditolak "isi formulir dengan tenang" | Normal: form harus terbuka ≥2,5 detik sebelum dikirim |
| "Terlalu banyak percobaan" | Rate-limit per IP (RSVP 8/10 menit, ucapan 4/10 menit, login 6/15 menit). Tunggu |
| Login admin gagal terus | Salin `ADMIN_PASSWORD_HASH` utuh (`scrypt$…`), tanpa spasi/kutip; atau tunggu 15 menit bila terkena rate-limit |
| Preview WhatsApp tanpa foto / lama | Isi `SITE_URL`, Redeploy; tambahkan `?v=2` pada tautan saat berbagi (WhatsApp menyimpan cache) |
| Foto/CSS lama tampil setelah diubah | CSS/JS otomatis berversi; foto & musik di-cache 7 hari — beri nama file baru atau tunggu |
| Musik tidak langsung bunyi | Normal: browser mewajibkan interaksi (tombol Buka Undangan) |
| Build gagal "finalDesign … tidak ditemukan" | `finalDesign` di config harus `dark-luxury-editorial` |

## Checklist keamanan
- [ ] `.env` tidak ada di GitHub (sudah di `.gitignore`); repository **Private**.
- [ ] Token Upstash hanya di Environment Variables Vercel (server-side), tidak pernah di kode.
- [ ] `ADMIN_PASSWORD_HASH` dipakai (bukan `ADMIN_PASSWORD` polos); password ≥12 karakter, unik.
- [ ] `SESSION_SECRET` acak 64 hex, **berbeda** dari project lain.
- [ ] Database Upstash khusus project ini (bukan milik project `chichi-nicko-wedding-day`).
- [ ] Cek header (DevTools → Network): `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options`.
- [ ] Cookie `inv_admin` berstatus HttpOnly + Secure + SameSite=Strict.
- [ ] `/api/admin?a=data` tanpa login → 401.
- [ ] QR tiket hanya berisi URL `…/?t=KODE` (tanpa data pribadi).

## Checklist tes production (di HP asli)
- [ ] Buka `https://DOMAIN/?to=Nama%20Tamu` → cover menampilkan nama; tombol Buka Undangan berfungsi.
- [ ] Musik berbunyi setelah tombol; tombol musik pause/play.
- [ ] Hitung mundur benar; tanggal/jam acara benar.
- [ ] Google Maps tertanam & tombol Buka Lokasi menunjuk titik yang benar.
- [ ] Simpan ke Google Calendar & .ics benar (WIB).
- [ ] Galeri + lightbox; semua foto tampil.
- [ ] Salin rekening → tempel & cocokkan nomor.
- [ ] RSVP Hadir → tiket QR muncul → simpan PNG → scan dengan kamera HP.
- [ ] Ucapan terkirim & tampil.
- [ ] Admin: login, data muncul, check-in tiket, check-in ulang ditolak ("sudah check-in"), ekspor CSV, logout.
- [ ] Bagikan tautan ke WhatsApp → judul, deskripsi, foto benar.
- [ ] Data uji dihapus.

## Backup & data
- **Rutin:** admin → tab RSVP/Ucapan/Tamu → **Ekspor CSV** (juga tiket). Lakukan H-7, H-1, dan setelah acara. Simpan di tempat aman (data pribadi).
- **Upstash:** console.upstash.com → database → **Backup** (atau Data Browser untuk melihat kunci `inv:nicko-chichi-unduh-mantu:*`).
- **Skema:** lihat `database/schema.md`. Perubahan v2: kunci RSVP kini `sha1(nama|perangkat)` (sebelumnya `sha1(nama)`). Data lama tetap terbaca; bila ada tamu yang sudah RSVP sebelum update lalu mengirim ulang, ia akan tercatat sebagai entri baru (hapus yang lama lewat admin).
- Jangan menjalankan perintah hapus massal di Upstash. Menghapus data lewat admin hanya per entri.
