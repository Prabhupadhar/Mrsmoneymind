// P05: "You lost ten bucks. Still buying the ticket?" Tversky & Kahneman (1981), Science 211: 453-458, problems 8-9:
// lost a $10 bill -> 88% would still buy (N = 183); lost the $10 ticket -> 46% would buy another (N = 200). Students, questionnaires.
import { pop, T, rectPts, ellipsePts, clamp, lerp, seg, eo, h2, ev, boot, stampRings, tileOpen, disc, darken, sunburst, wall, label, headline, camAt, finish, TS } from '../_kit/popkit.js';
const V = await boot(34.6);
const ST = stampRings(V[1] - .1, 1.2, 4, 6);
const tAsk = V[3], tYes = V[4], tReset = V[5], tNo = V[7], tJar = V[8], tEnd = V[9];
// a 10 x 10 block of answers, rows j 0..9, cols i 0..9 ; order is a fixed shuffle so "yes" tiles scatter
const ORD = []; for (let j = 0; j < 10; j++) for (let i = 0; i < 10; i++) ORD.push([i, j]);
ORD.sort((a, b) => h2(a[0], a[1], 5) - h2(b[0], b[1], 5));
const RANK = new Map(ORD.map((q, k) => [q[0] + ',' + q[1], k]));
ev(0, 'stamp', { v: 1.3 }); ev(1.0, 'flip', { v: 1 });
ev(V[2] + .8, 'flip', { v: 1 }); ev(tAsk, 'pan');
for (let k = 0; k < 12; k++) ev(tYes + .1 + k * .08, 'flip', { v: .5, pan: -.6 + k * .1 });
ev(tYes + 1.0, 'ding'); ev(tReset, 'pan'); ev(V[5] + 2.6, 'flip', { v: 1 });
ev(tNo, 'turn'); for (let k = 0; k < 8; k++) ev(tNo + .1 + k * .08, 'flip', { v: .5, pan: .6 - k * .1 });
ev(tNo + .8, 'stamp', { v: 1.3 }); ev(tJar, 'pan'); ev(tJar + 2.6, 'stamp', { v: 1.3 }); ev(tEnd, 'pan');
function ticket(mis, ghost, txt = '$10', gw = 6) {
  const R = 46, w = 220, h = 130;
  const sh = [[-w, -h], [w, -h]].concat(ellipsePts(w, 0, R, R, 16, -Math.PI / 2, -Math.PI * 1.5).reverse(), [[w, h], [-w, h]], ellipsePts(-w, 0, R, R, 16, Math.PI / 2, -Math.PI / 2));
  if (!ghost) { pop.save(); pop.translate(mis[0], mis[1]); pop.fill(sh, T.red); pop.fill(rectPts(-w + 70, -h + 30, 2 * w - 140, 2 * h - 60), T.white); pop.restore(); }
  pop.outline(sh, ghost ? gw : 9, { closed: true, wfn: ghost ? (u => (Math.floor(u * 30) % 2 ? .12 : 1)) : undefined });
  if (!ghost) { pop.text(txt, 0, 4, { size: 120, font: 'Anton', fill: T.red }); pop.text(txt, 0, 4, { size: 120, font: 'Anton', outline: 5, spot: 'rgba(0,0,0,0)' }); }
}
function bill(mis, ghost) {
  if (!ghost) { pop.save(); pop.translate(mis[0], mis[1]); pop.fill(rectPts(-210, -110, 420, 220), { y: 1, b: .6 }); pop.fill(ellipsePts(0, 0, 80, 80, 40), T.white); pop.restore(); }
  pop.outline(rectPts(-210, -110, 420, 220), ghost ? 6 : 8, { closed: true, wfn: ghost ? (u => (Math.floor(u * 30) % 2 ? .12 : 1)) : undefined });
  if (!ghost) { pop.text('10', 0, 4, { size: 100, font: 'Anton', fill: { y: 1, b: .6 } }); pop.text('10', 0, 4, { size: 100, font: 'Anton', outline: 5, spot: 'rgba(0,0,0,0)' }); }
}
function jar(x, fill, txt) {
  pop.save(); pop.translate(x, 30);
  const sh = [[-110, -150], [110, -150], [130, -100], [130, 170], [-130, 170], [-130, -100]];
  pop.fill(sh, T.white); pop.over(rectPts(-130, 170 - 320 * fill, 260, 320 * fill), { y: 1, b: .6 });
  pop.outline(sh.concat([sh[0]]), 8, { closed: true }); pop.fill(rectPts(-125, -190, 250, 45), T.red); pop.outline(rectPts(-125, -190, 250, 45), 7, { closed: true });
  pop.text(txt, 0, 60, { size: 90, font: 'Anton', fill: T.yellow }); pop.text(txt, 0, 60, { size: 90, font: 'Anton', outline: 4, spot: 'rgba(0,0,0,0)' });
  pop.restore();
}
function tile(i, j, t) {
  const home = i === 0 && j === 0, key = i + ',' + j;
  // hook and loop: one ticket tile; the bill beside it is lost (ghost)
  if (t < V[1] - .1 || t > tEnd) {
    if (!home) return; const t0 = t > tEnd ? tEnd : -.05;
    const mis = tileOpen(0, 0, T.blue, Math.max(.45, seg(t, t0, t0 + .14)));
    disc(mis); pop.save(); pop.translate(0, -110); pop.scale(.75); ticket(mis, false); pop.restore();
    pop.save(); pop.translate(0, 130); pop.scale(.62); bill(mis, t > t0 + 1.05); pop.restore();
    pop.restore(); return;
  }
  if (t < tAsk) {   // the theatre: a wall of tickets; then the lost bill
    const s = ST.get(key) ?? 9, ap = seg(t, s, s + .14); if (ap <= 0) return;
    const mis = tileOpen(i, j, T.blue, ap); disc(mis);
    if (home && t > V[2] - .3) { pop.save(); pop.translate(0, -110); pop.scale(.75); ticket(mis, false); pop.restore(); pop.save(); pop.translate(0, 130); pop.scale(.62); bill(mis, t > V[2] + .8); pop.restore(); }
    else ticket(mis, false);
    pop.restore(); return;
  }
  if (t >= tJar) return;   // jars are drawn in screen space
  // the answers: a 10 x 10 block
  if (i < 0 || i > 9 || j < 0 || j > 9) return;
  const r = RANK.get(key);
  const second = t >= tReset;
  const yesAt = !second ? tYes + .1 + r * .01 : tNo + .1 + r * .012;
  const isYes = !second ? r < 88 : r < 46;
  const yes = isYes && t > yesAt, no = !isYes && t > yesAt;
  const fp = seg(t, yesAt, yesAt + .25);
  const mis = tileOpen(i, j, yes && fp >= .5 ? T.yellow : T.blue, 1, isYes ? fp : 0);
  disc(mis); ticket(mis, second && !(yes && fp >= .5), '$10', 22);
  if (no) darken(.5 * seg(t, yesAt, yesAt + .4));
  pop.restore();
}
const CAM = [[0, 0, 0, 1.7], [V[1] - .1, 0, 0, 1.5], [V[1] + 1.1, 0, 0, .5], [V[2] - .3, 0, 0, .5], [V[2] + .2, 0, 0, 1.35], [tAsk, 0, 0, 1.35],
  [tAsk + .9, TS * 4.5, TS * 4.5, .165], [tJar, TS * 4.5, TS * 4.5, .17], [tEnd, TS * 4.5, TS * 4.5, .17], [tEnd + .5, 0, 0, 1.6], [34.6, 0, 0, 1.75]];
