// One-off: turn sample10 scenes into the vlogger version (pop words instead of read-along captions).
const fs = require('fs');
const dir = process.argv[2];
const edit = (f, pairs) => {
  let c = fs.readFileSync(dir + f, 'utf8');
  for (const [a, b] of pairs) {
    if (!c.includes(a)) throw new Error(f + ' missing: ' + a.slice(0, 60));
    c = c.split(a).join(b);
  }
  fs.writeFileSync(dir + f, c);
};
const pop = (id, x, y, size, text, color) =>
  `<text id="${id}" x="${x}" y="${y}" text-anchor="middle" style="font-family:InkHand;font-weight:700;font-size:${size}px;fill:${color};stroke:#0d0f22;stroke-width:14px;paint-order:stroke;stroke-linejoin:round">${text}</text>`;

// ---------- hook ----------
let h = fs.readFileSync(dir + 'hook.html', 'utf8');
h = h.replace(/<div id="phook-cap"[\s\S]*?<\/div>\n/, '');
h = h.replace(/<script>[\s\S]*<\/script>/, `<script>
    // times come from assets/timing.js (window.VO), written per voice by tools/prep.js
    const V = window.VO, tl = gsap.timeline({ paused: true });
    const L = (i, f) => V[i].start + (V[i].end - V[i].start) * f;
    tl.fromTo("#phook-head", { scale: 0.94, opacity: 0, transformOrigin: "50% 50%" }, { scale: 1, opacity: 1, duration: 0.5, ease: "expo.out" }, 0);
    tl.fromTo("#phook-browR", { y: 0 }, { y: -22, duration: 0.25, ease: "back.out(2)" }, L(0, 0.55));
    tl.to("#phook-browR", { y: 0, duration: 0.3, ease: "power2.inOut" }, V[1].start);
    // line 2: phone comes up, eyes drop to it, money leaves
    tl.fromTo("#phook-phone", { y: 420 }, { y: 0, duration: 0.5, ease: "expo.out" }, V[1].start);
    tl.fromTo("#phook-glow", { opacity: 0 }, { opacity: 1, duration: 0.4 }, V[1].start + 0.1);
    tl.fromTo(["#phook-p1", "#phook-p2"], { x: 0, y: 0 }, { x: -16, y: 20, duration: 0.3, ease: "power3.out" }, V[1].start + 0.2);
    ["#phook-t1", "#phook-t2", "#phook-t3"].forEach((id, i) =>
      tl.fromTo(id, { opacity: 0, x: 300, y: 140 }, { opacity: 1, x: 0, y: 0, duration: 0.55, ease: "expo.out" }, L(1, 0.2 + i * 0.15)));
    tl.fromTo("#phook-1am", { opacity: 0, scale: 0.3, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(2.2)" }, L(1, 0.5));
    // "and wince": squint + sweat
    tl.fromTo("#phook-eyes", { scaleY: 1, svgOrigin: "0 30" }, { scaleY: 0.3, duration: 0.12, ease: "power2.in" }, L(1, 0.86));
    tl.to("#phook-eyes", { scaleY: 1, duration: 0.25, ease: "power2.out" }, L(1, 0.86) + 0.55);
    tl.fromTo("#phook-sweat", { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }, L(1, 0.86));
    // line 3: "Yeah. Me too." sheepish shrug at the camera
    tl.to(["#phook-p1", "#phook-p2"], { x: 0, y: 0, duration: 0.25, ease: "power2.out" }, V[2].start);
    tl.to("#phook-mouth", { opacity: 0, duration: 0.15 }, V[2].start);
    tl.fromTo("#phook-smile", { opacity: 0 }, { opacity: 1, duration: 0.15 }, V[2].start);
    tl.fromTo("#phook-head", { rotation: 0, svgOrigin: "0 300" }, { rotation: -6, duration: 0.3, ease: "power2.out" }, V[2].start + 0.1);
    tl.to(["#phook-1am", "#phook-t1", "#phook-t2", "#phook-t3"], { opacity: 0, duration: 0.2 }, V[2].start);
    // push through into the next scene
    tl.to("#phook-head", { scale: 1.3, duration: 0.25, ease: "power3.in" }, V[3].start - 0.25);
    window.__timelines["phook"] = tl;
  </script>`);
fs.writeFileSync(dir + 'hook.html', h);
edit('hook.html', [
  ['<!-- eyes -->', '<g id="phook-eyes"><!-- eyes -->'],
  ['<!-- brows: worried -->', '</g><!-- brows: worried -->'],
  ['<path class="k" d="M52,-112 C84,-88 130,-70 170,-60"', '<path id="phook-browR" class="k" d="M52,-112 C84,-88 130,-70 170,-60"'],
  ['<path class="k" d="M-60,190 C-40,176 -20,196 0,182 C20,168 40,190 62,178" fill="none" stroke-width="9"/>',
   '<path id="phook-mouth" class="k" d="M-60,190 C-40,176 -20,196 0,182 C20,168 40,190 62,178" fill="none" stroke-width="9"/>\n        <path id="phook-smile" class="k" d="M-70,176 C-30,214 40,214 76,170" fill="none" stroke-width="10"/>'],
  ['<!-- money leaving -->', pop('phook-1am', 430, 330, 170, '1 AM', '#ffb35c') + '\n      <!-- money leaving -->'],
]);

