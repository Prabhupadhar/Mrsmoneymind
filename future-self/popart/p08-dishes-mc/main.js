// P08 (cartoon split): "More good dishes. Lower price." Hsee (1998), J. Behavioral Decision Making 11: 107-121, Study 4 (pp. 116-117):
// 104 students; clearance sale, sets usually $30-$60. Set L: 24 pieces, all intact. Set H: the same 24 plus 8 cups (2 broken) and 8 saucers (7 broken) = 31 intact.
// Mean WTP, separate evaluation: L $32.69, H $23.25 (p < .001). Joint evaluation: H $32.03, L $29.70 (p < .05).
import { PAL, g, W, H, ev, boot, finish, bg, person, medallion, tag, header, script, wipe, iris, shape, ink, ellipse, rect, text, star, rays, sparkle, seg, eo, back, twos, TAU } from '../_mc/mckit.js';
const V = await boot(34.9);
const T1 = V[1] - .2, T2 = V[2] - .2, T7 = V[7] - .2, T8 = V[8] - .2, T9 = V[9] - .2;
const tBroke = V[3] + 3.3;
ev(0, 'stamp', { v: 1.2 }); ev(.6, 'ding');
[T1, T2, T7, T8, T9].forEach(t => ev(t, 'pan'));
ev(V[2] + .3, 'stamp', { v: .9 }); ev(V[3] + .2, 'stamp', { v: .9 });
for (let k = 0; k < 9; k++) ev(tBroke + k * .07, 'flip', { v: .5, pan: .5 });
ev(V[4] + .1, 'note', { n: 5 }); ev(V[5] + .3, 'stamp', { v: 1 });
ev(V[6] - .1, 'turn'); ev(V[6] + .3, 'stamp', { v: 1.4 }); ev(V[6] + .6, 'ding');
ev(V[7] + .6, 'stamp', { v: 1.2 }); ev(V[7] + 1.4, 'ding');
ev(T9 + .4, 'stamp', { v: 1.2 });
const p = t => twos(t);
// ---------- dishes ----------
function crack(x, y, r, seed) { ink(g, [[x - r * .2, y - r * .9], [x + r * .15, y - r * .3], [x - r * .15, y + r * .1], [x + r * .25, y + r * .8]], 4, { seed, taper: false, color: PAL.ink }); }
function plate(x, y, rx, seed, col = PAL.white) { shape(g, ellipse(x, y, rx, rx * .26, 28), { fill: col, line: 4, seed }); shape(g, ellipse(x, y - 2, rx * .6, rx * .14, 24), { fill: PAL.paper, line: 2.5, seed: seed + 1 }); }
function bowl(x, y, r, seed) { shape(g, [[x - r, y - r * .35], [x + r, y - r * .35], [x + r * .7, y + r * .35], [x - r * .7, y + r * .35]], { fill: PAL.blueL, line: 4, seed }); shape(g, ellipse(x, y - r * .35, r, r * .2, 24), { fill: PAL.white, line: 3, seed: seed + 1 }); }
function cup(x, y, r, broken, seed) {
  ink(g, ellipse(x + r * .9, y, r * .35, r * .4, 14, -Math.PI / 2, Math.PI / 2), 6, { seed: seed + 3, taper: false });
  shape(g, [[x - r * .8, y - r * .7], [x + r * .8, y - r * .7], [x + r * .6, y + r * .7], [x - r * .6, y + r * .7]], { fill: PAL.coral, line: 4, seed });
  if (broken) { shape(g, [[x + r * .2, y - r * .72], [x + r * .8, y - r * .72], [x + r * .5, y - r * .1]], { fill: PAL.paper, line: 3, seed: seed + 2 }); crack(x - r * .1, y, r * .6, seed + 4); }
}
function saucer(x, y, r, broken, seed) {
  shape(g, ellipse(x, y, r, r * .3, 20), { fill: PAL.mustard, line: 4, seed });
  if (broken) { shape(g, [[x + r * .3, y - r * .3], [x + r, y], [x + r * .5, y + r * .05]], { fill: PAL.paper, line: 3, seed: seed + 2 }); ink(g, [[x - r * .5, y - r * .2], [x - r * .1, y + r * .05], [x + r * .2, y - r * .1]], 4, { seed: seed + 4, taper: false }); }
}
// the 24 good pieces: 8 dinner plates, 8 bowls, 8 dessert plates (drawn as three stacks)
function core24(x, y, s, seed) {
  for (let k = 0; k < 6; k++) plate(x - 125 * s, y - k * 13 * s, 78 * s, seed + k);
  for (let k = 0; k < 4; k++) bowl(x, y - k * 22 * s, 52 * s, seed + 10 + k);
  for (let k = 0; k < 6; k++) plate(x + 120 * s, y - k * 12 * s, 56 * s, seed + 20 + k, PAL.tealL);
}
// set H: the same 24 + 8 cups (2 broken) + 8 saucers (7 broken), in two rows in front
function set40(x, y, s, broke, seed) {
  core24(x, y - 120 * s, s, seed);
  for (let k = 0; k < 8; k++) saucer(x - 175 * s + k * 50 * s, y + 70 * s, 24 * s, broke && k !== 3, seed + 40 + k);
  for (let k = 0; k < 8; k++) cup(x - 175 * s + k * 50 * s, y - 10 * s, 20 * s, broke && (k === 1 || k === 6), seed + 60 + k);
}
function set24(x, y, s, seed) { core24(x, y - 120 * s, s, seed); }
function price(x, y, str, pp, col = PAL.mustard, sz = 1) { if (pp <= 0) return; const k = back(seg(pp, 0, 1)); g.save(); g.translate(x, y); g.scale(k * sz, k * sz); g.rotate(-.08);
  shape(g, [[-170, -70], [120, -70], [170, 0], [120, 70], [-170, 70]], { fill: col, line: 6, seed: 40 }); shape(g, ellipse(128, 0, 11, 11, 12), { fill: PAL.paper, line: 3, seed: 41 });
  text(g, str, -24, 34, { font: '92px Slab', fill: PAL.ink, align: 'center' }); g.restore(); }
