/* Logika bersama semua desain undangan. Data dibaca dari window.INV (dibuat otomatis oleh scripts/build.js). */
(() => {
  const I = window.INV, $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const qs = new URLSearchParams(location.search), reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const store = { get: k => { try { return localStorage.getItem('inv:' + I.slug + ':' + k); } catch { return null; } }, set: (k, v) => { try { localStorage.setItem('inv:' + I.slug + ':' + k, v); } catch {} } };
  const toast = m => { const t = $('#toast'); if (!t) return; t.textContent = m; t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), 2400); };
  const api = async (path, opt = {}) => { const r = await fetch(path, { credentials: 'same-origin', ...opt, headers: { 'Content-Type': 'application/json', ...(opt.headers || {}) } }); const j = await r.json().catch(() => ({})); if (!r.ok) throw new Error(j.error || 'Permintaan gagal (' + r.status + ')'); return j; };
  const fmtDate = iso => { try { return new Date(iso).toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' }).replace('.', ':') + ' WIB'; } catch { return ''; } };

  /* ---- Nama tamu (?to=) ---- */
  const guest = (qs.get('to') || '').replace(/[<>]/g, '').trim().slice(0, 60);
  $$('[data-guest]').forEach(el => { el.textContent = guest || 'Tamu Undangan'; });
  const fName = $('#f-name'), wName = $('#w-name'); if (guest) { if (fName) fName.value = guest; if (wName) wName.value = guest; }

  /* ---- Cover & pembukaan ---- */
  const cover = $('#cover'), openBtn = $('#openBtn');
  document.body.classList.add('locked');
  const bgm = $('#bgm'), mBtn = $('#musicBtn');
  const play = () => { if (!bgm) return; bgm.play().then(() => { mBtn?.classList.add('playing'); mBtn?.setAttribute('aria-pressed', 'true'); }).catch(() => {}); };
  const pause = () => { if (!bgm) return; bgm.pause(); mBtn?.classList.remove('playing'); mBtn?.setAttribute('aria-pressed', 'false'); };
  const open = () => {
    if (!cover || cover.classList.contains('opened')) return;
    cover.classList.add('opened'); document.body.classList.remove('locked'); window.scrollTo(0, 0);
    document.body.classList.add('is-open'); play(); setTimeout(() => { cover.hidden = true; revealNow(); }, reduce ? 0 : 1300);
    setTimeout(revealNow, 300);
  };
  openBtn && openBtn.addEventListener('click', open);
  if (mBtn) { mBtn.addEventListener('click', () => (bgm.paused ? play() : pause())); }
  let wasPlaying = false;
  document.addEventListener('visibilitychange', () => { if (!bgm) return; if (document.hidden) { wasPlaying = !bgm.paused; pause(); } else if (wasPlaying) play(); });

  /* ---- Reveal & parallax ---- */
  let io; const revealNow = () => $$('[data-anim]:not(.in)').forEach(el => { const r = el.getBoundingClientRect(); if (r.top < innerHeight * .92 && r.bottom > 0) el.classList.add('in'); });
  if ('IntersectionObserver' in window && !reduce) {
    io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .14, rootMargin: '0px 0px -6% 0px' });
    $$('[data-anim]').forEach(el => io.observe(el));
  } else $$('[data-anim]').forEach(el => el.classList.add('in'));
  { let rt = false; addEventListener('scroll', () => { if (!rt) { rt = true; requestAnimationFrame(() => { rt = false; revealNow(); }); } }, { passive: true }); } // cadangan: clip-path membuat IntersectionObserver tidak mendeteksi elemen 'wipe'
  const par = $$('[data-par]');
  if (par.length && !reduce) { let tick = false; const run = () => { tick = false; par.forEach(el => { const r = el.getBoundingClientRect(); if (r.bottom < -100 || r.top > innerHeight + 100) return; el.style.setProperty('--py', ((r.top + r.height / 2 - innerHeight / 2) * (parseFloat(el.dataset.par) || .1)).toFixed(1) + 'px'); }); };
    addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(run); } }, { passive: true }); run(); }
  const prog = $('#progress'); if (prog) addEventListener('scroll', () => { const h = document.documentElement; prog.style.transform = `scaleX(${Math.min(1, scrollY / (h.scrollHeight - innerHeight || 1))})`; }, { passive: true });

  /* ---- Countdown (WIB) ---- */
  const cd = $$('[data-cd-root]');
  if (cd.length) {
    const start = new Date(I.events[0].start).getTime(), end = new Date(I.events[I.events.length - 1].end).getTime(), pad = n => String(n).padStart(2, '0');
    const tick = () => { const now = Date.now(), df = start - now;
      cd.forEach(root => {
        const state = df > 0 ? 'before' : now < end ? 'live' : 'after'; root.dataset.state = state;
        const msg = $('[data-cd-msg]', root); if (msg) msg.textContent = state === 'live' ? 'Acara sedang berlangsung' : state === 'after' ? 'Acara telah berlangsung. Terima kasih atas doa dan kehadiran Anda.' : '';
        const v = Math.max(0, df), parts = { d: Math.floor(v / 864e5), h: pad(Math.floor(v % 864e5 / 36e5)), m: pad(Math.floor(v % 36e5 / 6e4)), s: pad(Math.floor(v % 6e4 / 1e3)) };
        for (const k in parts) { const el = $(`[data-cd="${k}"]`, root); if (el) el.textContent = parts[k]; }
      }); };
    tick(); setInterval(tick, 1000);
  }

  /* ---- Salin teks ---- */
  const copy = async (text, ok) => { try { await navigator.clipboard.writeText(text); } catch { const t = document.createElement('textarea'); t.value = text; t.style.cssText = 'position:fixed;opacity:0'; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); } catch { toast('Gagal menyalin'); t.remove(); return; } t.remove(); } toast(ok || 'Tersalin'); };
  document.addEventListener('click', e => { const b = e.target.closest('[data-copy]'); if (!b) return; copy(b.dataset.copy, b.dataset.ok || 'Tersalin'); const l = b.querySelector('span') || b, o = l.textContent; if (b.dataset.done) { l.textContent = b.dataset.done; b.classList.add('copied'); setTimeout(() => { l.textContent = o; b.classList.remove('copied'); }, 1800); } });

  /* ---- Kalender ---- */
  const stamp = d => new Date(d).toISOString().replace(/[-:]|\.\d{3}/g, '');
  const evOf = id => I.events.find(e => e.id === id) || I.events[0];
  $$('[data-gcal]').forEach(a => { const e = evOf(a.dataset.gcal); a.href = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent(e.title + ' — ' + I.names) + '&dates=' + stamp(e.start) + '/' + stamp(e.end) + '&details=' + encodeURIComponent(I.title + '\n' + e.dateText + ', ' + e.timeText) + '&location=' + encodeURIComponent(e.venue + ', ' + e.address) + '&ctz=Asia/Jakarta'; a.target = '_blank'; a.rel = 'noopener'; });
  $$('[data-ics]').forEach(b => b.addEventListener('click', () => { const e = evOf(b.dataset.ics), esc = s => String(s).replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n');
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Undangan Digital//ID', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT', 'UID:' + e.id + '-' + I.slug + '@undangan', 'DTSTAMP:' + stamp(Date.now()), 'DTSTART:' + stamp(e.start), 'DTEND:' + stamp(e.end), 'SUMMARY:' + esc(e.title + ' — ' + I.names), 'DESCRIPTION:' + esc(I.title), 'LOCATION:' + esc(e.venue + ', ' + e.address),
      'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', 'DESCRIPTION:Besok: ' + esc(e.title), 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' })); a.download = I.slug + '-' + e.id + '.ics'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); toast('Acara ditambahkan ke file kalender'); }));

  /* ---- Lightbox ---- */
  const lb = $('#lb');
  if (lb) {
    const img = $('#lbImg'), cnt = $('#lbCount'); let cur = 0, tx = 0, last = null;
    const show = i => { cur = (i + I.photos.length) % I.photos.length; img.classList.remove('in'); img.src = I.photos[cur].full; img.alt = I.photos[cur].alt; cnt.textContent = (cur + 1) + ' / ' + I.photos.length; const nx = new Image(); nx.src = I.photos[(cur + 1) % I.photos.length].full; };
    img.addEventListener('load', () => img.classList.add('in'));
    const openLb = i => { last = document.activeElement; lb.hidden = false; document.body.classList.add('locked'); show(i); $('.lb-x', lb).focus(); };
    const close = () => { lb.hidden = true; document.body.classList.remove('locked'); last && last.focus && last.focus(); };
    $$('[data-i]').forEach(b => b.addEventListener('click', () => openLb(+b.dataset.i)));
    $('.lb-x', lb).onclick = close; $('.prev', lb).onclick = () => show(cur - 1); $('.next', lb).onclick = () => show(cur + 1);
    lb.addEventListener('click', e => { if (e.target === lb || e.target.classList.contains('lb-stage')) close(); });
    document.addEventListener('keydown', e => { if (lb.hidden) return; if (e.key === 'Escape') close(); if (e.key === 'ArrowLeft') show(cur - 1); if (e.key === 'ArrowRight') show(cur + 1); });
    lb.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', e => { const d = e.changedTouches[0].clientX - tx; if (Math.abs(d) > 50) show(cur + (d < 0 ? 1 : -1)); }, { passive: true });
  }

  /* ---- Tiket QR ---- */
  const tkSec = $('#ticket');
  const renderTicket = t => {
    if (!tkSec) return; const url = (I.origin || location.origin) + '/?t=' + t.code;
    $('#tk-qr').innerHTML = window.QR.svg(url, { size: 220, quiet: 2 }); $('#tk-name').textContent = t.name; $('#tk-qty').textContent = t.qty + ' orang'; $('#tk-code').textContent = t.code;
    tkSec.hidden = false; $$('[data-needs-ticket]').forEach(el => el.hidden = false); revealNow();
    const dl = $('#tk-save'); if (dl) dl.onclick = () => saveTicket(t, url);
  };
  const saveTicket = (t, url) => { const m = window.QR.matrix(url), n = m.length, q = 3, s = Math.floor(520 / (n + q * 2)), S = (n + q * 2) * s;
    const c = document.createElement('canvas'); c.width = 800; c.height = 1180; const x = c.getContext('2d'), css = getComputedStyle(document.documentElement);
    const ac = (css.getPropertyValue('--accent') || '#8a1c2b').trim(), fg = (css.getPropertyValue('--ink') || '#222').trim() || '#222';
    x.fillStyle = '#fff'; x.fillRect(0, 0, 800, 1180); x.strokeStyle = ac; x.lineWidth = 6; x.strokeRect(30, 30, 740, 1120); x.textAlign = 'center'; x.fillStyle = ac; x.font = '600 26px sans-serif'; x.fillText('TIKET UNDANGAN DIGITAL', 400, 110);
    x.fillStyle = fg; x.font = 'italic 64px Georgia, serif'; x.fillText(I.names, 400, 215); x.font = '28px Georgia, serif'; x.fillText(I.events[0].dateText, 400, 275);
    x.fillStyle = '#fff'; x.fillRect(400 - S / 2, 340, S, S); x.fillStyle = '#000'; m.forEach((r, yy) => r.forEach((v, xx) => { if (v) x.fillRect(400 - S / 2 + (xx + q) * s, 340 + (yy + q) * s, s, s); }));
    x.fillStyle = fg; x.font = '600 44px Georgia, serif'; x.fillText(t.name, 400, 340 + S + 80); x.font = '28px sans-serif'; x.fillText(t.qty + ' orang · Kode ' + t.code, 400, 340 + S + 130);
    x.font = '24px Georgia, serif'; x.fillStyle = '#666'; const ev = I.events.map(e => e.title + ' ' + e.timeText.replace(' – selesai', '')).join('  ·  '); x.fillText(ev, 400, 1060); x.fillText(I.events[0].venue, 400, 1100);
    const a = document.createElement('a'); a.href = c.toDataURL('image/png'); a.download = 'tiket-' + I.slug + '-' + t.code + '.png'; document.body.appendChild(a); a.click(); a.remove(); };
  const loadTicket = async code => { try { const j = await api('/api/ticket?code=' + encodeURIComponent(code)); store.set('ticket', j.ticket.code); renderTicket(j.ticket); } catch { if (code === store.get('ticket')) store.set('ticket', ''); } };
  const tcode = (qs.get('t') || store.get('ticket') || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (tcode.length === 10 && tkSec) loadTicket(tcode);

  /* ---- RSVP ---- */
  const form = $('#rsvpForm');
  if (form) {
    const cid = (() => { let c = store.get('cid'); if (!/^[a-f0-9]{32}$/.test(c || '')) { c = [...crypto.getRandomValues(new Uint8Array(16))].map(x => x.toString(16).padStart(2, '0')).join(''); store.set('cid', c); } return c; })();
    const born = Date.now(), qtyRow = $('[data-qty-row]', form), msg = $('#rsvpMsg'), btn = $('button[type=submit]', form);
    const sync = () => { const hadir = (form.status.value === 'Hadir'); if (qtyRow) qtyRow.hidden = !hadir; };
    $$('input[name=status]', form).forEach(r => r.addEventListener('change', sync)); sync();
    form.addEventListener('submit', async e => { e.preventDefault(); msg.className = 'msg'; msg.textContent = '';
      if (!form.status.value) { msg.classList.add('err'); msg.textContent = 'Pilih status kehadiran.'; return; }
      btn.disabled = true; const lab = btn.textContent; btn.textContent = 'Mengirim…';
      try { const j = await api('/api/rsvp', { method: 'POST', body: JSON.stringify({ name: form.name.value, status: form.status.value, qty: form.qty ? form.qty.value : 1, message: form.message.value, website: form.website.value, cid, t: Date.now() - born }) });
        msg.classList.add('ok'); msg.textContent = j.ticket ? 'Terima kasih! Kehadiran Anda tercatat. Tiket Anda ada di bawah.' : 'Terima kasih atas konfirmasinya. Kami mohon doa restu Anda.';
        store.set('rsvp', form.status.value); if (j.ticket) { store.set('ticket', j.ticket.code); renderTicket(j.ticket); setTimeout(() => tkSec.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' }), 600); } }
      catch (er) { msg.classList.add('err'); msg.textContent = er.message; }
      finally { btn.disabled = false; btn.textContent = lab; } });
  }

  /* ---- Ucapan / buku tamu ---- */
  const wl = $('#wishList');
  if (wl) {
    let all = [], shown = 8; const more = $('#wishMore');
    const draw = () => { wl.innerHTML = ''; if (!all.length) { wl.innerHTML = '<p class="empty">Belum ada ucapan. Jadilah yang pertama menuliskan doa terbaik.</p>'; more && (more.hidden = true); return; }
      all.slice(0, shown).forEach(w => { const el = document.createElement('article'); el.className = 'wish'; const n = document.createElement('b'), p = document.createElement('p'), t = document.createElement('time'); n.textContent = w.name; p.textContent = w.message; t.textContent = fmtDate(w.at); t.dateTime = w.at; el.append(n, p, t); wl.append(el); });
      if (more) more.hidden = all.length <= shown; $('#wishCount') && ($('#wishCount').textContent = all.length); };
    const load = async () => { try { all = (await api('/api/wishes')).wishes; draw(); } catch (er) { wl.innerHTML = '<p class="empty">Ucapan belum dapat dimuat. ' + (er.message || '') + '</p>'; } };
    wl.innerHTML = '<p class="empty">Memuat ucapan…</p>'; load();
    more && more.addEventListener('click', () => { shown += 8; draw(); });
    const wf = $('#wishForm'), wmsg = $('#wishMsg'), born = Date.now();
    wf && wf.addEventListener('submit', async e => { e.preventDefault(); wmsg.className = 'msg'; wmsg.textContent = ''; const b = $('button[type=submit]', wf); b.disabled = true;
      try { const j = await api('/api/wishes', { method: 'POST', body: JSON.stringify({ name: wf.name.value, message: wf.message.value, website: wf.website.value, t: Date.now() - born }) });
        if (j.wish) all.unshift(j.wish); wf.message.value = ''; draw(); wmsg.classList.add('ok'); wmsg.textContent = 'Terima kasih, ucapan Anda sudah terkirim.'; }
      catch (er) { wmsg.classList.add('err'); wmsg.textContent = er.message; } finally { b.disabled = false; } });
  }
  setTimeout(revealNow, 400);
})();
