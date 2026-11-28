// P09 (Pop Art wall + printed chart): "The marshmallow test measured more than willpower."
// Watts, Duncan & Quan (2018), Psychological Science 29: 1159-1177. Original Stanford-preschool follow-ups: ns = 35-89.
// NICHD SECCYD: 918 children tested at 54 months (age 4), 7-min ceiling, "an additional portion" for waiting.
// Main group (n = 552, mothers without a college degree): bivariate link with age-15 achievement "only half the size" of the originals,
// "reduced by two thirds" with controls for family background, early cognitive ability and the home environment (beta .24 -> .08).
// Children who waited came from higher-income families and had higher early test scores (Table 3, p. 8).
import { pop, T, rectPts, ellipsePts, clamp, lerp, seg, eo, h2, ev, boot, stampRings, tileOpen, disc, darken, sunburst, wall, label, headline, camAt, finish, TS } from '../_kit/popkit.js';
const V = await boot(34.4);
const tSmall = V[1] - .1, tBig = V[2] - .1, tAge = V[3] - .1, tBars = V[4] - .1, tCtl = V[5] - .1, tTwist = V[6] - .1, tHomes = V[7] - .1, tEnd = V[8] - .1;
const ST = stampRings(tBig, 1.4, 7, 11);
const SMALL = (i, j) => i >= -1 && i <= 1 && j >= -2 && j <= 2;   // a small block = the original samples
ev(0, 'stamp', { v: 1.3 }); ev(.6, 'ding');
for (let k = 0; k < 15; k++) ev(tSmall + .1 + k * .07, 'stamp', { v: .45, pan: -.4 + (k % 3) * .4 });
ev(tAge, 'pan'); ev(tAge + .6, 'stamp', { v: 1 }); ev(tBars, 'pan'); ev(tBars + 1.0, 'stamp', { v: 1 }); ev(tBars + 2.6, 'stamp', { v: 1 });
ev(tCtl, 'pan'); ev(tTwist - .1, 'turn'); ev(tTwist + .2, 'stamp', { v: 1.4 }); ev(tTwist + .6, 'ding');
ev(tHomes, 'pan'); for (let k = 0; k < 12; k++) ev(tHomes + .4 + k * .1, 'flip', { v: .5, pan: -.6 + k * .1 });
ev(tEnd, 'pan'); ev(tEnd + .5, 'stamp', { v: 1.3 });
function mallow(mis, s = 1) {
  pop.save(); pop.scale(s);
  const body = rectPts(-150, -90, 300, 220), top = ellipsePts(0, -90, 150, 55, 40), bot = ellipsePts(0, 130, 150, 55, 40, 0, Math.PI);
  pop.save(); pop.translate(mis[0], mis[1]); pop.fill(body, { r: .18 }); pop.fill(bot, { r: .18 }); pop.fill(top, T.white); pop.restore();
  pop.outline([[-150, -90], [-150, 130]], 9); pop.outline([[150, -90], [150, 130]], 9); pop.outline(bot, 9); pop.outline(top, 9, { closed: true });
  pop.restore();
}
function house(mis) {
  const roof = [[-210, -30], [0, -210], [210, -30]], box = rectPts(-160, -30, 320, 230);
  pop.save(); pop.translate(mis[0], mis[1]); pop.fill(box, T.yellow); pop.fill(roof, T.red); pop.fill(rectPts(-40, 70, 80, 130), T.blue); pop.restore();
  pop.outline(box, 9, { closed: true }); pop.outline(roof.concat([roof[0]]), 9, { closed: true }); pop.outline(rectPts(-40, 70, 80, 130), 7, { closed: true });
}
function clockDisc(t, t0) {   // a 7-minute timer sweeping around the tile
  const a = seg(t, t0, t0 + 2.2) * Math.PI * 2;
  if (a > 0) pop.fill([[0, 10]].concat(ellipsePts(0, 10, 250, 250, 48, -Math.PI / 2, -Math.PI / 2 + a)), T.red);
}
function tile(i, j, t) {
  const home = i === 0 && j === 0, key = i + ',' + j;
  if (t < tSmall || t > tEnd || (t > tAge && t < tHomes && t < tBars)) {   // hook, loop, the age-4 close-up: one treat
    if (!home) return; const t0 = t > tEnd ? tEnd : (t > tAge ? tAge : -.05);
    const mis = tileOpen(0, 0, T.blue, Math.max(.45, seg(t, t0, t0 + .14)));
    if (t > tAge && t < tBars) clockDisc(t, tAge + .4); else if (t < tSmall || t > tEnd) sunburst(t, T.yellow);
    disc(mis, T.white, t > tAge && t < tBars ? 200 : 250); mallow(mis, .9); pop.restore(); return;
  }
  if (t < tBig) {   // the original samples: a small block
    if (!SMALL(i, j)) return; const n = (j + 2) * 3 + (i + 1), ap = seg(t, tSmall + .1 + n * .07, tSmall + .24 + n * .07); if (ap <= 0) return;
    const mis = tileOpen(i, j, T.red, ap); disc(mis); mallow(mis, .8); pop.restore(); return;
  }
  if (t < tAge) {   // the retest: hundreds of kids
    const s = ST.get(key) ?? 99, ap = home ? 1 : seg(t, s, s + .14); if (ap <= 0) return;
    const mis = tileOpen(i, j, T.blue, ap); disc(mis); mallow(mis, .8); pop.restore(); return;
  }
  if (t < tHomes) return;   // the chart is drawn in screen space
  // richer homes: tiles flip from treats to houses, from the centre out
  const fa = tHomes + .4 + Math.hypot(i, j) * .1, fp = seg(t, fa, fa + .3);
  const mis = tileOpen(i, j, fp >= .5 ? T.yellow : T.blue, 1, fp);
  disc(mis); if (fp >= .5 && (i + j) % 2 === 0) house(mis); else mallow(mis, .8);
  pop.restore();
}
function bars(t) {   // original link vs the retest: half, then two thirds smaller
  if (t < tBars || t > tHomes) return; const p = seg(t, tBars, tBars + .25);
  pop.save(); [pop.P, pop.L, pop.S].forEach(c => c.setTransform(1, 0, 0, 1, 0, 0));
  pop.fill(rectPts(0, 0, 1080, 1920), T.blue);
  pop.translate(0, (1 - eo(p)) * 400);
  pop.fill(rectPts(110, 420, 860, 1060), T.red); pop.fill(rectPts(90, 400, 860, 1060), T.white); pop.outline(rectPts(90, 400, 860, 1060), 8, { closed: true });
  const y0 = 1300, Hh = 760, h1 = Hh * eo(seg(t, tBars + .5, tBars + 1.0));
  const half = Hh * .5 * eo(seg(t, tBars + 2.2, tBars + 2.7)), h2b = half * (1 - (2 / 3) * eo(seg(t, tTwist + .1, tTwist + .8)));
  if (h1 > 1) { pop.fill(rectPts(190, y0 - h1, 250, h1), T.red); pop.outline(rectPts(190, y0 - h1, 250, h1), 8, { closed: true }); }
  if (h2b > 1) { pop.fill(rectPts(620, y0 - h2b, 250, h2b), { b: .55 }); pop.outline(rectPts(620, y0 - h2b, 250, h2b), 8, { closed: true }); }
  if (t > tTwist + .1 && half > 1) pop.outline(rectPts(620, y0 - half, 250, half), 5, { closed: true, wfn: u => (Math.floor(u * 30) % 2 ? .12 : 1) });
  pop.line([[150, y0], [910, y0]], 10, { taper: .05 });
  pop.text('ORIGINAL', 315, y0 + 70, { size: 60, font: 'Archivo' }); pop.text('RETEST', 745, y0 + 70, { size: 60, font: 'Archivo' });
  pop.restore();
}
const CAM = [[0, 0, 0, 1.75], [tSmall - .1, 0, 0, 1.5], [tSmall + .9, 0, 0, .55], [tBig - .1, 0, 0, .55], [tBig + 1.4, 0, 0, .15], [tAge - .1, 0, 0, .15],
  [tAge + .3, 0, 0, 1.5], [tBars, 0, 0, 1.5], [tHomes, 0, 0, 1.5], [tHomes + 1.6, 0, 0, .22], [tEnd, 0, 0, .25], [tEnd + .5, 0, 0, 1.7], [34.4, 0, 0, 1.75]];
