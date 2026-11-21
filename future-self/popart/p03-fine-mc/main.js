// P03 (cartoon version): "They fined late parents. Lateness got worse." Gneezy & Rustichini (2000), J. Legal Studies.
// 10 private day-care centres, Haifa, 1998; NIS 10 fine for 10+ min late in 6 centres. Test-group average late pickups
// per centre per week (Table 2): weeks 1-4 = 8.0, weeks 5-16 = 16.4, weeks 17-20 (fine removed) = 18.7.
import { PAL, g, W, H, ev, boot, finish, bg, person, drawOwner, medallion, tag, header, script, wipe, iris, clockFace, shape, ink, ellipse, rect, rrect, text, star, rays, sparkle, seg, eo, eio, back, lerp, clamp, twos, TAU } from '../_mc/mckit.js';
const V = await boot(28.6);
const T1 = V[1] - .2, T3 = V[3] - .15, T4 = V[4] - .1, T5 = V[5] - .1, T6 = V[6], T7 = V[7] - .1, T8 = V[8] - .1, T9 = V[9] - .1, TEND = 26.9;
ev(0, 'stamp', { v: 1.2 }); ev(.5, 'stamp', { v: 1.3 }); ev(1.7, 'pan');
[T1, T3, T5, T8].forEach(t => ev(t, 'pan'));
for (let k = 0; k < 6; k++) ev(T3 + 1.3 + k * .18, 'stamp', { v: .8, pan: -.5 + k * .2 });
ev(T4 + .2, 'stamp', { v: 1.3 }); ev(T5 + .4, 'note', { n: 2 }); ev(T5 + 1.2, 'note', { n: 7 });
ev(T6, 'turn'); ev(T6 + .1, 'flip', { v: 1.2 }); ev(T7 + .3, 'note', { n: 8 });
ev(T8 + .6, 'flip', { v: 1.2 }); ev(T9 + .9, 'ding'); ev(TEND, 'pan');
const tt = t => twos(t);   // poses on twos
function house(x, y, s, col) {
  shape(g, [[x - 80 * s, y - 60 * s], [x, y - 140 * s], [x + 80 * s, y - 60 * s]], { fill: PAL.coral, line: 4, seed: x | 0 });
  shape(g, rect(x - 64 * s, y - 62 * s, 128 * s, 110 * s), { fill: col, line: 4, seed: (x | 0) + 1 });
  shape(g, rect(x - 18 * s, y - 2 * s, 36 * s, 50 * s), { fill: PAL.brown, line: 3, seed: (x | 0) + 2 });
}
function coin(x, y, r, p) { if (p <= 0) return; const k = back(seg(p, 0, 1)); g.save(); g.translate(x, y); g.scale(k, k);
  shape(g, ellipse(0, 0, r, r, 32), { fill: PAL.mustard, line: 5, seed: 70 }); text(g, '₪10', 0, r * .3, { font: `${r * .8}px Slab`, fill: PAL.ink, align: 'center' }); g.restore(); }
