// Shared kit for Mrs. Money Mind Pop Art Shorts (1080x1920). One wall of identical prints per film;
// films import this and write only their subject icon and their beats.
import { createPop, T, rectPts, ellipsePts } from './pop.js';
import { clamp, lerp, seg, eo, eio, hash } from '/core/lib.js';
export { T, rectPts, ellipsePts, clamp, lerp, seg, eo, eio, hash };
export const W = 1080, H = 1920, TS = 600;
export const pop = createPop(document.getElementById('c'), { W, H });
export const h2 = (i, j, k = 0) => hash(i * 17.13 + j * 91.7 + k * 7.31);
export const EV = []; export const ev = (t, type, o = {}) => EV.push({ t: +t.toFixed(3), type, ...o });
export async function boot(dur) {
  const ff = new FontFace('Anton', 'url(/films/_kit/Anton-Regular.ttf)'), fa = new FontFace('Archivo', 'url(/films/_kit/ArchivoBlack-Regular.ttf)');
  document.fonts.add(await ff.load()); document.fonts.add(await fa.load());
  const vo = await (await fetch('voice/vo.json')).json();
  window.DUR = dur; window.EV = EV;
  return vo.map(l => l.start);   // line start times
}
// rings of stamps around (0,0), faster and faster; returns Map "i,j" -> time
export function stampRings(t0, dur, ri = 4, rj = 6, sound = true) {
  const O = []; for (let j = -rj; j <= rj; j++) for (let i = -ri; i <= ri; i++) if (i || j) O.push([i, j]);
  O.sort((a, b) => (Math.max(Math.abs(a[0]), Math.abs(a[1])) - Math.max(Math.abs(b[0]), Math.abs(b[1]))) || (Math.atan2(a[1], a[0]) - Math.atan2(b[1], b[0])));
  const M = new Map([['0,0', t0 - .05]]);
  O.forEach(([i, j], n) => { const ta = t0 + .12 + dur * Math.pow((n + 1) / O.length, .55); M.set(i + ',' + j, ta); if (sound && (n < 10 || n % 4 == 0)) ev(ta, 'stamp', { pan: clamp(i / 4, -1, 1) * .6, v: n < 8 ? 1 : .55 }); });
  if (sound) ev(t0, 'stamp', { v: 1.3 });
  return M;
}
// a tile: ground square + paper disc (misregistered) ; returns the transform pushed (caller pops with pop.restore())
export function tileOpen(i, j, ground, appear = 1, flip = 0) {
  pop.save(); pop.translate(i * TS, j * TS); pop.clip(rectPts(-TS / 2, -TS / 2, TS, TS));
  if (appear < 1) pop.scale(1 + .14 * (1 - eo(appear)));
  if (flip > 0 && flip < 1) pop.scale(Math.max(.02, Math.abs(Math.cos(flip * Math.PI))), 1);
  const big = appear < 1 ? (1 - eo(appear)) * 60 : 0, mis = [(h2(i, j, 1) - .5) * 14 + big, (h2(i, j, 2) - .5) * 10 - big * .5];
  pop.fill(rectPts(-TS / 2, -TS / 2, TS, TS), ground);
  return mis;
}
export function disc(mis, ink = T.white, r = 250) { pop.save(); pop.translate(mis[0] * .6, mis[1] * .6); pop.fill(ellipsePts(0, 10, r, r, 72), ink); pop.restore(); }
export function darken(d) { if (d > 0) pop.over(rectPts(-TS / 2, -TS / 2, TS, TS), { r: d, b: d * .9 }); }
export function sunburst(t, ink = T.orange, R = 520) { const n = 28, rot = t * .25; for (let k = 0; k < n; k += 2) { const a0 = rot + k / n * 6.2832, a1 = rot + (k + 1) / n * 6.2832; pop.fill([[0, 0], [Math.cos(a0) * R, Math.sin(a0) * R], [Math.cos(a1) * R, Math.sin(a1) * R]], ink); } }
export function wall(cam, fn) {
  const hw = W / 2 / cam.zoom + TS, hh = H / 2 / cam.zoom + TS;
  pop.fill(rectPts(cam.x - hw, cam.y - hh, hw * 2, hh * 2), T.white);
  for (let j = Math.floor((cam.y - hh) / TS); j <= Math.ceil((cam.y + hh) / TS); j++)
    for (let i = Math.floor((cam.x - hw) / TS); i <= Math.ceil((cam.x + hw) / TS); i++) fn(i, j);
}
const screen = (fn) => { pop.save(); [pop.P, pop.L, pop.S].forEach(c => c.setTransform(1, 0, 0, 1, 0, 0)); fn(); pop.restore(); };
// paper slip label, top-left; p = 0..1 over its life
export function label(str, p, ink = T.red) {
  if (p <= 0 || p >= 1) return;
  const k = eo(seg(p, 0, .12)), out = 1 - eo(seg(p, .9, 1));
  screen(() => {
    pop.translate(70 - (1 - k) * 60 - (1 - out) * 900, 250); pop.rotate(-.03);
    const w = pop.measure(str, { size: 100, font: 'Archivo' }) + 70;
    pop.fill(rectPts(14, 14, w, 146), ink); pop.fill(rectPts(0, 0, w, 146), T.white); pop.outline(rectPts(0, 0, w, 146), 7, { closed: true });
    pop.text(str, 35, 76, { size: 100, font: 'Archivo', align: 'left', read: 'label' });
  });
}
// big headline printed in (colour from an offset, then the key), screen space, centred at x,y
export function headline(str, x, y, size, p, ink = T.yellow, drop = T.red) {
  if (p <= 0) return; const e = eo(seg(p, 0, .5)), dx = 90 * (1 - e), dy = -40 * (1 - e);
  screen(() => {
    const b = { size, font: 'Anton', align: 'center' };
    pop.text(str, x + size * .06 - dx * .6, y + size * .06 - dy * .6, { ...b, fill: drop });
    pop.text(str, x + dx, y + dy, { ...b, fill: ink });
    if (p > .3) pop.text(str, x, y, { ...b, outline: Math.max(4, size * .045), spot: 'rgba(0,0,0,0)', read: 'head:' + str });
  });
}
export function camAt(K, t) {
  for (let k = 0; k < K.length - 1; k++) { const [t0, x0, y0, z0] = K[k], [t1, x1, y1, z1] = K[k + 1];
    if (t <= t1) { const e = eio(seg(t, t0, t1)); return { x: lerp(x0, x1, e), y: lerp(y0, y1, e), zoom: Math.exp(lerp(Math.log(z0), Math.log(z1), e)) }; } }
  const l = K[K.length - 1]; return { x: l[1], y: l[2], zoom: l[3] };
}
export function finish(renderFn, fx = {}) {
  window.render = (t) => { renderFn(t); window._reads = pop.reads; pop.present({ cell: 10, age: .08, rough: .1, ...fx }); };
  window.TEXTS = (t) => { window.render(t); return window._reads; };
  window.READY = true;
}
