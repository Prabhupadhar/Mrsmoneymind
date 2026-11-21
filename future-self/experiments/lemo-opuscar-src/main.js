// The Neighbor Who Won: a 10 s vertical Pop Art Short. render(t) is pure; one timeline below.
import { createPop, T, rectPts, ellipsePts } from './engine/pop.js';
import { clamp, lerp, seg, eo, eio, back, hash } from '/core/lib.js';

const W = 1080, H = 1920, TS = 600;
const pop = createPop(document.getElementById('c'), { W, H });
await Promise.all(['40px Anton', '40px Archivo'].map(f => document.fonts.load(f)));
window.DUR = 10.0;

// timeline (voice: 0.15 won the lottery | 2.11 you didn't win | 3.84 neighbors going broke | 6.46 keep up)
const TL = { flip: 1.25, toYou: 2.0, back: 3.45, spread: 4.0, cars: 6.35, end: 8.2 };
const h2 = (i, j, k = 0) => hash(i * 17.13 + j * 91.7 + k * 7.31);
const YOU = [1, 0];
const EV = []; const ev = (t, type, o = {}) => EV.push({ t: +t.toFixed(3), type, ...o });

// stamp order: rings around the first print, faster and faster
const ORD = [];
for (let j = -6; j <= 6; j++) for (let i = -4; i <= 4; i++) if (i || j) ORD.push([i, j]);
ORD.sort((a, b) => (Math.max(Math.abs(a[0]), Math.abs(a[1])) - Math.max(Math.abs(b[0]), Math.abs(b[1]))) || (Math.atan2(a[1], a[0]) - Math.atan2(b[1], b[0])));
const STAMP = new Map([['0,0', -0.05]]);
ORD.forEach(([i, j], n) => { const ta = .2 + .85 * Math.pow((n + 1) / ORD.length, .55); STAMP.set(i + ',' + j, ta); if (n < 10 || n % 4 == 0) ev(ta, 'stamp', { pan: clamp(i / 4, -1, 1) * .6, v: n < 8 ? 1 : .55 }); });
ev(0, 'stamp', { v: 1.3 });
ev(TL.flip, 'flip', { v: 1.2 }); ev(TL.flip + .3, 'ding', { v: 1 });
ev(TL.toYou, 'pan'); ev(TL.back, 'pan');
ev(TL.spread, 'rot', { d: 3.4 });
// the dark front: distance from the winner, in tiles
const dist = (i, j) => Math.hypot(i, j * .9);
const darkAt = (i, j, t) => (i || j) ? clamp((t - TL.spread - dist(i, j) * .45) / .9) * .6 * clamp(3.6 - dist(i, j), 0, 1) : 0;
// cars: stamped next to each darkened house, outward, accelerating
const CAR = new Map(); { const L = ORD.filter(([i, j]) => dist(i, j) < 3.4);
  L.sort((a, b) => dist(a[0], a[1]) - dist(b[0], b[1]) + (h2(a[0], a[1], 9) - h2(b[0], b[1], 9)) * .3);
  L.forEach(([i, j], n) => { const ta = TL.cars + 1.5 * Math.pow(n / L.length, .7); CAR.set(i + ',' + j, ta); if (n < 12 || n % 3 == 0) ev(ta, 'car', { n: Math.min(n, 11), pan: clamp(i / 4, -1, 1) * .6 }); }); }

