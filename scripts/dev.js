// Server lokal: build mode PREVIEW (katalog + semua desain) lalu layani .dev-dist/ (terpisah dari dist/ produksi) + /api. Pakai: npm run dev
const http = require('http'), fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const root = path.join(__dirname, '..'); process.chdir(root); const DIST = process.env.DIST_DIR || '.dev-dist'; process.env.DIST_DIR = DIST;
try { fs.readFileSync('.env', 'utf8').split('\n').forEach(l => { const m = l.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/); if (m && !l.trim().startsWith('#')) process.env[m[1]] ??= m[2].replace(/^["']|["']$/g, ''); }); } catch {}
let dummy = false; if (!process.env.ADMIN_PASSWORD && !process.env.ADMIN_PASSWORD_HASH) { process.env.ADMIN_PASSWORD = 'admin12345'; dummy = true; }
process.env.SESSION_SECRET ||= 'dev-secret-hanya-untuk-lokal-ganti-di-produksi';
const build = () => { const r = spawnSync(process.execPath, ['scripts/build.js', '--preview'], { stdio: 'inherit', env: process.env }); if (r.status) console.error('Build gagal'); };
build();
let t; try { for (const d of ['src', 'config', 'public']) fs.watch(d, { recursive: true }, () => { clearTimeout(t); t = setTimeout(build, 300); }); } catch {}
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.jpg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.mp3': 'audio/mpeg', '.txt': 'text/plain' };
const PORT = process.env.PORT || 3000;
http.createServer(async (req, res) => {
  const u = new URL(req.url, 'http://localhost'); let p = decodeURIComponent(u.pathname);
  if (p.startsWith('/api/')) {
    const f = path.join(root, 'api', path.basename(p) + '.js');
    if (path.basename(p).startsWith('_') || !fs.existsSync(f)) { res.statusCode = 404; return res.end('{}'); }
    let raw = ''; for await (const c of req) raw += c; try { req.body = raw ? JSON.parse(raw) : {}; } catch { req.body = {}; }
    req.query = Object.fromEntries(u.searchParams); delete require.cache[require.resolve(f)];
    return require(f)(req, res);
  }
  let file = path.join(root, DIST, p); if (!file.startsWith(path.join(root, DIST))) { res.statusCode = 403; return res.end(); }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  else if (!path.extname(file) && fs.existsSync(file + '.html')) file += '.html';
  fs.readFile(file, (e, d) => { if (e) { res.statusCode = 404; return res.end(fs.existsSync(DIST + '/404.html') ? fs.readFileSync(DIST + '/404.html') : 'Not found'); }
    res.setHeader('Content-Type', MIME[path.extname(file)] || 'application/octet-stream'); res.setHeader('Cache-Control', 'no-store');
    const m = /bytes=(\d+)-(\d*)/.exec(req.headers.range || '');
    if (m && path.extname(file) === '.mp3') { const s = +m[1], e2 = m[2] ? +m[2] : d.length - 1; res.statusCode = 206; res.setHeader('Content-Range', `bytes ${s}-${e2}/${d.length}`); res.setHeader('Accept-Ranges', 'bytes'); return res.end(d.subarray(s, e2 + 1)); }
    res.end(d); });
}).listen(PORT, () => console.log(`\n  Katalog desain : http://localhost:${PORT}/\n  Admin          : http://localhost:${PORT}/admin/${dummy ? '   (password lokal: admin12345)' : ''}\n  Tes tamu       : http://localhost:${PORT}/d/<desain>/?to=Bapak%20Andi\n`));
