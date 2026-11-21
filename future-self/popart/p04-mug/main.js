// P04: "Give someone a mug. Its price doubles." Kahneman, Knetsch & Thaler (1990), JPE. Experiment 6: 77 Simon Fraser
// students; median value $7.12 for owners (sellers) vs $2.87 for buyers. Owners got the mugs minutes before.
import { pop, T, rectPts, ellipsePts, clamp, lerp, seg, eo, h2, ev, boot, stampRings, tileOpen, disc, darken, sunburst, wall, label, headline, camAt, finish, TS } from '../_kit/popkit.js';
const V = await boot(29.8);
const ST = stampRings(V[1] - .3, 1.2, 4, 6);
const tSplit = V[2] + .4, tAsk = V[3], tBuy = V[5], tOwn = V[6], tMin = V[7], tOld = V[8], tEnd = V[9];
const owner = (i, j) => ((i + j) % 2 + 2) % 2 === 0;
ev(0, 'stamp', { v: 1.3 }); ev(.6, 'stamp', { v: 1.0 }); ev(1.0, 'ding');
for (let k = 0; k < 14; k++) ev(tSplit + .3 + k * .1, 'flip', { v: .6, pan: -.6 + k * .09 });
ev(tAsk, 'pan'); ev(tBuy, 'stamp', { v: 1 }); ev(tOwn, 'turn'); ev(tOwn, 'stamp', { v: 1.4 }); ev(tOwn + .3, 'ding');
ev(tMin, 'pan'); ev(tOld, 'pan'); for (let k = 0; k < 8; k++) ev(tOld + .5 + k * .18, 'note', { n: k + 2 });
ev(tEnd, 'pan'); ev(tEnd + .5, 'stamp', { v: 1.2 });
function mug(ghost, mis) {
  const body = [[-130, -150], [130, -150], [115, 160], [-115, 160]];
  const handle = ellipsePts(160, 0, 80, 95, 40, -Math.PI / 2, Math.PI / 2);
  if (!ghost) { pop.save(); pop.translate(mis[0], mis[1]); pop.fill(body, T.red); pop.over(rectPts(-110, -40, 225, 60), { y: 1 }); pop.restore(); }
  pop.line(handle, ghost ? 8 : 26, { taper: .05 });
  if (!ghost) pop.line(ellipsePts(160, 0, 80, 95, 40, -Math.PI / 2, Math.PI / 2), 12, { taper: .05 });
  pop.outline(body.concat([body[0]]), ghost ? 6 : 10, { closed: true, wfn: ghost ? (u => (Math.floor(u * 24) % 2 ? .15 : 1)) : undefined });
  if (!ghost) for (let k = 0; k < 3; k++) pop.line([[-50 + k * 50, -190], [-40 + k * 50, -230], [-55 + k * 50, -270]], 6, { taper: .4 });
}
function tag(str, p, ink) {   // a price tag stamped at the lower right of the tile
  if (p <= 0) return; pop.save(); pop.translate(150, 190); pop.rotate(-.15); pop.scale(1 + .4 * (1 - eo(p)));
  const sh = [[-110, -55], [90, -55], [130, 0], [90, 55], [-110, 55]];
  pop.fill(sh, ink); pop.outline(sh.concat([sh[0]]), 7, { closed: true }); pop.black(ellipsePts(95, 0, 9, 9, 12));
  pop.text(str, -15, 3, { size: 78, font: 'Anton', fill: T.white }); pop.text(str, -15, 3, { size: 78, font: 'Anton', outline: 4, spot: 'rgba(0,0,0,0)' });
  pop.restore();
}
function tile(i, j, t) {
  const home = i === 0 && j === 0, key = i + ',' + j;
  if (t < V[1] - .3 && !home) return;
  if (t < V[1] - .3 || t > tEnd) {   // hook & loop: one mug, its tag doubling
    const mis = tileOpen(0, 0, T.blue, seg(t, t > tEnd ? tEnd : -.05, (t > tEnd ? tEnd : -.05) + .14) * .55 + .45);
    if (t > .9) sunburst(t, T.yellow); disc(mis); mug(false, mis);
    tag(t < .9 || (t > tEnd && t < tEnd + .5) ? '$3' : '$7', t > tEnd ? seg(t, tEnd + .5, tEnd + .7) : seg(t, .55, .7), t < .9 || (t > tEnd && t < tEnd + .5) ? T.blue : T.red);
    pop.restore(); return;
  }
  const s = ST.get(key) ?? 9, ap = seg(t, s, s + .14); if (ap <= 0) return;
  const own = owner(i, j), fpAt = tSplit + .3 + (Math.abs(i) + Math.abs(j)) * .1, fp = own ? 0 : seg(t, fpAt, fpAt + .3);
  const mis = tileOpen(i, j, own ? (t > tOwn + .1 ? T.yellow : T.red) : T.blue, ap, fp);
  if (own && t > tOwn + .1) sunburst(t, T.orange);
  disc(mis);
  mug(!own && fp >= .5, mis);
  if (!own && t > tBuy) tag('$2.87', seg(t, tBuy + .1 + h2(i, j) * .4, tBuy + .3 + h2(i, j) * .4), T.blue);
  if (own && t > tOwn) tag('$7.12', seg(t, tOwn + .05 + h2(i, j) * .4, tOwn + .25 + h2(i, j) * .4), T.red);
  if (!own && t > tOwn + .3) darken(.35);
  pop.restore();
}
const CAM = [[0, 0, 0, 1.7], [V[1] - .3, 0, 0, 1.5], [V[1] + 1.2, 0, 0, .5], [tAsk, 0, 0, .55], [tAsk + .6, TS * .5, 0, 1.0], [tBuy, TS * .5, 0, 1.0],
  [tOwn + .5, TS * .5, 0, .95], [tMin, TS * .5, 0, .9], [tOld + .4, TS * .5, TS * .5, .42], [tEnd, TS * .5, TS * .5, .45], [tEnd + .6, 0, 0, 1.6], [29.8, 0, 0, 1.75]];
finish((t) => {
  const cam = camAt(CAM, t); pop.begin(cam);
  wall(cam, (i, j) => tile(i, j, t));
  headline('×2', 540, 1560, 360, seg(t, 1.0, 1.5) * (t < V[1] - .3 ? 1 : 0), T.yellow, T.red);
  label('SAME MUG', seg(t, V[1] + .4, tSplit + .3));
  label('OWNERS', seg(t, tSplit + .9, tAsk + 2.4));
  label('BUYERS', seg(t, V[4], tBuy + .2), T.blue);
  label('MINUTES', seg(t, tMin + .2, tOld), T.blue);
  label('OLD STUFF', seg(t, tOld + .3, tEnd));
  headline('×2', 540, 1560, 360, t > tEnd + .7 ? seg(t, tEnd + .7, tEnd + 1.2) : 0, T.yellow, T.red);
});