function bubble(x, y, str, pp) { if (pp <= 0) return; const k = back(seg(pp, 0, 1)); g.save(); g.translate(x, y); g.scale(k, k);
  shape(g, ellipse(0, 0, 140, 95, 40), { fill: PAL.white, line: 5, seed: 50 }); shape(g, ellipse(-70, 110, 22, 18, 16), { fill: PAL.white, line: 4, seed: 51 });
  text(g, str, 0, 28, { font: '84px Slab', fill: PAL.ink, align: 'center', plate: PAL.mustard }); g.restore(); }
const shopper = (t, face = 'neutral', dir = 1, coat = PAL.teal, coatD = PAL.tealD) => ({ dir, coat, coatD, face, blink: (p(t) % 2.9) < .1 ? 1 : 0 });
// ---------- scenes ----------
function hookScene(t, t0) {
  bg(PAL.coralL, PAL.kraftL, 1420); rays(g, 540, 1000, 28, 1300, PAL.coral, { alpha: .22, rot: t * .05 });
  header('MORE GOOD DISHES.', 260, 1, { size: 96 });
  header('LOWER PRICE.', 390, 1, { size: 110, plate: PAL.mustard });
  shape(g, rect(20, 900, 1040, 34), { fill: PAL.brownL, line: 5, seed: 80 });
  const s = 1 + .03 * Math.sin(t * 3);
  set40(280, 810, 1.15 * s, true, 100); set24(810, 810, 1.15, 200);
  price(270, 470, '$', seg(t, t0 + .2, t0 + .45) || (t0 < 0 ? 1 : 0), PAL.blueL, .75);
  price(810, 470, '$$$', seg(t, t0 + .35, t0 + .6) || (t0 < 0 ? 1 : 0), PAL.mustard, .85);
  person(540, 1410, .72, shopper(t, 'wow'));
}
function split(t) {
  shape(g, rect(0, 0, W / 2, H), { fill: PAL.tealL, line: 0, off: [0, 0] }); shape(g, rect(W / 2, 0, W / 2, H), { fill: PAL.blueL, line: 0, off: [0, 0] });
  shape(g, rect(0, 1420, W, 520), { fill: PAL.kraftL, line: 0, off: [0, 0] }); ink(g, [[W / 2, 0], [W / 2, 1420]], 8, { seed: 2, taper: false });
  text(g, '24 PIECES', 270, 290, { font: '72px Slab', fill: PAL.ink, align: 'center', plate: PAL.teal });
  text(g, '40 PIECES', 810, 290, { font: '72px Slab', fill: PAL.ink, align: 'center', plate: PAL.coral });
  shape(g, rect(15, 900, 510, 28), { fill: PAL.brownL, line: 4, seed: 81 }); shape(g, rect(555, 900, 510, 28), { fill: PAL.brownL, line: 4, seed: 82 });
  const a = seg(t, V[2] + .2, V[2] + .55); if (a > 0) { g.save(); g.translate(270, 810); g.scale(back(a), back(a)); set24(0, 0, 1.0, 300); g.restore(); }
  const b = seg(t, V[3] + .1, V[3] + .45); if (b > 0) { g.save(); g.translate(810, 810); g.scale(back(b), back(b)); set40(0, 0, 1.0, t > tBroke, 400); g.restore(); }
  if (t > V[2] + .8) tag(270, 400, 'all perfect', seg(t, V[2] + .8, V[2] + 1.1), { size: 46 });
  if (t > tBroke + .3) tag(810, 400, '9 broken', seg(t, tBroke + .3, tBroke + .6), { size: 46, star: PAL.coralD });
  const lf = t > V[5] + .3 ? 'happy' : 'neutral', rf = t > V[6] + .3 ? 'sad' : (t > tBroke ? 'worried' : 'neutral');
  person(230, 1410, .7, shopper(t, lf, 1, PAL.mustard, PAL.mustardD)); person(850, 1410, .7, shopper(t, rf, -1, PAL.coral, PAL.coralD));
  if (t > V[4] - .1 && t < V[5] + .3) { bubble(270, 540, '$ ?', seg(t, V[4], V[4] + .3)); bubble(810, 540, '$ ?', seg(t, V[4] + .15, V[4] + .45)); }
  price(270, 530, '$32.69', seg(t, V[5] + .3, V[5] + .55), PAL.mustard, .82);
  price(810, 530, '$23.25', seg(t, V[6] + .3, V[6] + .55), PAL.blueL, .82);
  if (t > V[6] + .8) medallion(540, 1250, 95, 'ALONE', seg(t, V[6] + .8, V[6] + 1.1), { size: 46 });
}
function sideBySide(t) {
  bg(PAL.mustardL, PAL.kraft, 1420); header('SIDE BY SIDE', 300, seg(t, T7 + .2, T7 + .6), { size: 100, plate: PAL.teal });
  shape(g, rect(20, 900, 1040, 32), { fill: PAL.brownL, line: 5, seed: 83 });
  set40(280, 810, 1.05, true, 500); set24(810, 810, 1.05, 600);
  price(280, 530, '$32.03', seg(t, V[7] + .5, V[7] + .8), PAL.mustard, .8);
  price(810, 530, '$29.70', seg(t, V[7] + .8, V[7] + 1.1), PAL.blueL, .8);
  medallion(190, 1150, 90, 'WINS', seg(t, V[7] + 1.3, V[7] + 1.6), { size: 42 });
  person(540, 1410, .72, { ...shopper(t, 'happy'), look: [Math.sin(t * 2) * 6, 0] });
}
function eyeScene(t) {
  bg(PAL.tealL, null); const r = 330, x = 540, y = 860;
  shape(g, ellipse(x, y, r, r, 60), { fill: PAL.paper, line: 10, seed: 90 });
  ink(g, [[x + r * .7, y + r * .7], [x + r * 1.15, y + r * 1.15]], 46, { seed: 91, taper: false });
  g.save(); g.translate(x, y); g.scale(2.4, 2.4); saucer(-40, 30, 70, true, 92); cup(55, -40, 50, true, 93); g.restore();
  tag(540, 380, 'easy to see: broken', seg(t, T8 + .5, T8 + .8), { size: 54, star: PAL.coralD });
  tag(540, 1330, 'easy to miss: 31 good', seg(t, V[8] + 1.6, V[8] + 1.9), { size: 54, star: PAL.teal });
}
finish((t) => {
  if (t < T1 + .5) hookScene(t, -.05);
  const s1 = () => { bg(PAL.mustardL, PAL.kraft, 1420); script('clearance sale', 420, seg(t, T1 + .2, T1 + .9));
    tag(540, 620, 'usually $30 - $60 a set', seg(t, V[1] + 1.4, V[1] + 1.7), { size: 54 });
    medallion(840, 1150, 110, 'SALE', seg(t, T1 + .5, T1 + .8), { size: 56 });
    shape(g, rect(80, 930, 600, 30), { fill: PAL.brownL, line: 5, seed: 84 }); core24(380, 900, 1.0, 700);
    person(230, 1410, .7, shopper(t, 'happy')); };
  if (t >= T1 && t < T2 + .5) { if (t < T1 + .5) wipe(seg(t, T1, T1 + .5), PAL.mustard, s1); else s1(); }
  if (t >= T2 && t < T7 + .5) { if (t < T2 + .5) wipe(seg(t, T2, T2 + .5), PAL.teal, () => split(t), -1); else split(t); }
  if (t >= T7 && t < T8 + .6) { if (t < T7 + .5) wipe(seg(t, T7, T7 + .5), PAL.coral, () => sideBySide(t)); else sideBySide(t); }
  if (t >= T8 && t < T9 + .5) { if (t < T8 + .6) iris(seg(t, T8, T8 + .6), 540, 860, () => eyeScene(t)); else eyeScene(t); }
  if (t >= T9) { if (t < T9 + .5) iris(seg(t, T9, T9 + .5), 540, 900, () => hookScene(t, T9 + .3)); else hookScene(t, T9 + .3); }
});