finish((t) => {
  const cam = camAt(CAM, t); pop.begin(cam);
  wall(cam, (i, j) => tile(i, j, t));
  if (t >= tJar && t < tEnd) {   // two jars: the ticket jar now reads $20
    pop.save(); [pop.P, pop.L, pop.S].forEach(c => c.setTransform(1, 0, 0, 1, 0, 0));
    pop.fill(rectPts(0, 0, 1080, 1920), T.blue);
    pop.translate(540, 900); pop.scale(1.6);
    jar(-150, .35, 'CASH'); jar(150, t > tJar + 2.6 ? .9 : .45, t > tJar + 2.6 ? '$20' : '$10'); pop.text('THE SHOW', 150, 235, { size: 40, font: 'Archivo', read: 'jar2' });
    pop.restore();
  }
  label('LOST: $10', seg(t, 1.1, V[1] - .1));
  label('$10 BILL GONE', seg(t, V[2] + .9, tAsk + .5));
  headline('88%', 540, 1580, 300, t > tYes + 1.0 && t < tReset ? seg(t, tYes + 1.0, tYes + 1.5) : 0, T.yellow, T.red);
  label('TICKET GONE', seg(t, V[5] + 2.6, tNo));
  headline('46%', 540, 1580, 300, t > tNo + .8 && t < tJar ? seg(t, tNo + .8, tNo + 1.3) : 0, T.yellow, T.red);
  label('SEPARATE JARS', seg(t, tJar + .2, tEnd), T.red);
});
