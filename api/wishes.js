// GET /api/wishes — daftar ucapan publik | POST /api/wishes — kirim ucapan (buku tamu digital)
const db = require('./_lib/redis'), U = require('./_lib/util');
module.exports = async (req, res) => {
  try {
    if (req.method === 'GET') {
      const list = (await db.hgetall('wishes')).filter(w => !w.hidden).sort((a, b) => b.at.localeCompare(a.at)).slice(0, 200);
      return U.send(res, 200, { wishes: list.map(({ id, name, message, at }) => ({ id, name, message, at })) });
    }
    if (req.method !== 'POST') return U.send(res, 405, { error: 'Method not allowed' });
    if (!U.sameOrigin(req)) return U.send(res, 403, { error: 'Origin tidak diizinkan' });
    const b = await U.body(req);
    if (b.website) return U.send(res, 200, { ok: true });
    if (!(Number(b.t) >= 2500)) return U.send(res, 429, { error: 'Mohon tulis ucapan dengan tenang, lalu kirim kembali.' });
    if (!(await U.rate(db, 'wish:' + U.ip(req), 4, 600))) return U.send(res, 429, { error: 'Terlalu banyak ucapan dalam waktu singkat. Coba lagi nanti.' });
    const name = U.clean(b.name, 60), message = U.clean(b.message, 400);
    if (name.length < 2) return U.send(res, 400, { error: 'Nama minimal 2 karakter.' });
    if (message.length < 3) return U.send(res, 400, { error: 'Ucapan minimal 3 karakter.' });
    if ((message.match(/https?:\/\/|www\./gi) || []).length > 0) return U.send(res, 400, { error: 'Ucapan tidak boleh berisi tautan.' });
    const dup = (await db.hgetall('wishes')).some(w => w.name.toLowerCase() === name.toLowerCase() && w.message === message);
    if (dup) return U.send(res, 200, { ok: true, duplicate: true });
    const id = U.id(), w = { id, name, message, at: new Date().toISOString(), hidden: false };
    await db.hset('wishes', id, w);
    U.send(res, 200, { ok: true, wish: { id, name, message, at: w.at } });
  } catch (e) { U.dbError(res, e); }
};