finish((t) => {
  const cam = camAt(CAM, t); pop.begin(cam);
  wall(cam, (i, j) => tile(i, j, t));
  bars(t);
  const hook = t < tSmall || t > tEnd + .3, hp = t < tSmall ? 1 : seg(t, tEnd + .3, tEnd + .8);
  if (hook) { headline('THE MARSHMALLOW TEST', 540, 290, 104, hp, T.white, T.blue); headline('MEASURED MORE', 540, 420, 118, hp, T.yellow, T.red); headline('THAN WILLPOWER.', 540, 1420, 110, hp, T.yellow, T.red); }
  label('STANFORD', seg(t, tSmall + .3, tBig));
  headline('35-89 KIDS', 540, 1400, 150, t > tSmall + 2.6 && t < tBig ? seg(t, tSmall + 2.6, tSmall + 3.1) : 0, T.yellow, T.red);
  label('RETEST', seg(t, tBig + .2, tAge));
  headline('918 KIDS', 540, 1380, 200, t > tBig + 1.2 && t < tAge ? seg(t, tBig + 1.2, tBig + 1.7) : 0, T.yellow, T.red);
  label('AGE 4', seg(t, tAge + .3, tBars));
  headline('7 MINUTES', 540, 1380, 150, t > tAge + .6 && t < tBars ? seg(t, tAge + .6, tAge + 1.1) : 0, T.yellow, T.red);
  label('SCORES AT 15', seg(t, tBars + .2, tCtl));
  headline('HALF', 745, 330, 130, t > tBars + 2.6 && t < tCtl ? seg(t, tBars + 2.6, tBars + 3.1) : 0, T.yellow, T.red);
  label('FAMILY + HOME', seg(t, tCtl + .1, tTwist + .2), T.blue);
  headline('-2/3', 745, 330, 170, t > tTwist + .3 && t < tHomes ? seg(t, tTwist + .3, tTwist + .8) : 0, T.yellow, T.red);
  label('RICHER HOMES', seg(t, tHomes + .4, tEnd));
});
