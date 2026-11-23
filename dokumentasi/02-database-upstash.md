# 02 — Membuat database Upstash BARU (khusus proyek ini)

> **Jangan memakai database proyek lain** (termasuk database undangan lama). Proyek `NICKO-CHICHI-UNDUH-MANTU` dan `CHICHI-NICKO-WEDDING-DAY` masing-masing butuh database Upstash sendiri agar data tidak tercampur.

1. Masuk https://console.upstash.com (login/daftar, paket **Free** cukup).
2. Klik **Create Database** (tab Redis).
3. Isi: **Name** = `nicko-chichi-unduh-mantu` · **Type** = Regional · **Region** = *Asia Pacific (Singapore)* (terdekat dengan Trenggalek) · TLS aktif.
4. Klik **Create**.
5. Di halaman database, buka bagian/tab **REST API**. Salin:
   - `UPSTASH_REDIS_REST_URL` → alamat `https://xxxx.upstash.io`
   - `UPSTASH_REDIS_REST_TOKEN` → token **read-write** (bukan *Read-Only Token*).
6. Tempel keduanya ke `.env` (lokal) dan Environment Variables Vercel (lihat `03` dan `04`).

> Token = kunci akses penuh database. Jangan taruh di kode, jangan di-commit, jangan dikirim lewat chat publik. Semua akses database hanya terjadi di folder `api/` (server).

## Struktur data
Semua kunci diawali `inv:nicko-chichi-unduh-mantu:` sehingga pun bila tak sengaja berbagi database, data tetap terpisah. Lihat `database/schema.md`.
