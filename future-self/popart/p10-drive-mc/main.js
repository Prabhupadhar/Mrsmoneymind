// P10 (cartoon split): "Same five dollars. Same drive. Different answer." Tversky & Kahneman (1981), Science 211: 453-458, problem 10 (p. 457):
// jacket ($125) + calculator ($15), calculator $10 at the other branch 20 minutes' drive away: 68% would make the trip (N = 93).
// Jacket [$15] + calculator [$125], $120 at the other branch: 29% (N = 88). Students at Stanford and UBC, classroom questionnaires (p. 453).
import { PAL, g, W, H, ev, boot, finish, bg, person, medallion, tag, header, script, wipe, iris, shape, ink, ellipse, rect, rrect, text, rays, sparkle, seg, eo, back, twos, clockFace, TAU } from '../_mc/mckit.js';
const V = await boot(34.4);
const T1 = V[1] - .2, T2 = V[2] - .2, T3 = V[3] - .2, T4 = V[4] - .2, T7 = V[7] - .2, T8 = V[8] - .2;
ev(0, 'stamp', { v: 1.2 }); ev(.6, 'ding');
[T1, T2, T3, T4, T7, T8].forEach(t => ev(t, 'pan'));
ev(V[1] + .3, 'stamp', { v: .9 }); ev(V[1] + 2.2, 'stamp', { v: .9 }); ev(V[2] + 1.2, 'note', { n: 5 });
ev(V[3] + .3, 'stamp', { v: 1.2 }); ev(V[3] + .6, 'ding');
ev(V[4] + .9, 'flip', { v: 1.2 }); ev(V[4] + 3.4, 'stamp', { v: 1 });
ev(V[6] - .15, 'turn'); ev(V[6] + .2, 'stamp', { v: 1.4 }); ev(V[6] + .5, 'ding');
ev(T8 + .4, 'stamp', { v: 1.2 });
const p = t => twos(t);
function jacket(x, y, s, seed = 1) {
  ink(g, [[x - 60 * s, y - 150 * s], [x, y - 190 * s], [x + 60 * s, y - 150 * s]], 8 * s, { seed: seed + 9, taper: false });
  shape(g, [[x - 70 * s, y - 150 * s], [x + 70 * s, y - 150 * s], [x + 130 * s, y - 90 * s], [x + 110 * s, y + 20 * s], [x + 80 * s, y], [x + 80 * s, y + 150 * s], [x - 80 * s, y + 150 * s], [x - 80 * s, y], [x - 110 * s, y + 20 * s], [x - 130 * s, y - 90 * s]], { fill: PAL.avocado, line: 5, seed });
  ink(g, [[x, y - 140 * s], [x, y + 150 * s]], 4, { seed: seed + 2, taper: false });
  for (let k = 0; k < 3; k++) shape(g, ellipse(x + 14 * s, y - 80 * s + k * 70 * s, 7 * s, 7 * s, 10), { fill: PAL.mustard, line: 2, seed: seed + 3 + k });
}
function calc(x, y, s, seed = 20) {
  shape(g, rrect(x - 70 * s, y - 105 * s, 140 * s, 210 * s, 14 * s), { fill: PAL.blue, line: 5, seed });
  shape(g, rect(x - 52 * s, y - 85 * s, 104 * s, 46 * s), { fill: PAL.tealL, line: 3, seed: seed + 1 });
  for (let j = 0; j < 3; j++) for (let i = 0; i < 3; i++) shape(g, rrect(x - 50 * s + i * 36 * s, y - 20 * s + j * 36 * s, 28 * s, 26 * s, 5 * s), { fill: PAL.paper, line: 2.5, seed: seed + 2 + i + j * 3 });
}
function car(x, y, s, seed = 40) {
  shape(g, rrect(x - 140 * s, y - 70 * s, 280 * s, 70 * s, 22 * s), { fill: PAL.coral, line: 5, seed });
  shape(g, [[x - 80 * s, y - 70 * s], [x - 50 * s, y - 125 * s], [x + 60 * s, y - 125 * s], [x + 95 * s, y - 70 * s]], { fill: PAL.coral, line: 5, seed: seed + 1 });
  shape(g, [[x - 62 * s, y - 75 * s], [x - 42 * s, y - 112 * s], [x + 50 * s, y - 112 * s], [x + 76 * s, y - 75 * s]], { fill: PAL.tealL, line: 3, seed: seed + 2 });
  for (const wx of [-85, 85]) { shape(g, ellipse(x + wx * s, y, 32 * s, 32 * s, 20), { fill: PAL.ink, line: 0, seed: seed + 3 }); shape(g, ellipse(x + wx * s, y, 12 * s, 12 * s, 12), { fill: PAL.paper, line: 0, seed: seed + 4 }); }
}
function price(x, y, str, pp, col = PAL.mustard, sz = 1) { if (pp <= 0) return; const k = back(seg(pp, 0, 1)); g.save(); g.translate(x, y); g.scale(k * sz, k * sz); g.rotate(-.08);
  shape(g, [[-170, -70], [120, -70], [170, 0], [120, 70], [-170, 70]], { fill: col, line: 6, seed: 40 }); shape(g, ellipse(128, 0, 11, 11, 12), { fill: PAL.paper, line: 3, seed: 41 });
  text(g, str, -24, 34, { font: '92px Slab', fill: PAL.ink, align: 'center' }); g.restore(); }
