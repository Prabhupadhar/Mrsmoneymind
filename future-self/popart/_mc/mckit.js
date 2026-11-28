// Mid-century cartoon kit for Mrs. Money Mind vertical Shorts (1080x1920): people in situations.
// Built on the library's midcentury-toon engine (toon.js / chars.js / icons.js, MIT).
import { PAL, shape, ink, ellipse, spline, rrect, rect, move, xform, text, measure, sparkle, star, rays, starPts, setClock, textures, paperFinish, clamp, lerp, seg, eo, eio, back, twos, TAU, hash } from './toon.js';
import { drawHand, drawOwner } from './chars.js';
import { icon } from './icons.js';
export { PAL, shape, ink, ellipse, spline, rrect, rect, move, xform, text, measure, sparkle, star, rays, starPts, clamp, lerp, seg, eo, eio, back, twos, TAU, hash, drawHand, drawOwner, icon };
export const W = 1080, H = 1920;
export const cv = document.getElementById('c'), g = cv.getContext('2d');
export const EV = []; export const ev = (t, type, o = {}) => EV.push({ t: +t.toFixed(3), type, ...o });
export async function boot(dur) {
  for (const [fam, file, w] of [['Oleo', 'OleoScript-Bold.ttf', '700'], ['Slab', 'AlfaSlabOne-Regular.ttf', '400'], ['Jost', 'Jost.ttf', '100 900']]) {
    const f = new FontFace(fam, `url(/films/_mc/${file})`, { weight: w }); document.fonts.add(await f.load()); }
  textures();
  const vo = await (await fetch('voice/vo.json')).json();
  window.DUR = dur; window.EV = EV;
  return vo.map(l => l.start);
}
export function finish(draw) {
  window.render = (t) => { g.setTransform(1, 0, 0, 1, 0, 0); setClock(t); draw(t); paperFinish(g, W, H, .8); };
  window.READY = true;
}
// ---------- backgrounds ----------
export function bg(col, floor = null, fy = 1380) {
  shape(g, rect(-20, -20, W + 40, H + 40), { fill: col, line: 0, off: [0, 0], grain: .2 });
  if (floor) { shape(g, rect(-20, fy, W + 40, H - fy + 40), { fill: floor, line: 0, off: [0, 0], grain: .3 }); ink(g, [[-10, fy], [380, fy]], 5, { seed: 3 }); ink(g, [[460, fy + 2], [1090, fy]], 5, { seed: 4 }); }
}
// ---------- a person (feet at x,y; s = scale; local units, head top ~ -540) ----------
// o: coat, coatD, pants, hair, skin, face ('neutral'|'worried'|'happy'|'sad'|'wow'), armF/armB {a1,a2} (0 = right, PI/2 = down),
//    handF/handB, look [dx,dy], dir (1 faces right, -1 left), cap (a hat colour), kid (shorter body), blink
export function person(x, y, s, o = {}) {
  const coat = o.coat || PAL.teal, coatD = o.coatD || PAL.tealD, pants = o.pants || '#3B4766', skin = o.skin || PAL.skin, hair = o.hair || PAL.hair;
  const kid = !!o.kid, d = o.dir ?? 1;
  g.save(); g.translate(x, y); g.scale(s * d, s);
  g.save(); g.globalAlpha = .16; g.fillStyle = PAL.ink; g.beginPath(); g.ellipse(0, 2, 90, 11, 0, 0, TAU); g.fill(); g.restore();
  const hip = kid ? -150 : -250, sh = kid ? -330 : -440, headY = sh - 78;
  const legW = 26, step = o.step ?? 0;
  for (const [i, lx] of [[0, -24], [1, 24]]) {
    const sw = (i ? 1 : -1) * step * 40;
    shape(g, [[lx - legW, hip], [lx + legW, hip], [lx + legW * .7 + sw, -18], [lx - legW * .7 + sw, -18]], { fill: pants, line: 4, seed: 10 + i, grain: .3, breaks: .15 });
    shape(g, ellipse(lx + 10 + sw, -9, 30, 11, 16), { fill: PAL.ink, line: 0, off: [0, 0], grain: 0 });
  }
  const armJ = (which) => { const a = o[which] || (which === 'armF' ? { a1: 1.35, a2: 1.5 } : { a1: 1.8, a2: 1.65 });
    const S0 = which === 'armF' ? [44, sh + 18] : [-44, sh + 18], ua = kid ? 70 : 100, fa = kid ? 64 : 92;
    const E = [S0[0] + Math.cos(a.a1) * ua, S0[1] + Math.sin(a.a1) * ua], Hh = [E[0] + Math.cos(a.a2) * fa, E[1] + Math.sin(a.a2) * fa]; return { S0, E, Hh, a2: a.a2 }; };
  const arm = (which, seed) => { const J = armJ(which); const P = spline([J.S0, J.E, J.Hh], false, 6);
    ink(g, P, kid ? 24 : 28, { seed, taper: false, wob: .08 }); ink(g, P, kid ? 15 : 19, { seed: seed + 1, taper: false, wob: .05, color: coat });
    drawHand(g, J.Hh[0], J.Hh[1], J.a2, o[which === 'armF' ? 'handF' : 'handB'] || 'open', which === 'armF' ? -1 : 1, kid ? .8 : 1, skin); return J; };
  arm('armB', 40);
  const body = spline([[-50, sh], [50, sh], [62, hip + 10], [-62, hip + 10]], true, 4);
  shape(g, body, { fill: coat, line: 4.5, seed: 20, grain: .35, breaks: .2, shade: [{ pts: [[20, sh - 10], [80, sh - 10], [80, hip + 20], [26, hip + 20]], color: coatD, alpha: .55 }] });
  if (o.cap) { /* worn on the head, drawn after it */ }
  // head: an egg, nose part of the outline (a small bump to the facing side)
  const hy = headY, R = kid ? 64 : 58;
  const head = spline([[0, hy - R * 1.15], [R * .9, hy - R * .7], [R * .98, hy - R * .1], [R * 1.22, hy + R * .05], [R * .95, hy + R * .25], [R * .8, hy + R * .75], [0, hy + R * 1.05], [-R * .85, hy + R * .7], [-R, hy - R * .1], [-R * .85, hy - R * .75]], true, 6);
  shape(g, head, { fill: skin, line: 4, seed: 30, grain: .15, breaks: .15 });
  shape(g, spline([[-R * 1.02, hy - R * .2], [-R * .9, hy - R * .95], [0, hy - R * 1.22], [R * .85, hy - R * .9], [R * .7, hy - R * .55], [0, hy - R * .75], [-R * .5, hy - R * .55]], true, 6), { fill: hair, line: 0, seed: 31, grain: .3 });
  if (o.cap) { shape(g, spline([[-R * 1.05, hy - R * .45], [-R * .8, hy - R * 1.2], [R * .3, hy - R * 1.35], [R * .95, hy - R * .7], [R * 1.6, hy - R * .55], [R * .9, hy - R * .38]], true, 6), { fill: o.cap, line: 4, seed: 32, grain: .2 }); }
  const look = o.look || [0, 0], face = o.face || 'neutral', blink = o.blink ?? 0;
  const ex = [R * .05, R * .55], ey = hy - R * .12;
  ex.forEach((x0, i) => {
    const x = x0 + look[0], y = ey + look[1];
    if (face === 'happy' || blink > .5) ink(g, face === 'happy' ? [[x - 8, y + 3], [x, y - 5], [x + 8, y + 3]] : [[x - 8, y], [x + 8, y]], 4, { seed: 40 + i, taper: false });
    else { const r = face === 'wow' ? 9 : 7; shape(g, ellipse(x, y, r * .8, r * 1.3, 12), { fill: PAL.ink, line: 0, off: [0, 0], grain: 0 }); shape(g, ellipse(x + 1.5, y - 3.5, 2.2, 2.6, 8), { fill: PAL.white, line: 0, off: [0, 0], grain: 0 }); }
    // brows: worried = inner ends up; sad = inner up, lower; wow = high
    const by = y - (face === 'wow' ? 26 : 19), inner = i === 0 ? 1 : -1;   // inner side of eye 0 is +x
    const tilt = face === 'worried' || face === 'sad' ? 6 : 0;
    ink(g, [[x - 10, by + (inner > 0 ? tilt * .6 : -tilt)], [x + 10, by + (inner > 0 ? -tilt : tilt * .6)]], 3.6, { seed: 50 + i });
  });
  const mx = R * .35, my = hy + R * .5;
  if (face === 'happy') shape(g, spline([[mx - 16, my - 6], [mx + 14, my - 8], [mx + 4, my + 12], [mx - 10, my + 10]], true, 6), { fill: PAL.coralD, line: 3.2, seed: 60, grain: 0, breaks: 0 });
  else if (face === 'wow') shape(g, ellipse(mx, my + 2, 8, 11, 14), { fill: PAL.coralD, line: 3.2, seed: 61, grain: 0, breaks: 0 });
  else if (face === 'worried') ink(g, spline([[mx - 14, my + 4], [mx - 5, my - 2], [mx + 4, my + 3], [mx + 13, my - 1]], false, 5), 3.4, { seed: 62 });
  else if (face === 'sad') ink(g, spline([[mx - 13, my + 5], [mx, my - 3], [mx + 13, my + 5]], false, 5), 3.6, { seed: 63 });
  else ink(g, spline([[mx - 12, my - 2], [mx, my + 4], [mx + 10, my - 3]], false, 5), 3.4, { seed: 64 });
  shape(g, ellipse(-R * .2, hy + R * .3, 11, 7, 12), { fill: PAL.pink, line: 0, grain: 0, alpha: .8 });
  arm('armF', 70);
  if (o.prop) o.prop(armJ('armF'));
  g.restore();
}
// ---------- graphic devices ----------
export function medallion(x, y, r, label, p, o = {}) {   // a stamped ink disc with a paper label
  if (p <= 0) return; const k = back(seg(p, 0, 1)), sc = .3 + .7 * k;
  g.save(); g.translate(x, y); g.scale(sc, sc); g.rotate((o.rot ?? -.12) * (1 - k));
  star(g, 0, 0, r * 1.35, { n: 16, inner: .8, fill: o.burst || PAL.mustard });
  shape(g, ellipse(0, 0, r, r, 48), { fill: o.fill || PAL.ink, line: 0, off: [0, 0], grain: .1 });
  ink(g, ellipse(0, 0, r * .86, r * .86, 48), 4, { closed: true, color: PAL.paper, breaks: .2, seed: 5 });
  const lines = String(label).split('\n'), fs = o.size || r * .55;
  lines.forEach((ln, i) => text(g, ln, 0, (i - (lines.length - 1) / 2) * fs * 1.0 + fs * .35, { font: `${fs}px Slab`, fill: PAL.paper, align: 'center', plate: PAL.coral }));
  g.restore();
}
export function tag(x, y, str, p, o = {}) {   // a paper detail card with a star bullet
  if (p <= 0) return; const k = back(seg(p, 0, 1));
  const fs = o.size || 64, font = `600 ${fs}px Jost`, w = measure(g, str, font) + fs * 1.7, h = fs * 1.6;
  g.save(); g.translate(x, y); g.scale(k, k); g.rotate(o.rot ?? -.04);
  shape(g, rrect(-w / 2, -h / 2, w, h, 18), { fill: o.fill || PAL.white, line: 4, seed: 7, grain: .2 });
  star(g, -w / 2 + fs * .6, 0, fs * .32, { n: 4, inner: .35, fill: o.star || PAL.coral });
  text(g, str, -w / 2 + fs * 1.1, fs * .34, { font, fill: PAL.ink });
  g.restore();
}
export function header(str, y, p, o = {}) {   // big slab title with an off-register plate
  if (p <= 0) return; const e = eo(seg(p, 0, 1)), fs = o.size || 120;
  text(g, str, W / 2 + (1 - e) * 80, y, { font: `${fs}px Slab`, fill: o.fill || PAL.ink, align: 'center', plate: o.plate || PAL.coral, alpha: e, maxW: W - 120 });
}
export function script(str, y, p, o = {}) {   // Oleo script kicker that writes on left to right
  if (p <= 0) return; const fs = o.size || 110, font = `700 ${fs}px Oleo`, w = measure(g, str, font);
  g.save(); g.beginPath(); g.rect(W / 2 - w / 2 - 20, y - fs, (w + 40) * eo(seg(p, 0, 1)), fs * 1.5); g.clip();
  text(g, str, W / 2, y, { font, fill: o.fill || PAL.ink, align: 'center', plate: o.plate || PAL.mustard }); g.restore();
}
// colour-block wipe: draws `next` inside a growing rectangle from the side (p 0..1)
export function wipe(p, col, next, dir = 1) {
  if (p <= 0) return; const e = eio(p), x0 = dir > 0 ? 0 : W * (1 - e);
  g.save(); g.beginPath(); g.rect(x0, 0, W * e, H); g.clip(); next(); g.restore();
  if (e < 1) shape(g, rect(dir > 0 ? W * e - 30 : W * (1 - e), 0, 30, H), { fill: col, line: 0, off: [0, 0], grain: .2 });
}
// iris: draws `next` inside a growing circle at (x,y)
export function iris(p, x, y, next) { if (p <= 0) return; const r = eio(p) * 2300; g.save(); g.beginPath(); g.arc(x, y, Math.max(1, r), 0, TAU); g.clip(); next(); g.restore(); ink(g, ellipse(x, y, r, r, 64), 8, { closed: true, seed: 9 }); }
export function clockFace(x, y, r, min, o = {}) {   // a wall clock at 4:00 + min minutes
  shape(g, ellipse(x, y, r, r, 48), { fill: o.fill || PAL.white, line: 6, seed: 12, grain: .15 });
  for (let k = 0; k < 12; k++) { const a = k / 12 * TAU; ink(g, [[x + Math.cos(a) * r * .78, y + Math.sin(a) * r * .78], [x + Math.cos(a) * r * .9, y + Math.sin(a) * r * .9]], k % 3 ? 3 : 6, { seed: 13 + k, taper: false }); }
  const am = -Math.PI / 2 + min / 60 * TAU, ah = -Math.PI / 2 + (4 + min / 60) / 12 * TAU;
  ink(g, [[x, y], [x + Math.cos(ah) * r * .5, y + Math.sin(ah) * r * .5]], r * .09, { seed: 30, taper: false });
  ink(g, [[x, y], [x + Math.cos(am) * r * .75, y + Math.sin(am) * r * .75]], r * .055, { seed: 31, taper: false, color: o.hand || PAL.coralD });
  shape(g, ellipse(x, y, r * .07, r * .07, 12), { fill: PAL.ink, line: 0, off: [0, 0], grain: 0 });
}
