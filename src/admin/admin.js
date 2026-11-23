(() => {
  const C = window.ADMIN_CFG || {}, $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const h = (t, a = {}, ...k) => { const e = document.createElement(t); for (const x in a) { if (x === 'class') e.className = a[x]; else if (x.startsWith('on')) e.addEventListener(x.slice(2), a[x]); else if (a[x] !== false && a[x] != null) e.setAttribute(x, a[x]); } k.flat().forEach(c => e.append(c?.nodeType ? c : document.createTextNode(c ?? ''))); return e; };
  const toast = m => { const t = $('#toast'); t.textContent = m; t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), 2200); };
  const api = async (a, o = {}) => { const r = await fetch('/api/admin?a=' + a + (o.q || ''), { method: o.body ? 'POST' : 'GET', credentials: 'same-origin', headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'fetch' }, body: o.body ? JSON.stringify(o.body) : undefined });
    const j = await r.json().catch(() => ({})); if (r.status === 401 && a !== 'login') { showLogin(); throw new Error('Sesi berakhir'); } if (!r.ok) throw new Error(j.error || 'Gagal (' + r.status + ')'); return j; };
  const fmt = iso => iso ? new Date(iso).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' }) : '';
  let D = null;
  $('#ttl').textContent = C.title || 'Dashboard'; $('#sub').textContent = C.names || ''; $('#loginTitle').textContent = C.title || 'Dashboard Undangan'; document.title = 'Admin — ' + (C.title || '');
  const showLogin = () => { $('#app').hidden = true; $('#login').hidden = false; $('#pw').focus(); };
  $('#loginForm').addEventListener('submit', async e => { e.preventDefault(); const m = $('#loginMsg'); m.textContent = ''; try { await api('login', { body: { password: $('#pw').value } }); $('#pw').value = ''; await boot(); } catch (er) { m.textContent = er.message; } });
  $('#logout').onclick = async () => { await api('logout', { body: {} }).catch(() => {}); showLogin(); };
  $('#refresh').onclick = () => load().then(() => toast('Data dimuat ulang'));
  $$('.tabs button').forEach(b => b.onclick = () => { $$('.tabs button').forEach(x => x.classList.toggle('on', x === b)); $$('.tab').forEach(t => t.hidden = t.id !== 't-' + b.dataset.t); });
  const load = async () => { D = await api('data'); const m = $('#dbmode'); m.textContent = D.db === 'upstash' ? 'Upstash Redis' : 'Penyimpanan lokal (dev)'; m.classList.toggle('warn', D.db !== 'upstash'); draw(); };
  async function boot() { try { await api('me'); } catch { return showLogin(); } $('#login').hidden = true; $('#app').hidden = false; await load().catch(er => toast(er.message)); const m = location.hash.match(/cek=([A-Z0-9]{10})/i); if (m) { $$('.tabs button')[4].click(); $('#sc').value = m[1].toUpperCase(); check(); } }
  const del = (type, id, label) => async () => { if (!confirm('Hapus ' + label + '? Tindakan ini tidak bisa dibatalkan.')) return; try { await api('del', { body: { type, id } }); await load(); toast('Dihapus'); } catch (er) { toast(er.message); } };

  function draw() {
    const s = D.stats; $('#stats').replaceChildren(...[['Total RSVP', s.rsvp], ['Hadir', s.hadir], ['Tidak hadir', s.tidak], ['Estimasi total tamu', s.estimasi], ['Ucapan', s.wishes], ['Tiket dibuat', s.tickets], ['Sudah check-in', s.checkedIn], ['Tamu terdaftar', s.guests]].map(([l, v]) => h('div', { class: 'stat' }, h('b', {}, v), h('span', {}, l))));
    // RSVP
    const q = $('#rq').value.toLowerCase(), f = $('#rf').value, rs = D.rsvp.filter(r => (!f || r.status === f) && (r.name + ' ' + r.message).toLowerCase().includes(q));
    $('#rl').replaceChildren(h('div', { class: 'r head' }, h('span', {}, 'Nama'), h('span', {}, 'Status'), h('span', {}, 'Pesan'), h('span')), ...(rs.length ? rs.map(r => h('div', { class: 'r' }, h('p', {}, h('b', {}, r.name), h('small', {}, fmt(r.updatedAt || r.at))), h('p', {}, h('span', { class: 'tag' + (r.status === 'Hadir' ? '' : ' no') }, r.status + (r.status === 'Hadir' ? ' · ' + r.qty + ' org' : '')), r.code ? h('small', {}, 'Tiket ' + r.code) : ''), h('p', {}, r.message || '—'), h('div', { class: 'acts' }, h('button', { class: 'btn sm danger', onclick: del('rsvp', r.id, 'RSVP ' + r.name) }, 'Hapus')))) : [h('p', { class: 'note' }, 'Belum ada data RSVP.')]));
    // Ucapan
    const wq = $('#wq').value.toLowerCase(), wf = $('#wf').value, ws = D.wishes.filter(w => (!wf || (wf === 'h') === !!w.hidden) && (w.name + ' ' + w.message).toLowerCase().includes(wq));
    $('#wl').replaceChildren(...(ws.length ? ws.map(w => h('div', { class: 'r', style: 'grid-template-columns:1fr auto' }, h('p', {}, h('b', {}, w.name), ' ', w.hidden ? h('span', { class: 'tag mut' }, 'disembunyikan') : '', h('small', {}, fmt(w.at)), w.message),
      h('div', { class: 'acts' }, h('button', { class: 'btn sm ghost', onclick: async () => { await api('hide', { body: { id: w.id, hidden: !w.hidden } }); await load(); } }, w.hidden ? 'Tampilkan' : 'Sembunyikan'), h('button', { class: 'btn sm danger', onclick: del('wish', w.id, 'ucapan dari ' + w.name) }, 'Hapus')))) : [h('p', { class: 'note' }, 'Belum ada ucapan.')]));
    // Tamu
    const gq = $('#gs').value.toLowerCase(), gs = D.guests.filter(g => (g.name + ' ' + g.group).toLowerCase().includes(gq)), tk = Object.fromEntries(D.tickets.map(t => [t.code, t]));
    const link = g => location.origin + '/?to=' + encodeURIComponent(g.name) + '&t=' + g.code;
    const wa = g => { const t = (C.waTemplate || 'Assalamualaikum {nama}, kami mengundang Anda ke pernikahan kami. Buka undangan: {link}').replace('{nama}', g.name).replace('{link}', link(g)); return 'https://wa.me/' + g.phone + '?text=' + encodeURIComponent(t); };
    $('#gl').replaceChildren(...(gs.length ? gs.map(g => h('div', { class: 'r', style: 'grid-template-columns:1.3fr 1fr auto' }, h('p', {}, h('b', {}, g.name), h('small', {}, [g.group, g.qty + ' orang', g.phone && '+' + g.phone].filter(Boolean).join(' · '))), h('p', {}, h('span', { class: 'tag' + (tk[g.code]?.checkedIn ? '' : ' mut') }, tk[g.code]?.checkedIn ? 'Sudah check-in' : 'Belum hadir'), h('small', {}, 'Tiket ' + g.code + (g.sent ? ' · terkirim' : ''))),
      h('div', { class: 'acts' }, h('button', { class: 'btn sm ghost', onclick: () => navigator.clipboard.writeText(link(g)).then(() => toast('Tautan tamu disalin')) }, 'Salin tautan'), g.phone ? h('a', { class: 'btn sm ghost', href: wa(g), target: '_blank', rel: 'noopener', onclick: () => api('sent', { body: { id: g.id, sent: true } }).then(load) }, 'WhatsApp') : '', h('button', { class: 'btn sm danger', onclick: del('guest', g.id, g.name) }, 'Hapus')))) : [h('p', { class: 'note' }, 'Belum ada tamu. Tambahkan di atas — setiap tamu otomatis mendapat tiket QR.')]));
    // Daftar tiket (semua tiket: dari RSVP & dari daftar tamu)
    const tq = $('#tq').value.toLowerCase(), tf = $('#tf').value, ts = D.tickets.filter(t => (!tf || (tf === 'y') === !!t.checkedIn) && (t.name + ' ' + t.code).toLowerCase().includes(tq));
    $('#tl').replaceChildren(...(ts.length ? ts.map(t => h('div', { class: 'r', style: 'grid-template-columns:1.3fr 1fr auto' }, h('p', {}, h('b', {}, t.name), h('small', {}, (t.qty || 1) + ' orang · ' + (t.source === 'rsvp' ? 'dari RSVP' : 'dari daftar tamu'))), h('p', {}, h('span', { class: 'tag' + (t.checkedIn ? '' : ' mut') }, t.checkedIn ? 'Sudah check-in' : 'Belum check-in'), h('small', {}, 'Kode ' + t.code + (t.checkedAt ? ' · ' + fmt(t.checkedAt) : ''))),
      h('div', { class: 'acts' }, h('button', { class: 'btn sm ghost', onclick: () => showQR(t) }, 'Lihat QR'), t.checkedIn ? '' : h('button', { class: 'btn sm', onclick: async () => { try { await api('checkin', { body: { code: t.code } }); toast('Check-in: ' + t.name); await load(); } catch (er) { toast(er.message); } } }, 'Check-in')))) : [h('p', { class: 'note' }, 'Belum ada tiket.')]));
    // Check-in
    const ci = D.tickets.filter(t => t.checkedIn).sort((a, b) => (b.checkedAt || '').localeCompare(a.checkedAt || ''));
    $('#cl').replaceChildren(...(ci.length ? ci.map(t => h('div', { class: 'r', style: 'grid-template-columns:1fr auto' }, h('p', {}, h('b', {}, t.name), h('small', {}, t.qty + ' orang · ' + t.code + ' · ' + fmt(t.checkedAt))), h('div', { class: 'acts' }, h('button', { class: 'btn sm ghost', onclick: async () => { await api('checkin', { body: { code: t.code, undo: true } }); await load(); } }, 'Batalkan')))) : [h('p', { class: 'note' }, 'Belum ada tamu yang check-in.')]));
  }
  const showQR = t => { const d = $('#qrd'); $('#qrb').innerHTML = window.QR.svg((C.origin || location.origin) + '/?t=' + t.code, { size: 240, quiet: 2 }); $('#qrn').textContent = t.name; $('#qrc').textContent = 'Kode ' + t.code + ' · ' + (t.qty || 1) + ' orang'; d.showModal ? d.showModal() : d.setAttribute('open', ''); };
  $('#qrx').onclick = () => { const d = $('#qrd'); d.close ? d.close() : d.removeAttribute('open'); };
  ['rq', 'rf', 'wq', 'wf', 'gs', 'tq', 'tf'].forEach(i => $('#' + i).addEventListener('input', () => D && draw()));
  $('#gf').addEventListener('submit', async e => { e.preventDefault(); try { await api('guest', { body: { name: $('#gn').value, phone: $('#gp').value, group: $('#gg').value, qty: $('#gq').value } }); e.target.reset(); $('#gq').value = 1; await load(); toast('Tamu & tiket dibuat'); } catch (er) { toast(er.message); } });
  async function check() { const raw = $('#sc').value.toUpperCase(), code = (raw.match(/[A-Z0-9]{10}(?![A-Z0-9])/g) || []).pop() || '', box = $('#sr'); box.replaceChildren();
    try { const { ticket: t } = await api('lookup', { q: '&code=' + code });
      const bad = t.checkedIn; box.append(h('div', { class: 'res ' + (bad ? 'warn' : 'ok') }, h('b', {}, t.name), t.qty + ' orang · kode ' + t.code, h('p', {}, bad ? '⚠ Sudah check-in pada ' + fmt(t.checkedAt) : '✔ Tiket valid, belum check-in'), bad ? '' : h('button', { class: 'btn', onclick: async () => { await api('checkin', { body: { code: t.code } }); toast('Check-in berhasil'); await load(); check(); } }, 'Check-in sekarang')));
    } catch (er) { box.append(h('div', { class: 'res bad' }, h('b', {}, 'Tiket tidak valid'), er.message)); } }
  $('#sf').addEventListener('submit', e => { e.preventDefault(); check(); });
  boot();
})();
