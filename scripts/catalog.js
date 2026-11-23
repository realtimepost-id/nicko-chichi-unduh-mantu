// Katalog preview internal (hanya ada di mode preview / npm run dev). Tidak ikut ke build produksi.
const { esc } = require('../src/lib/partials.js');
module.exports = (inv, designs) => `<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Katalog Desain — ${esc(inv.projectLabel)}</title>
<link rel="icon" href="/favicon.svg"><style>
:root{--bg:#f4f1ed;--ink:#1d1a18;--mut:#7a726b;--line:#ddd5cc;--ac:#1d1a18}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.5 system-ui,-apple-system,Segoe UI,sans-serif}
header{padding:20px clamp(16px,4vw,40px);border-bottom:1px solid var(--line);display:flex;gap:16px;align-items:center;justify-content:space-between;flex-wrap:wrap;background:#fff;position:sticky;top:0;z-index:20}
h1{font:600 1.05rem/1.2 system-ui;margin:0;letter-spacing:.02em}small{color:var(--mut)}
.badge{font-size:.7rem;letter-spacing:.14em;text-transform:uppercase;background:#ece5dc;padding:.35em .7em;border-radius:99px}
main{display:grid;grid-template-columns:300px 1fr;min-height:calc(100vh - 71px)}
aside{border-right:1px solid var(--line);background:#fff;padding:14px;overflow:auto}
.it{display:grid;grid-template-columns:64px 1fr;gap:12px;width:100%;text-align:left;padding:10px;border:1px solid transparent;background:none;border-radius:10px;cursor:pointer;margin-bottom:6px;font:inherit;color:inherit}
.it:hover{background:#f7f3ee}.it[aria-current=true]{border-color:var(--ink);background:#faf7f3}
.sw{display:flex;flex-direction:column;border-radius:8px;overflow:hidden;height:64px;border:1px solid var(--line)}.sw i{flex:1}
.it b{display:block;font-size:.95rem}.it span{font-size:.78rem;color:var(--mut);display:block;line-height:1.35}
.stage{display:flex;flex-direction:column;min-width:0}
.bar{display:flex;gap:10px;flex-wrap:wrap;align-items:center;justify-content:space-between;padding:12px clamp(12px,3vw,28px);border-bottom:1px solid var(--line);background:#fff}
.grp{display:flex;gap:6px;flex-wrap:wrap}
.b{border:1px solid var(--line);background:#fff;padding:.55em 1em;border-radius:8px;font:600 .8rem system-ui;cursor:pointer;text-decoration:none;color:var(--ink)}
.b:hover{border-color:var(--ink)}.b[aria-pressed=true]{background:var(--ink);color:#fff;border-color:var(--ink)}.b.pri{background:var(--ink);color:#fff;border-color:var(--ink)}
.view{flex:1;display:grid;place-items:start center;padding:24px;overflow:auto;background:#e9e4dd}
.frame{background:#111;border-radius:34px;padding:12px;box-shadow:0 20px 60px rgba(0,0,0,.25);transition:width .3s;max-width:100%}
.frame.desk{border-radius:12px;padding:8px}
iframe{display:block;width:100%;height:min(780px,calc(100vh - 220px));min-height:560px;border:0;border-radius:24px;background:#fff}.frame.desk iframe{border-radius:6px}
.info{padding:14px clamp(12px,3vw,28px);background:#fff;border-top:1px solid var(--line);font-size:.88rem;color:var(--mut)}
.info code{background:#f1ece5;padding:.15em .5em;border-radius:5px;color:var(--ink);font-size:.82rem;user-select:all}
.nm{margin:8px 0 14px;display:flex;gap:8px;align-items:center;font-size:.8rem;color:var(--mut)}.nm input{flex:1;border:1px solid var(--line);border-radius:8px;padding:.5em .7em;font:inherit;min-width:0}
@media(max-width:860px){main{grid-template-columns:1fr}aside{border-right:0;border-bottom:1px solid var(--line);display:flex;gap:8px;overflow-x:auto;padding:10px}.it{min-width:230px;margin:0}.nm{display:none}.view{padding:12px}}
</style></head><body>
<header><div><h1>${esc(inv.projectLabel)}</h1><small>Katalog preview internal · ${designs.length} desain · semua fitur aktif</small></div><span class="badge">Hanya untuk pemilihan desain — tidak ikut ke produksi</span></header>
<main><aside><label class="nm">Nama tamu <input id="guest" value="Bapak Andi Wijaya" aria-label="Nama tamu untuk preview"></label>
${designs.map((d, i) => `<button class="it" data-i="${i}" aria-current="${i === 0}"><div class="sw">${d.palette.map(c => `<i style="background:${c}"></i>`).join('')}</div><div><b>${i + 1}. ${esc(d.name)}</b><span>${esc(d.concept)}</span></div></button>`).join('')}</aside>
<section class="stage"><div class="bar"><div class="grp"><button class="b" id="prev">← Sebelumnya</button><button class="b" id="next">Berikutnya →</button></div>
<div class="grp" role="group" aria-label="Ukuran layar"><button class="b" data-w="375" aria-pressed="true">Mobile 375</button><button class="b" data-w="430" aria-pressed="false">Mobile 430</button><button class="b" data-w="768" aria-pressed="false">Tablet</button><button class="b" data-w="1280" aria-pressed="false">Desktop</button></div>
<div class="grp"><button class="b" id="reload">Ulangi cover</button><a class="b" id="full" target="_blank" rel="noopener">Buka layar penuh ↗</a><button class="b pri" id="pick">Pakai desain ini</button></div></div>
<div class="view"><div class="frame" id="frame" style="width:399px"><iframe id="fr" title="Preview desain" loading="lazy" allow="autoplay"></iframe></div></div>
<div class="info" id="info"></div></section></main>
<script>
const D=${JSON.stringify(designs.map(d => ({ slug: d.slug, name: d.name })))};let cur=+(new URLSearchParams(location.search).get('i')||0),W=375;
const $=s=>document.querySelector(s),items=[...document.querySelectorAll('.it')];
function go(i){cur=(i+D.length)%D.length;const u='/d/'+D[cur].slug+'/?preview=1&to='+encodeURIComponent($('#guest').value||'Tamu Undangan');$('#fr').src=u;$('#full').href=u;
items.forEach((b,k)=>b.setAttribute('aria-current',k===cur));$('#info').innerHTML='Desain terpilih: <b>'+D[cur].name+'</b> — untuk memakainya saat publikasi, ubah di <code>config/invitation.js</code>: <code>finalDesign: \\''+D[cur].slug+'\\'</code> (atau set Environment Variable Vercel <code>FINAL_DESIGN='+D[cur].slug+'</code>), lalu deploy ulang.';history.replaceState(null,'','?i='+cur)}
function size(w){W=w;$('#frame').style.width=Math.min(w+(w>600?16:24),9999)+'px';$('#frame').classList.toggle('desk',w>600);document.querySelectorAll('[data-w]').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.w===w))}
items.forEach((b,k)=>b.onclick=()=>go(k));$('#prev').onclick=()=>go(cur-1);$('#next').onclick=()=>go(cur+1);$('#reload').onclick=()=>go(cur);$('#guest').onchange=()=>go(cur);
document.querySelectorAll('[data-w]').forEach(b=>b.onclick=()=>size(+b.dataset.w));
$('#pick').onclick=async()=>{const t="finalDesign: '"+D[cur].slug+"'";try{await navigator.clipboard.writeText(t)}catch(e){}alert('Disalin: '+t+'\\n\\nTempel/ubah di config/invitation.js, lalu jalankan npm run build (atau push ke GitHub agar Vercel membangun ulang).')};
document.addEventListener('keydown',e=>{if(e.target.tagName==='INPUT')return;if(e.key==='ArrowRight')go(cur+1);if(e.key==='ArrowLeft')go(cur-1)});
size(375);go(cur);
</script></body></html>`;
