// P07 (Pop Art wall): "Lottery winners aren't happier. They're more satisfied."
// Brickman, Coates & Janoff-Bulman (1978), JPSP 36: 917-927: 22 major Illinois State Lottery winners vs 22 controls; winners "were not in general happier".
// Lindqvist, Ostling & Cesarini (2020), REStud 87: 2703-2726: 3,362 Swedish lottery players surveyed 5-22 years after the win; $100K raises
// overall life satisfaction 0.037 SD (p = .009), happiness 0.016 SD (n.s.), mental health n.s.; effect still there 11+ years later;
// financial satisfaction accounts for 73% of the life-satisfaction effect.
import { pop, T, rectPts, ellipsePts, clamp, lerp, seg, eo, h2, ev, boot, stampRings, tileOpen, disc, darken, sunburst, wall, label, headline, camAt, finish, TS } from '../_kit/popkit.js';
const V = await boot(34.6);
const tBlock = V[1] - .1, tSwe = V[3] + 2.6, tHap = V[4] - .1, tSat = V[6] - .1, tMoney = V[7] - .1, tEnd = V[8] - .1;
const ST = stampRings(tSwe, 1.6, 7, 11);
// the 1978 block: 4 x 6 tiles minus two corners = 22 winners
const IN22 = (i, j) => i >= 0 && i < 4 && j >= 0 && j < 6 && !((i === 3 && j === 5) || (i === 0 && j === 5));
ev(0, 'stamp', { v: 1.3 }); ev(.6, 'ding');
for (let k = 0; k < 22; k++) ev(tBlock + .1 + k * .06, 'stamp', { v: .45, pan: -.4 + (k % 4) * .25 });
ev(V[2] - .1, 'pan'); ev(V[3] - .1, 'pan');
ev(tHap, 'pan'); ev(tSat - .2, 'turn');
for (let k = 0; k < 12; k++) ev(tSat + .1 + k * .1, 'flip', { v: .5, pan: -.6 + k * .1 });
ev(tSat + 1.4, 'ding'); ev(tMoney, 'pan'); ev(tMoney + .4, 'stamp', { v: 1.2 }); ev(tEnd, 'pan'); ev(tEnd + .5, 'stamp', { v: 1.3 });
function ticket(mis, txt = 'WIN', fill = T.red) {
  const R = 46, w = 220, h = 130;
  const sh = [[-w, -h], [w, -h]].concat(ellipsePts(w, 0, R, R, 16, -Math.PI / 2, -Math.PI * 1.5).reverse(), [[w, h], [-w, h]], ellipsePts(-w, 0, R, R, 16, Math.PI / 2, -Math.PI / 2));
  pop.save(); pop.translate(mis[0], mis[1]); pop.fill(sh, fill); pop.fill(rectPts(-w + 70, -h + 30, 2 * w - 140, 2 * h - 60), T.white); pop.restore();
  pop.outline(sh, 9, { closed: true });
  pop.text(txt, 0, 4, { size: 110, font: 'Anton', fill }); pop.text(txt, 0, 4, { size: 110, font: 'Anton', outline: 5, spot: 'rgba(0,0,0,0)' });
}
function coinStack(mis) {   // the money: a stack of coins with a $ on top
  pop.save(); pop.translate(mis[0], mis[1]);
  for (let k = 0; k < 5; k++) pop.fill(ellipsePts(0, 140 - k * 50, 190, 55, 40), { y: 1, b: .6 });
  pop.restore();
  for (let k = 0; k < 5; k++) pop.outline(ellipsePts(0, 140 - k * 50, 190, 55, 40), 7, { closed: true });
  pop.text('$', 0, -100, { size: 150, font: 'Anton', fill: T.red }); pop.text('$', 0, -100, { size: 150, font: 'Anton', outline: 5, spot: 'rgba(0,0,0,0)' });
}
function tile(i, j, t) {
  const home = i === 0 && j === 0, key = i + ',' + j;
  if (t < tBlock || t > tEnd) {   // hook and loop: one winning ticket on a sunburst
    if (!home) return; const t0 = t > tEnd ? tEnd : -.05;
    const mis = tileOpen(0, 0, T.blue, Math.max(.45, seg(t, t0, t0 + .14))); sunburst(t, T.yellow); disc(mis); ticket(mis); pop.restore(); return;
  }
  if (t < tSwe) {   // 1978: a block of 22 winners; the controls next door are the same colour (no happier)
    if (IN22(i, j)) { const ap = seg(t, tBlock + .1 + (j * 4 + i) * .06, tBlock + .24 + (j * 4 + i) * .06); if (ap <= 0) return;
      const mis = tileOpen(i, j, T.blue, ap); disc(mis); ticket(mis); pop.restore(); return; }
    if (t > V[2] && i >= 4 && i < 8 && j >= 0 && j < 6) { const ap = seg(t, V[2] + .1 + ((j * 4 + i - 4) % 22) * .04, V[2] + .25 + ((j * 4 + i - 4) % 22) * .04); if (ap <= 0) return;
      const mis = tileOpen(i, j, T.blue, ap); disc(mis); pop.fill(ellipsePts(mis[0], mis[1] - 60, 90, 90, 32), T.white); pop.outline(ellipsePts(0, -60, 90, 90, 32), 8, { closed: true });
      pop.outline([[-130, 200], [-120, 60], [120, 60], [130, 200]], 8); pop.restore(); return; }
    return;
  }
  // Sweden: a wall of thousands of tickets
  const s = ST.get(key) ?? (Math.abs(i) <= 7 && Math.abs(j) <= 11 ? 99 : 99); const ap = home ? 1 : seg(t, s, s + .14);
  if (ap <= 0 && !(t > tSat)) return;
  if (t < tSat) { const mis = tileOpen(i, j, T.blue, Math.max(ap, .01)); disc(mis); ticket(mis); if (t > tHap) darken(.25 * seg(t, tHap, tHap + .6)); pop.restore(); return; }
  // life satisfaction: tiles flip yellow from the centre out and stay
  const fa = tSat + .1 + Math.hypot(i, j) * .12, fp = seg(t, fa, fa + .3);
  const mis = tileOpen(i, j, fp >= .5 ? T.yellow : T.blue, 1, fp);
  if (fp >= .5 && (i + j) % 3 === 0) sunburst(t, T.orange);
  disc(mis);
  if (t > tMoney && home) coinStack(mis); else ticket(mis, 'WIN', fp >= .5 ? T.red : T.red);
  pop.restore();
}
const CAM = [[0, 0, 0, 1.75], [tBlock - .1, 0, 0, 1.5], [tBlock + .9, TS * 1.5, TS * 2.5, .42], [V[2], TS * 1.5, TS * 2.5, .42], [V[2] + .8, TS * 3.5, TS * 2.5, .3],
  [tSwe - .2, TS * 3.5, TS * 2.5, .3], [tSwe, 0, 0, 1.4], [tSwe + 1.6, 0, 0, .14], [tSat, 0, 0, .14], [tSat + 2.4, 0, 0, .2], [tMoney, 0, 0, .2], [tMoney + .6, 0, 0, 1.4], [tEnd, 0, 0, 1.4], [tEnd + .4, 0, 0, 1.7], [34.6, 0, 0, 1.75]];
