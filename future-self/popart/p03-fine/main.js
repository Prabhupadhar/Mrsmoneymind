// P03: "They fined late parents. Lateness got worse." Gneezy & Rustichini (2000), A Fine is a Price, J. Legal Studies.
// 10 private day-care centres in Haifa; a NIS 10 fine for 10+ min late in 6 of them; late pickups rose to almost
// twice the initial level and stayed there after the fine was removed.
import { pop, T, rectPts, ellipsePts, clamp, lerp, seg, eo, h2, ev, boot, stampRings, tileOpen, disc, darken, sunburst, wall, label, headline, camAt, finish, TS } from '../_kit/popkit.js';
const V = await boot(29.5);
const ST = stampRings(.05, 1.4, 4, 6);
const t10 = V[3] - .2, tPush = V[4] - .1, tUp = V[5], tOff = V[6], tPrice = V[8] - .1, tEnd = V[9] + .1;
const TEN = []; for (let j = -2; j <= 2; j++) for (let i = 0; i <= 1; i++) TEN.push([i, j]);
const FINED = (i, j) => j <= 0 && j >= -2;          // six of the ten
ev(t10, 'pan'); for (let k = 0; k < 6; k++) ev(t10 + 1.2 + k * .14, 'flip', { v: .8, pan: -.3 + k * .12 });
ev(tPush, 'pan'); ev(tPush + .9, 'stamp', { v: 1.3 });
for (let k = 0; k < 10; k++) ev(tUp + .3 + k * .17, 'note', { n: k, pan: (k % 2 ? .4 : -.4) });
ev(tOff, 'turn'); for (let k = 0; k < 6; k++) ev(tOff + .2 + k * .1, 'flip', { v: .7 });
ev(V[7], 'rot', { d: 2.2 });
ev(tPrice, 'pan'); for (let k = 0; k < 12; k++) ev(tPrice + .4 + k * .08, 'flip', { v: .5, pan: -.6 + k * .1 });
ev(tEnd, 'pan');

function clock(min, mis, face = T.white) {   // minutes after 4:00
  const a = -Math.PI / 2 + min / 60 * Math.PI * 2, ah = -Math.PI / 2 + (4 + min / 60) / 12 * Math.PI * 2;
  pop.save(); pop.translate(mis[0] * .5, mis[1] * .5); pop.fill(ellipsePts(0, 0, 190, 190, 60), face); pop.restore();
  pop.outline(ellipsePts(0, 0, 190, 190, 60), 10, { closed: true });
  for (let k = 0; k < 12; k++) { const b = k / 12 * Math.PI * 2; pop.line([[Math.cos(b) * 150, Math.sin(b) * 150], [Math.cos(b) * 172, Math.sin(b) * 172]], k % 3 ? 5 : 9, { taper: 0 }); }
  pop.line([[0, 0], [Math.cos(ah) * 95, Math.sin(ah) * 95]], 16, { taper: .1 });
  pop.line([[0, 0], [Math.cos(a) * 140, Math.sin(a) * 140]], 10, { taper: .1 });
  pop.black(ellipsePts(0, 0, 14, 14, 16));
}
function coin(p, x = 150, y = 150) {   // the fine: a red coin stamped in
  if (p <= 0) return; pop.save(); pop.translate(x, y); pop.scale(1 + .4 * (1 - eo(p)));
  pop.fill(ellipsePts(0, 0, 80, 80, 40), T.red); pop.outline(ellipsePts(0, 0, 80, 80, 40), 8, { closed: true });
  pop.text('10', 0, 4, { size: 70, font: 'Anton', fill: T.yellow }); pop.text('10', 0, 4, { size: 70, font: 'Anton', outline: 4, spot: 'rgba(0,0,0,0)' });
  pop.restore();
}
function tally(n) {   // late pickups as marks along the bottom of the tile
  for (let k = 0; k < n; k++) { const x = -230 + (k % 12) * 40, y = 250 - Math.floor(k / 12) * 48; pop.line([[x, y - 30], [x + 8, y + 30]], 10, { taper: .2 }); }
}
// late counts per centre, from the paper's Table 2 (weeks 1-4 -> 5-16 -> 17-20), rounded; control centres stay flat
const LATE = { '0,-2': [7, 12, 15], '1,-2': [5, 12, 13], '0,-1': [9, 17, 22], '1,-1': [9, 19, 20], '0,0': [12, 25, 30], '1,0': [6, 13, 12],
  '0,1': [9, 7, 7], '1,1': [13, 11, 9], '0,2': [5, 6, 5], '1,2': [13, 13, 12] };
