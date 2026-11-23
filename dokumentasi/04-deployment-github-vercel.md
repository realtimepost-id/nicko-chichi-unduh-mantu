# 04 — Deployment: ZIP → GitHub → Vercel (proyek NICKO & CHICHI — UNDUH MANTU)

Ikuti berurutan. Semua perintah dijalankan di Terminal Mac (atau terminal VS Code).

## STEP 1 — Extract ZIP
Klik dua kali `NICKO-CHICHI-UNDUH-MANTU.zip` di Finder → muncul folder `NICKO-CHICHI-UNDUH-MANTU`.

## STEP 2 — Buka di VS Code
VS Code → **File → Open Folder…** → pilih `NICKO-CHICHI-UNDUH-MANTU`.

## STEP 3 — npm install
```bash
cd ~/Downloads/NICKO-CHICHI-UNDUH-MANTU      # sesuaikan lokasi folder
npm install
```

## STEP 4 — Buat database Upstash baru
Ikuti `dokumentasi/02-database-upstash.md` (nama database: `nicko-chichi-unduh-mantu`). Salin URL & token.

## STEP 5 — Isi environment variables lokal
```bash
cp .env.example .env
npm run hash-password -- "GantiDenganPasswordKuat"   # salin baris ADMIN_PASSWORD_HASH=... ke .env
openssl rand -hex 32                                  # salin hasilnya ke SESSION_SECRET= di .env
```
Buka `.env` di VS Code dan isi `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `ADMIN_PASSWORD_HASH`, `SESSION_SECRET`.

## STEP 6 — Jalankan lokal
```bash
npm run dev
```
Buka http://localhost:3000/ (katalog desain lokal) dan http://localhost:3000/admin/.

## STEP 7 — Tes fitur
Buka desain final di katalog (`/d/dark-luxury-editorial/`), lalu coba: buka undangan, musik, galeri, salin rekening/alamat, Google Maps, tambah kalender, RSVP (tunggu ±3 detik setelah halaman dimuat sebelum kirim), ucapan, tiket QR. Lalu login admin dan cek datanya muncul. Dengan `.env` terisi, data masuk ke Upstash sungguhan (cek di console.upstash.com → Data Browser, kunci berawalan `inv:nicko-chichi-unduh-mantu:`).
Setelah selesai tes, **hapus data uji** lewat admin (atau Data Browser Upstash) supaya tidak ikut ke hari-H.

## STEP 8 — Pilih desain final lalu buat repository GitHub baru
Pastikan `config/invitation.js` berisi `finalDesign: 'dark-luxury-editorial'` (sudah diatur; jangan diubah). Lalu di github.com klik **New repository** → nama `nicko-chichi-unduh-mantu` → **Private** → *jangan* centang README/.gitignore → Create.

## STEP 9 — Push ke GitHub
```bash
cd ~/Downloads/NICKO-CHICHI-UNDUH-MANTU
git init
git add .
git commit -m "Undangan NICKO & CHICHI — UNDUH MANTU"
git branch -M main
git remote add origin https://github.com/USERNAME_ANDA/nicko-chichi-unduh-mantu.git
git push -u origin main
```
(`.env` dan `data/` otomatis di-ignore — tidak ikut ter-push.)

## STEP 10 — Import ke Vercel
vercel.com → **Add New… → Project** → pilih repo `nicko-chichi-unduh-mantu` → **Import**. Framework Preset: **Other**. Biarkan Build Command/Output Directory (sudah diatur `vercel.json`: `npm run build` / `dist`).

## STEP 11 — Isi Environment Variables di Vercel
Sebelum menekan Deploy, buka bagian **Environment Variables**, tambahkan: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `ADMIN_PASSWORD_HASH`, `SESSION_SECRET`, dan `SITE_URL` (isi setelah tahu domainnya; boleh diisi belakangan lalu Redeploy).

## STEP 12 — Deploy
Klik **Deploy**. Tunggu sampai *Congratulations*. Catat domain (mis. `https://nicko-chichi-unduh-mantu.vercel.app`). Jika belum mengisi `SITE_URL`, isi sekarang di Settings → Environment Variables, lalu **Deployments → ⋯ → Redeploy**.

## STEP 13 — Tes website production
Buka `https://DOMAIN/?to=Bapak%20Andi`. Ulangi tes fitur (STEP 7) di HP asli: buka cover, musik, RSVP, ucapan, salin rekening, Maps, kalender, tiket. Bagikan tautan ke WhatsApp dan pastikan pratinjau (judul + foto) muncul.

## STEP 14 — Tes admin dashboard & database
Buka `https://DOMAIN/admin` → login → pastikan RSVP/ucapan uji tadi muncul → coba ekspor CSV, validasi tiket, logout. Di Upstash Data Browser pastikan kunci `inv:nicko-chichi-unduh-mantu:*` terisi. Hapus data uji sebelum menyebarkan undangan.

### Mengubah sesuatu setelah live
Edit file → `git add . && git commit -m "ubah ..." && git push` → Vercel otomatis deploy ulang.

### Masalah umum
| Gejala | Penyebab / solusi |
|---|---|
| Form RSVP: "Database belum terhubung" | `UPSTASH_REDIS_REST_URL/TOKEN` belum diisi di Vercel → isi lalu Redeploy |
| Login admin: "…SESSION_SECRET belum diatur" | Isi `SESSION_SECRET` (≥16, disarankan 64 hex) |
| Login admin gagal terus | Salin `ADMIN_PASSWORD_HASH` utuh (diawali `scrypt$`), tanpa spasi/kutip tambahan |
| Preview WhatsApp tanpa gambar | Isi `SITE_URL`, Redeploy; WhatsApp menyimpan cache lama → tambahkan `?v=2` pada tautan saat membagikan |
| Musik tidak langsung berbunyi | Normal: browser hanya mengizinkan suara setelah tamu menekan "Buka Undangan" |
