// P04 (cartoon version): "Give someone a mug. Its price doubles." Kahneman, Knetsch & Thaler (1990), JPE, experiment 6:
// 77 Simon Fraser students; median value $7.12 for owners (sellers) vs $2.87 for buyers; mugs handed out minutes before.
import { PAL, g, W, H, ev, boot, finish, bg, person, medallion, tag, header, script, wipe, iris, shape, ink, ellipse, rect, rrect, text, star, rays, sparkle, seg, eo, eio, back, lerp, twos, TAU } from '../_mc/mckit.js';
const V = await boot(29.8);
const T1 = V[1] - .2, T2 = V[2] - .2, T3 = V[3] - .2, T5 = V[5] - .1, T6 = V[6], T7 = V[7] - .1, T8 = V[8] - .1, T9 = V[9] - .1;
ev(0, 'stamp', { v: 1.2 }); ev(1.0, 'flip', { v: 1.2 }); ev(1.1, 'ding');
[T1, T2, T3, T7, T8, T9].forEach(t => ev(t, 'pan'));
for (let k = 0; k < 3; k++) ev(T2 + 1.4 + k * .3, 'note', { n: 3 + k * 2 });
ev(T5 + .1, 'stamp', { v: 1 }); ev(T6, 'turn'); ev(T6 + .05, 'stamp', { v: 1.4 }); ev(T6 + .3, 'ding');
ev(T9 + .4, 'stamp', { v: 1.2 }); ev(T9 + 1.3, 'flip', { v: 1.2 });
const p = t => twos(t);
function mug(x, y, s, seed = 1) {
  ink(g, ellipse(x + 46 * s, y, 26 * s, 32 * s, 20, -Math.PI / 2, Math.PI / 2), 12 * s, { seed: seed + 3, taper: false });
  shape(g, [[x - 42 * s, y - 50 * s], [x + 42 * s, y - 50 * s], [x + 36 * s, y + 50 * s], [x - 36 * s, y + 50 * s]], { fill: PAL.coral, line: 4.5, seed });
  shape(g, rect(x - 40 * s, y - 14 * s, 78 * s, 18 * s), { fill: PAL.mustard, line: 0, seed: seed + 1 });
  for (let k = 0; k < 3; k++) ink(g, [[x - 18 * s + k * 18 * s, y - 64 * s], [x - 12 * s + k * 18 * s, y - 84 * s], [x - 20 * s + k * 18 * s, y - 104 * s]], 3.5, { seed: seed + 5 + k });
}
const hold = (s = 1) => (J) => mug(J.Hh[0] + 34, J.Hh[1] - 30, s, 7);
function price(x, y, str, pp, col = PAL.mustard, sz = 1) { if (pp <= 0) return; const k = back(seg(pp, 0, 1)); g.save(); g.translate(x, y); g.scale(k * sz, k * sz); g.rotate(-.08);
  shape(g, [[-150, -70], [100, -70], [150, 0], [100, 70], [-150, 70]], { fill: col, line: 6, seed: 40 }); shape(g, ellipse(108, 0, 11, 11, 12), { fill: PAL.paper, line: 3, seed: 41 });
  text(g, str, -20, 34, { font: '96px Slab', fill: PAL.ink, align: 'center' }); g.restore(); }
function bubble(x, y, str, pp) { if (pp <= 0) return; const k = back(seg(pp, 0, 1)); g.save(); g.translate(x, y); g.scale(k, k);
  shape(g, ellipse(0, 0, 150, 105, 40), { fill: PAL.white, line: 5, seed: 50 }); shape(g, ellipse(-80, 120, 24, 20, 16), { fill: PAL.white, line: 4, seed: 51 }); shape(g, ellipse(-110, 165, 13, 11, 12), { fill: PAL.white, line: 3.5, seed: 52 });
  text(g, str, 0, 30, { font: '90px Slab', fill: PAL.ink, align: 'center', plate: PAL.mustard }); g.restore(); }
