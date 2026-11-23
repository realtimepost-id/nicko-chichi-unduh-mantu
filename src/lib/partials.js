// Potongan HTML fungsional yang dipakai semua desain (dirender saat build).
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const IC = {
  pin: '<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.6"/>',
  nav: '<path d="m3 11 18-8-8 18-2-8-8-2Z"/>',
  cal: '<rect x="3.5" y="5" width="17" height="15.5" rx="1.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  copy: '<rect x="8.5" y="8.5" width="12" height="12" rx="1.5"/><path d="M15.5 8.5V5A1.5 1.5 0 0 0 14 3.5H5A1.5 1.5 0 0 0 3.5 5v9A1.5 1.5 0 0 0 5 15.5h3.5"/>',
  dl: '<path d="M12 4v11m0 0-4-4m4 4 4-4M5 20h14"/>',
  send: '<path d="m4 12 16-8-6 16-3-7-7-1Z"/>',
  gift: '<rect x="3.5" y="8.5" width="17" height="4" rx="1"/><path d="M5 12.5V20h14v-7.5M12 8.5V20M12 8.5S10.5 4 8.3 4.6C6.6 5 7.2 8.5 12 8.5Zm0 0s1.5-4.5 3.7-3.9c1.7.4 1.1 3.9-3.7 3.9Z"/>',
  mus: '<path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3.5 2"/>',
};
const ic = n => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n]}</svg>`;

module.exports = (inv, o = {}) => {
  const enc = encodeURIComponent, q = inv.mapQuery;
  const maps = { open: 'https://www.google.com/maps/search/?api=1&query=' + enc(q), dir: 'https://www.google.com/maps/dir/?api=1&destination=' + enc(q), embed: 'https://maps.google.com/maps?q=' + enc(q) + '&hl=id&z=16&output=embed' };
  const P = { esc, ic, maps };
  const A = (a, d) => ` data-anim="${a}"${d ? ` style="--d:${d}s"` : ''}`; P.A = A;

  P.img = (i, { cls = '', sizes = '100vw', loading = 'lazy', pos, alt } = {}) => { const p = inv.photos[i % inv.photos.length];
    return `<img${cls ? ` class="${cls}"` : ''} src="${p.thumb}" srcset="${p.thumb} 560w, ${p.src} 1100w" sizes="${sizes}" width="1100" height="1650" alt="${esc(alt ?? p.alt)}" loading="${loading}" decoding="async" style="object-position:${pos || p.pos}">`; };
  P.person = (key, cls = '') => { const m = inv.couple[key]; return `<div class="ph cutout ${cls}"><img src="${m.photo}" width="640" height="${key === 'bride' ? 960 : 960}" alt="${esc(m.name)}" loading="lazy" decoding="async"></div>`; };

  P.cd = (cls = '') => `<div class="${cls}" data-cd-root><div class="cd" role="timer" aria-label="Hitung mundur menuju hari pernikahan"><div><b data-cd="d">0</b><small>Hari</small></div><div><b data-cd="h">00</b><small>Jam</small></div><div><b data-cd="m">00</b><small>Menit</small></div><div><b data-cd="s">00</b><small>Detik</small></div></div><p data-cd-msg></p></div>`;

  P.event = (e, i = 0, extra = '') => { const [wd, rest] = e.dateText.split(', '), [dd, ...my] = rest.split(' ');
    return `<article class="ev ${extra}"${A('rise', i * .12)}><h3 class="ev-t">${esc(e.title)}</h3>
