const crypto = require('crypto');
exports.send = (res, code, obj, headers = {}) => {
  res.statusCode = code; res.setHeader('Cache-Control', 'no-store'); res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  for (const k in headers) res.setHeader(k, headers[k]);
  res.end(JSON.stringify(obj));
};
exports.body = async req => {
  let b = req.body;
  if (b === undefined) { let raw = ''; for await (const c of req) { raw += c; if (raw.length > 20000) break; } b = raw; }
  if (typeof b === 'string') { try { b = JSON.parse(b || '{}'); } catch { b = {}; } }
  return b && typeof b === 'object' ? b : {};
};
// Di Vercel, header x-vercel-forwarded-for / x-real-ip diisi platform (tidak bisa dipalsukan klien). x-forwarded-for hanya cadangan untuk lokal.
exports.ip = req => (req.headers['x-vercel-forwarded-for'] || req.headers['x-real-ip'] || (req.headers['x-forwarded-for'] || '').split(',')[0] || req.socket?.remoteAddress || '0').toString().trim().slice(0, 64);
exports.clean = (v, n) => String(v ?? '').normalize('NFC').replace(/[\u0000-\u001f\u007f<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, n);
exports.id = () => crypto.randomBytes(8).toString('hex');
const AL = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
exports.code = () => Array.from(crypto.randomBytes(10), b => AL[b % 32]).join('');
exports.rate = async (db, key, limit, windowSec) => (await db.incr('rl:' + key, windowSec)) <= limit;
exports.sameOrigin = req => {
  const o = req.headers.origin; if (!o) return true;
  try { return new URL(o).host === req.headers.host; } catch { return false; }
};
exports.dbError = (res, e) => {
  if (e.code === 'DB_NOT_CONFIGURED') return exports.send(res, 503, { error: e.message });
  console.error('[api]', e.message); return exports.send(res, 500, { error: 'Terjadi kesalahan pada server. Coba lagi sebentar.' });
};
