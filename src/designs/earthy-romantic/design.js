const arcs = `<svg viewBox="0 0 200 110" aria-hidden="true" fill="none" stroke-width="10"><path d="M10 110a90 90 0 0 1 180 0" stroke="#b2593a"/><path d="M30 110a70 70 0 0 1 140 0" stroke="#d9a07e"/><path d="M50 110a50 50 0 0 1 100 0" stroke="#6b6b3f"/><path d="M70 110a30 30 0 0 1 60 0" stroke="#f1e6d6"/></svg>`;
module.exports = {
  order: 4, slug: 'earthy-romantic', name: 'Earthy Romantic', themeColor: '#b2593a',
  concept: 'Boho hangat: terakota, pasir & zaitun, lengkung pelangi, jendela arch dan tekstur kertas.',
  palette: ['#faf3e8', '#f1e6d6', '#b2593a', '#6b6b3f', '#3e2a20'],
  fonts: 'family=DM+Serif+Display:ital@0;1&family=Nunito+Sans:wght@300;400;600;700',
  render: ({ inv, P, esc }) => {
    const [a, b] = inv.order.map(k => inv.couple[k]), cl = t => t.replace(/,$/, '');
    return `
<div id="cover" class="cv" data-open="iris"><div class="cover-inner cv-in"><div class="rb">${arcs}</div>
  <p class="k">Unduh Mantu</p><div class="win"><div class="ph">${P.img(3, { loading: 'eager', sizes: '280px', pos: '50% 28%' })}</div></div>
  <h1>${esc(a.nick)} <i>&amp;</i> ${esc(b.nick)}</h1><p class="dt">24 Desember 2026</p><p class="to">Kepada Yth.<br><b data-guest>Tamu Undangan</b></p>${P.open('Buka Undangan')}</div></div>

<header class="hero"><div class="rb big" data-anim="fade">${arcs}</div><p class="k" data-anim="fade">${esc(inv.copy.salam)}</p><h2 data-anim="rise">${esc(a.name)}<i>&amp;</i>${esc(b.name)}</h2>
  <div class="win lg" data-anim="scale"><div class="ph">${P.img(1, { loading: 'eager', sizes: '(min-width:800px) 400px,78vw', pos: '50% 38%' })}</div></div><p class="dd" data-anim="rise">${esc(inv.events[0].dateText)}</p></header>

<main>
<section class="s tc"><p class="lead" data-anim="rise">${esc(inv.copy.intro)}</p><div data-anim="fade">${P.quote()}</div></section>
<section class="s tc"><h2 class="h" data-anim="rise">Mempelai</h2><div class="cpl">${inv.order.map((k, i) => { const m = inv.couple[k]; return `<article data-anim="scale" style="--d:${i * .15}s"><div class="arch ${i ? 'ol' : 'tc2'}">${P.person(k)}</div><h3>${esc(m.name)}</h3><p class="r">${esc(m.role)} dari</p><p class="pp">${esc(m.parents)}</p></article>`; }).join('')}</div></section>
<section class="s tc clay"><h2 class="h lt" data-anim="rise">Menuju Hari Bahagia</h2>${P.cd('cde')}</section>
<section class="s tc"><h2 class="h" data-anim="rise">Acara</h2><div class="evs">${P.events()}</div><div class="calrow">${P.calAll()}</div>${P.map()}</section>
<section class="s sand"><h2 class="h tc" data-anim="rise">Love Story</h2><ol class="tl">${P.storyItems((s, i) => `<li data-anim="${i % 2 ? 'right' : 'left'}"><b>${esc(s.label)}</b><p>${esc(cl(s.text))}</p></li>`)}</ol></section>
<section class="s tc"><h2 class="h" data-anim="rise">Galeri</h2>${P.gallery('arches', { anim: 'scale' })}</section>
<section class="s tc sand"><h2 class="h" data-anim="rise">Wedding Gift</h2><p class="lead" data-anim="rise">${esc(inv.copy.giftNote)}</p>${P.gifts()}${P.address()}</section>
<section class="s tc"><h2 class="h" data-anim="rise">RSVP</h2><p class="lead" data-anim="rise">${esc(inv.copy.rsvpNote)}</p><div class="box tl" data-anim="rise">${P.rsvp()}</div>${P.ticket()}</section>
<section class="s tc sand"><h2 class="h" data-anim="rise">Buku Tamu</h2><div class="box tl" data-anim="rise">${P.wishes()}</div></section>
</main>
<footer class="foot tc"><div class="rb">${arcs}</div><p class="lead lt">${esc(inv.copy.closing)}</p><p class="k lt">${esc(inv.copy.wassalam)}</p><h2 class="fn">${esc(a.nick)} <i>&amp;</i> ${esc(b.nick)}</h2><p class="fam">${inv.copy.families.map(esc).join('<br>')}</p>${P.credit()}</footer>`;
  },
};
