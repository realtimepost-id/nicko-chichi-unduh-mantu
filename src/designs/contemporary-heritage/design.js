const kawung = c => `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='44' height='44' viewBox='0 0 44 44' fill='none' stroke='${c}' stroke-width='1'><ellipse cx='22' cy='11' rx='6' ry='11'/><ellipse cx='22' cy='33' rx='6' ry='11'/><ellipse cx='11' cy='22' rx='11' ry='6'/><ellipse cx='33' cy='22' rx='11' ry='6'/></svg>`)}")`;
module.exports = {
  order: 5, slug: 'contemporary-heritage', name: 'Contemporary Heritage', themeColor: '#3b2a1f',
  concept: 'Warisan Jawa kontemporer: sogan & parchment, motif kawung, bentuk gunungan, tata letak asimetris.',
  palette: ['#f0e4cf', '#3b2a1f', '#b98a3e', '#7a2a22', '#1b1a22'],
  fonts: 'family=Marcellus&family=Spectral:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500;600',
  render: ({ inv, P, esc }) => {
    const [a, b] = inv.order.map(k => inv.couple[k]), cl = t => t.replace(/,$/, '');
    const K = kawung('#b98a3e'), Kd = kawung('#7a5a2c');
    return `
<style>.kw{background-image:${K};background-size:44px}.kd{background-image:${Kd};background-size:44px}</style>
<div id="cover" class="cv" data-open="down"><div class="kw band"></div><div class="cover-inner cv-in"><div class="fr"><div class="fr2">
  <p class="k" data-anim="fade">Unduh Mantu</p><div class="gun"><div class="ph">${P.img(0, { loading: 'eager', sizes: '260px', pos: '50% 28%' })}</div></div>
  <h1>${esc(a.nick)} <i>&amp;</i> ${esc(b.nick)}</h1><p class="dt">Kamis · 24 Desember 2026</p><p class="to">Kepada Yth.<br><b data-guest>Tamu Undangan</b></p>${P.open('Buka Undangan')}</div></div></div></div>

<header class="hero"><div class="kw band"></div><div class="hg"><div class="hl"><p class="k" data-anim="fade">${esc(inv.copy.salam)}</p><h2 data-anim="rise">${esc(a.name)}<i>&amp;</i>${esc(b.name)}</h2><p class="in" data-anim="rise">${esc(inv.copy.intro)}</p><p class="dd" data-anim="rise">${esc(inv.events[0].dateText)}</p></div>
  <div class="hr2" data-anim="left"><div class="gun lg"><div class="ph">${P.img(1, { loading: 'eager', sizes: '(min-width:900px) 380px,70vw', pos: '50% 38%' })}</div></div></div></div></header>

<main>
<section class="s tc"><div data-anim="fade">${P.quote()}</div></section>
<section class="s"><h2 class="h" data-anim="rise">Mempelai</h2><div class="cpl">${inv.order.map((k, i) => { const m = inv.couple[k]; return `<article class="${i ? 'b' : ''}" data-anim="${i ? 'right' : 'left'}"><div class="gun sm"><div class="ph cutout">${P.person(k).replace(/^<div class="ph cutout ">|<\/div>$/g, '')}</div></div><div><h3>${esc(m.name)}</h3><p class="r">${esc(m.role)} dari</p><p class="pp">${esc(m.parents)}</p></div></article>`; }).join('')}</div></section>
<section class="s dkb tc"><div class="kd band2"></div><h2 class="h lt" data-anim="rise">Menuju Hari Bahagia</h2>${P.cd('cdh')}</section>
<section class="s"><h2 class="h" data-anim="rise">Acara</h2><div class="evs">${P.events()}</div><div class="calrow">${P.calAll()}</div>${P.map()}</section>
<section class="s par"><h2 class="h" data-anim="rise">Kisah Kami</h2><ol class="tlv">${P.storyItems((s, i) => `<li data-anim="${i % 2 ? 'right' : 'left'}"><b>${esc(s.label)}</b><p>${esc(cl(s.text))}</p></li>`)}</ol></section>
<section class="s"><h2 class="h" data-anim="rise">Galeri</h2>${P.gallery('offs', { anim: 'rise' })}</section>
<section class="s par"><h2 class="h" data-anim="rise">Wedding Gift</h2><p class="in" data-anim="rise">${esc(inv.copy.giftNote)}</p>${P.gifts()}${P.address()}</section>
<section class="s"><h2 class="h" data-anim="rise">RSVP</h2><p class="in" data-anim="rise">${esc(inv.copy.rsvpNote)}</p><div class="box" data-anim="rise">${P.rsvp()}</div>${P.ticket()}</section>
<section class="s par"><h2 class="h" data-anim="rise">Buku Tamu</h2><div class="box" data-anim="rise">${P.wishes()}</div></section>
</main>
<footer class="foot tc"><div class="kd band2"></div><p class="in lt">${esc(inv.copy.closing)}</p><p class="k lt">${esc(inv.copy.wassalam)}</p><h2 class="fn">${esc(a.nick)} <i>&amp;</i> ${esc(b.nick)}</h2><p class="fam">${inv.copy.families.map(esc).join('<br>')}</p>${P.credit()}</footer>`;
  },
};
