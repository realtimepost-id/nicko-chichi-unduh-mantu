const crest = (t) => `<svg viewBox="0 0 120 140" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M60 4 112 22v50c0 32-24 52-52 64C32 124 8 104 8 72V22z"/><path d="M60 14 102 28v44c0 26-19 43-42 53C37 115 18 98 18 72V28z" opacity=".5"/><text x="60" y="84" text-anchor="middle" font-family="Cinzel,Georgia,serif" font-size="30" fill="currentColor" stroke="none">${t}</text><path d="M40 34h40M48 42h24" opacity=".6"/></svg>`;
module.exports = {
  order: 1, slug: 'modern-royal', name: 'Modern Royal', themeColor: '#0e1a3a',
  concept: 'Kerajaan modern: navy tua & emas, lambang, sudut bingkai geometris, galeri bento.',
  palette: ['#0e1a3a', '#080f24', '#c9a24a', '#f6f0e2', '#27386b'],
  fonts: 'family=Cinzel:wght@400;500;600&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Lato:wght@300;400;700',
  render: ({ inv, P, esc }) => {
    const [a, b] = inv.order.map(k => inv.couple[k]), cl = t => t.replace(/,$/, ''), mono = a.nick[0] + b.nick[0];
    return `
<div id="cover" class="cv" data-open="up"><div class="cover-inner cv-in">
  <div class="cv-ph">${P.img(2, { loading: 'eager', sizes: '100vw', pos: '50% 30%' })}<span class="cor tl"></span><span class="cor tr"></span><span class="cor bl"></span><span class="cor br"></span></div>
  <div class="cv-tx"><div class="crest">${crest(mono)}</div><p class="k">Unduh Mantu</p><h1>${esc(a.nick)} <i>&amp;</i> ${esc(b.nick)}</h1><p class="d">24 · 12 · 2026</p>
  <p class="to">Kepada Yth.<br><b data-guest>Tamu Undangan</b></p>${P.open('Buka Undangan')}</div></div></div>

<header class="hero"><div class="hero-ph" data-anim="scale">${P.img(1, { loading: 'eager', sizes: '(min-width:900px) 40vw,100vw', pos: '50% 34%' })}<span class="cor tl"></span><span class="cor br"></span></div>
  <div class="hero-tx"><p class="k" data-anim="fade">${esc(inv.copy.salam)}</p><h2 data-anim="rise">${esc(a.name)}<i>&amp;</i>${esc(b.name)}</h2><p class="lead" data-anim="rise">${esc(inv.copy.intro)}</p><p class="dd" data-anim="rise">${esc(inv.events[0].dateText)}</p></div></header>

<main>
<section class="s qt"><div data-anim="fade">${P.quote()}</div></section>

<section class="s"><h2 class="h" data-anim="rise">Mempelai</h2><div class="cpl">${inv.order.map((k, i) => { const m = inv.couple[k]; return `<article class="pan" data-anim="${i ? 'right' : 'left'}"><div class="pf">${P.person(k)}<span class="cor tl"></span><span class="cor br"></span></div><div><h3>${esc(m.name)}</h3><p class="r">${esc(m.role)} dari</p><p class="pp">${esc(m.parents)}</p></div></article>`; }).join('')}</div></section>

<section class="s band"><h2 class="h" data-anim="rise">Menuju Hari Bahagia</h2>${P.cd('cdr')}</section>

<section class="s"><h2 class="h" data-anim="rise">Acara</h2><div class="evs">${P.events()}</div><div class="calrow">${P.calAll()}</div>${P.map()}</section>

<section class="s band"><h2 class="h" data-anim="rise">Love Story</h2><ol class="steps">${P.storyItems((s, i) => `<li data-anim="rise" style="--d:${i * .08}s"><b class="n">0${i + 1}</b><div><em>${esc(s.label)}</em><p>${esc(cl(s.text))}</p></div></li>`)}</ol></section>

<section class="s"><h2 class="h" data-anim="rise">Galeri</h2>${P.gallery('bento', { anim: 'scale' })}</section>

<section class="s band"><h2 class="h" data-anim="rise">Wedding Gift</h2><p class="lead" data-anim="rise">${esc(inv.copy.giftNote)}</p>${P.gifts()}${P.address()}</section>
<section class="s"><h2 class="h" data-anim="rise">RSVP</h2><p class="lead" data-anim="rise">${esc(inv.copy.rsvpNote)}</p><div class="box" data-anim="rise">${P.rsvp()}</div>${P.ticket()}</section>
<section class="s band"><h2 class="h" data-anim="rise">Buku Tamu</h2><div class="box" data-anim="rise">${P.wishes()}</div></section>
</main>
<footer class="foot"><div class="crest">${crest(mono)}</div><p class="lead">${esc(inv.copy.closing)}</p><p class="k">${esc(inv.copy.wassalam)}</p><h2 class="fn">${esc(a.nick)} <i>&amp;</i> ${esc(b.nick)}</h2><p class="fam">${inv.copy.families.map(esc).join(' · ')}</p>${P.credit()}</footer>`;
  },
};
