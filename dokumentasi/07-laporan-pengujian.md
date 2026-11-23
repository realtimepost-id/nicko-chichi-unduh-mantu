# 07 — Laporan Pengujian (NICKO & CHICHI — UNDUH MANTU)

Status: **PASS** = benar-benar dijalankan dan lulus · **MANUAL** = wajib Anda verifikasi setelah deploy · **NOT TESTED** = tidak bisa diuji dari lingkungan kerja saya.
Lingkungan uji: Linux, Node 22, Chromium (Playwright), tanpa internet dan tanpa kredensial Upstash/Vercel/GitHub.

## Build & kode
| Pengujian | Hasil |
|---|---|
| `npm install` | PASS (tanpa dependensi) |
| `npm run build` | PASS — `dist/` hanya berisi desain `dark-luxury-editorial` (tanpa katalog / desain lain / folder `d/`) |
| Build dengan `finalDesign` salah | PASS — gagal dengan pesan jelas |
| Judul & Open Graph | PASS — judul = `projectLabel`, tanpa duplikasi nama |
| Referensi aset `/admin` | PASS — memakai path absolut (di Vercel `/admin` tanpa slash akan 404 untuk CSS/JS jika relatif) |

## Backend — `npm test` : **91/91 PASS** (45 uji mode file + 46 uji mode Upstash tiruan)
Mode 1 penyimpanan file lokal; mode 2 klien Upstash REST (termasuk `/pipeline`) melawan server tiruan `scripts/fake-upstash.js`.
Cakupan: RSVP (hadir/tidak, tiket, update, nama kembar dari perangkat lain tidak menimpa, batas jumlah tamu, validasi, honeypot, time-trap, anti-CSRF origin), ucapan (link ditolak, `<>` dibuang, sembunyikan, hapus), tiket (valid/palsu), admin (semua endpoint 401 tanpa login, login salah/benar, cookie HttpOnly+SameSite+Max-Age, cookie palsu, tamu+tiket, lookup, check-in, **check-in ganda tidak mengubah waktu pertama**, CSV 4 jenis + anti formula-injection, hapus, header anti-CSRF, logout, rate-limit brute-force), isolasi prefix `inv:nicko-chichi-unduh-mantu:` pada semua kunci Redis, semua kunci rate-limit ber-TTL.

## Browser (Chromium) — 29/29 PASS
Cover, `?to=` aman dari HTML, musik tidak autoplay, tombol musik, countdown, status "sedang berlangsung" & "telah berlangsung" (jam dipalsukan), lightbox (buka/Esc/panah), salin rekening (isi clipboard dicek), link Maps, Google Calendar (ctz WIB), unduh .ics, RSVP → tiket + QR, simpan tiket PNG, ucapan (script tidak dieksekusi), tiket tetap setelah reload, admin: CSS `/admin` termuat, login salah/benar, statistik, daftar tiket, QR dialog, check-in, tambah tamu + link WhatsApp, logout.

## Responsif — PASS
8 lebar (360, 375, 390, 430, 768, 1024, 1280, 1440): 0 overflow horizontal, 0 gambar rusak, 0 error JavaScript (cover dan halaman penuh).

## Belum bisa diuji / wajib manual
| Item | Status |
|---|---|
| Koneksi ke Upstash asli (termasuk `/pipeline` untuk rate-limit) | **MANUAL** — jalur kode diuji dengan server tiruan, bukan Upstash asli |
| Deployment Vercel/GitHub, domain, HTTPS, header CSP/HSTS efektif | **MANUAL** |
| Pemutaran musik di iPhone/Android | **MANUAL** — Chromium headless tidak memutar audio |
| Google Fonts, Google Maps tertanam | **MANUAL** — sandbox tanpa internet (peta tampil kosong di screenshot uji) |
| Preview WhatsApp (judul, deskripsi, foto) | **MANUAL** — butuh domain live + `SITE_URL` |
| Safari iOS fisik, scan QR dengan kamera HP | **MANUAL** |
| Lighthouse / performa jaringan nyata | **NOT TESTED** |
