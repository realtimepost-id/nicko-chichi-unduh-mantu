// Server tiruan Upstash Redis REST — HANYA untuk pengujian otomatis (npm test). Meniru protokol: POST / [CMD,...] dan POST /pipeline [[CMD,...],...].
const http = require('http');
module.exports = (token = 'test-token') => {
  const kv = new Map(), exp = new Map(); // key -> {t:'s'|'h', v}
  const alive = k => { const e = exp.get(k); if (e && e < Date.now()) { kv.delete(k); exp.delete(k); } return kv.has(k); };
  const run = ([c, k, ...a]) => {
    c = String(c).toUpperCase();
    if (c === 'HSET') { if (alive(k) && kv.get(k).t !== 'h') throw new Error('WRONGTYPE'); const h = alive(k) ? kv.get(k).v : {}; const isNew = !(a[0] in h); h[a[0]] = a[1]; kv.set(k, { t: 'h', v: h }); return isNew ? 1 : 0; }
    if (c === 'HGET') return alive(k) ? (kv.get(k).v[a[0]] ?? null) : null;
    if (c === 'HGETALL') return alive(k) ? Object.entries(kv.get(k).v).flat() : [];
    if (c === 'HDEL') { if (!alive(k)) return 0; const h = kv.get(k).v, had = a[0] in h; delete h[a[0]]; return had ? 1 : 0; }
    if (c === 'SET') { const nx = a.slice(2).map(String).map(x => x.toUpperCase()).includes('NX'); if (nx && alive(k)) return null; kv.set(k, { t: 's', v: String(a[0]) });
      const i = a.map(x => String(x).toUpperCase()).indexOf('EX'); if (i > 0) exp.set(k, Date.now() + Number(a[i + 1]) * 1000); else exp.delete(k); return 'OK'; }
    if (c === 'GET') return alive(k) ? kv.get(k).v : null;
    if (c === 'DEL') { const had = kv.delete(k); exp.delete(k); return had ? 1 : 0; }
    if (c === 'INCR') { const n = (alive(k) ? parseInt(kv.get(k).v) : 0) + 1; kv.set(k, { t: 's', v: String(n) }); return n; }
    if (c === 'EXPIRE') { if (!alive(k)) return 0; exp.set(k, Date.now() + Number(a[0]) * 1000); return 1; }
    if (c === 'TTL') return alive(k) ? (exp.has(k) ? Math.ceil((exp.get(k) - Date.now()) / 1000) : -1) : -2;
    throw new Error('ERR unknown command ' + c);
  };
  const srv = http.createServer((req, res) => { let raw = ''; req.on('data', d => raw += d); req.on('end', () => {
    const send = (code, o) => { res.statusCode = code; res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(o)); };
    if (req.headers.authorization !== 'Bearer ' + token) return send(401, { error: 'Unauthorized' });
    let body; try { body = JSON.parse(raw); } catch { return send(400, { error: 'bad json' }); }
    try {
      if (req.url === '/pipeline') return send(200, body.map(c => { try { return { result: run(c) }; } catch (e) { return { error: e.message }; } }));
      return send(200, { result: run(body) });
    } catch (e) { return send(400, { error: e.message }); } }); });
  return { srv, keys: () => [...kv.keys()].filter(alive), ttl: k => (exp.has(k) ? Math.ceil((exp.get(k) - Date.now()) / 1000) : null) };
};
