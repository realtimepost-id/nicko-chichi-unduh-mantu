// Autentikasi admin: password (hash scrypt / env), sesi server-side di Redis, cookie HttpOnly + Secure + SameSite=Strict.
const crypto = require('crypto');
const db = require('./redis');
const NAME = 'inv_admin', TTL = 60 * 60 * 12;
const sha = s => crypto.createHash('sha256').update(String(s)).digest();
const eq = (a, b) => crypto.timingSafeEqual(a, b);

exports.configured = () => !!(process.env.ADMIN_PASSWORD_HASH || process.env.ADMIN_PASSWORD) && (process.env.SESSION_SECRET || '').length >= 16;
exports.hash = pw => { const salt = crypto.randomBytes(16); const h = crypto.scryptSync(pw, salt, 64, { N: 16384 }); return `scrypt$${salt.toString('base64')}$${h.toString('base64')}`; };
exports.verify = pw => {
  pw = String(pw || '').slice(0, 200);
  const H = process.env.ADMIN_PASSWORD_HASH;
  if (H) { const [t, s, h] = H.split('$'); if (t !== 'scrypt' || !s || !h) return false;
    try { return eq(crypto.scryptSync(pw, Buffer.from(s, 'base64'), 64, { N: 16384 }), Buffer.from(h, 'base64')); } catch { return false; } }
  if (process.env.ADMIN_PASSWORD) return eq(sha(pw), sha(process.env.ADMIN_PASSWORD));
  return false;
};
const sign = v => crypto.createHmac('sha256', process.env.SESSION_SECRET).update(v).digest('base64url');
const secure = req => process.env.VERCEL || (req.headers['x-forwarded-proto'] || '').includes('https');
const cookie = (req, val, age) => `${NAME}=${val}; Path=/api; HttpOnly; SameSite=Strict; Max-Age=${age}${secure(req) ? '; Secure' : ''}`;
const readCookie = req => { const m = (req.headers.cookie || '').match(new RegExp('(?:^|; )' + NAME + '=([^;]+)')); return m ? m[1] : ''; };

exports.create = async (req, res) => {
  const sid = crypto.randomBytes(24).toString('base64url');
  await db.set('sess:' + sid, { at: Date.now() }, TTL);
  res.setHeader('Set-Cookie', cookie(req, sid + '.' + sign(sid), TTL));
};
exports.check = async req => {
  if (!exports.configured()) return false;
  const [sid, sig] = readCookie(req).split('.'); if (!sid || !sig) return false;
  const want = Buffer.from(sign(sid)), got = Buffer.from(sig);
  if (want.length !== got.length || !eq(want, got)) return false;
  return !!(await db.get('sess:' + sid));
};
exports.destroy = async (req, res) => {
  const [sid] = readCookie(req).split('.'); if (sid) await db.del('sess:' + sid).catch(() => {});
  res.setHeader('Set-Cookie', cookie(req, '', 0));
};
