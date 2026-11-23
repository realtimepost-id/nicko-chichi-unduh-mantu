// Uji otomatis backend. Dua mode:
//   (1) "file"    : penyimpanan lokal (emulator di api/_lib/redis.js)
//   (2) "upstash" : klien Upstash REST (termasuk /pipeline) melawan server tiruan scripts/fake-upstash.js
// TIDAK menyentuh Upstash asli dan tidak memerlukan internet. Jalankan: npm test
const { spawn } = require('child_process'), fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..'), cfg = require('../config/invitation.js');
let pass = 0, fail = 0;
const ok = (c, m) => { c ? pass++ : fail++; console.log((c ? '  ✔ ' : '  ✖ ') + m); };
const DB = path.join(root, 'data', 'dev-db.json');
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function suite(mode, PORT, fake) {
  console.log(`\n=== MODE: ${mode} ===`);
  const B = `http://localhost:${PORT}`;
  try { fs.rmSync(DB); } catch {}
  const env = { ...process.env, PORT, DIST_DIR: '.test-dist', ADMIN_PASSWORD: 'uji-coba-123', ADMIN_PASSWORD_HASH: '', SESSION_SECRET: 'x'.repeat(40), UPSTASH_REDIS_REST_URL: '', UPSTASH_REDIS_REST_TOKEN: '' };
  if (fake) { env.UPSTASH_REDIS_REST_URL = `http://localhost:${fake.port}`; env.UPSTASH_REDIS_REST_TOKEN = 'test-token'; }
  const srv = spawn(process.execPath, ['scripts/dev.js'], { cwd: root, env, stdio: 'ignore' });
  const post = (p, b, h = {}) => fetch(B + p, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'fetch', ...h }, body: JSON.stringify(b) });
  const cid1 = 'a'.repeat(32), cid2 = 'b'.repeat(32);
  for (let i = 0; i < 40; i++) { try { await fetch(B + '/api/wishes'); break; } catch { await sleep(250); } }
  try {
    console.log('RSVP');
    let r = await post('/api/rsvp', { name: 'Budi Santoso', status: 'Hadir', qty: 3, message: 'Selamat', cid: cid1, t: 5000 }), j = await r.json();
    ok(r.status === 200 && j.ticket?.code?.length === 10, 'RSVP hadir tersimpan + tiket dibuat'); const code = j.ticket.code;
    r = await post('/api/rsvp', { name: 'Budi Santoso', status: 'Hadir', qty: 2, cid: cid1, t: 5000 }); j = await r.json(); ok(j.ticket.code === code, 'RSVP ulang dari perangkat yang sama memperbarui data & kode tiket tetap');
    r = await post('/api/rsvp', { name: 'Budi Santoso', status: 'Tidak Hadir', cid: cid2, t: 5000 }); j = await r.json();
    ok(r.status === 200 && !j.ticket, 'Orang lain bernama sama TIDAK menimpa RSVP & tidak menerima kode tiket Budi');
    r = await fetch(B + '/api/ticket?code=' + code); j = await r.json(); ok(r.status === 200 && j.ticket.qty === 2, 'Tiket Budi tetap utuh setelah ada nama kembar');
    r = await post('/api/rsvp', { name: 'Siti', status: 'Tidak Hadir', cid: cid1, t: 5000 }); ok(r.status === 200 && !(await r.json()).ticket, 'RSVP tidak hadir tanpa tiket');
    r = await post('/api/rsvp', { name: 'A', status: 'Hadir', t: 5000 }); ok(r.status === 400, 'Validasi nama terlalu pendek ditolak');
    r = await post('/api/rsvp', { name: 'Tanpa Status', t: 5000 }); ok(r.status === 400, 'Status kehadiran wajib dipilih');
    r = await post('/api/rsvp', { name: 'Bot', status: 'Hadir', t: 100 }); ok(r.status === 429, 'Pengisian terlalu cepat (bot) ditolak');
    r = await post('/api/rsvp', { name: 'Bot2', status: 'Hadir', t: 5000, website: 'spam.com' }); ok(r.status === 200 && !(await r.json()).ticket, 'Honeypot terisi diabaikan tanpa menyimpan');
    r = await post('/api/rsvp', { name: 'Origin Jahat', status: 'Hadir', t: 5000 }, { Origin: 'https://evil.example' }); ok(r.status === 403, 'Origin berbeda ditolak (CSRF)');
    r = await post('/api/rsvp', { name: 'Banyak Tamu', status: 'Hadir', qty: 99, cid: cid1, t: 5000 }); j = await r.json(); ok(j.ticket.qty === (cfg.maxGuests || 5), 'Jumlah tamu dibatasi maxGuests');

    console.log('Ucapan'); r = await post('/api/wishes', { name: 'Ani', message: 'Barakallah, semoga sakinah mawaddah warahmah', t: 5000 }); ok(r.status === 200, 'Ucapan tersimpan');
    r = await post('/api/wishes', { name: 'Ani', message: 'Kunjungi http://spam.example', t: 5000 }); ok(r.status === 400, 'Ucapan berisi tautan ditolak');
    r = await post('/api/wishes', { name: 'Xss', message: '<img src=x onerror=alert(1)> halo', t: 5000 }); j = await r.json(); ok(r.status === 200 && !/[<>]/.test(j.wish.message), 'Tanda < > dibuang dari ucapan (anti-XSS)');
    j = await (await fetch(B + '/api/wishes')).json(); const w1 = j.wishes.find(w => w.name === 'Ani'); ok(j.wishes.length === 2 && !!w1, 'Daftar ucapan publik tampil'); const wid = w1.id;

    console.log('Tiket'); r = await fetch(B + '/api/ticket?code=' + code); j = await r.json(); ok(r.status === 200 && j.ticket.name === 'Budi Santoso' && !('rsvpId' in j.ticket), 'Tiket valid hanya membuka nama & jumlah');
    r = await fetch(B + '/api/ticket?code=ZZZZZZZZZZ'); ok(r.status === 404, 'Tiket palsu ditolak');

    console.log('Admin'); r = await fetch(B + '/api/admin?a=data'); ok(r.status === 401, 'Data admin tanpa login ditolak');
    for (const a of ['export&type=rsvp', 'lookup&code=' + code]) { r = await fetch(B + '/api/admin?a=' + a); ok(r.status === 401, `Endpoint admin "${a.split('&')[0]}" tanpa login ditolak`); }
    r = await post('/api/admin?a=del', { type: 'rsvp', id: 'x' }); ok(r.status === 401, 'Hapus tanpa login ditolak');
    r = await post('/api/admin?a=login', { password: 'salah' }); ok(r.status === 401, 'Password salah ditolak');
    r = await post('/api/admin?a=login', { password: 'uji-coba-123' }); const ck = r.headers.get('set-cookie'); ok(r.status === 200 && /HttpOnly/.test(ck) && /SameSite=Strict/.test(ck) && /Max-Age=\d+/.test(ck), 'Login berhasil, cookie HttpOnly + SameSite=Strict + Max-Age'); const H = { Cookie: ck.split(';')[0] };
    r = await fetch(B + '/api/admin?a=data', { headers: H }); j = await r.json(); ok(r.status === 200 && j.stats.hadir === 2 && j.stats.tidak === 2 && j.stats.wishes === 2, 'Statistik benar (hadir 2, tidak 2, ucapan 2)');
    ok(j.stats.estimasi === 2 + (cfg.maxGuests || 5), 'Estimasi total tamu benar');
    r = await fetch(B + '/api/admin?a=data', { headers: { Cookie: H.Cookie.slice(0, -3) + 'abc' } }); ok(r.status === 401, 'Cookie dipalsukan ditolak');
    r = await post('/api/admin?a=guest', { name: 'Pak Haji', phone: '08123456789', group: 'Keluarga', qty: 2 }, H); j = await r.json(); ok(r.status === 200 && j.guest.code.length === 10, 'Tambah tamu + tiket'); const gcode = j.guest.code, gid = j.guest.id;
    r = await fetch(B + `/api/admin?a=lookup&code=${gcode}`, { headers: H }); ok(r.status === 200, 'Lookup tiket oleh admin');
    r = await post('/api/admin?a=checkin', { code: gcode }, H); j = await r.json(); ok(j.ticket.checkedIn === true && j.already === false, 'Check-in berhasil'); const t1 = j.ticket.checkedAt;
    await sleep(1100); r = await post('/api/admin?a=checkin', { code: gcode }, H); j = await r.json(); ok(j.already === true && j.ticket.checkedAt === t1, 'Check-in ganda terdeteksi & waktu check-in pertama tidak berubah');
    r = await post('/api/admin?a=checkin', { code: 'ZZZZZZZZZZ' }, H); ok(r.status === 404, 'Check-in tiket palsu ditolak');
    r = await post('/api/admin?a=hide', { id: wid, hidden: true }, H); j = await (await fetch(B + '/api/wishes')).json(); ok(!j.wishes.find(w => w.id === wid), 'Ucapan disembunyikan hilang dari publik');
    r = await fetch(B + '/api/admin?a=export&type=rsvp', { headers: H }); const csv = await r.text(); ok(r.headers.get('content-type').includes('text/csv') && csv.includes('Budi Santoso'), 'Ekspor CSV RSVP');
    for (const t of ['wishes', 'guests', 'tickets']) { r = await fetch(B + '/api/admin?a=export&type=' + t, { headers: H }); ok(r.status === 200 && (await r.text()).length > 20, 'Ekspor CSV ' + t); }
    r = await post('/api/rsvp', { name: '=HYPERLINK("x")', status: 'Hadir', cid: cid2, t: 5000 }); r = await fetch(B + '/api/admin?a=export&type=rsvp', { headers: H }); ok((await r.text()).includes(`"'=HYPERLINK`), 'CSV aman dari formula injection');
    r = await post('/api/admin?a=del', { type: 'guest', id: gid }, H); ok(r.status === 200, 'Hapus tamu'); r = await fetch(B + `/api/admin?a=lookup&code=${gcode}`, { headers: H }); ok(r.status === 404, 'Tiket tamu ikut terhapus');
    r = await post('/api/admin?a=del', { type: 'wish', id: wid }, { ...H, 'X-Requested-With': 'x' }); ok(r.status === 403, 'Aksi admin tanpa header anti-CSRF ditolak');
    r = await post('/api/admin?a=del', { type: 'wish', id: wid }, { ...H, Origin: 'https://evil.example' }); ok(r.status === 403, 'Aksi admin dari origin lain ditolak');
    r = await post('/api/admin?a=del', { type: 'wish', id: wid }, H); ok(r.status === 200, 'Hapus ucapan');
    r = await post('/api/admin?a=logout', {}, H); r = await fetch(B + '/api/admin?a=data', { headers: H }); ok(r.status === 401, 'Logout menghapus sesi di server');
    for (let i = 0; i < 7; i++) r = await post('/api/admin?a=login', { password: 'salah' }); ok(r.status === 429, 'Rate limit login (brute-force) aktif');

    if (fake) {
      console.log('Upstash (server tiruan)');
      const keys = fake.keys(), P = `inv:${cfg.slug}:`;
      ok(keys.length > 0 && keys.every(k => k.startsWith(P)), `Semua ${keys.length} kunci Redis memakai prefix "${P}" (isolasi antar-project)`);
      const rl = keys.filter(k => k.startsWith(P + 'rl:')); ok(rl.length > 0 && rl.every(k => fake.ttl(k) > 0), 'Semua kunci rate-limit punya TTL (tidak menggantung)');
      ok(keys.every(k => !k.includes('uji-coba-123')), 'Password tidak tersimpan di Redis');
    }
  } catch (e) { fail++; console.log('  ✖ Error tak terduga:', e.stack || e.message); }
  srv.kill(); try { fs.rmSync(DB); } catch {} try { fs.rmSync(path.join(root, '.test-dist'), { recursive: true, force: true }); } catch {}
}

(async () => {
  await suite('file', 3299, null);
  const f = require('./fake-upstash.js')('test-token'); await new Promise(r => f.srv.listen(0, r)); f.port = f.srv.address().port;
  await suite('upstash', 3298, f); f.srv.close();
  console.log(`\nHasil: ${pass} lulus, ${fail} gagal`); process.exit(fail ? 1 : 0);
})();
