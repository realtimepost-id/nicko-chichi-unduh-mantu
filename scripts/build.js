// Build: menghasilkan folder dist/ (statis). Mode "final" = 1 desain dipublikasikan; mode "preview" = katalog + semua desain.
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..'), R = (...p) => path.join(root, ...p);
const inv0 = require(R('config/invitation.js')), mk = require('../src/lib/partials.js'), { esc } = mk;
const PREVIEW = process.argv.includes('--preview') || process.env.PREVIEW === '1';
const FINAL = inv0.finalDesign;   // desain final HANYA ditentukan di config/invitation.js (tidak bisa ditimpa env agar tidak salah publish)
const OUT = process.env.DIST_DIR || 'dist';
const crypto = require('crypto'), ver = f => crypto.createHash('md5').update(fs.readFileSync(f)).digest('hex').slice(0, 8);
const cp = (s, d) => { fs.mkdirSync(path.dirname(d), { recursive: true }); fs.cpSync(s, d, { recursive: true }); };
const wr = (f, c) => { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, c); };

const designs = fs.readdirSync(R('src/designs')).filter(d => fs.existsSync(R('src/designs', d, 'design.js'))).map(d => ({ dir: d, ...require(R('src/designs', d, 'design.js')) }))
  .sort((a, b) => a.order - b.order);
if (!PREVIEW && !designs.find(d => d.slug === FINAL)) { console.error(`\n✖ finalDesign "${FINAL}" tidak ditemukan. Pilihan: ${designs.map(d => d.slug).join(', ')}\n`); process.exit(1); }

const origin = (process.env.SITE_URL || inv0.siteUrl || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? 'https://' + process.env.VERCEL_PROJECT_PRODUCTION_URL : '')).replace(/\/$/, '');
const [wd0, r0] = inv0.events[0].dateText.split(', ');
const inv = JSON.parse(JSON.stringify(inv0)); inv.origin = origin;
inv.photos = inv.photos.map((p, i) => ({ ...p, src: `/assets/img/p${i + 1}.jpg`, thumb: `/assets/img/p${i + 1}-s.jpg`, full: `/assets/img/p${i + 1}.jpg` }));
for (const k of ['bride', 'groom']) inv.couple[k].photo = `/assets/img/${k}.webp`;

const clientData = () => JSON.stringify({ slug: inv.slug, title: inv.title, names: inv.names, origin, maxGuests: inv.maxGuests, events: inv.events.map(({ id, title, start, end, venue, address, dateText, timeText }) => ({ id, title, start, end, venue, address, dateText, timeText })),
  photos: inv.photos.map(p => ({ full: p.full, alt: p.alt })) }).replace(/</g, '\\u003c');

const V = { core: ver(R('src/core/core.css')), app: ver(R('src/core/app.js')), qr: ver(R('src/core/qr.js')) };
function page(d, cssHref, designVer) {
  const P = mk(inv), abs = p => (origin ? origin + p : p);
  const body = d.render({ inv, P, esc, abs });
  const title = inv.projectLabel, desc = inv.description;
  return `<!doctype html>
<html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(title)}</title><meta name="description" content="${esc(desc)}"><meta name="theme-color" content="${d.themeColor}"><meta name="robots" content="noindex,nofollow">
<link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="/apple-touch-icon.png">
<meta property="og:type" content="website"><meta property="og:locale" content="id_ID"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:image" content="${abs('/assets/img/og.jpg')}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">${origin ? `<meta property="og:url" content="${origin}/">` : ''}
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:image" content="${abs('/assets/img/og.jpg')}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?${d.fonts}&display=swap">
<link rel="stylesheet" href="/assets/core.css?v=${V.core}"><link rel="stylesheet" href="${cssHref}?v=${designVer}">
<script>window.INV=${clientData()};</script></head>
<body class="d-${d.slug}">
<noscript><p style="padding:2rem;text-align:center">Aktifkan JavaScript untuk membuka undangan ini.</p></noscript>
<div id="progress" aria-hidden="true"></div>
${body}
<button type="button" id="musicBtn" aria-label="Putar atau jeda musik" aria-pressed="false"><span class="eq" aria-hidden="true"><i></i><i></i><i></i><i></i></span></button>
<audio id="bgm" src="/assets/audio/music.mp3" loop preload="none"></audio>
<div id="toast" role="status" aria-live="polite"></div>
<div id="lb" hidden role="dialog" aria-modal="true" aria-label="Galeri foto"><button class="lb-x" aria-label="Tutup">×</button><button class="lb-nav prev" aria-label="Foto sebelumnya">‹</button><div class="lb-stage"><img id="lbImg" alt="" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="></div><button class="lb-nav next" aria-label="Foto berikutnya">›</button><div id="lbCount" aria-live="polite"></div></div>
<script src="/assets/qr.js?v=${V.qr}" defer></script><script src="/assets/app.js?v=${V.app}" defer></script></body></html>`;
}

