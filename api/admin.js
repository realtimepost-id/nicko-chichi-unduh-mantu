// Endpoint admin (semua dilindungi sesi server-side). ?a=login|logout|me|data|export|lookup|del|hide|guest|checkin
const db = require('./_lib/redis'), auth = require('./_lib/auth'), U = require('./_lib/util');
const csv = rows => '\ufeff' + rows.map(r => r.map(v => { v = String(v ?? ''); if (/^[=+\-@\t\r]/.test(v)) v = "'" + v; return '"' + v.replace(/"/g, '""') + '"'; }).join(',')).join('\r\n');
const sortNew = (a, b) => String(b.at || b.createdAt).localeCompare(String(a.at || a.createdAt));

module.exports = async (req, res) => {
  const q = new URL(req.url, 'http://x').searchParams, a = req.query?.a || q.get('a');
  try {
    if (!auth.configured()) return U.send(res, 500, { error: 'ADMIN_PASSWORD (atau ADMIN_PASSWORD_HASH) dan SESSION_SECRET (min. 16 karakter) belum diatur di environment.' });
    if (req.method === 'POST' && !U.sameOrigin(req)) return U.send(res, 403, { error: 'Origin tidak diizinkan' });
    if (req.method === 'POST' && req.headers['x-requested-with'] !== 'fetch') return U.send(res, 403, { error: 'Header tidak valid' });

    if (a === 'login' && req.method === 'POST') {
      if (!(await U.rate(db, 'login:' + U.ip(req), 6, 900))) return U.send(res, 429, { error: 'Terlalu banyak percobaan login. Coba lagi 15 menit lagi.' });
      const b = await U.body(req); await new Promise(r => setTimeout(r, 400));
      if (!auth.verify(b.password)) return U.send(res, 401, { error: 'Password salah.' });
      await auth.create(req, res); return U.send(res, 200, { ok: true });
    }
    if (a === 'logout' && req.method === 'POST') { await auth.destroy(req, res); return U.send(res, 200, { ok: true }); }
    if (!(await auth.check(req))) return U.send(res, 401, { error: 'Belum login.' });
    if (a === 'me') return U.send(res, 200, { ok: true, db: db.mode() });

    if (a === 'data' && req.method === 'GET') {
      const [rsvp, wishes, guests, tickets] = await Promise.all(['rsvp', 'wishes', 'guests', 'tickets'].map(k => db.hgetall(k)));
      const hadir = rsvp.filter(r => r.status === 'Hadir');
      return U.send(res, 200, {
        db: db.mode(), rsvp: rsvp.sort(sortNew), wishes: wishes.sort(sortNew), guests: guests.sort(sortNew), tickets: tickets.sort(sortNew),
        stats: { rsvp: rsvp.length, hadir: hadir.length, tidak: rsvp.length - hadir.length, estimasi: hadir.reduce((s, r) => s + (r.qty || 1), 0),
          wishes: wishes.length, guests: guests.length, tickets: tickets.length, checkedIn: tickets.filter(t => t.checkedIn).length },
      });
    }
    if (a === 'export' && req.method === 'GET') {
      const type = req.query?.type || q.get('type'); let rows;
      if (type === 'rsvp') rows = [['Nama', 'Status', 'Jumlah Tamu', 'Pesan', 'Kode Tiket', 'Waktu']].concat((await db.hgetall('rsvp')).sort(sortNew).map(r => [r.name, r.status, r.qty, r.message, r.code, r.at]));
      else if (type === 'wishes') rows = [['Nama', 'Ucapan', 'Tersembunyi', 'Waktu']].concat((await db.hgetall('wishes')).sort(sortNew).map(w => [w.name, w.message, w.hidden ? 'ya' : 'tidak', w.at]));
      else if (type === 'guests') rows = [['Nama', 'Telepon', 'Grup', 'Jumlah', 'Kode Tiket', 'Sudah Dikirim']].concat((await db.hgetall('guests')).sort(sortNew).map(g => [g.name, g.phone, g.group, g.qty, g.code, g.sent ? 'ya' : 'belum']));
      else if (type === 'tickets') rows = [['Kode', 'Nama', 'Jumlah', 'Sumber', 'Check-in', 'Waktu Check-in']].concat((await db.hgetall('tickets')).sort(sortNew).map(t => [t.code, t.name, t.qty, t.source, t.checkedIn ? 'ya' : 'belum', t.checkedAt || '']));
      else return U.send(res, 400, { error: 'Tipe ekspor tidak dikenal.' });
      res.statusCode = 200; res.setHeader('Content-Type', 'text/csv; charset=utf-8'); res.setHeader('Content-Disposition', `attachment; filename="${type}-${new Date().toISOString().slice(0, 10)}.csv"`); res.setHeader('Cache-Control', 'no-store');
      return res.end(csv(rows));
    }
    if (a === 'lookup' && req.method === 'GET') {
      const code = String(req.query?.code || q.get('code') || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(-10);
      const t = code.length === 10 && await db.hget('tickets', code);
      return t ? U.send(res, 200, { ok: true, ticket: t }) : U.send(res, 404, { error: 'Tiket tidak ditemukan.' });
    }
    if (req.method !== 'POST') return U.send(res, 405, { error: 'Method not allowed' });
    const b = await U.body(req);

    if (a === 'del') {
      const id = U.clean(b.id, 40);
      if (b.type === 'rsvp') { const r = await db.hget('rsvp', id); if (r?.code) await db.hdel('tickets', r.code); await db.hdel('rsvp', id); }
      else if (b.type === 'wish') await db.hdel('wishes', id);
      else if (b.type === 'guest') { const g = await db.hget('guests', id); if (g?.code) await db.hdel('tickets', g.code); await db.hdel('guests', id); }
      else return U.send(res, 400, { error: 'Tipe tidak dikenal.' });
      return U.send(res, 200, { ok: true });
    }
    if (a === 'hide') { const w = await db.hget('wishes', U.clean(b.id, 40)); if (!w) return U.send(res, 404, { error: 'Tidak ditemukan.' }); await db.hset('wishes', w.id, { ...w, hidden: !!b.hidden }); return U.send(res, 200, { ok: true }); }
    if (a === 'guest') {
      const name = U.clean(b.name, 60); if (name.length < 2) return U.send(res, 400, { error: 'Nama minimal 2 karakter.' });
      const id = U.id(), code = U.code(), qty = Math.min(20, Math.max(1, parseInt(b.qty) || 1));
      const g = { id, name, phone: String(b.phone || '').replace(/\D/g, '').slice(0, 16), group: U.clean(b.group, 30), qty, code, sent: false, at: new Date().toISOString() };
      await db.hset('guests', id, g); await db.hset('tickets', code, { code, name, qty, source: 'tamu', guestId: id, createdAt: g.at, checkedIn: false });
      return U.send(res, 200, { ok: true, guest: g });
    }
    if (a === 'sent') { const g = await db.hget('guests', U.clean(b.id, 40)); if (!g) return U.send(res, 404, { error: 'Tidak ditemukan.' }); await db.hset('guests', g.id, { ...g, sent: !!b.sent }); return U.send(res, 200, { ok: true }); }
    if (a === 'checkin') {
      const code = String(b.code || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(-10), t = code.length === 10 && await db.hget('tickets', code);
      if (!t) return U.send(res, 404, { error: 'Tiket tidak ditemukan.' });
      if (!b.undo && t.checkedIn) return U.send(res, 200, { ok: true, ticket: t, already: true });   // check-in ganda: data & waktu pertama TIDAK diubah
      const n = { ...t, checkedIn: !b.undo, checkedAt: b.undo ? '' : new Date().toISOString() };
      await db.hset('tickets', code, n); return U.send(res, 200, { ok: true, ticket: n, already: false });
    }
    U.send(res, 400, { error: 'Aksi tidak dikenal.' });
  } catch (e) { U.dbError(res, e); }
};