finish((t) => {
  const cam = camAt(CAM, t); pop.begin(cam);
  wall(cam, (i, j) => tile(i, j, t));
  const hook = t < tBlock || t > tEnd + .3, hp = t < tBlock ? 1 : seg(t, tEnd + .3, tEnd + .8);
  if (hook) { headline('LOTTERY WINNERS', 540, 300, 118, hp, T.white, T.blue); headline("AREN'T HAPPIER.", 540, 440, 118, hp, T.yellow, T.red); headline("THEY'RE MORE SATISFIED.", 540, 1420, 84, hp, T.yellow, T.red); }
  label('ILLINOIS, 1978', seg(t, tBlock + .3, V[2]));
  headline('22 WINNERS', 540, 1400, 150, t > tBlock + 1.5 && t < tSwe - .2 ? seg(t, tBlock + 1.5, tBlock + 2) : 0, T.yellow, T.red);
  label('SAME AREA', seg(t, V[2] + .2, V[3]), T.blue);
  label('SWEDEN', seg(t, tSwe - .3, tHap));
  headline('3,362 PLAYERS', 540, 1300, 130, t > tSwe + .6 && t < tHap ? seg(t, tSwe + .6, tSwe + 1.1) : 0, T.yellow, T.red);
  headline('5-22 YEARS LATER', 540, 1440, 90, t > tSwe + 2.4 && t < tHap ? seg(t, tSwe + 2.4, tSwe + 2.9) : 0, T.white, T.blue);
  label('HAPPINESS', seg(t, tHap, tSat - .1), T.blue);
  headline('NO CLEAR CHANGE', 540, 1380, 110, t > tHap + .6 && t < tSat - .2 ? seg(t, tHap + .6, tHap + 1.1) : 0, T.white, T.blue);
  label('SATISFACTION', seg(t, V[5] - .1, tMoney));
  headline('HIGHER', 540, 1380, 220, t > tSat + 1.2 && t < tMoney ? seg(t, tSat + 1.2, tSat + 1.7) : 0, T.yellow, T.red);
  label('10+ YEARS LATER', seg(t, tSat + 2.0, tMoney), T.blue);
  label('THEIR FINANCES', seg(t, tMoney + .5, tEnd));
});
