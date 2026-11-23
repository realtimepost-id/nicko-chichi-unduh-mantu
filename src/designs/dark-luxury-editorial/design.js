module.exports = {
  order: 2, slug: 'dark-luxury-editorial', name: 'Dark Luxury Editorial', themeColor: '#0a0a0b',
  concept: 'Hitam sinematik & perunggu: tipografi outline raksasa, foto layar penuh dengan parallax.',
  palette: ['#0a0a0b', '#17171a', '#b8935a', '#ece6da', '#5c4a30'],
  fonts: 'family=Bodoni+Moda:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&family=Manrope:wght@300;400;500;600',
  render: ({ inv, P, esc }) => {
    const [a, b] = inv.order.map(k => inv.couple[k]), cl = t => t.replace(/,$/, '');
    return `
<div id="cover" class="cv" data-open="fade">${P.img(4, { loading: 'eager', cls: 'cv-bg', sizes: '100vw', pos: '50% 36%' })}<div class="cv-sh"></div>
<div class="cover-inner cv-in"><p class="mini"><span>${esc(inv.events[0].title)}</span><span>${esc(inv.events[0].start.slice(0, 10).split('-').reverse().join('.'))}</span></p>
  <h1 class="out"><span>${esc(a.nick)}</span><span class="am">&amp;</span><span>${esc(b.nick)}</span></h1>
  <div class="cv-bt"><p class="to">Kepada Yth.<br><b data-guest>Tamu Undangan</b></p>${P.open('Buka Undangan')}</div></div></div>

<header class="hero"><div class="hbg" data-par=".08">${P.img(3, { loading: 'eager', sizes: '100vw', pos: '50% 30%' })}</div><div class="hsh"></div>
  <div class="htx"><p class="mini" data-anim="fade">${esc(inv.copy.salam)}</p><h2 data-anim="rise">${esc(a.name)}<i>&amp;</i>${esc(b.name)}</h2><p class="dd" data-anim="rise">${esc(inv.events[0].dateText)}</p></div></header>

<main>
<section class="s"><p class="big" data-anim="rise">${esc(inv.copy.intro)}</p><div data-anim="fade">${P.quote()}</div></section>

${inv.order.map((k, i) => { const m = inv.couple[k]; return `<section class="slab ${i ? 'r' : ''}"><div class="sph" data-anim="wipeup">${P.person(k)}</div><div class="stx" data-anim="rise"><b class="no">0${i + 1}</b><h3>${esc(m.name)}</h3><p class="mini">${esc(m.role)} dari</p><p class="pp">${esc(m.parents)}</p></div></section>`; }).join('')}

<section class="s alt"><h2 class="mini" data-anim="fade">Menuju Hari Bahagia</h2>${P.cd('cdd')}</section>

<section class="s"><h2 class="mini" data-anim="fade">Acara</h2><div class="evs">${P.events()}</div><div class="calrow">${P.calAll()}</div>${P.map()}</section>

<section class="s alt story"><h2 class="mini" data-anim="fade">Love Story</h2>${P.storyItems((s, i) => `<div class="ln" data-anim="wipeup"><em>${esc(s.label)}</em><p>${esc(cl(s.text))}</p></div>`)}</section>

<section class="gl"><h2 class="mini pad" data-anim="fade">Galeri</h2>${P.gallery('stack', { anim: 'fade' })}</section>

<section class="s alt"><h2 class="mini" data-anim="fade">Wedding Gift</h2><p class="big sm" data-anim="rise">${esc(inv.copy.giftNote)}</p>${P.gifts()}${P.address()}</section>
<section class="s"><h2 class="mini" data-anim="fade">RSVP</h2><p class="big sm" data-anim="rise">${esc(inv.copy.rsvpNote)}</p><div class="box" data-anim="rise">${P.rsvp()}</div>${P.ticket()}</section>
<section class="s alt"><h2 class="mini" data-anim="fade">Buku Tamu</h2><div class="box" data-anim="rise">${P.wishes()}</div></section>
</main>
<footer class="foot"><p class="big sm">${esc(inv.copy.closing)}</p><h2 class="out sm"><span>${esc(a.nick)}</span><span class="am">&amp;</span><span>${esc(b.nick)}</span></h2><p class="mini">${esc(inv.copy.wassalam)}</p><p class="fam">${inv.copy.families.map(esc).join(' · ')}</p>${P.credit()}</footer>`;
  },
};
