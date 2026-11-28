// P06 (cartoon): "Lose a hundred? They needed two oh two." Tversky & Kahneman (1992), J. Risk & Uncertainty 5: 297-323
// (read in the authorized reprint, Tversky 2004, ch. 27): 25 Berkeley/Stanford grad students, three 1-h computer sessions, flat $25 pay,
// choices not paid out. Table 6 (median gain x that makes a 50-50 lose/win gamble acceptable): lose $25 -> $61, $50 -> $101,
// $100 -> $202, $150 -> $280. "a loss-aversion coefficient of about 2"; median lambda 2.25.
// Later: Brown, Imai, Vieider & Camerer (2024), JEL 62: 485-516: 607 estimates from 150 articles, mean 1.955.
import { PAL, g, W, H, ev, boot, finish, bg, person, medallion, tag, header, script, wipe, iris, shape, ink, ellipse, rect, rrect, text, rays, sparkle, seg, eo, back, twos, TAU } from '../_mc/mckit.js';
const V = await boot(35.0);
const T1 = V[1] - .2, T3 = V[3] - .2, T4 = V[4] - .2, T7 = V[7] - .2, T8 = V[8] - .2, T9 = V[9] - .2;
ev(0, 'stamp', { v: 1.2 }); ev(.5, 'ding');
[T1, T3, T4, T7, T8, T9].forEach(t => ev(t, 'pan'));
ev(V[1] + 2.2, 'stamp', { v: 1 }); ev(V[2] + .2, 'stamp', { v: 1 });
ev(V[4] + .4, 'flip', { v: 1 }); ev(V[5] + .2, 'note', { n: 5 });
ev(V[6] - .15, 'turn'); ev(V[6] + .1, 'stamp', { v: 1.4 }); ev(V[6] + .4, 'ding');
ev(V[7] + .3, 'stamp', { v: .9 }); ev(V[7] + 2.4, 'stamp', { v: .9 });
ev(V[8] + .3, 'flip', { v: 1 }); ev(V[8] + 2.6, 'stamp', { v: 1.2 });
ev(T9 + .4, 'stamp', { v: 1.2 });
const p = t => twos(t);
function coin(x, y, r, face, spin = 0, col = PAL.mustard) {
  const sx = Math.max(.08, Math.abs(Math.cos(spin)));
  g.save(); g.translate(x, y); g.scale(sx, 1);
  shape(g, ellipse(0, 0, r, r, 48), { fill: col, line: 6, seed: 11 });
  ink(g, ellipse(0, 0, r * .82, r * .82, 48), 4, { closed: true, seed: 12, breaks: .2 });
  if (sx > .35 && face) text(g, face, 0, r * .2, { font: `${Math.round(r * .55)}px Slab`, fill: PAL.ink, align: 'center' });
  g.restore();
}
function price(x, y, str, pp, col = PAL.mustard, sz = 1) { if (pp <= 0) return; const k = back(seg(pp, 0, 1)); g.save(); g.translate(x, y); g.scale(k * sz, k * sz); g.rotate(-.08);
  shape(g, [[-170, -70], [120, -70], [170, 0], [120, 70], [-170, 70]], { fill: col, line: 6, seed: 40 }); shape(g, ellipse(128, 0, 11, 11, 12), { fill: PAL.paper, line: 3, seed: 41 });
  text(g, str, -24, 34, { font: '92px Slab', fill: PAL.ink, align: 'center' }); g.restore(); }
function bubble(x, y, str, pp) { if (pp <= 0) return; const k = back(seg(pp, 0, 1)); g.save(); g.translate(x, y); g.scale(k, k);
  shape(g, ellipse(0, 0, 140, 95, 40), { fill: PAL.white, line: 5, seed: 50 }); shape(g, ellipse(-70, 110, 22, 18, 16), { fill: PAL.white, line: 4, seed: 51 });
  text(g, str, 0, 28, { font: '84px Slab', fill: PAL.ink, align: 'center', plate: PAL.mustard }); g.restore(); }