<div class="ev-date"><span class="ev-wd">${esc(wd)}</span><b class="ev-dd">${esc(dd)}</b><span class="ev-my">${esc(my.join(' '))}</span></div>
<p class="ev-time">${ic('clock')}<span>Pukul ${esc(e.timeText)}</span></p>
<p class="ev-place">${ic('pin')}<span><b>${esc(e.venue)}</b><br>${esc(e.address)}</span></p>
<div class="ev-act"><a class="btn" href="${maps.open}" target="_blank" rel="noopener">${ic('pin')}Buka Lokasi</a><a class="btn ghost" href="${maps.dir}" target="_blank" rel="noopener">${ic('nav')}Navigasi</a><a class="btn ghost" data-gcal="${e.id}">${ic('cal')}Google Kalender</a><button class="btn ghost" type="button" data-ics="${e.id}">${ic('dl')}Simpan .ics</button></div></article>`; };
  P.events = (extra = '') => inv.events.map((e, i) => P.event(e, i, extra)).join('');
  P.map = (cls = '') => `<div class="mapbox ${cls}"${A('fade')}><iframe class="map-embed" title="Peta lokasi acara" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="${maps.embed}"></iframe></div>`;
  P.mapBtns = () => `<a class="btn" href="${maps.open}" target="_blank" rel="noopener">${ic('pin')}Buka Google Maps</a> <a class="btn ghost" href="${maps.dir}" target="_blank" rel="noopener">${ic('nav')}Petunjuk Arah</a>`;

  P.story = () => inv.story.map(s => s.text).join(' ');
  P.storyItems = (fn) => inv.story.map((s, i) => fn(s, i)).join('');
  P.quote = () => `<blockquote class="quote"><p class="ar" lang="ar" dir="rtl">${inv.quote.ar}</p><p>${esc(inv.quote.id)}</p><cite>${esc(inv.quote.src)}</cite></blockquote>`;

  P.gallery = (cls = 'gal', opt = {}) => `<div class="${cls}">${inv.photos.map((p, i) => `<button type="button" class="g g${i + 1}" data-i="${i}" aria-label="Perbesar foto ${i + 1}"${A(opt.anim || 'rise', (i % 3) * .1)}><img src="${p.thumb}" width="560" height="840" alt="${esc(p.alt)}" loading="lazy" decoding="async" style="object-position:${p.pos}"></button>`).join('')}</div>`;

  P.gifts = (cls = '') => `<div class="gifts ${cls}">${inv.gifts.map((g, i) => `<div class="gift"${A('rise', i * .12)}><span class="bank">${esc(g.bank)}</span><b class="acct">${esc(g.number)}</b><span class="own">a.n. ${esc(g.owner)}</span><button type="button" class="btn ghost" data-copy="${esc(g.number)}" data-ok="Nomor rekening ${esc(g.bank)} disalin" data-done="Tersalin ✓">${ic('copy')}<span>Salin Rekening</span></button></div>`).join('')}</div>`;
  P.address = () => `<div class="giftaddr"${A('rise')}><span class="bank">Kirim Hadiah</span><p>${esc(inv.giftAddress)}</p><button type="button" class="btn ghost" data-copy="${esc(inv.giftAddress)}" data-ok="Alamat disalin" data-done="Tersalin ✓">${ic('copy')}<span>Salin Alamat</span></button></div>`;

  P.rsvp = () => `<form id="rsvpForm" class="form" novalidate>
<div><label for="f-name">Nama</label><input id="f-name" name="name" type="text" autocomplete="name" required maxlength="60" placeholder="Nama lengkap Anda"></div>
<div><span class="lbl">Konfirmasi Kehadiran</span><div class="radios"><label><input type="radio" name="status" value="Hadir"><span>Hadir</span></label><label><input type="radio" name="status" value="Tidak Hadir"><span>Tidak Hadir</span></label></div></div>
<div data-qty-row hidden><label for="f-qty">Jumlah Tamu</label><select id="f-qty" name="qty">${Array.from({ length: inv.maxGuests }, (_, i) => `<option value="${i + 1}">${i + 1} orang</option>`).join('')}</select></div>
<div><label for="f-msg">Pesan (opsional)</label><textarea id="f-msg" name="message" maxlength="300" rows="3" placeholder="Tulis pesan singkat"></textarea></div>
<input class="hp" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
<button class="btn" type="submit">${ic('send')}Kirim Konfirmasi</button><p id="rsvpMsg" class="msg" role="status" aria-live="polite"></p></form>`;
  P.wishes = () => `<form id="wishForm" class="form" novalidate>
<div><label for="w-name">Nama</label><input id="w-name" name="name" type="text" required maxlength="60" placeholder="Nama Anda"></div>
<div><label for="w-msg">Ucapan &amp; Doa</label><textarea id="w-msg" name="message" maxlength="400" rows="3" required placeholder="Tulis ucapan terbaik untuk kami"></textarea></div>
<input class="hp" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
<button class="btn" type="submit">${ic('send')}Kirim Ucapan</button><p id="wishMsg" class="msg" role="status" aria-live="polite"></p></form>
<div class="wishes" id="wishList" aria-live="polite"></div><button type="button" class="btn ghost" id="wishMore" hidden>Muat lebih banyak</button>`;
  P.ticket = (cls = '') => `<section id="ticket" class="ticket ${cls}" hidden aria-label="Tiket undangan"><div class="tk-card"><small>TIKET UNDANGAN</small><b>${esc(inv.names)}</b><small>${esc(inv.events[0].dateText)}</small><div id="tk-qr" style="margin:1rem 0 .4rem"></div><b id="tk-name"></b><small><span id="tk-qty"></span> · KODE <span id="tk-code"></span></small></div><p class="tk-hint">Tunjukkan QR ini kepada penerima tamu saat tiba di lokasi.</p><button class="btn" id="tk-save" type="button">${ic('dl')}Simpan Tiket (PNG)</button></section>`;
  P.guest = () => `<span data-guest>Tamu Undangan</span>`;
  P.calAll = () => inv.events.map(e => `<a class="btn ghost" data-gcal="${e.id}">${ic('cal')}${esc(e.title)}</a>`).join(' ');
  P.open = (label = 'Buka Undangan') => `<button type="button" class="btn" id="openBtn">${ic('mus')}<span>${label}</span></button>`;
  P.credit = () => `<p class="credit">Dibuat dengan cinta · ${esc(inv.names)}</p>`;
  return P;
};
module.exports.esc = esc;