// ---------- drawing ----------
function house(roofInk, bodyInk, mis) {
  pop.save(); pop.translate(mis[0], mis[1]);
  pop.fill([[-185, -25], [0, -195], [185, -25]], roofInk);
  pop.fill(rectPts(-150, -30, 300, 205), bodyInk);
  pop.fill(rectPts(-40, 60, 80, 115), T.white); pop.over(rectPts(-40, 60, 80, 115), { b: .35 });
  pop.fill(rectPts(-125, 10, 70, 60), T.white); pop.fill(rectPts(55, 10, 70, 60), T.white);
  pop.over(rectPts(-125, 10, 70, 60), { y: .5 }); pop.over(rectPts(55, 10, 70, 60), { y: .5 });
  pop.restore();
  pop.outline([[-185, -25], [0, -195], [185, -25], [-185, -25]], 9, { closed: true });
  pop.outline(rectPts(-150, -30, 300, 205), 9, { closed: true });
  pop.outline(rectPts(-40, 60, 80, 115), 6, { closed: true });
  for (const x of [-125, 55]) { pop.outline(rectPts(x, 10, 70, 60), 6, { closed: true }); pop.line([[x + 35, 10], [x + 35, 70]], 4, { taper: 0 }); }
  pop.line([[-240, 178], [240, 178]], 8, { taper: .1 });
}
function car(p) {   // a shiny yellow car, stamped in (p 0..1)
  if (p <= 0) return;
  pop.save(); pop.translate(175, 200); const s = .95 * (1 + .25 * (1 - eo(p))); pop.scale(s);
  const body = [[-120, 0], [-120, -40], [-70, -48], [-40, -90], [45, -90], [80, -48], [125, -40], [125, 0]];
  pop.fill(body, T.yellow); pop.over([[-30, -80], [40, -80], [65, -48], [-55, -48]], { b: .4 });
  pop.outline(body.concat([body[0]]), 9, { closed: true });
  for (const x of [-70, 75]) { const wh = ellipsePts(x, 2, 28, 28, 32); pop.fill(wh, T.white); pop.black(ellipsePts(x, 2, 28, 28, 32)); pop.knock(ellipsePts(x, 2, 10, 10, 16)); }
  pop.restore();
}
function sunburst(t) {
  const n = 28, rot = t * .25;
  for (let k = 0; k < n; k += 2) { const a0 = rot + k / n * Math.PI * 2, a1 = rot + (k + 1) / n * Math.PI * 2;
    pop.fill([[0, 0], [Math.cos(a0) * 520, Math.sin(a0) * 520], [Math.cos(a1) * 520, Math.sin(a1) * 520]], T.orange); }
}
function tile(i, j, t) {
  const ap = seg(t, STAMP.get(i + ',' + j) ?? 9, (STAMP.get(i + ',' + j) ?? 9) + .14);
  if (ap <= 0 && !(i === 0 && j === 0)) return;
  const win = i === 0 && j === 0;
  const fp = win ? seg(t, TL.flip, TL.flip + .3) : 0;
  const mis = [(h2(i, j, 1) - .5) * 14, (h2(i, j, 2) - .5) * 10];
  pop.save(); pop.translate(i * TS, j * TS); pop.clip(rectPts(-TS / 2, -TS / 2, TS, TS));
  const a = win ? Math.max(ap, .45) : ap;
  if (a < 1) pop.scale(1 + .14 * (1 - eo(a)));
  if (fp > 0 && fp < 1) pop.scale(Math.max(.02, Math.abs(Math.cos(fp * Math.PI))), 1);
  const gold = fp >= .5;
  const big = a < 1 ? (1 - eo(a)) * 60 : 0;
  pop.fill(rectPts(-TS / 2, -TS / 2, TS, TS), gold ? T.yellow : T.blue);
  if (gold) sunburst(t);
  pop.save(); pop.translate(mis[0] * .6 + big, mis[1] * .6 - big * .5); pop.fill(ellipsePts(0, 10, 250, 250, 72), T.white); pop.restore();
  pop.outline(ellipsePts(0, 10, 250, 250, 72), gold ? 8 : 0.01, { closed: true });
  house(gold ? T.orange : T.red, gold ? T.red : T.yellow, [mis[0] - big, mis[1] + big * .7]);
  if (gold) { pop.text('$', 0, -110, { size: 110, font: 'Anton', fill: T.green }); pop.text('$', 0, -110, { size: 110, font: 'Anton', outline: 6, spot: 'rgba(0,0,0,0)' }); }
  const d = darkAt(i, j, t);
  if (d > 0) pop.over(rectPts(-TS / 2, -TS / 2, TS, TS), { r: d, b: d * .9 });
  if (!win) car(seg(t, CAR.get(i + ',' + j) ?? 99, (CAR.get(i + ',' + j) ?? 99) + .16));
  pop.restore();
}
// paper label, screen space, top-left (clear of the Shorts UI at the bottom)
function label(str, p, ink = T.red) {
  if (p <= 0) return;
  const k = eo(seg(p, 0, .35)), out = 1 - eo(seg(p, .85, 1)) ;
  pop.save(); [pop.P, pop.L, pop.S].forEach(c => c.setTransform(1, 0, 0, 1, 0, 0));
  pop.translate(70 - (1 - k) * 60 - (1 - out) * 900, 250); pop.rotate(-.03);
  const w = pop.measure(str, { size: 104, font: 'Archivo' }) + 70;
  pop.fill(rectPts(14, 14, w, 150), ink);
  pop.fill(rectPts(0, 0, w, 150), T.white); pop.outline(rectPts(0, 0, w, 150), 7, { closed: true });
  pop.text(str, 35, 78, { size: 104, font: 'Archivo', align: 'left', read: 'label' });
  pop.restore();
}

// camera keys: [t, x, y, zoom]
const CAMK = [[0, 0, 0, 1.55], [1.15, 0, 0, .5], [TL.toYou, 0, 0, .62], [TL.toYou + .55, YOU[0] * TS, 0, 1.25], [TL.back, YOU[0] * TS, 0, 1.3], [TL.back + .6, 0, 120, .38], [TL.cars, 0, 120, .42], [10, 0, 40, .6]];
function camAt(t) {
  for (let k = 0; k < CAMK.length - 1; k++) { const [t0, x0, y0, z0] = CAMK[k], [t1, x1, y1, z1] = CAMK[k + 1];
    if (t <= t1) { const e = eio(seg(t, t0, t1)); return { x: lerp(x0, x1, e), y: lerp(y0, y1, e), zoom: Math.exp(lerp(Math.log(z0), Math.log(z1), e)) }; } }
  const l = CAMK[CAMK.length - 1]; return { x: l[1], y: l[2], zoom: l[3] };
}

window.render = (t) => {
  const cam = camAt(t);
  pop.begin(cam);
  const hw = W / 2 / cam.zoom + TS, hh = H / 2 / cam.zoom + TS;
  pop.fill(rectPts(cam.x - hw, cam.y - hh, hw * 2, hh * 2), T.white);
  for (let j = Math.floor((cam.y - hh) / TS); j <= Math.ceil((cam.y + hh) / TS); j++)
    for (let i = Math.floor((cam.x - hw) / TS); i <= Math.ceil((cam.x + hw) / TS); i++) tile(i, j, t);
  // labels: one at a time
  label('WINNER', seg(t, TL.flip + .2, TL.toYou + .1));
  label('YOU: $0', seg(t, TL.toYou + .45, TL.back + .25), T.blue);
  label('BROKE?', seg(t, TL.spread + 1.0, TL.cars + .2));
  label('NEW CARS', seg(t, TL.cars + .5, 10.6), T.blue);
  window._reads = pop.reads;
  pop.present({ cell: 10, age: .08, rough: .1 });
};
window.TEXTS = (t) => { window.render(t); return window._reads; };
window.EV = EV;
window.READY = true;
