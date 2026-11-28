// P02: "They nearly quadrupled their savings." Save More Tomorrow (Thaler & Benartzi 2004): 3.5% -> 13.6% in 40 months.
import { pop, T, rectPts, ellipsePts, clamp, lerp, seg, eo, h2, ev, boot, stampRings, tileOpen, disc, darken, sunburst, wall, label, headline, camAt, finish, TS, W, H } from '../_kit/popkit.js';
const V = await boot(30.0);
const ST = stampRings(V[1] - .1, 1.3, 4, 6);
ev(0, 'stamp', { v: 1.3 }); ev(.5, 'ding');
ev(V[2] + .6, 'pan'); ev(V[3] - .2, 'flip', { v: 1.2 });
ev(V[1] + 1.4, 'rot', { d: 2.4 });
for (let k = 0; k < 6; k++) ev(V[4] + .1 + k * .33, 'note', { n: k * 2, pan: -.5 + k * .2 });
ev(V[6], 'turn'); ev(V[6], 'stamp', { v: 1.2 }); ev(V[6] + .9, 'stamp', { v: 1.4 });
ev(V[7], 'pan');
for (let k = 0; k < 10; k++) ev(V[7] + .5 + k * .09, 'flip', { v: .5, pan: -.6 + k * .12 });
ev(V[8] + .2, 'pan'); ev(V[8] + 1.0, 'ding');

function piggy(sc = 1, mis = [0, 0]) {
  pop.save(); pop.scale(sc);
  pop.save(); pop.translate(mis[0], mis[1]);
  const body = ellipsePts(0, 20, 190, 140, 64);
  pop.fill(body, { r: .45 });
  pop.fill(ellipsePts(190, 30, 50, 44, 32), { r: .6 });
  pop.fill([[-80, -95], [-40, -190], [-10, -110]], { r: .6 });
  for (const x of [-110, -40, 50, 120]) pop.fill(rectPts(x - 22, 130, 44, 60), { r: .55 });
  pop.restore();
  pop.outline(body, 9, { closed: true }); pop.outline(ellipsePts(190, 30, 50, 44, 32), 7, { closed: true });
  pop.outline([[-80, -95], [-40, -190], [-10, -110]], 7);
  for (const x of [-110, -40, 50, 120]) pop.outline(rectPts(x - 22, 145, 44, 50), 7, { closed: true });
  pop.black(ellipsePts(110, -20, 14, 14, 16)); pop.black(ellipsePts(180, 25, 7, 10, 12)); pop.black(ellipsePts(205, 25, 7, 10, 12));
  pop.black(rectPts(-60, -118, 110, 18));
  pop.line([[-190, 20], [-230, -10], [-215, -40]], 7, { taper: .3 });
  pop.restore();
}
function bill(mis) {
  pop.save(); pop.translate(mis[0], mis[1]); pop.fill(rectPts(-210, -110, 420, 220), { y: 1, b: .6 }); pop.fill(ellipsePts(0, 0, 80, 80, 40), T.white); pop.restore();
  pop.outline(rectPts(-210, -110, 420, 220), 8, { closed: true }); pop.outline(rectPts(-180, -82, 360, 164), 4, { closed: true });
  pop.text('$', 0, 4, { size: 120, font: 'Anton', fill: { y: 1, b: .6 } }); pop.text('$', 0, 4, { size: 120, font: 'Anton', outline: 5, spot: 'rgba(0,0,0,0)' });
}
function raise(frac, mis) {   // an up arrow on a disc, with a red slice of the disc = the share saved
  if (frac > 0) { const a0 = -Math.PI / 2, a1 = a0 + frac * Math.PI * 2; pop.fill([[0, 10]].concat(ellipsePts(0, 10, 250, 250, 48, a0, a1)), T.red); }
  pop.save(); pop.translate(mis[0], mis[1]);
  const ar = [[-60, 150], [-60, -20], [-130, -20], [0, -170], [130, -20], [60, -20], [60, 150]];
  pop.fill(ar, T.blue); pop.restore(); pop.outline(ar.concat([ar[0]]), 9, { closed: true });
}
// phases
const tWall = V[1] - .1, tPush = V[2] + .6, tRow = V[4] - .2, tBars = V[6], tWave = V[7] + .5, tEnd = V[8] + .2;
const CAM = [[0, 0, 0, 1.75], [tWall, 0, 0, 1.5], [tWall + 1.4, 0, 0, .42], [tPush, 0, 0, .45], [tPush + .8, 0, 0, 1.4], [tRow, 0, 0, 1.3],
  [tRow + .5, 0, 0, .9], [tRow + 2.6, TS * 3, 0, .9], [tBars - .1, TS * 1.5, 0, .35], [tWave, TS * 1.5, 0, .4], [tEnd, TS * 1.5, 0, .45], [tEnd + 1.0, 0, 0, 1.6], [30, 0, 0, 1.75]];
