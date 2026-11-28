// HyperFrames Shorts kit (Mrs. Money Mind). Builds SVG characters and props into the page and adds
// seek-safe tweens. RULE: never animate an element that has its own transform attribute; wrap it:
// <g transform="translate(x,y)"><g id="thing">...</g></g> and animate #thing.
// seek-safe tweens to one paused GSAP timeline. Everything is a pure function of time: no Math.random, no Date.
(function (root) {
  "use strict";
  var NS = "http://www.w3.org/2000/svg";
  var INK = "#0d0f22";
  function svg(markup) {
    var g = document.createElementNS(NS, "g");
    g.innerHTML = markup;
    return g;
  }
  function add(parent, markup) { var g = svg(markup); (typeof parent === "string" ? document.querySelector(parent) : parent).appendChild(g); return g; }

  // ---- characters --------------------------------------------------------------------------------
  // Bust character centred on (0,0) = middle of the head (radius 290 at scale 1).
  var LOOKS = {
    kid:      { skin: "#f4d2b6", skinD: "#e3b394", ear: "#eec2a2", hair: "#1c1a30", coat: "#e3a63a", coatD: "#c98b2c", tuft: true },
    neighbor: { skin: "#c98f6b", skinD: "#b07a58", ear: "#bd8562", hair: "#2a1a12", coat: "#3fae6a", coatD: "#2f8a52", cap: "#d8432f" },
    boss:     { skin: "#f1c9a5", skinD: "#dcae8a", ear: "#e6b994", hair: "#8a8f9c", coat: "#3d4a7a", coatD: "#2c3760", tie: "#d8432f", glasses: true },
    friend:   { skin: "#8d5a3c", skinD: "#774a30", ear: "#7f5034", hair: "#120d0a", coat: "#c9539a", coatD: "#a2407b", bun: true }
  };
  function person(id, look, o) {
    o = o || {};
    var L = Object.assign({}, LOOKS[look] || LOOKS.kid, o.look || {});
    var cap = L.cap ? '<path class="k" d="M-290,-120 C-280,-330 280,-330 290,-120 Z" fill="' + L.cap + '" stroke-width="10"/><path class="k" d="M-300,-120 L-30,-130 C80,-140 300,-100 390,-60 C300,-60 200,-100 -300,-110 Z" fill="' + L.cap + '" stroke-width="10"/><circle cx="0" cy="-250" r="20" fill="#fff"/>' : "";
    var hair = L.cap ? "" : '<path class="k" d="M-302,-30 C-326,-330 300,-352 306,-40 C262,-150 160,-186 80,-146 C58,-200 -62,-206 -112,-146 C-182,-186 -272,-136 -302,-30 Z" fill="' + L.hair + '" stroke-width="10"/>';
    var tuft = L.tuft ? '<g id="' + id + '-tuft"><path class="k" d="M10,-300 C-6,-392 96,-410 86,-338 C72,-372 34,-362 44,-306 Z" fill="' + L.hair + '" stroke-width="8"/></g>' : "";
    var bun = L.bun ? '<circle class="k" cx="0" cy="-330" r="90" fill="' + L.hair + '" stroke-width="10"/>' : "";
    var tie = L.tie ? '<path class="k" d="M-26,330 L26,330 L40,470 L0,520 L-40,470 Z" fill="' + L.tie + '" stroke-width="8"/>' : '<path d="M-60,358 L-66,470 M60,358 L66,470" stroke="#f4f1ff" stroke-width="9" stroke-linecap="round"/>';
    var glasses = L.glasses ? '<g fill="none" stroke="' + INK + '" stroke-width="10"><circle cx="-104" cy="30" r="88"/><circle cx="104" cy="30" r="88"/><path d="M-16,20 L16,20"/></g>' : "";
    function pupil(side, x) {
      return '<g transform="translate(' + x + ',30)"><g id="' + id + '-p' + side + '">' +
        '<g class="' + id + '-eye-n"><circle r="42" fill="#151530"/><circle cx="15" cy="-18" r="13" fill="#fff"/><circle cx="-16" cy="18" r="6" fill="#fff"/></g>' +
        '<g class="' + id + '-eye-h" opacity="0"><path d="M0,26 C-48,-10 -54,-46 -26,-58 C-8,-64 0,-48 0,-40 C0,-48 8,-64 26,-58 C54,-46 48,-10 0,26 Z" fill="#ff4f6d" stroke="' + INK + '" stroke-width="5"/></g>' +
        '<g class="' + id + '-eye-d" opacity="0"><circle r="44" fill="#151530"/><text y="20" text-anchor="middle" style="font:900 58px \'Archivo Black\',sans-serif" fill="#7dff9a">$</text></g>' +
        '<g class="' + id + '-eye-s" opacity="0"><path d="M-30,0 C-30,-30 30,-30 30,0 C30,22 -14,22 -14,0 C-14,-12 10,-12 10,0" fill="none" stroke="#151530" stroke-width="10" stroke-linecap="round"/></g>' +
        '</g></g>';
    }
    var m =
      '<path class="' + id + '-m ' + id + '-m-flat k" d="M-50,190 C-20,198 20,198 50,190" fill="none" stroke-width="9"/>' +
      '<path class="' + id + '-m ' + id + '-m-smile k" d="M-80,170 C-60,250 60,250 80,170 Z" fill="#7a2034" stroke-width="9" opacity="0"/>' +
      '<ellipse class="' + id + '-m ' + id + '-m-o k" cx="0" cy="200" rx="40" ry="50" fill="#7a2034" stroke-width="9" opacity="0"/>' +
      '<path class="' + id + '-m ' + id + '-m-frown k" d="M-60,214 C-30,176 30,176 60,214" fill="none" stroke-width="10" opacity="0"/>';
    var body = '<g id="' + id + '-body"><path class="k" d="M-330,620 C-330,360 -200,300 0,300 C200,300 330,360 330,620 Z" fill="' + L.coat + '" stroke-width="10"/>' +
      '<path class="k" d="M-150,318 C-80,380 80,380 150,318" fill="' + L.coatD + '" stroke-width="8"/>' + tie + '</g>';
    var head = '<g id="' + id + '-head">' + bun +
      '<ellipse class="k" cx="-292" cy="20" rx="44" ry="66" fill="' + L.ear + '" stroke-width="10"/>' +
      '<ellipse class="k" cx="292" cy="20" rx="44" ry="66" fill="' + L.ear + '" stroke-width="10"/>' +
      '<circle class="k" cx="0" cy="0" r="290" fill="' + L.skin + '" stroke-width="10"/>' +
      '<path d="M150,-210 C260,-120 280,60 210,190 C270,60 250,-100 150,-210 Z" fill="' + L.skinD + '" opacity="0.7"/>' +
      hair + cap + tuft +
      '<ellipse class="k" cx="-104" cy="30" rx="66" ry="76" fill="#fff" stroke-width="9"/><ellipse class="k" cx="104" cy="30" rx="66" ry="76" fill="#fff" stroke-width="9"/>' +
      pupil("L", -104) + pupil("R", 104) +
      '<g id="' + id + '-lids" opacity="0"><ellipse cx="-104" cy="30" rx="70" ry="80" fill="' + L.skin + '"/><ellipse cx="104" cy="30" rx="70" ry="80" fill="' + L.skin + '"/>' +
      '<path class="k" d="M-170,40 C-130,60 -80,60 -38,40 M38,40 C80,60 130,60 170,40" fill="none" stroke-width="9"/></g>' +
      glasses +
      '<g id="' + id + '-brL"><path class="k" d="M-170,-80 C-130,-96 -84,-104 -48,-100" fill="none" stroke-width="16"/></g>' +
      '<g id="' + id + '-brR"><path class="k" d="M48,-100 C84,-104 130,-96 170,-80" fill="none" stroke-width="16"/></g>' +
      '<path class="k" d="M0,90 C14,104 12,118 -2,124" fill="none" stroke-width="8"/>' +
      '<ellipse id="' + id + '-blL" cx="-190" cy="130" rx="46" ry="28" fill="#ff8f86" opacity="0.4"/><ellipse id="' + id + '-blR" cx="190" cy="130" rx="46" ry="28" fill="#ff8f86" opacity="0.4"/>' +
      m +
      '<path id="' + id + '-sweat" class="k" d="M238,-120 C222,-90 220,-66 240,-60 C260,-66 256,-92 238,-120 Z" fill="#9fe3ff" stroke-width="6" opacity="0"/>' +
      '</g>';
    var x = o.x || 0, y = o.y || 0, s = o.s || 1, flip = o.flip ? -1 : 1;
    return '<g transform="translate(' + x + ',' + y + ') scale(' + (s * flip) + ',' + s + ')"><g id="' + id + '">' + body + head + '</g></g>';
  }

  // ---- face + body acting (all on the timeline) ------------------------------------------------
  var MOUTHS = ["flat", "smile", "o", "frown"], EYES = ["n", "h", "d", "s"];
  function face(tl, id, f, t) {
    // f: {m: mouth, e: eyes, br: brow angle (deg, + = worried), look: [x,y], blush, sweat}
    if (f.m) MOUTHS.forEach(function (k) { tl.set("." + id + "-m-" + k, { opacity: k === f.m ? 1 : 0 }, t); });
    if (f.m) tl.fromTo("." + id + "-m-" + f.m, { scale: 0.6, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.25, ease: "back.out(3)", immediateRender: false }, t);
    if (f.e) {
      EYES.forEach(function (k) { tl.set("." + id + "-eye-" + k, { opacity: k === f.e ? 1 : 0 }, t); });
      if (f.e !== "n") tl.fromTo("." + id + "-eye-" + f.e, { scale: 0.2, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.4, ease: "back.out(3)", immediateRender: false }, t);
    }
    if (f.br != null) {
      tl.to("#" + id + "-brL", { rotation: -f.br, y: f.br > 0 ? -14 : 0, svgOrigin: "-110 -95", duration: 0.2, ease: "power2.out" }, t);
      tl.to("#" + id + "-brR", { rotation: f.br, y: f.br > 0 ? -14 : 0, svgOrigin: "110 -95", duration: 0.2, ease: "power2.out" }, t);
    }
    if (f.look) tl.to(["#" + id + "-pL", "#" + id + "-pR"], { x: f.look[0], y: f.look[1], duration: 0.3, ease: "power3.out" }, t);
    if (f.blush != null) tl.to(["#" + id + "-blL", "#" + id + "-blR"], { opacity: f.blush, duration: 0.3 }, t);
    if (f.sweat != null) tl.to("#" + id + "-sweat", { opacity: f.sweat, duration: 0.25 }, t);
  }
  function blink(tl, id, t) {
    tl.set("#" + id + "-lids", { opacity: 1 }, t);
    tl.set("#" + id + "-lids", { opacity: 0 }, t + 0.1);
  }
  function react(tl, id, t, amt) {  // a bob with overlapping action (tuft lags)
    amt = amt || 1;
    tl.fromTo("#" + id, { y: 0 }, { y: 26 * amt, duration: 0.1, ease: "power2.out", immediateRender: false }, t);
    tl.to("#" + id, { y: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" }, t + 0.1);
    if (document.getElementById(id + "-tuft")) {
      tl.fromTo("#" + id + "-tuft", { rotation: 0, svgOrigin: "40 -306" }, { rotation: -16 * amt, duration: 0.12, ease: "power2.out", immediateRender: false }, t + 0.04);
      tl.to("#" + id + "-tuft", { rotation: 0, duration: 0.9, ease: "elastic.out(1.2, 0.3)" }, t + 0.16);
    }
  }
  function sway(tl, id, t0, t1) {  // breathing idle, no infinite repeats
    var n = Math.max(1, Math.round((t1 - t0) / 1.6));
    for (var i = 0; i < n; i++) tl.to("#" + id, { rotation: i % 2 ? 2 : -2, svgOrigin: "0 600", duration: (t1 - t0) / n, ease: "sine.inOut" }, t0 + i * (t1 - t0) / n);
  }

  // ---- text ---------------------------------------------------------------------------------------
  function words(el, html) {  // split a caption into word spans (keeps <b> highlights)
    var e = typeof el === "string" ? document.querySelector(el) : el;
    e.innerHTML = html.split(" ").map(function (w) { return "<span>" + w + "</span>"; }).join(" ");
    return e;
  }
  function title(tl, sel, t, hold) {
    tl.fromTo(sel + " span", { opacity: 0, filter: "blur(8px)" }, { opacity: 1, filter: "blur(0px)", duration: 0.14, stagger: 0.08, ease: "power4.out" }, t);
    if (hold) tl.to(sel, { opacity: 0, duration: 0.2 }, t + hold);
  }
  // The HOOK: the whole line is readable in frame 0 and already moving (punch-in), held until `until`.
  function hook(tl, sel, html, until) {
    words(sel, html);
    document.querySelector(sel).classList.add("hook");
    tl.fromTo(sel, { scale: 1.22, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.5, ease: "back.out(2.2)" }, 0);
    tl.fromTo(sel + " span", { y: -22 }, { y: 0, duration: 0.35, stagger: 0.05, ease: "back.out(2.5)" }, 0);
    if (until) tl.to(sel, { opacity: 0, duration: 0.2 }, until);
  }
  function counter(tl, el, from, to, t, dur, fmt) {
    var e = typeof el === "string" ? document.querySelector(el) : el, o = { v: from };
    fmt = fmt || function (v) { return Math.round(v).toLocaleString("en-US"); };
    e.textContent = fmt(from);
    tl.to(o, { v: to, duration: dur, ease: "power2.out", onUpdate: function () { e.textContent = fmt(o.v); } }, t);
  }

  // ---- props ------------------------------------------------------------------------------------
  // 100-dot grid (people icons) for percentages; returns the dot class.
  function grid(parent, cls, x, y, cols, gap, r, col) {
    var m = "";
    for (var i = 0; i < 100; i++) {
      var cx = x + (i % cols) * gap, cy = y + Math.floor(i / cols) * gap;
      m += '<g class="' + cls + '" transform="translate(' + cx + ',' + cy + ')"><circle cy="-' + (r * 0.9) + '" r="' + (r * 0.55) + '" fill="' + col + '"/><path d="M-' + r * 0.8 + ',' + r * 0.9 + ' C-' + r * 0.8 + ',0 ' + r * 0.8 + ',0 ' + r * 0.8 + ',' + r * 0.9 + ' Z" fill="' + col + '"/></g>';
    }
    add(parent, m);
    return cls;
  }
  function fillGrid(tl, cls, n, col, t, dur) {  // colour the first n dots, a stagger that lands on n
    var els = Array.prototype.slice.call(document.querySelectorAll("." + cls)).slice(0, n);
    tl.to(els.map(function (e) { return e.querySelectorAll("circle,path"); }).reduce(function (a, b) { return a.concat(Array.prototype.slice.call(b)); }, []),
      { fill: col, duration: 0.05, stagger: (dur || 1) / Math.max(1, n) }, t);
    tl.fromTo(els, { scale: 1 }, { scale: 1.25, duration: 0.08, stagger: (dur || 1) / Math.max(1, n), yoyo: true, repeat: 1, immediateRender: false }, t);
  }
  // scene switch: whip pan (old leaves left, new arrives from right) with motion blur from the root
  function cut(tl, from, to, t, dir) {
    dir = dir || 1;
    if (from) tl.to(from, { x: -1200 * dir, duration: 0.35, ease: "power3.in" }, t);
    if (from) tl.set(from, { opacity: 0 }, t + 0.35);
    tl.fromTo(to, { x: 1200 * dir, opacity: 1 }, { x: 0, opacity: 1, duration: 0.5, ease: "expo.out", immediateRender: false }, t + 0.25);
  }
  function show(tl, sel, t) { tl.set(sel, { opacity: 1, x: 0 }, t); }
  function pop(tl, sel, t, s) {
    tl.fromTo(sel, { opacity: 0, scale: s || 0.4, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(2.4)", immediateRender: false }, t);
  }
  function camera(tl, sel, keys) {  // keys: [[t, scale, x, y, dur]]
    keys.forEach(function (k) { tl.to(sel, { scale: k[1], x: k[2] || 0, y: k[3] || 0, svgOrigin: "540 960", duration: k[4] || 0.8, ease: "power2.inOut" }, k[0]); });
  }
  root.K = { add: add, person: person, face: face, blink: blink, react: react, sway: sway, words: words, title: title, hook: hook,
    counter: counter, grid: grid, fillGrid: fillGrid, cut: cut, show: show, pop: pop, camera: camera, INK: INK };
})(window);
