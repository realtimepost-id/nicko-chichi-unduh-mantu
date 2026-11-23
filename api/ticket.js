// GET /api/ticket?code=XXXX — data publik minimal untuk menampilkan tiket (hanya nama & jumlah tamu).
const db = require('./_lib/redis'), U = require('./_lib/util');
module.exports = async (req, res) => {
  if (req.method !== 'GET') return U.send(res, 405, { error: 'Method not allowed' });
  try {
    if (!(await U.rate(db, 'tk:' + U.ip(req), 40, 600))) return U.send(res, 429, { error: 'Terlalu banyak percobaan.' });
    const code = String(req.query?.code || new URL(req.url, 'http://x').searchParams.get('code') || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 12);
    if (code.length !== 10) return U.send(res, 404, { error: 'Tiket tidak ditemukan.' });
    const t = await db.hget('tickets', code);
    if (!t) return U.send(res, 404, { error: 'Tiket tidak ditemukan.' });
    U.send(res, 200, { ok: true, ticket: { code: t.code, name: t.name, qty: t.qty || 1 } });
  } catch (e) { U.dbError(res, e); }
};