function tile(i, j, t) {
  const key = i + ',' + j;
  if (t < t10 || t >= tEnd) {   // the open (and the loop): a wall of clocks, hands running late
    const s = (t >= tEnd ? tEnd - .05 + (ST.get(key) ?? 9) * .5 : ST.get(key) ?? 9); const ap = seg(t, s, s + .14); if (ap <= 0 && key !== '0,0') return;
    const mis = tileOpen(i, j, T.blue, key === '0,0' ? Math.max(.45, ap) : ap);
    disc(mis); clock(t < t10 && t > 1.0 ? 25 * eo(seg(t, 1.0 + h2(i, j) * .4, 2.6)) : (t >= tEnd ? 20 * eo(seg(t, tEnd + .4, tEnd + 1.8)) : 0), mis);
    if (t < V[1] - .2 && t > 1.0) darken(.45 * seg(t, 1.2 + h2(i, j) * .5, 2.4));
    pop.restore(); return;
  }
  const inTen = i >= 0 && i <= 1 && j >= -2 && j <= 2; if (!inTen) return;
  const fined = FINED(i, j), fk = fined ? TEN.findIndex(q => q[0] === i && q[1] === j) : -1;
  const fineOn = fined && t > t10 + 1.2 + fk * .14 && t < tOff + .2 + fk * .1;
  const fp = fined ? (t < tOff ? seg(t, t10 + 1.2 + fk * .14, t10 + 1.5 + fk * .14) : 1 - seg(t, tOff + .2 + fk * .1, tOff + .5 + fk * .1)) : 0;
  const priceWave = t > tPrice + .4 + Math.hypot(i, j) * .1;
  const mis = tileOpen(i, j, priceWave ? T.yellow : fp >= .5 ? T.red : T.blue, 1);
  if (priceWave && fined) sunburst(t, T.orange);
  disc(mis);
  const L = LATE[key], n = t < tUp ? L[0] : t < tOff ? Math.round(lerp(L[0], L[1], eo(seg(t, tUp + .3, tUp + 2.2)))) : Math.round(lerp(L[1], L[2], seg(t, tOff, tOff + 2)));
  const min = key === '0,0' && t > tPush && t < tUp ? 10 * eo(seg(t, tPush + .2, tPush + .8)) : 0;
  pop.save(); pop.scale(.62); pop.translate(0, -110); clock(min, mis); pop.restore();
  if (priceWave && fined) coin(1);
  if (fineOn) coin(seg(t, t10 + 1.2 + fk * .14, t10 + 1.4 + fk * .14));
  pop.save(); pop.scale(.95); pop.translate(0, 0); tally(Math.min(n, 30)); pop.restore();
  if (t > V[7] && fined) darken(.35 * seg(t, V[7], V[7] + 1));
  pop.restore();
}
const CAM = [[0, 0, 0, 1.6], [1.0, 0, 0, .5], [V[1] - .2, 0, 0, .5], [V[1] + .6, 0, 0, 1.4], [t10, 0, 0, 1.4], [t10 + .9, TS * .5, 0, .58], [tPush, TS * .5, 0, .58],
  [tPush + .6, 0, 0, 1.3], [tUp, 0, 0, 1.3], [tUp + .6, TS * .5, 0, .58], [tPrice, TS * .5, 0, .6], [tEnd, TS * .5, 0, .62], [tEnd + .6, 0, 0, 1.6], [29.5, 0, 0, 1.7]];
finish((t) => {
  const cam = camAt(CAM, t); pop.begin(cam);
  wall(cam, (i, j) => tile(i, j, t));
  label('FINED', seg(t, .9, 2.9));
  label('4:00 PM', seg(t, V[1] + .5, V[2] + 3.1), T.blue);
  label('6 OF 10', seg(t, t10 + 1.3, tPush), T.blue);
  label('4:10 = FINE', seg(t, tPush + .8, tUp));
  headline('ALMOST ×2', 540, 1640, 150, t > tUp + 1.6 && t < tOff ? seg(t, tUp + 1.6, tUp + 2.1) : 0, T.yellow, T.red);
  label('NO FINE', seg(t, tOff + .3, V[7] + .2), T.blue);
  label('STILL LATE', seg(t, V[7] + .3, tPrice));
  label('A PRICE', seg(t, tPrice + .6, tEnd + .1), T.blue);
});