const dark = (i, j, t) => t < tPush ? clamp((t - V[1] - 1.4 - Math.hypot(i, j) * .3) / .8) * .55 : 0;
function tile(i, j, t) {
  const home = i === 0 && j === 0;
  if (t < tPush) {   // the hook piggy, then a wall of bills that gets spoken for
    if (home && t < tWall + .3) {
      const mis = tileOpen(0, 0, T.blue, Math.max(.45, seg(t, -.05, .09)));
      disc(mis); const g = 1 + .5 * eo(seg(t, .3, 1.6)); piggy(.82 * g, mis); pop.restore(); return;
    }
    const s = ST.get(i + ',' + j) ?? 99; const ap = seg(t, s, s + .14); if (ap <= 0) return;
    const mis = tileOpen(i, j, T.red, ap); disc(mis); bill(mis); darken(dark(i, j, t)); pop.restore(); return;
  }
  if (home && t > tEnd + .9) { const mis = tileOpen(0, 0, T.blue, seg(t, tEnd + .9, tEnd + 1.05)); sunburst(t, T.yellow); disc(mis); piggy(.82 * 1.5, mis); pop.restore(); return; }
  // raises: the home tile flips first; along the row each raise saves a bigger slice; on the wave every tile flips
  const flipAt = home ? V[3] - .2 : (j === 0 && i > 0 && t < tBars) ? V[4] + .1 + (i - 1) * .33 : tWave + Math.hypot(i - 1.5, j) * .12;
  const fp = seg(t, flipAt, flipAt + .3);
  const mis = tileOpen(i, j, fp >= .5 ? T.yellow : T.red, 1, fp);
  if (fp >= .5) { if (home || (j === 0 && i > 0 && t >= tWave)) sunburst(t, T.orange); disc(mis); raise(home ? .12 : j === 0 && i > 0 ? Math.min(.6, .12 + i * .09) * eo(seg(t, flipAt + .2, flipAt + .5)) : .25, mis); }
  else { disc(mis); bill(mis); darken(.55); }
  pop.restore();
}
function bars(t) {   // the twist: 3.5% vs 13.6%, printed plate by plate on a paper slip
  const p = seg(t, tBars, tBars + .25); if (p <= 0 || t > tWave) return;
  pop.save(); [pop.P, pop.L, pop.S].forEach(c => c.setTransform(1, 0, 0, 1, 0, 0));
  const y0 = 1420, k = 1 - eo(p);
  pop.translate(0, k * 400);
  pop.fill(rectPts(110, 420, 860, 1120), T.blue); pop.fill(rectPts(90, 400, 860, 1120), T.white); pop.outline(rectPts(90, 400, 860, 1120), 8, { closed: true });
  const h1 = 900 * 3.5 / 13.6, h2b = 900 * eo(seg(t, tBars + .9, tBars + 1.6));
  pop.fill(rectPts(190, y0 - h1, 250, h1), { b: .5 }); pop.outline(rectPts(190, y0 - h1, 250, h1), 8, { closed: true });
  if (h2b > 1) { pop.fill(rectPts(600, y0 - h2b, 250, h2b), T.red); pop.over(rectPts(600, y0 - h2b, 250, h2b), { y: .45 }); pop.outline(rectPts(600, y0 - h2b, 250, h2b), 8, { closed: true }); }
  pop.line([[150, y0], [910, y0]], 10, { taper: .05 });
  pop.restore();
  headline('3.5%', 315, y0 - h1 - 90, 120, seg(t, tBars + .1, tBars + .6), T.blue, T.yellow);
  headline('13.6%', 725, y0 - 900 - 90, 120, seg(t, tBars + 1.4, tBars + 1.9), T.yellow, T.red);
}
finish((t) => {
  const cam = camAt(CAM, t); pop.begin(cam);
  wall(cam, (i, j) => tile(i, j, t));
  bars(t);
  headline('×4', 540, 1500, 380, seg(t, .35, 1.0) * (t < tWall ? 1 : 0), T.yellow, T.red);
  headline('×4', 540, 1500, 380, t > tEnd + 1.0 ? seg(t, tEnd + 1.0, tEnd + 1.6) : 0, T.yellow, T.red);
  label('NO ROOM', seg(t, V[1] + 1.5, tPush + .2));
  label('FUTURE RAISES', seg(t, V[3] + .3, tRow + 2.8), T.blue);
  label('TOMORROW', seg(t, tWave + .4, tEnd + .9), T.blue);
});
