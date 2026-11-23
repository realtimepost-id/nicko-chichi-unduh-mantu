// POST /api/rsvp — simpan konfirmasi kehadiran. Tamu yang hadir otomatis mendapat kode tiket.
const crypto = require('crypto');
const db = require('./_lib/redis'), U = require('./_lib/util'), cfg = require('../config/invitation.js');
module.exports = async (req, res) => {
  if (req.method !== 'POST') return U.send(res, 405, { error: 'Method not allowed' });
  if (!U.sameOrigin(req)) return U.send(res, 403, { error: 'Origin tidak diizinkan' });
  try {
    const b = await U.body(req);
    if (b.website) return U.send(res, 200, { ok: true });                       // honeypot
    if (!(Number(b.t) >= 2500)) return U.send(res, 429, { error: 'Mohon isi formulir dengan tenang, lalu kirim kembali.' }); // time trap
    if (!(await U.rate(db, 'rsvp:' + U.ip(req), 8, 600))) return U.send(res, 429, { error: 'Terlalu banyak percobaan. Coba lagi beberapa menit lagi.' });
    const name = U.clean(b.name, 60), status = b.status === 'Hadir' ? 'Hadir' : b.status === 'Tidak Hadir' ? 'Tidak Hadir' : '';
    if (name.length < 2) return U.send(res, 400, { error: 'Nama minimal 2 karakter.' });
    if (!status) return U.send(res, 400, { error: 'Pilih status kehadiran.' });
    const max = cfg.maxGuests || 5;
    const qty = status === 'Hadir' ? Math.min(max, Math.max(1, parseInt(b.qty) || 1)) : 0;
    const message = U.clean(b.message, 300);
    // 1 RSVP per (nama + perangkat). Perangkat dikenali lewat cid acak yang disimpan di browser tamu. Dengan begitu orang lain yang
    // kebetulan memakai nama sama (atau sengaja menirunya) TIDAK menimpa RSVP / mendapat kode tiket milik orang lain.
    const cid = /^[a-f0-9]{16,64}$/.test(String(b.cid || '')) ? String(b.cid) : 'ip:' + U.ip(req);
    const owner = crypto.createHash('sha256').update(cid).digest('hex').slice(0, 16);
    const key = crypto.createHash('sha1').update(name.toLowerCase() + '|' + owner).digest('hex').slice(0, 14);
    const old = await db.hget('rsvp', key);
    let code = old?.code || '';
    if (status === 'Hadir' && !code) code = U.code();
    const rec = { id: key, name, status, qty, message, code: status === 'Hadir' ? code : '', at: old?.at || new Date().toISOString(), updatedAt: new Date().toISOString() };
    await db.hset('rsvp', key, rec);
    if (rec.code) {
      const t = (await db.hget('tickets', rec.code)) || { code: rec.code, createdAt: rec.at, checkedIn: false };
      await db.hset('tickets', rec.code, { ...t, name, qty, source: 'rsvp', rsvpId: key });
    } else if (old?.code) await db.hdel('tickets', old.code);
    U.send(res, 200, { ok: true, ticket: rec.code ? { code: rec.code, name, qty } : null });
  } catch (e) { U.dbError(res, e); }
};