// ---- tulis dist ----
fs.rmSync(R(OUT), { recursive: true, force: true });
cp(R('public'), R(OUT)); cp(R('src/core/core.css'), R(OUT, 'assets/core.css')); cp(R('src/core/app.js'), R(OUT, 'assets/app.js')); cp(R('src/core/qr.js'), R(OUT, 'assets/qr.js'));
cp(R('src/admin'), R(OUT, 'admin'));
const AV = ['admin.css', 'admin.js'].map(f => ver(R('src/admin', f)));
wr(R(OUT, 'admin/index.html'), fs.readFileSync(R('src/admin/index.html'), 'utf8').replace('href="/admin/admin.css"', `href="/admin/admin.css?v=${AV[0]}"`).replace('src="/admin/admin.js"', `src="/admin/admin.js?v=${AV[1]}"`).replace('src="/admin/config.js"', `src="/admin/config.js?v=${Date.now().toString(36)}"`));
wr(R(OUT, 'admin/config.js'), `window.ADMIN_CFG=${JSON.stringify({ title: inv.projectLabel, names: inv.names, origin, events: inv.events.map(e => e.title), waTemplate: inv.waTemplate })};`);
wr(R(OUT, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
const sel = PREVIEW ? designs : [designs.find(d => d.slug === FINAL)];
for (const d of sel) {
  const css = fs.readFileSync(R('src/designs', d.dir, 'style.css'), 'utf8');
  if (PREVIEW) { const dv = ver(R('src/designs', d.dir, 'style.css')); wr(R(OUT, 'd', d.slug, 'design.css'), css); wr(R(OUT, 'd', d.slug, 'index.html'), page(d, `/d/${d.slug}/design.css`, dv)); }
  else { wr(R(OUT, 'design.css'), css); wr(R(OUT, 'index.html'), page(d, '/design.css', ver(R('src/designs', d.dir, 'style.css')))); }
}
const fd = designs.find(d => d.slug === FINAL) || designs[0];
wr(R(OUT, '404.html'), `<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Halaman tidak ditemukan</title><meta name="robots" content="noindex"></head><body style="margin:0;min-height:100vh;display:grid;place-items:center;background:${fd.themeColor};color:#fff;font-family:Georgia,serif;text-align:center;padding:2rem"><div><p style="letter-spacing:.3em;font-size:.8rem;opacity:.8">404</p><h1 style="font-weight:400;font-style:italic;font-size:2rem;margin:.4rem 0 1rem">Halaman tidak ditemukan</h1><p>Tautan undangan tidak valid atau telah berubah.</p><p><a href="/" style="color:#fff">Kembali ke undangan ${esc(inv.names)}</a></p></div></body></html>`);
if (PREVIEW) wr(R(OUT, 'index.html'), require('./catalog.js')(inv, designs));
console.log(PREVIEW ? `✔ Build PREVIEW: katalog + ${designs.length} desain → ${OUT}/` : `✔ Build FINAL: desain "${FINAL}" → ${OUT}/`);