// ---------- reveal ----------
let r = fs.readFileSync(dir + 'reveal.html', 'utf8');
r = r.replace(/<div id="rev-capa"[\s\S]*?<\/div>\n/, '').replace(/<div id="rev-capb"[\s\S]*?<\/div>\n/, '');
r = r.replace(/<script>[\s\S]*<\/script>/, `<script>
    // scene host starts at line 4; times are film time minus that start
    const V = window.VO, o = V[3].start, tl = gsap.timeline({ paused: true });
    const L = (i, f) => V[i].start - o + (V[i].end - V[i].start) * f;
    tl.fromTo("#rev-young", { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: 0.5, ease: "expo.out" }, 0);
    tl.fromTo(["#rev-oldlit", "#rev-olddark"], { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "power2.out" }, 0.1);
    tl.fromTo("#rev-dots", { strokeDashoffset: 300 }, { strokeDashoffset: 0, duration: 0.8, ease: "power2.inOut" }, 0.2);
    tl.fromTo(["#rev-p1", "#rev-p2"], { x: 0 }, { x: 20, duration: 0.3, ease: "power3.out" }, 0.4);
    tl.fromTo(["#rev-q", "#rev-qg"], { opacity: 0, scale: 0.4, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(2)" }, L(3, 0.35));
    tl.fromTo("#rev-someone", { opacity: 0, scale: 0.3, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(2.2)" }, L(3, 0.8));
    // line 5: "And you've definitely met him." the stranger lights up as you
    const t5 = L(4, 0.15);
    tl.to(["#rev-q", "#rev-qg", "#rev-someone"], { opacity: 0, duration: 0.2, ease: "power3.in" }, t5 - 0.1);
    tl.to("#rev-olddark", { opacity: 0, duration: 0.45, ease: "power2.inOut" }, t5);
    tl.fromTo("#rev-warmglow", { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "power2.out" }, t5);
    tl.to("#rev-dots", { opacity: 0, duration: 0.2 }, t5);
    tl.fromTo("#rev-line", { strokeDasharray: 320, strokeDashoffset: 320 }, { strokeDashoffset: 0, duration: 0.5, ease: "power2.out" }, t5 + 0.1);
    tl.fromTo(["#rev-p1", "#rev-p2"], { scale: 1 }, { scale: 1.25, duration: 0.25, ease: "back.out(2)" }, t5 + 0.15);
    tl.fromTo("#rev-ol", { opacity: 0 }, { opacity: 1, duration: 0.3 }, t5 + 0.3);
    tl.fromTo("#rev-you", { opacity: 0, scale: 0.3, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(2.2)" }, L(4, 0.75));
    tl.fromTo("#rev-wave", { opacity: 0, y: 80 }, { opacity: 1, y: 0, duration: 0.35, ease: "back.out(1.6)" }, t5 + 0.3);
    [0, 1, 2].forEach(i => tl.fromTo("#rev-hand", { rotation: -14, svgOrigin: "1690 760" }, { rotation: 14, duration: 0.18, yoyo: true, repeat: 1, ease: "sine.inOut" }, t5 + 0.6 + i * 0.36));
    window.__timelines["reveal"] = tl;
  </script>`);
fs.writeFileSync(dir + 'reveal.html', r);
edit('reveal.html', [
  ['<text x="560" y="1045"', pop('rev-someone', 960, 300, 150, 'someone', '#ffb35c') + '\n      ' + pop('rev-you', 960, 300, 170, 'you.', '#ffb35c') + `
      <g id="rev-wave"><g id="rev-hand">
        <path d="M1640,900 C1660,840 1680,800 1690,760" fill="none" stroke="#0d0f22" stroke-width="46" stroke-linecap="round"/>
        <path d="M1640,900 C1660,840 1680,800 1690,760" fill="none" stroke="#2f7c72" stroke-width="32" stroke-linecap="round"/>
        <circle cx="1694" cy="730" r="34" fill="#efcaa9" stroke="#0d0f22" stroke-width="8"/>
        <path d="M1672,708 L1666,684 M1690,700 L1690,674 M1708,704 L1716,682" stroke="#0d0f22" stroke-width="8" stroke-linecap="round"/>
      </g></g>
      <text x="560" y="1045"`],
  ['data-duration="5.5" viewBox', 'data-duration="12" viewBox'],
]);
console.log('ok');