const ownerPose = (t, face = 'happy') => ({ dir: -1, coat: PAL.teal, coatD: PAL.tealD, face, armF: { a1: .25, a2: -1.1 }, handF: 'grip', prop: hold(1.1), blink: (p(t) % 2.7) < .1 ? 1 : 0 });
const buyerPose = (t, face = 'neutral') => ({ dir: 1, coat: PAL.mustard, coatD: PAL.mustardD, face, blink: (p(t) % 3.1) < .1 ? 1 : 0 });
function hookScene(t, t0) {
  bg(PAL.coralL, PAL.kraftL, 1420); rays(g, 540, 820, 28, 1300, PAL.coral, { alpha: .25, rot: t * .05 });
  person(520, 1410, 1.25, ownerPose(t));
  const flip = seg(t, t0 + .95, t0 + 1.1);
  if (flip < .5) price(760, 560, '$3', seg(t, t0, t0 + .25) || (t0 < 0 ? 1 : 0), PAL.blueL);
  else price(760, 560, '$7', 1, PAL.mustard, 1.15);
  medallion(260, 470, 120, '×2', seg(t, t0 + 1.1, t0 + 1.4), { burst: PAL.mustard, size: 90 });
}
function split(t, leftFace, rightFace, mugOnRight = true) {
  shape(g, rect(0, 0, W / 2, H), { fill: PAL.blueL, line: 0, off: [0, 0] }); shape(g, rect(W / 2, 0, W / 2, H), { fill: PAL.tealL, line: 0, off: [0, 0] });
  shape(g, rect(0, 1420, W, 520), { fill: PAL.kraftL, line: 0, off: [0, 0] }); ink(g, [[W / 2, 0], [W / 2, 1420]], 8, { seed: 2, taper: false });
  text(g, 'BUYER', 270, 300, { font: '80px Slab', fill: PAL.ink, align: 'center', plate: PAL.blue });
  text(g, 'OWNER', 810, 300, { font: '80px Slab', fill: PAL.ink, align: 'center', plate: PAL.teal });
  person(250, 1410, 1.0, buyerPose(t, leftFace));
  person(840, 1410, 1.0, mugOnRight ? ownerPose(t, rightFace) : { ...ownerPose(t, rightFace), prop: null });
}
finish((t) => {
  if (t < T1 + .5) hookScene(t, -.05);
  // S1 same mug, two prices
  const s1 = () => { split(t, 'neutral', 'neutral'); header('SAME MUG', 470, seg(t, T1 + .3, T1 + .8), { size: 96 }); };
  if (t >= T1 && t < T2 + .5) { if (t < T1 + .5) wipe(seg(t, T1, T1 + .5), PAL.mustard, s1); else s1(); }
  // S2 a classroom: mugs land on every other desk
  const s2 = () => { bg(PAL.mustardL, PAL.kraft, 1380); script('a classroom', 420, seg(t, T2 + .2, T2 + .9));
    for (let k = 0; k < 4; k++) { const x = 170 + k * 250; person(x, 1250, .62, { dir: 1, coat: [PAL.teal, PAL.coral, PAL.blue, PAL.avocado][k], coatD: [PAL.tealD, PAL.coralD, PAL.blueD, PAL.avocadoD][k], face: k % 2 ? 'neutral' : (t > T2 + 1.6 + k * .15 ? 'happy' : 'neutral') });
      shape(g, rect(x - 110, 1130, 220, 40), { fill: PAL.brownL, line: 4, seed: 60 + k }); shape(g, rect(x - 95, 1170, 16, 210), { fill: PAL.brown, line: 3, seed: 70 + k }); shape(g, rect(x + 79, 1170, 16, 210), { fill: PAL.brown, line: 3, seed: 80 + k });
      if (k % 2 === 0) { const u = seg(t, T2 + 1.4 + k * .15, T2 + 1.7 + k * .15); if (u > 0) { g.save(); g.translate(x, 1080); g.scale(back(u), back(u)); mug(0, 0, .85, 90 + k); g.restore(); if (u < 1) sparkle(g, x + 60, 1000, 40 * u, { fill: PAL.white }); } } } };
  if (t >= T2 && t < T3 + .5) { if (t < T2 + .5) wipe(seg(t, T2, T2 + .5), PAL.teal, s2, -1); else s2(); }
  // S3-S5 the question, the two answers (split again)
  const s3 = () => { split(t, t > T5 ? 'neutral' : 'neutral', t > T6 ? 'happy' : 'neutral');
    if (t < V[4] + .1) bubble(830, 640, '$ ?', seg(t, T3 + .4, T3 + .7));
    if (t > V[4] - .1 && t < T5) bubble(300, 640, '$ ?', seg(t, V[4] - .1, V[4] + .2));
    price(270, 640, '$2.87', seg(t, T5 + .1, T5 + .35), PAL.blueL, .85);
    price(810, 640, '$7.12', seg(t, T6 + .05, T6 + .3), PAL.mustard, .95);
    if (t > T6 + .4) medallion(540, 1640, 110, '×2', seg(t, T6 + .4, T6 + .7), { size: 84 }); };
  if (t >= T3 && t < T7 + .6) { if (t < T3 + .5) wipe(seg(t, T3, T3 + .5), PAL.coral, s3); else s3(); }
  // S6 owned for minutes: iris into the owner hugging the mug, a small clock
  const s6 = () => { bg(PAL.tealL, PAL.kraftL, 1420); person(540, 1410, 1.3, ownerPose(t, 'happy'));
    const r = 110, x = 830, y = 560; shape(g, ellipse(x, y, r, r, 40), { fill: PAL.white, line: 6, seed: 20 });
    const a = -Math.PI / 2 + seg(t, T7 + .2, T7 + 2.2) * TAU * .25; ink(g, [[x, y], [x + Math.cos(a) * r * .75, y + Math.sin(a) * r * .75]], 8, { seed: 21, taper: false, color: PAL.coralD });
    tag(700, 380, 'a few minutes', seg(t, T7 + .6, T7 + .9), { size: 56 }); };
  if (t >= T7 && t < T8 + .5) { if (t < T7 + .6) iris(seg(t, T7, T7 + .6), 840, 700, s6); else s6(); }
  // S7 your old stuff: a box of old things, your tag towers over the buyer's
  const s7 = () => { bg(PAL.paperD, PAL.kraft, 1420); header('YOUR OLD STUFF', 380, seg(t, T8 + .2, T8 + .7), { size: 84 });
    shape(g, rect(330, 1180, 420, 240), { fill: PAL.kraft, line: 6, seed: 30 }); ink(g, [[330, 1250], [750, 1250]], 4, { seed: 31 });
    shape(g, [[380, 1180], [430, 1010], [480, 1180]], { fill: PAL.mustard, line: 4, seed: 32 }); mug(620, 1120, .9, 33);
    person(170, 1410, .95, buyerPose(t, 'neutral')); person(910, 1410, .95, { dir: -1, coat: PAL.coral, coatD: PAL.coralD, face: 'happy' });
    price(820, 700, '$$$', seg(t, T8 + 1.0, T8 + 1.3), PAL.mustard, 1); price(250, 760, '$', seg(t, T8 + 1.6, T8 + 1.9), PAL.blueL, .7); };
  if (t >= T8 && t < T9 + .5) { if (t < T8 + .5) wipe(seg(t, T8, T8 + .5), PAL.teal, s7, -1); else s7(); }
  // S8 the loop: back to the hook frame
  if (t >= T9) { if (t < T9 + .5) iris(seg(t, T9, T9 + .5), 540, 900, () => hookScene(t, T9 + .3)); else hookScene(t, T9 + .3); }
});
