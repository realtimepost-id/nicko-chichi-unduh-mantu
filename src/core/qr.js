/* Generator QR Code kecil tanpa dependensi (byte mode, ECC level M, versi 1–10). Hasil: matriks boolean. */
(function (g) {
  const ECC = [0, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26], BLK = [0, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5];
  const exp = new Array(512), log = new Array(256);
  for (let i = 0, x = 1; i < 255; i++) { exp[i] = x; log[x] = i; x <<= 1; if (x & 256) x ^= 0x11d; }
  for (let i = 255; i < 512; i++) exp[i] = exp[i - 255];
  const mul = (a, b) => (a && b ? exp[log[a] + log[b]] : 0);
  function rsGen(n) { let p = [1]; for (let i = 0; i < n; i++) { const q = new Array(p.length + 1).fill(0); p.forEach((c, j) => { q[j] ^= c; q[j + 1] ^= mul(c, exp[i]); }); p = q; } return p; }
  function rsRem(data, n) { const gen = rsGen(n), r = new Array(n).fill(0); for (const d of data) { const f = d ^ r.shift(); r.push(0); for (let i = 0; i < n; i++) r[i] ^= mul(gen[i + 1], f); } return r; }
  const rawModules = v => { let r = (16 * v + 128) * v + 64; if (v >= 2) { const a = Math.floor(v / 7) + 2; r -= (25 * a - 10) * a - 55; if (v >= 7) r -= 36; } return r; };
  const dataCap = v => Math.floor(rawModules(v) / 8) - ECC[v] * BLK[v];
  function encode(text) {
    const bytes = Array.from(new TextEncoder().encode(text));
    let ver = 1; while (ver <= 10 && bytes.length + 2 > dataCap(ver) - (ver >= 10 ? 1 : 0)) ver++;
    if (ver > 10) throw new Error('Teks terlalu panjang untuk QR');
    const bits = []; const put = (v, n) => { for (let i = n - 1; i >= 0; i--) bits.push((v >>> i) & 1); };
    put(4, 4); put(bytes.length, ver >= 10 ? 16 : 8); bytes.forEach(b => put(b, 8));
    const cap = dataCap(ver) * 8; put(0, Math.min(4, cap - bits.length)); while (bits.length % 8) bits.push(0);
    for (let pad = 0xec; bits.length < cap; pad ^= 0xec ^ 0x11) put(pad, 8);
    const data = []; for (let i = 0; i < bits.length; i += 8) data.push(parseInt(bits.slice(i, i + 8).join(''), 2));
    const nb = BLK[ver], ne = ECC[ver], total = Math.floor(rawModules(ver) / 8), short = nb - (total % nb), sl = Math.floor(total / nb) - ne;
    const blocks = []; let k = 0;
    for (let i = 0; i < nb; i++) { const d = data.slice(k, k += sl + (i < short ? 0 : 1)); blocks.push({ d, e: rsRem(d, ne) }); }
    const out = []; for (let i = 0; i <= sl; i++) blocks.forEach((b, j) => { if (i < b.d.length) out.push(b.d[i]); });
    for (let i = 0; i < ne; i++) blocks.forEach(b => out.push(b.e[i]));
    return { ver, out };
  }
  function build(text) {
    const { ver, out } = encode(text), n = ver * 4 + 17;
    const base = Array.from({ length: n }, () => new Array(n).fill(false)), fn = Array.from({ length: n }, () => new Array(n).fill(false));
    const setF = (x, y, d) => { if (x >= 0 && y >= 0 && x < n && y < n) { base[y][x] = d; fn[y][x] = true; } };
    for (let i = 0; i < n; i++) { setF(6, i, i % 2 === 0); setF(i, 6, i % 2 === 0); }
    const finder = (cx, cy) => { for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) { const d = Math.max(Math.abs(dx), Math.abs(dy)); setF(cx + dx, cy + dy, d !== 2 && d !== 4); } };
    finder(3, 3); finder(n - 4, 3); finder(3, n - 4);
    if (ver > 1) { const na = Math.floor(ver / 7) + 2, step = Math.ceil((ver * 4 + 4) / (na * 2 - 2)) * 2; const pos = [6]; for (let p = n - 7; pos.length < na; p -= step) pos.splice(1, 0, p);
      pos.forEach((cx, i) => pos.forEach((cy, j) => { if ((i === 0 && j === 0) || (i === 0 && j === na - 1) || (i === na - 1 && j === 0)) return;
        for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) setF(cx + dx, cy + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1); })); }
    const fmt = mask => { const d = (0 << 3) | mask; let r = d; for (let i = 0; i < 10; i++) r = (r << 1) ^ ((r >>> 9) * 0x537); const bits = ((d << 10) | r) ^ 0x5412, b = i => ((bits >>> i) & 1) !== 0;
      for (let i = 0; i <= 5; i++) setF(8, i, b(i)); setF(8, 7, b(6)); setF(8, 8, b(7)); setF(7, 8, b(8)); for (let i = 9; i < 15; i++) setF(14 - i, 8, b(i));
      for (let i = 0; i < 8; i++) setF(n - 1 - i, 8, b(i)); for (let i = 8; i < 15; i++) setF(8, n - 15 + i, b(i)); setF(8, n - 8, true); };
    fmt(0);
    if (ver >= 7) { let r = ver; for (let i = 0; i < 12; i++) r = (r << 1) ^ ((r >>> 11) * 0x1f25); const bits = (ver << 12) | r;
      for (let i = 0; i < 18; i++) { const b = ((bits >>> i) & 1) !== 0, a = n - 11 + (i % 3), c = Math.floor(i / 3); setF(a, c, b); setF(c, a, b); } }
    const place = mask => { const m = base.map(r => r.slice()); let i = 0;
      for (let right = n - 1; right >= 1; right -= 2) { if (right === 6) right = 5;
        for (let v = 0; v < n; v++) for (let j = 0; j < 2; j++) { const x = right - j, up = ((right + 1) & 2) === 0, y = up ? n - 1 - v : v;
          if (!fn[y][x] && i < out.length * 8) { m[y][x] = ((out[i >>> 3] >>> (7 - (i & 7))) & 1) !== 0; i++; }
          if (!fn[y][x]) { const inv = [(x + y) % 2 === 0, y % 2 === 0, x % 3 === 0, (x + y) % 3 === 0, (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0, x * y % 2 + x * y % 3 === 0, (x * y % 2 + x * y % 3) % 2 === 0, ((x + y) % 2 + x * y % 3) % 2 === 0][mask]; if (inv) m[y][x] = !m[y][x]; } } }
      return m; };
    const pen = m => { let p = 0; for (let t = 0; t < 2; t++) for (let a = 0; a < n; a++) { let run = 1; for (let b = 1; b < n; b++) { const c = t ? m[b][a] : m[a][b], pc = t ? m[b - 1][a] : m[a][b - 1]; if (c === pc) { run++; if (run === 5) p += 3; else if (run > 5) p++; } else run = 1; } }
      for (let y = 0; y < n - 1; y++) for (let x = 0; x < n - 1; x++) if (m[y][x] === m[y][x + 1] && m[y][x] === m[y + 1][x] && m[y][x] === m[y + 1][x + 1]) p += 3;
      const dark = m.flat().filter(Boolean).length; p += Math.floor(Math.abs(dark * 20 - n * n * 10) / (n * n)) * 10; return p; };
    let best = 0, bp = 1e9, bm; for (let k = 0; k < 8; k++) { const m = place(k), s = pen(m); if (s < bp) { bp = s; best = k; bm = m; } }
    fmt(best); for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (fn[y][x]) bm[y][x] = base[y][x];
    return bm;
  }
  function svg(text, { size = 220, fg = '#000', bg = '#fff', quiet = 3 } = {}) {
    const m = build(text), n = m.length, t = n + quiet * 2; let d = '';
    m.forEach((row, y) => { let x = 0; while (x < n) { if (row[x]) { let w = 1; while (x + w < n && row[x + w]) w++; d += `M${x + quiet} ${y + quiet}h${w}v1h-${w}z`; x += w; } else x++; } });
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${t} ${t}" width="${size}" height="${size}" shape-rendering="crispEdges" role="img" aria-label="Kode QR tiket"><rect width="${t}" height="${t}" fill="${bg}"/><path d="${d}" fill="${fg}"/></svg>`;
  }
  g.QR = { matrix: build, svg };
  if (typeof module !== 'undefined') module.exports = g.QR;
})(typeof window !== 'undefined' ? window : globalThis);
