# 03 — Environment variables

Salin `.env.example` → `.env` (lokal). Di Vercel: **Project → Settings → Environment Variables**.

| Variabel | Wajib | Keterangan |
|---|---|---|
| `UPSTASH_REDIS_REST_URL` | Ya (production) | Dari Upstash → database **nicko-chichi-unduh-mantu** → REST API |
| `UPSTASH_REDIS_REST_TOKEN` | Ya (production) | Token read-write dari tempat yang sama |
| `ADMIN_PASSWORD_HASH` | Ya* | Hash scrypt password admin. Buat: `npm run hash-password -- "PasswordKuat123"` lalu salin barisnya |
| `ADMIN_PASSWORD` | Alternatif* | Password polos di env (kurang disarankan; tidak pernah dikirim ke browser). Dipakai bila hash kosong |
| `SESSION_SECRET` | Ya | Acak ≥ 32 karakter untuk menandatangani sesi. Buat: `openssl rand -hex 32` |
| `SITE_URL` | Disarankan | mis. `https://nicko-chichi-unduh-mantu.vercel.app` — agar gambar preview WhatsApp memakai URL absolut |

\* salah satu dari `ADMIN_PASSWORD_HASH` atau `ADMIN_PASSWORD` harus ada. Jika `SESSION_SECRET` kosong/pendek, admin menolak login dengan pesan jelas.

Jangan memakai nilai yang sama persis dengan proyek `CHICHI-NICKO-WEDDING-DAY`: buat password/secret/database **berbeda** untuk tiap proyek.