function bars(t, show3) {   // the manual-style chart
  const base = 1240, x0 = 170, bw = 210, gap = 60, k = 38;   // px per late pickup
  shape(g, rrect(90, 380, 900, 1020, 30), { fill: PAL.white, line: 5, seed: 80, grain: .2 });
  const B = [['BEFORE', 8.0, PAL.blue, T5 + .2], ['FINE', 16.4, PAL.coral, T5 + .9], ['NO FINE', 18.7, PAL.coral, T7 + .2]];
  B.forEach(([lab, v, col, t0], i) => { if (i === 2 && !show3) return; const h = v * k * eo(seg(t, t0, t0 + .6)); const x = x0 + i * (bw + gap);
    if (h > 2) shape(g, rect(x, base - h, bw, h), { fill: col, line: 5, seed: 81 + i, grain: .35 });
    text(g, lab, x + bw / 2, base + 70, { font: '600 50px Jost', fill: PAL.ink, align: 'center' }); });
  ink(g, [[120, base], [960, base]], 7, { seed: 90 });
  text(g, 'late pickups a week', W / 2, 460, { font: '500 46px Jost', fill: PAL.inkSoft, align: 'center' });
}
function room(t, clockMin) {
  bg(PAL.tealL, PAL.kraft, 1380);
  shape(g, rect(80, 420, 300, 960), { fill: PAL.tealD, line: 5, seed: 3 });   // the door
  shape(g, ellipse(330, 920, 14, 14, 12), { fill: PAL.mustard, line: 3, seed: 4 });
  clockFace(720, 600, 170, clockMin);
  text(g, 'CLOSES 4:00', 720, 360, { font: '70px Slab', fill: PAL.ink, align: 'center', plate: PAL.coral });
}
finish((t) => {
  const p = tt(t);
  // S0 hook: a parent runs in late; the fine is stamped
  if (t < T1 + .5) {
    bg(PAL.coralL, PAL.kraftL, 1420);
    clockFace(540, 560, 190, 18 + 4 * seg(t, 0, 2.8));
    const x = lerp(1000, 640, eo(seg(t, -.2, 1.4)));
    person(x, 1410, 1.15, { dir: -1, coat: PAL.teal, coatD: PAL.tealD, face: 'worried', step: Math.sin(p * 18) * (t < 1.4 ? 1 : 0), armF: { a1: .6 + Math.sin(p * 18) * .5, a2: .2 }, armB: { a1: 2.4 - Math.sin(p * 18) * .5, a2: 2.6 }, cap: null });
    medallion(250, 950, 150, 'FINE', seg(t, .45, .8), { burst: PAL.mustard });
    if (t > 1.6) { const u = seg(t, 1.6, 2.3); ink(g, [[880, 1120], [880, 1120 - 380 * eo(u)]], 22, { seed: 5, taper: false, color: PAL.coralD }); if (u > .8) shape(g, [[820, 750], [940, 750], [880, 660]], { fill: PAL.coralD, line: 4, seed: 6 }); }
  }
  // S1/S2 the daycare at four
  const roomScene = () => { const min = t < V[2] ? 0 : 25 * eo(seg(t, V[2], V[2] + 2.8));
    room(t, min);
    drawOwner(g, { x: 470, y: 1400, s: 1.2, dir: 1, view: 'q', face: t > V[2] + 1 ? 'focus' : 'happy', armF: t > V[2] + .6 ? { a1: -.4, a2: -2.2 } : undefined, handF: 'open', blink: (p % 3.1) < .12 ? 1 : 0 }, t);
    person(790, 1400, 1.0, { kid: true, dir: -1, coat: PAL.mustard, coatD: PAL.mustardD, face: t > V[2] + 1.2 ? 'sad' : 'happy' });
    if (t > V[2] + 1.5) tag(720, 830, '4:25', seg(t, V[2] + 1.5, V[2] + 1.8), { star: PAL.coral }); };
  if (t >= T1 - .1 && t < T3 + .8) { if (t < T1 + .5) wipe(seg(t, T1, T1 + .5), PAL.mustard, roomScene); else roomScene(); }
  // S3 ten daycares, six fined
  const tenScene = () => { bg(PAL.mustardL, null);
    script('Haifa, 1998', 400, seg(t, T3 + .2, T3 + .9));
    header('10 DAYCARES', 560, seg(t, T3 + .3, T3 + .8), { size: 110 });
    for (let k = 0; k < 10; k++) { const c = k % 2, r = Math.floor(k / 2), x = 300 + c * 480, y = 820 + r * 190;
      house(x, y, .95, PAL.white); if (k < 6) medallion(x + 120, y - 60, 48, '₪', seg(t, T3 + 1.3 + k * .18, T3 + 1.55 + k * .18), { size: 46, burst: PAL.coral }); } };
  if (t >= T3 && t < T4 + .6) { if (t < T3 + .5) wipe(seg(t, T3, T3 + .5), PAL.coral, tenScene, -1); else tenScene(); }
  // S4 the rule: 4:10 = a fine
  const ruleScene = () => { bg(PAL.blueL, null); shape(g, ellipse(540, 860, 430, 430, 64), { fill: PAL.white, line: 7, seed: 20 });
    clockFace(540, 820, 260, 10 * eo(seg(t, T4 + .1, T4 + .6)));
    coin(800, 1110, 110, seg(t, T4 + .2, T4 + .5)); header('10 MIN LATE', 360, seg(t, T4, T4 + .4), { size: 100 }); };
  if (t >= T4 && t < T5 + .5) { if (t < T4 + .6) iris(seg(t, T4, T4 + .6), 420, 1270, ruleScene); else ruleScene(); }
  // S5-S7 the chart: up, fine removed, stays up
  const chartScene = () => { bg(PAL.paperD, null); bars(t, t > T7);
    if (t > T5 + 1.4 && t < T6) tag(540, 270, 'almost ×2', seg(t, T5 + 1.4, T5 + 1.7), { size: 70 });
    if (t > T6 && t < T7) { medallion(860, 250, 110, 'FINE', 1); const u = seg(t, T6 + .15, T6 + .5); ink(g, [[740, 130], [740 + 240 * u, 130 + 240 * u]], 26, { seed: 91, color: PAL.coralD, taper: false }); ink(g, [[980, 130], [980 - 240 * u, 130 + 240 * u]], 26, { seed: 92, color: PAL.coralD, taper: false }); }
    if (t > T7 + .8) tag(540, 270, 'still late', seg(t, T7 + .8, T7 + 1.1), { size: 70, star: PAL.teal }); };
  if (t >= T5 && t < T8 + .6) { if (t < T5 + .5) wipe(seg(t, T5, T5 + .5), PAL.teal, chartScene); else chartScene(); }
  // S8 a favour becomes a price (split frame, the right block flips)
  const splitScene = () => { const f = seg(t, T8 + .5, T8 + .9);
    shape(g, rect(0, 0, W / 2, H), { fill: PAL.tealL, line: 0, off: [0, 0] }); shape(g, rect(W / 2, 0, W / 2, H), { fill: f > .5 ? PAL.coralL : PAL.tealL, line: 0, off: [0, 0] });
    ink(g, [[W / 2, 0], [W / 2, H]], 8, { seed: 2, taper: false });
    text(g, 'FAVOR', 270, 430, { font: '86px Slab', fill: PAL.ink, align: 'center', plate: PAL.teal });
    text(g, f > .5 ? 'PRICE' : 'FAVOR', 810, 430, { font: '86px Slab', fill: PAL.ink, align: 'center', plate: f > .5 ? PAL.coral : PAL.teal });
    const heart = (x, y, s) => shape(g, [[x, y + 60 * s], [x - 70 * s, y - 10 * s], [x - 40 * s, y - 60 * s], [x, y - 30 * s], [x + 40 * s, y - 60 * s], [x + 70 * s, y - 10 * s]], { fill: PAL.coral, line: 5, seed: 33 });
    heart(270, 800, 1.6); if (f < .5) { g.save(); g.translate(810, 800); g.scale(Math.max(.05, 1 - f * 2), 1); heart(0, 0, 1.6); g.restore(); }
    else { g.save(); g.translate(810, 800); g.scale(Math.max(.05, (f - .5) * 2), 1); shape(g, [[-150, -90], [110, -90], [170, 0], [110, 90], [-150, 90]], { fill: PAL.mustard, line: 6, seed: 34 }); text(g, '₪10', -20, 30, { font: '96px Slab', fill: PAL.ink, align: 'center' }); g.restore(); } };
  if (t >= T8 && t < T9 + .6) { if (t < T8 + .5) wipe(seg(t, T8, T8 + .5), PAL.mustard, splitScene, -1); else splitScene(); }
  // S9 the parent pays, guilt gone; iris out onto the clock (the loop)
  const payScene = () => { room(t, 30);
    drawOwner(g, { x: 430, y: 1400, s: 1.2, dir: 1, view: 'q', face: 'neutral', armF: { a1: .1, a2: .1 }, handF: 'open' }, t);
    person(820, 1400, 1.15, { dir: -1, coat: PAL.teal, coatD: PAL.tealD, face: t > T9 + .9 ? 'happy' : 'neutral', armF: { a1: .15, a2: .05 }, handF: 'grip' });
    coin(640, 960, 50, seg(t, T9 + .5, T9 + .8)); if (t > T9 + .9) sparkle(g, 700, 760, 50, { fill: PAL.white }); };
  if (t >= T9 && t < TEND + .7) { if (t < T9 + .5) wipe(seg(t, T9, T9 + .5), PAL.teal, payScene); else payScene(); }
  if (t >= TEND) iris(seg(t, TEND, TEND + .7), 720, 600, () => { bg(PAL.coralL, PAL.kraftL, 1420); clockFace(540, 560, 190, 18); medallion(250, 950, 150, 'FINE', 1); });
});