const you = (t, face = 'neutral', o = {}) => ({ dir: 1, coat: PAL.teal, coatD: PAL.tealD, face, blink: (p(t) % 2.9) < .1 ? 1 : 0, ...o });
// ---------- scenes ----------
function hookScene(t, t0) {
  shape(g, rect(0, 0, W / 2, H), { fill: PAL.tealL, line: 0, off: [0, 0] }); shape(g, rect(W / 2, 0, W / 2, H), { fill: PAL.coralL, line: 0, off: [0, 0] });
  shape(g, rect(0, 1420, W, 520), { fill: PAL.kraftL, line: 0, off: [0, 0] }); ink(g, [[W / 2, 470], [W / 2, 1420]], 8, { seed: 2, taper: false });
  header('SAME $5. SAME DRIVE.', 250, 1, { size: 92 });
  header('DIFFERENT ANSWER.', 380, 1, { size: 100, plate: PAL.mustard });
  const d = ((t - t0) * 260) % 700;
  car(130 + d * .45, 900, .7, 50); text(g, 'GO', 270, 700, { font: '120px Slab', fill: PAL.ink, align: 'center', plate: PAL.teal });
  car(810, 900, .7, 60); text(g, 'NAH', 810, 700, { font: '120px Slab', fill: PAL.ink, align: 'center', plate: PAL.coral });
  person(230, 1410, .62, you(t, 'happy')); person(850, 1410, .62, you(t, 'sad', { dir: -1, coat: PAL.mustard, coatD: PAL.mustardD }));
}
function store(t) {
  bg(PAL.mustardL, PAL.kraft, 1420); ink(g, [[100, 520], [980, 520]], 10, { seed: 5, taper: false, color: PAL.brown });
  const a = seg(t, V[1] + .2, V[1] + .5); if (a > 0) { g.save(); g.translate(300, 760); g.scale(back(a), back(a)); jacket(0, 0, 1.25); g.restore(); }
  price(300, 1080, '$125', seg(t, V[1] + .3, V[1] + .6), PAL.paper, .75);
  const b = seg(t, V[1] + 2.0, V[1] + 2.3); if (b > 0) { g.save(); g.translate(770, 780); g.scale(back(b), back(b)); calc(0, 0, 1.3); g.restore(); }
  price(780, 1080, '$15', seg(t, V[1] + 2.2, V[1] + 2.5), PAL.mustard, .75);
}
function clerk(t) {
  bg(PAL.blueL, PAL.kraftL, 1420);
  person(240, 1410, .85, you(t, 'neutral', { look: [6, 0] })); person(840, 1410, .85, { dir: -1, coat: PAL.coral, coatD: PAL.coralD, cap: PAL.mustard, face: 'happy', blink: (p(t) % 3.3) < .1 ? 1 : 0 });
  calc(540, 1000, .6);
  tag(540, 330, '$10 at our other store', seg(t, V[2] + 1.0, V[2] + 1.3), { size: 56 });
  clockFace(540, 620, 120, 20 * seg(t, V[2] + 2.6, V[2] + 4.2));
  tag(540, 800, '20 minutes away', seg(t, V[2] + 2.8, V[2] + 3.1), { size: 50, star: PAL.coral });
}
function drive(t, flipped) {
  bg(flipped ? PAL.coralL : PAL.tealL, PAL.kraft, 1420);
  shape(g, rect(-20, 1180, W + 40, 120), { fill: '#8C8C8C', line: 0, off: [0, 0] });
  for (let k = 0; k < 6; k++) shape(g, rect(k * 200 + 30, 1232, 100, 14), { fill: PAL.paper, line: 0, off: [0, 0] });
  const t0 = flipped ? V[6] : V[3], go = flipped ? 0 : eo(seg(t, t0 + .5, t0 + 2.2));
  car(260 + go * 560, 1220, .9, 70);
  medallion(540, 560, 190, flipped ? '29%' : '68%', seg(t, t0 + .2, t0 + .6), { size: 150, burst: flipped ? PAL.coral : PAL.mustard });
  tag(540, 860, flipped ? 'would drive' : 'would drive', seg(t, t0 + .7, t0 + 1.0), { size: 60 });
  person(flipped ? 840 : 140, 1410, .5, you(t, flipped ? 'sad' : 'happy', { dir: flipped ? -1 : 1 }));
}
function flip(t) {   // the second version: prices swap
  bg(PAL.coralL, PAL.kraft, 1420); header('NOW FLIP IT', 300, seg(t, T4 + .2, T4 + .6), { size: 100, plate: PAL.mustard });
  jacket(280, 720, .9); calc(790, 720, 1.0);
  const f = seg(t, V[4] + .8, V[4] + 1.1);
  price(280, 980, f < .5 ? '$125' : '$15', 1, PAL.paper, .65);
  price(790, 980, f < .5 ? '$15' : '$125', 1, PAL.mustard, .65);
  if (f > 0 && f < 1) sparkle(g, 790, 980, 60 * f, { fill: PAL.white });
  tag(790, 1170, 'across town: $120', seg(t, V[4] + 3.3, V[4] + 3.6), { size: 50, star: PAL.coral });
  if (t > V[5]) { tag(300, 1300, 'same $5', seg(t, V[5] + .1, V[5] + .4), { size: 56 }); tag(780, 1300, 'same drive', seg(t, V[5] + 1.0, V[5] + 1.3), { size: 56 }); }
}
function scale(t) {   // $5 against each price tag
  bg(PAL.mustardL, PAL.kraftL, 1420); header('$5 OF WHAT?', 300, seg(t, T7 + .2, T7 + .6), { size: 100, plate: PAL.teal });
  const bar = (y, total, lab, seed) => { const w = 900, x = 90, part = w * 5 / total, u = eo(seg(t, T7 + .4, T7 + 1.2));
    shape(g, rect(x, y, w * u, 90), { fill: PAL.paper, line: 5, seed }); if (u > .3) shape(g, rect(x, y, part * u, 90), { fill: PAL.coral, line: 5, seed: seed + 1 });
    text(g, lab, x, y - 24, { font: '600 54px Jost', fill: PAL.ink }); };
  bar(620, 15, '$5 off $15', 90); bar(900, 125, '$5 off $125', 95);
  tag(540, 1200, 'your 20 minutes: the same', seg(t, V[7] + 2.0, V[7] + 2.3), { size: 52 });
}
finish((t) => {
  if (t < T1 + .5) hookScene(t, -.05);
  if (t >= T1 && t < T2 + .5) { if (t < T1 + .5) wipe(seg(t, T1, T1 + .5), PAL.mustard, () => store(t)); else store(t); }
  if (t >= T2 && t < T3 + .5) { if (t < T2 + .5) wipe(seg(t, T2, T2 + .5), PAL.teal, () => clerk(t), -1); else clerk(t); }
  if (t >= T3 && t < T4 + .5) { if (t < T3 + .5) wipe(seg(t, T3, T3 + .5), PAL.coral, () => drive(t, false)); else drive(t, false); }
  if (t >= T4 && t < V[6] + .3) { if (t < T4 + .5) wipe(seg(t, T4, T4 + .5), PAL.mustard, () => flip(t), -1); else flip(t); }
  if (t >= V[6] - .2 && t < T7 + .5) { if (t < V[6] + .3) iris(seg(t, V[6] - .2, V[6] + .3), 540, 560, () => drive(t, true)); else drive(t, true); }
  if (t >= T7 && t < T8 + .5) { if (t < T7 + .5) wipe(seg(t, T7, T7 + .5), PAL.teal, () => scale(t)); else scale(t); }
  if (t >= T8) { if (t < T8 + .5) iris(seg(t, T8, T8 + .5), 540, 900, () => hookScene(t, T8 + .3)); else hookScene(t, T8 + .3); }
});
