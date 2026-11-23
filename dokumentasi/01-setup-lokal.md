# 01 — Setup lokal

## Prasyarat
- **Node.js 18 atau lebih baru** (diuji pada Node 22). Cek: `node -v`. Belum ada? Unduh LTS di https://nodejs.org lalu install.
- VS Code (opsional tapi disarankan).

## Langkah
1. Extract `NICKO-CHICHI-UNDUH-MANTU.zip` (klik dua kali di Finder).
2. Buka VS Code → **File → Open Folder…** → pilih folder `NICKO-CHICHI-UNDUH-MANTU`.
3. Buka terminal VS Code (**Terminal → New Terminal**) lalu:
   ```bash
   npm install
   cp .env.example .env
   npm run dev
   ```
4. Buka **http://localhost:3000/** → katalog internal semua desain (hanya untuk pengembangan lokal; **tidak ikut ter-deploy**).
5. Lihat desain final: `http://localhost:3000/d/dark-luxury-editorial/?to=Bapak%20Andi`

## Penyimpanan data saat lokal
Jika `UPSTASH_REDIS_REST_URL`/`TOKEN` **belum** diisi, data RSVP/ucapan disimpan di file `data/dev-db.json` (hanya untuk uji coba lokal, ikut di-ignore Git). Jika diisi, lokal memakai Upstash sungguhan.

## Perintah
| Perintah | Fungsi |
|---|---|
| `npm run dev` | Server lokal + katalog desain (auto-rebuild; hasil di `.dev-dist/`, terpisah dari `dist/`) |
| `npm run build` | Build produksi → `dist/` berisi **hanya 1 desain final** |
| `npm run build:preview` | Build katalog + semua desain (hanya untuk referensi, jangan di-deploy) |
| `npm test` | Uji backend otomatis (mode file + mode Upstash tiruan) |
| `npm run hash-password -- "PasswordKuat123"` | Membuat `ADMIN_PASSWORD_HASH` |
| `npm test` | Uji otomatis backend (memakai penyimpanan lokal, tidak menyentuh Upstash) |
