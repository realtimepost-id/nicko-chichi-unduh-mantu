# Skema Redis — NICKO & CHICHI — UNDUH MANTU

Prefix semua kunci: `inv:nicko-chichi-unduh-mantu:` (diambil dari `slug` di `config/invitation.js`). Nilai disimpan sebagai JSON.

| Kunci | Tipe | Isi | Dibuat oleh |
|---|---|---|---|
| `rsvp` | Hash (field = sha1(nama + '|' + id perangkat) 14 char) | `{id,name,status,qty,message,code,at,updatedAt}` — 1 RSVP per nama per perangkat (kirim ulang dari perangkat sama = perbarui) | `POST /api/rsvp` |
| `wishes` | Hash (field = id acak) | `{id,name,message,at,hidden}` — buku tamu | `POST /api/wishes` |
| `tickets` | Hash (field = kode 10 karakter) | `{code,name,qty,source(rsvp/tamu),checkedIn,checkedAt,createdAt}` | RSVP hadir / admin |
| `guests` | Hash (field = id acak) | `{id,name,phone,group,qty,code,sent,at}` — daftar tamu terundang (admin) | admin |
| `sess:<id>` | String + TTL 12 jam | sesi admin (revocable saat logout) | `admin?a=login` |
| `rl:<aksi>:<ip>` | String + TTL | penghitung rate limit | semua endpoint publik |

`invitation_settings` tidak dipakai: pengaturan undangan ada di `config/invitation.js` (dipilih saat build), bukan di database, agar tidak bisa diubah lewat request.

Kode tiket memakai 10 karakter acak (alfabet tanpa 0/O/1/I) dari `crypto.randomBytes`; QR hanya memuat URL `…/?t=KODE` — tidak ada data pribadi di dalam QR.