// a balance: post at x, beam at y; tilt > 0 drops the left pan; items drawn in each pan
function balance(x, y, tilt, left, right) {
  shape(g, [[x - 26, y], [x + 26, y], [x + 40, y + 560], [x - 40, y + 560]], { fill: PAL.brown, line: 5, seed: 70 });
  shape(g, rect(x - 150, y + 540, 300, 40), { fill: PAL.brownL, line: 5, seed: 71 });
  const L = 330, c = Math.cos(tilt), s = Math.sin(tilt);
  const A = [x - L * c, y + L * s], B = [x + L * c, y - L * s];
  ink(g, [A, B], 22, { seed: 72, taper: false, color: PAL.ink }); ink(g, [A, B], 12, { seed: 73, taper: false, color: PAL.mustard });
  shape(g, ellipse(x, y, 26, 26, 20), { fill: PAL.coral, line: 4, seed: 74 });
  for (const [P, items, col, seed] of [[A, left, PAL.coralL, 80], [B, right, PAL.tealL, 90]]) {
    const py = P[1] + 230;
    ink(g, [P, [P[0] - 110, py]], 4, { seed, taper: false }); ink(g, [P, [P[0] + 110, py]], 4, { seed: seed + 1, taper: false });
    shape(g, [[P[0] - 140, py], [P[0] + 140, py], [P[0] + 100, py + 50], [P[0] - 100, py + 50]], { fill: col, line: 5, seed: seed + 2 });
    items && items(P[0], py);
  }
}
const weight = (x, y, str, col, seed) => { shape(g, [[x - 55, y], [x + 55, y], [x + 42, y - 90], [x - 42, y - 90]], { fill: col, line: 5, seed }); shape(g, ellipse(x, y - 104, 22, 16, 14), { fill: 'transparent', line: 5, seed: seed + 1 }); text(g, str, x, y - 30, { font: '34px Slab', fill: PAL.paper, align: 'center' }); };
const you = (t, face = 'neutral', o = {}) => ({ dir: 1, coat: PAL.teal, coatD: PAL.tealD, face, blink: (p(t) % 2.9) < .1 ? 1 : 0, ...o });
// ---------- scenes ----------
function hookScene(t, t0) {
  bg(PAL.coralL, PAL.kraftL, 1420); rays(g, 540, 820, 28, 1300, PAL.coral, { alpha: .22, rot: t * .05 });
  header('LOSE $100?', 260, 1, { size: 120 });
  header('THEY NEEDED $202.', 400, 1, { size: 96, plate: PAL.mustard });
  const up = Math.abs(Math.sin((t - t0) * 2.2)) * 120;
  coin(560, 760 - up, 110, (t - t0) % 1.4 < .7 ? '-$100' : '+$202', (t - t0) * 7, (t - t0) % 1.4 < .7 ? PAL.coral : PAL.mustard);
  person(500, 1410, .95, you(t, 'wow', { armF: { a1: -.6, a2: -1.3 }, handF: 'open', look: [4, -10] }));
}
function deal(t) {
  shape(g, rect(0, 0, W / 2, H), { fill: PAL.coralL, line: 0, off: [0, 0] }); shape(g, rect(W / 2, 0, W / 2, H), { fill: PAL.tealL, line: 0, off: [0, 0] });
  shape(g, rect(0, 1420, W, 520), { fill: PAL.kraftL, line: 0, off: [0, 0] }); ink(g, [[W / 2, 0], [W / 2, 1420]], 8, { seed: 2, taper: false });
  text(g, 'HEADS', 270, 300, { font: '84px Slab', fill: PAL.ink, align: 'center', plate: PAL.coral });
  text(g, 'TAILS', 810, 300, { font: '84px Slab', fill: PAL.ink, align: 'center', plate: PAL.teal });
  const a = seg(t, V[1] + 2.2, V[1] + 2.5); if (a > 0) { g.save(); g.translate(270, 720); g.scale(back(a), back(a)); coin(0, 0, 170, '-$100', 0, PAL.coral); g.restore(); tag(270, 960, 'you lose', a, { size: 52 }); }
  const b = seg(t, V[2] + .2, V[2] + .5); if (b > 0) { g.save(); g.translate(810, 720); g.scale(back(b), back(b)); coin(0, 0, 170, '+$?', 0, PAL.mustard); g.restore(); tag(810, 960, 'you win', b, { size: 52 }); }
  person(540, 1410, .72, you(t, t > V[2] + 1 ? 'worried' : 'neutral', { look: [Math.sin(t * 1.5) * 8, -6] }));
}
function lab(t) {
  bg(PAL.mustardL, PAL.kraft, 1420); tag(540, 330, '25 grad students', seg(t, T3 + .3, T3 + .6), { size: 64 });
  script('Berkeley + Stanford', 520, seg(t, V[3] + 1.4, V[3] + 2.2), { size: 90 });
  for (let k = 0; k < 3; k++) { const x = 200 + k * 340, u = seg(t, T3 + .3 + k * .2, T3 + .6 + k * .2);
    person(x, 1410, .58, you(t, 'neutral', { coat: [PAL.coral, PAL.teal, PAL.blue][k], coatD: [PAL.coralD, PAL.tealD, PAL.blueD][k], dir: k === 2 ? -1 : 1 }));
    if (u <= 0) continue;
    g.save(); g.translate(x, 1380); g.scale(1, back(u)); g.translate(-x, -1380);
    shape(g, rect(x - 150, 1340, 300, 34), { fill: PAL.brownL, line: 4, seed: 60 + k });
    shape(g, rrect(x - 100, 1185, 200, 150, 14), { fill: PAL.ink, line: 5, seed: 66 + k });
    shape(g, rect(x - 84, 1200, 168, 120), { fill: k % 2 ? PAL.blueL : PAL.tealL, line: 0, seed: 69 + k });
    text(g, '$?', x, 1285, { font: '64px Slab', fill: PAL.ink, align: 'center' });
    g.restore(); }
}
function bet(t) {
  bg(PAL.blueL, PAL.kraftL, 1420);
  const level = t < V[6] ? -.18 * eo(seg(t, V[4] + .3, V[4] + .9)) : 0;
  const tilt = t < V[4] + .3 ? 0 : (t < V[6] ? .16 - .16 * eo(seg(t, V[4] + .2, V[4] + 1)) + Math.sin(t * 3) * .02 + .12 : 0);
  header(t < V[5] ? 'ON PAPER' : 'IN THEIR HEADS', 300, seg(t, t < V[5] ? T4 + .2 : V[5], (t < V[5] ? T4 + .2 : V[5]) + .4), { size: 100, plate: t < V[5] ? PAL.teal : PAL.coral });
  balance(540, 720, t > V[6] ? 0 : tilt, (x, y) => weight(x, y, '-$100', PAL.coralD, 100),
    (x, y) => { weight(x, y, t > V[6] ? '$202' : (t > V[5] ? '?' : '$101'), PAL.tealD, 110); });
  if (t > V[5] && t < V[6]) bubble(800, 560, '$ ?', seg(t, V[5], V[5] + .3));
  price(760, 520, '$202', seg(t, V[6] + .1, V[6] + .35), PAL.mustard, 1.1);
  medallion(250, 520, 100, '×2', seg(t, V[6] + .5, V[6] + .8), { size: 76 });
  person(880, 1410, .6, you(t, t > V[6] ? 'wow' : 'neutral', { dir: -1 }));
}
function ladder(t) {
  bg(PAL.tealL, PAL.kraft, 1420); header('THE TYPICAL ASK', 280, seg(t, T7 + .2, T7 + .6), { size: 90, plate: PAL.mustard });
  const rows = [['risk $25', '$61', V[7] + .3], ['risk $100', '$202', T7], ['risk $150', '$280', V[7] + 2.4]];
  rows.forEach(([a, b, t0], k) => { const y = 480 + k * 230, u = seg(t, t0, t0 + .3);
    tag(300, y, a, u, { size: 60, star: PAL.coral }); if (u > 0) ink(g, [[500, y], [600, y]], 10, { seed: 30 + k, taper: false });
    price(780, y, b, seg(t, t0 + .2, t0 + .5), k === 1 ? PAL.mustard : PAL.paper, .8); });
  person(540, 1410, .55, you(t, 'worried'));
}
function twice(t) {
  bg(PAL.mustardL, PAL.kraftL, 1420); header('LOSS ≈ 2 × GAIN', 300, seg(t, T8 + .3, T8 + .7), { size: 96, plate: PAL.coral });
  balance(540, 760, 0, (x, y) => weight(x, y, 'LOSS', PAL.coralD, 120),
    (x, y) => { weight(x - 60, y, 'GAIN', PAL.tealD, 130); if (t > V[8] + .4) weight(x + 60, y, 'GAIN', PAL.tealD, 140); });
  tag(540, 1250, '607 estimates: about 2', seg(t, V[8] + 2.6, V[8] + 2.9), { size: 54 });
}
finish((t) => {
  if (t < T1 + .5) hookScene(t, -.05);
  if (t >= T1 && t < T3 + .5) { if (t < T1 + .5) wipe(seg(t, T1, T1 + .5), PAL.mustard, () => deal(t)); else deal(t); }
  if (t >= T3 && t < T4 + .5) { if (t < T3 + .5) wipe(seg(t, T3, T3 + .5), PAL.teal, () => lab(t), -1); else lab(t); }
  if (t >= T4 && t < T7 + .5) { if (t < T4 + .5) wipe(seg(t, T4, T4 + .5), PAL.coral, () => bet(t)); else bet(t); }
  if (t >= T7 && t < T8 + .6) { if (t < T7 + .5) wipe(seg(t, T7, T7 + .5), PAL.mustard, () => ladder(t), -1); else ladder(t); }
  if (t >= T8 && t < T9 + .5) { if (t < T8 + .6) iris(seg(t, T8, T8 + .6), 540, 760, () => twice(t)); else twice(t); }
  if (t >= T9) { if (t < T9 + .5) iris(seg(t, T9, T9 + .5), 540, 760, () => hookScene(t, T9 + .3)); else hookScene(t, T9 + .3); }
});
