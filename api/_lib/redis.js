// Klien Upstash Redis (REST) + emulator file untuk pengembangan lokal.
// Semua akses database hanya terjadi di sisi server (folder api/). Token tidak pernah dikirim ke browser.
const fs = require('fs'), path = require('path');
const { slug } = require('../../config/invitation.js');
const URL_ = process.env.UPSTASH_REDIS_REST_URL, TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const PFX = `inv:${slug}:`;
const REMOTE = !!(URL_ && TOKEN);
const FILE = path.join(process.cwd(), 'data', 'dev-db.json');

exports.mode = () => (REMOTE ? 'upstash' : process.env.VERCEL ? 'none' : 'file');

async function cmd(args) {
  const r = await fetch(URL_, { method: 'POST', headers: { Authorization: 'Bearer ' + TOKEN, 'Content-Type': 'application/json' }, body: JSON.stringify(args) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || j.error) throw new Error('Upstash: ' + (j.error || r.status));
  return j.result;
}
async function pipe(cmds) {
  const r = await fetch(URL_.replace(/\/$/, '') + '/pipeline', { method: 'POST', headers: { Authorization: 'Bearer ' + TOKEN, 'Content-Type': 'application/json' }, body: JSON.stringify(cmds) });
  const j = await r.json().catch(() => null);
  if (!r.ok || !Array.isArray(j) || j.some(x => x.error)) throw new Error('Upstash: ' + ((Array.isArray(j) && j.find(x => x.error)?.error) || r.status));
  return j.map(x => x.result);
}
const load = () => { try { return JSON.parse(fs.readFileSync(FILE, 'utf8')); } catch { return { kv: {}, h: {}, exp: {} }; } };
const save = d => { fs.mkdirSync(path.dirname(FILE), { recursive: true }); fs.writeFileSync(FILE, JSON.stringify(d)); };
const sweep = d => { const n = Date.now(); for (const k in d.exp) if (d.exp[k] < n) { delete d.kv[k]; delete d.h[k]; delete d.exp[k]; } return d; };
function guard() { if (exports.mode() === 'none') { const e = new Error('Database belum terhubung. Isi UPSTASH_REDIS_REST_URL dan UPSTASH_REDIS_REST_TOKEN.'); e.code = 'DB_NOT_CONFIGURED'; throw e; } }
const J = v => JSON.stringify(v);

exports.hset = async (key, field, obj) => { guard(); key = PFX + key;
  if (REMOTE) return cmd(['HSET', key, field, J(obj)]);
  const d = sweep(load()); (d.h[key] ||= {})[field] = J(obj); save(d); };
exports.hget = async (key, field) => { guard(); key = PFX + key;
  if (REMOTE) { const v = await cmd(['HGET', key, field]); return v ? JSON.parse(v) : null; }
  const v = sweep(load()).h[key]?.[field]; return v ? JSON.parse(v) : null; };
exports.hgetall = async key => { guard(); key = PFX + key;
  if (REMOTE) { const a = await cmd(['HGETALL', key]) || [], out = []; for (let i = 1; i < a.length; i += 2) { try { out.push(JSON.parse(a[i])); } catch {} } return out; }
  return Object.values(sweep(load()).h[key] || {}).map(v => JSON.parse(v)); };
exports.hdel = async (key, field) => { guard(); key = PFX + key;
  if (REMOTE) return cmd(['HDEL', key, field]);
  const d = load(); if (d.h[key]) delete d.h[key][field]; save(d); };
exports.set = async (key, val, ex) => { guard(); key = PFX + key;
  if (REMOTE) return cmd(ex ? ['SET', key, J(val), 'EX', ex] : ['SET', key, J(val)]);
  const d = sweep(load()); d.kv[key] = J(val); if (ex) d.exp[key] = Date.now() + ex * 1000; save(d); };
exports.get = async key => { guard(); key = PFX + key;
  if (REMOTE) { const v = await cmd(['GET', key]); return v ? JSON.parse(v) : null; }
  const v = sweep(load()).kv[key]; return v ? JSON.parse(v) : null; };
exports.del = async key => { guard(); key = PFX + key;
  if (REMOTE) return cmd(['DEL', key]);
  const d = load(); delete d.kv[key]; delete d.h[key]; delete d.exp[key]; save(d); };
exports.incr = async (key, ttl) => { guard(); key = PFX + key;
  if (REMOTE) { // SET NX EX + INCR dalam 1 pipeline: kunci selalu punya TTL (tidak bisa "menggantung" tanpa kedaluwarsa)
    if (!ttl) return cmd(['INCR', key]);
    const r = await pipe([['SET', key, '0', 'EX', ttl, 'NX'], ['INCR', key]]); return r[1]; }
  const d = sweep(load()); const n = (parseInt(d.kv[key]) || 0) + 1; d.kv[key] = String(n); if (n === 1 && ttl) d.exp[key] = Date.now() + ttl * 1000; save(d); return n; };
