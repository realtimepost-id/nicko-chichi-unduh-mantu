module.exports = {
  order: 3, slug: 'minimalist-monochrome', name: 'Minimalist Monochrome', themeColor: '#ffffff',
  concept: 'Grid Swiss hitam-putih: label kecil, garis tipis, foto hitam-putih yang berwarna saat disentuh.',
  palette: ['#ffffff', '#f2f2f0', '#111111', '#8a8a8a', '#d9d9d6'],
  fonts: 'family=Instrument+Serif:ital@0;1&family=Inter+Tight:wght@300;400;500;600',
  render: ({ inv, P, esc }) => {
    const [a, b] = inv.order.map(k => inv.couple[k]), cl = t => t.replace(/,$/, '');
    const rows = inv.events.map(e => `<dl class="spec" data-anim="fade"><div><dt>Acara</dt><dd>${esc(e.title)}</dd></div><div><dt>Hari</dt><dd>${esc(e.dateText.split(', ')[0])}</dd></div><div><dt>Tanggal</dt><dd>${esc(e.dateText.split(', ')[1])}</dd></div><div><dt>Waktu</dt><dd>${esc(e.timeText)}</dd></div><div><dt>Tempat</dt><dd>${esc(e.venue)}<br><small>${esc(e.address)}</small></dd></div></dl>`).join('');
    const sec = (n, t) => `<p class="lb" data-anim="fade"><span>${n}</span><span>${t}</span></p><div class="hr" data-anim="line"></div>`;
    return `
<div id="cover" class="cv" data-open="wipe"><div class="cover-inner cv-in"><p class="lb"><span>N°01</span><span>Unduh Mantu</span><span>24.12.2026</span></p>
  <div class="cv-mid"><h1>${esc(a.nick)}<br><i>&amp;</i> ${esc(b.nick)}</h1><div class="cv-ph">${P.img(0, { loading: 'eager', sizes: '260px', pos: '50% 30%' })}</div></div>
  <div class="cv-bt"><p class="to">Kepada Yth.<br><b data-guest>Tamu Undangan</b></p>${P.open('Buka')}</div></div></div>

<header class="hero"><p class="lb"><span>${esc(inv.copy.salam)}</span><span>24.12.26</span></p><h2 data-anim="rise">${esc(a.name)}<br><i>&amp;</i> ${esc(b.name)}</h2><div class="hph" data-anim="wipeup">${P.img(3, { loading: 'eager', sizes: '(min-width:900px) 50vw,100vw', pos: '50% 30%' })}</div><p class="in" data-anim="rise">${esc(inv.copy.intro)}</p></header>

<main>
<section class="s">${sec('01', 'Pembuka')}<div data-anim="fade">${P.quote()}</div></section>
<section class="s">${sec('02', 'Mempelai')}<div class="cpl">${inv.order.map((k, i) => { const m = inv.couple[k]; return `<article data-anim="rise" style="--d:${i * .1}s"><div class="pf">${P.person(k)}</div><h3>${esc(m.name)}</h3><p class="mu">${esc(m.role)} dari</p><p>${esc(m.parents)}</p></article>`; }).join('')}</div></section>
<section class="s">${sec('03', 'Hitung Mundur')}${P.cd('cdm')}</section>
<section class="s">${sec('04', 'Acara')}${rows}<div class="calrow">${P.mapBtns()}</div><div class="calrow">${P.calAll()}${inv.events.map(e => `<button class="btn ghost" type="button" data-ics="${e.id}">${P.ic('dl')}.ics</button>`).join('')}</div>${P.map()}</section>
<section class="s">${sec('05', 'Kisah')}<div class="st">${P.storyItems((s, i) => `<div class="row" data-anim="rise"><span class="mu">${esc(s.label)}</span><p>${esc(cl(s.text))}</p></div>`)}</div></section>
<section class="s">${sec('06', 'Galeri')}${P.gallery('sheet', { anim: 'fade' })}</section>
<section class="s">${sec('07', 'Hadiah')}<p class="in" data-anim="rise">${esc(inv.copy.giftNote)}</p>${P.gifts()}${P.address()}</section>
<section class="s">${sec('08', 'RSVP')}<p class="in" data-anim="rise">${esc(inv.copy.rsvpNote)}</p><div class="box" data-anim="rise">${P.rsvp()}</div>${P.ticket()}</section>
<section class="s">${sec('09', 'Buku Tamu')}<div class="box" data-anim="rise">${P.wishes()}</div></section>
</main>
<footer class="foot"><div class="hr"></div><p class="in">${esc(inv.copy.closing)}</p><h2>${esc(a.nick)} <i>&amp;</i> ${esc(b.nick)}</h2><p class="lb"><span>${esc(inv.copy.wassalam)}</span></p><p class="mu">${inv.copy.families.map(esc).join(' · ')}</p>${P.credit()}</footer>`;
  },
};
