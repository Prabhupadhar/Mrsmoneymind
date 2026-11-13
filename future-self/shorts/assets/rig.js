// Shared character rig + declarative animation for "The Stranger You're Robbing".
// Characters: <g data-rig="kid|old|sil|nb" data-p="prefix" data-o='{"look":[x,y],...}'> filled by Rig.fill().
// Animation:  data-in="line,frac[,kind]"  data-out="line,frac[,kind]"  on any element.
// Times come from window.VO (voice timing) and window.SCENES (scene start), written by tools/prep-film.cjs.
(function () {
  const INK = '#0d0f22', ORANGE = '#ff8a2a', PURPLE = '#8f7dff';
  const k = (d, extra) => `class="rk" d="${d}" ${extra || ''}`;

  const BROWS = {
    worry: ['M-170,-60 C-130,-70 -84,-88 -52,-112', 'M52,-112 C84,-88 130,-70 170,-60'],
    up: ['M-170,-110 C-130,-140 -84,-140 -52,-120', 'M52,-120 C84,-140 130,-140 170,-110'],
    flat: ['M-170,-80 C-130,-92 -84,-92 -52,-84', 'M52,-84 C84,-92 130,-92 170,-80'],
    mad: ['M-170,-100 C-130,-92 -84,-76 -52,-62', 'M52,-62 C84,-76 130,-92 170,-100'],
  };
  const KID_MOUTHS = {
    worry: `<path ${k('M-60,190 C-40,176 -20,196 0,182 C20,168 40,190 62,178', 'fill="none" stroke-width="10"')}/>`,
    smile: `<path ${k('M-70,176 C-30,214 40,214 76,170', 'fill="none" stroke-width="11"')}/>`,
    o: `<ellipse class="rk" cx="10" cy="186" rx="26" ry="32" fill="#4a1f28" stroke-width="10"/>`,
    flat: `<path ${k('M-40,188 L50,188', 'fill="none" stroke-width="10"')}/>`,
    grin: `<path ${k('M-90,156 C-50,232 50,232 90,156 Z', 'fill="#a8483a" stroke-width="11"')}/>`,
    sad: `<path ${k('M-50,204 C-20,176 20,176 50,204', 'fill="none" stroke-width="10"')}/>`,
  };
  const OLD_MOUTHS = {
    grin: `<path ${k('M-90,150 C-50,220 50,220 90,150 Z', 'fill="#a8483a" stroke-width="11"')}/>`,
    smile: `<path ${k('M-70,170 C-30,204 40,204 76,166', 'fill="none" stroke-width="11"')}/>`,
    sad: `<path ${k('M-50,200 C-20,174 20,174 50,200', 'fill="none" stroke-width="10"')}/>`,
    o: `<ellipse class="rk" cx="0" cy="180" rx="24" ry="30" fill="#4a1f28" stroke-width="10"/>`,
    worry: `<path ${k('M-60,186 C-40,172 -20,192 0,178 C20,164 40,186 62,174', 'fill="none" stroke-width="10"')}/>`,
  };

  const HAPPY = `<path ${k('M-150,24 C-130,0 -80,0 -60,24', 'fill="none" stroke-width="12"')}/><path ${k('M60,24 C80,0 130,0 150,24', 'fill="none" stroke-width="12"')}/>`;
  const tears = (p, o) => `<g id="${p}-tears" opacity="${o.tears ? 1 : 0}">
        <path ${k('M-150,100 C-162,150 -150,200 -160,250 C-140,252 -128,200 -132,102 Z', 'fill="#9fe3ff" stroke-width="7"')}/>
        <path ${k('M150,100 C162,150 150,200 160,250 C140,252 128,200 132,102 Z', 'fill="#9fe3ff" stroke-width="7"')}/>
      </g>`;
  const mouthSet =(p, set, cur) => Object.keys(set).map(m =>
    `<g id="${p}-m-${m}" opacity="${m === cur ? 1 : 0}">${set[m]}</g>`).join('');

  const pupil = (p, n, x, dollar) => `<g transform="translate(${x},30)"><g id="${p}-p${n}">
      <circle r="42" fill="#151530"/>${dollar ? `<text x="0" y="15" text-anchor="middle" style="font-family:'Archivo Black';font-size:38px;fill:${ORANGE}">$</text>` : ''}
      <circle cx="14" cy="-18" r="13" fill="#fff"/><circle cx="-16" cy="18" r="6" fill="#fff"/></g></g>`;

  const KID_SIL = `<path d="M-330,520 C-330,330 -200,280 0,280 C200,280 330,330 330,520 Z"/>
    <ellipse cx="-292" cy="20" rx="44" ry="66"/><ellipse cx="292" cy="20" rx="44" ry="66"/><circle r="290"/>
    <path d="M-302,-30 C-326,-330 300,-352 306,-40 C262,-150 160,-186 80,-146 C58,-200 -62,-206 -112,-146 C-182,-186 -272,-136 -302,-30 Z"/>
    <path d="M10,-300 C-6,-392 96,-410 86,-338 C72,-372 34,-362 44,-306 Z"/>`;
  const OLD_SIL = `<path d="M-340,560 C-340,340 -210,286 0,286 C210,286 340,340 340,560 Z"/>
    <ellipse cx="-292" cy="20" rx="44" ry="66"/><ellipse cx="292" cy="20" rx="44" ry="66"/><circle r="290"/>
    <path d="M-296,40 C-350,-40 -320,-170 -230,-190 C-250,-100 -250,-20 -220,50 Z"/>
    <path d="M296,40 C350,-40 320,-170 230,-190 C250,-100 250,-20 220,50 Z"/>
    <path d="M10,-300 C-6,-392 96,-410 86,-338 C72,-372 34,-362 44,-306 Z"/>`;

  function kid(p, o) {
    const b = BROWS[o.brows || 'worry'];
    return `<g id="${p}-rig">
      <g transform="translate(16,-12)" fill="${ORANGE}">${KID_SIL}</g>
      <g transform="translate(-10,8)" fill="${PURPLE}" opacity="0.8">${KID_SIL}</g>
      <path ${k('M-330,520 C-330,330 -200,280 0,280 C200,280 330,330 330,520 Z', `fill="${o.shirt || '#e3a63a'}" stroke-width="10"`)}/>
      <path ${k('M-150,300 C-80,360 80,360 150,300', 'fill="#c98b2c" stroke-width="8"')}/>
      <path d="M-60,340 L-66,470 M60,340 L66,470" stroke="#f4f1ff" stroke-width="9" stroke-linecap="round"/>
      <ellipse class="rk" cx="-292" cy="20" rx="44" ry="66" fill="#eec2a2" stroke-width="10"/>
      <ellipse class="rk" cx="292" cy="20" rx="44" ry="66" fill="#eec2a2" stroke-width="10"/>
      <circle class="rk" r="290" fill="#f4d2b6" stroke-width="10"/>
      <path d="M150,-210 C260,-120 280,60 210,190 C270,60 250,-100 150,-210 Z" fill="#e3b394" opacity="0.7"/>
      <path ${k('M-302,-30 C-326,-330 300,-352 306,-40 C262,-150 160,-186 80,-146 C58,-200 -62,-206 -112,-146 C-182,-186 -272,-136 -302,-30 Z', 'fill="#1c1a30" stroke-width="10"')}/>
      <path ${k('M10,-300 C-6,-392 96,-410 86,-338 C72,-372 34,-362 44,-306 Z', 'fill="#1c1a30" stroke-width="8"')}/>
      <g id="${p}-eyes">${o.happy ? HAPPY : `
        <ellipse class="rk" cx="-104" cy="30" rx="66" ry="76" fill="#fff" stroke-width="9"/>
        <ellipse class="rk" cx="104" cy="30" rx="66" ry="76" fill="#fff" stroke-width="9"/>
        ${pupil(p, 1, -104, o.dollar)}${pupil(p, 2, 104, o.dollar)}`}
      </g>
      <path id="${p}-bl" ${k(b[0], 'fill="none" stroke-width="16"')}/>
      <path id="${p}-br" ${k(b[1], 'fill="none" stroke-width="16"')}/>
      <path ${k('M0,90 C14,104 12,118 -2,124', 'fill="none" stroke-width="8"')}/>
      <ellipse cx="-190" cy="130" rx="44" ry="26" fill="#ff8f86" opacity="0.45"/>
      <ellipse cx="190" cy="130" rx="44" ry="26" fill="#ff8f86" opacity="0.45"/>
      ${mouthSet(p, KID_MOUTHS, o.mouth || 'worry')}
      <path id="${p}-sweat" ${k('M238,-120 C222,-90 220,-66 240,-60 C260,-66 256,-92 238,-120 Z', `fill="#9fe3ff" stroke-width="6" opacity="${o.sweat ? 1 : 0}"`)}/>
      ${tears(p, o)}
    </g>`;
  }

  function old(p, o) {
    const happy = o.eyes !== 'open';
    return `<g id="${p}-rig">
      <g transform="translate(16,-12)" fill="${ORANGE}">${OLD_SIL}</g>
      <path ${k('M-340,560 C-340,340 -210,286 0,286 C210,286 340,340 340,560 Z', 'fill="#2f7c72" stroke-width="12"')}/>
      <path ${k('M-90,296 L0,400 L90,296', 'fill="#f3ecdf" stroke-width="10"')}/>
      <line class="rk" x1="0" y1="400" x2="0" y2="560" stroke-width="9"/>
      <circle cx="26" cy="450" r="14" fill="#f3e6c8"/><circle cx="26" cy="510" r="14" fill="#f3e6c8"/>
      <ellipse class="rk" cx="-292" cy="20" rx="44" ry="66" fill="#eac0a0" stroke-width="12"/>
      <ellipse class="rk" cx="292" cy="20" rx="44" ry="66" fill="#eac0a0" stroke-width="12"/>
      <circle class="rk" r="290" fill="#efcaa9" stroke-width="12"/>
      <path ${k('M-296,40 C-350,-40 -320,-170 -230,-190 C-250,-100 -250,-20 -220,50 Z', 'fill="#f7f3ea" stroke-width="10"')}/>
      <path ${k('M296,40 C350,-40 320,-170 230,-190 C250,-100 250,-20 220,50 Z', 'fill="#f7f3ea" stroke-width="10"')}/>
      <path d="M-120,-230 C-60,-262 40,-262 100,-236" fill="none" stroke="#fff" stroke-width="16" stroke-linecap="round" opacity="0.55"/>
      <path ${k('M10,-300 C-6,-392 96,-410 86,-338 C72,-372 34,-362 44,-306 Z', 'fill="#f7f3ea" stroke-width="10"')}/>
      <g id="${p}-eyes">
        ${happy ? `<path ${k('M-150,24 C-130,0 -80,0 -60,24', 'fill="none" stroke-width="12"')}/><path ${k('M60,24 C80,0 130,0 150,24', 'fill="none" stroke-width="12"')}/>`
        : `${pupil(p, 1, -104, false)}${pupil(p, 2, 104, false)}`}
      </g>
      <circle class="rk" cx="-104" cy="20" r="74" fill="#fff" fill-opacity="0.22" stroke-width="11"/>
      <circle class="rk" cx="104" cy="20" r="74" fill="#fff" fill-opacity="0.22" stroke-width="11"/>
      <line class="rk" x1="-30" y1="20" x2="30" y2="20" stroke-width="10"/>
      <path class="rk" d="M-210,0 L-190,20 M-214,30 L-190,36 M210,0 L190,20 M214,30 L190,36" stroke-width="7"/>
      <path id="${p}-bl" ${k(o.sadbrows ? BROWS.worry[0] : 'M-170,-90 C-130,-110 -90,-110 -60,-96', 'fill="none" stroke="#f7f3ea" stroke-width="18"')}/>
      <path id="${p}-br" ${k(o.sadbrows ? BROWS.worry[1] : 'M60,-96 C90,-110 130,-110 170,-90', 'fill="none" stroke="#f7f3ea" stroke-width="18"')}/>
      <ellipse cx="-190" cy="140" rx="46" ry="26" fill="#ff8f86" opacity="0.55"/>
      <ellipse cx="190" cy="140" rx="46" ry="26" fill="#ff8f86" opacity="0.55"/>
      ${mouthSet(p, OLD_MOUTHS, o.mouth || 'grin')}
      ${tears(p, o)}
    </g>`;
  }


  // the neighbor: friendly guy next door, red cap, green jacket
  const NB_SIL = `<path d="M-340,540 C-340,330 -210,280 0,280 C210,280 340,330 340,540 Z"/>
    <ellipse cx="-292" cy="20" rx="44" ry="66"/><ellipse cx="292" cy="20" rx="44" ry="66"/><circle r="290"/>
    <path d="M-290,-140 C-300,-410 300,-410 290,-140 Z"/><path d="M-330,-150 C-200,-100 200,-100 330,-150 C318,-196 -318,-196 -330,-150 Z"/>`;
  function nb(p, o) {
    const b = BROWS[o.brows || 'flat'];
    return `<g id="${p}-rig">
      <g transform="translate(16,-12)" fill="${ORANGE}">${NB_SIL}</g>
      <path ${k('M-340,540 C-340,330 -210,280 0,280 C210,280 340,330 340,540 Z', 'fill="#3fae5a" stroke-width="10"')}/>
      <path ${k('M-70,290 L0,380 L70,290', 'fill="#f4f1ff" stroke-width="8"')}/>
      <path ${k('M-150,296 L-70,290 L-20,420 Z', 'fill="#2e8a45" stroke-width="8"')}/>
      <path ${k('M150,296 L70,290 L20,420 Z', 'fill="#2e8a45" stroke-width="8"')}/>
      <line class="rk" x1="0" y1="400" x2="0" y2="540" stroke-width="8"/>
      <rect x="-250" y="420" width="70" height="12" rx="6" fill="#2e8a45"/>
      <ellipse class="rk" cx="-292" cy="20" rx="44" ry="66" fill="#b97c58" stroke-width="10"/>
      <ellipse class="rk" cx="292" cy="20" rx="44" ry="66" fill="#b97c58" stroke-width="10"/>
      <circle class="rk" r="290" fill="#c98d66" stroke-width="10"/>
      <path d="M150,-170 C260,-100 280,60 210,190 C270,60 250,-80 150,-170 Z" fill="#b07a55" opacity="0.7"/>
      <path d="M-282,-120 L-250,-120 L-254,40 C-272,10 -284,-60 -282,-120 Z M282,-120 L250,-120 L254,40 C272,10 284,-60 282,-120 Z" fill="#3a2a22"/>
      <path d="M-200,150 C-160,300 160,300 200,150 C150,250 -150,250 -200,150 Z" fill="#5a3d2c" opacity="0.35"/>
      <path ${k('M-290,-140 C-300,-410 300,-410 290,-140 Z', 'fill="#e8483f" stroke-width="10"')}/>
      <path d="M0,-370 L0,-150" stroke="#b8322b" stroke-width="7"/>
      <circle class="rk" cx="0" cy="-372" r="16" fill="#e8483f" stroke-width="7"/>
      <path d="M90,-280 l12,26 28,4 -20,19 5,28 -25,-13 -25,13 5,-28 -20,-19 28,-4 z" fill="#fff"/>
      <path ${k('M-330,-150 C-200,-100 200,-100 330,-150 C318,-196 -318,-196 -330,-150 Z', 'fill="#c23a32" stroke-width="10"')}/>
      <g id="${p}-eyes">${o.happy ? HAPPY : `
        <ellipse class="rk" cx="-104" cy="30" rx="62" ry="70" fill="#fff" stroke-width="9"/>
        <ellipse class="rk" cx="104" cy="30" rx="62" ry="70" fill="#fff" stroke-width="9"/>
        ${pupil(p, 1, -104, o.dollar)}${pupil(p, 2, 104, o.dollar)}`}
      </g>
      <path id="${p}-bl" ${k(b[0], 'fill="none" stroke-width="16"')}/>
      <path id="${p}-br" ${k(b[1], 'fill="none" stroke-width="16"')}/>
      <path ${k('M0,90 C14,104 12,118 -2,124', 'fill="none" stroke-width="8"')}/>
      <ellipse cx="-190" cy="130" rx="44" ry="26" fill="#ff8f86" opacity="0.35"/>
      <ellipse cx="190" cy="130" rx="44" ry="26" fill="#ff8f86" opacity="0.35"/>
      ${mouthSet(p, KID_MOUTHS, o.mouth || 'smile')}
      <path id="${p}-sweat" ${k('M238,-100 C222,-70 220,-46 240,-40 C260,-46 256,-72 238,-100 Z', `fill="#9fe3ff" stroke-width="6" opacity="${o.sweat ? 1 : 0}"`)}/>
      ${tears(p, o)}
    </g>`;
  }

  function sil(p) {
    return `<g id="${p}-rig">
      <g transform="translate(-16,-12)" fill="#b9a6ff">${OLD_SIL}</g>
      <g fill="#0c1433">${OLD_SIL}</g>
      <g fill="none" stroke="#b9a6ff" stroke-width="10" opacity="0.55">
        <circle cx="-104" cy="30" r="74"/><circle cx="104" cy="30" r="74"/><line x1="-30" y1="30" x2="30" y2="30"/></g>
    </g>`;
  }

  const Rig = {
    fill() {
      document.querySelectorAll('[data-rig]:not([data-rigged])').forEach(el => {
        const o = JSON.parse(el.getAttribute('data-o') || '{}'), p = el.getAttribute('data-p');
        const kind = el.getAttribute('data-rig');
        el.innerHTML = kind === 'kid' ? kid(p, o) : kind === 'nb' ? nb(p, o) : kind === 'old' ? old(p, o) : sil(p);
        el.setAttribute('data-rigged', '1');
        if (o.look) gsap.set([`#${p}-p1`, `#${p}-p2`], { x: o.look[0], y: o.look[1] });
      });
    },
    // film time of a point inside a line: frac of its spoken length (may be <0 or >1)
    at(spec, scene) {
      const [l, f] = String(spec).split(',').map(Number);
      const v = window.VO[l];
      return v.start + (v.end - v.start) * (isNaN(f) ? 0 : f) - window.SCENES[scene];
    },
    run(tl, scene) {
      const root = [...document.querySelectorAll("[data-composition-id]")].find(e => e.getAttribute("data-composition-id") === scene);
      root.querySelectorAll('[data-in]').forEach(el => {
        const [l, f, kind = 'up'] = el.getAttribute('data-in').split(',');
        const t = Math.max(0, Rig.at(`${l},${f}`, scene));
        const from = { opacity: 0 }, to = { opacity: 1, duration: 0.45, ease: 'expo.out' };
        if (kind === 'pop') Object.assign(from, { scale: 0.3, transformOrigin: '50% 50%' }), Object.assign(to, { scale: 1, duration: 0.35, ease: 'back.out(2.2)' });
        if (kind === 'up') from.y = 60, to.y = 0;
        if (kind === 'down') from.y = -60, to.y = 0;
        if (kind === 'left') from.x = -90, to.x = 0;
        if (kind === 'right') from.x = 90, to.x = 0;
        if (kind === 'shot') Object.assign(from, { filter: 'blur(10px)' }), Object.assign(to, { filter: 'blur(0px)', duration: 0.3, ease: 'power2.out' });
        if (kind === 'fade') to.ease = 'power2.out', to.duration = 0.5;
        if (kind === 'grow') Object.assign(from, { scaleY: 0, transformOrigin: '50% 100%', opacity: 1 }), Object.assign(to, { scaleY: 1, duration: 0.7, ease: 'power3.out' });
        if (kind === 'growx') Object.assign(from, { scaleX: 0, transformOrigin: '0% 50%', opacity: 1 }), Object.assign(to, { scaleX: 1, duration: 0.7, ease: 'power3.out' });
        if (kind === 'draw') { const len = +el.getAttribute('data-len') || 1200; Object.assign(from, { strokeDasharray: len, strokeDashoffset: len, opacity: 1 }); Object.assign(to, { strokeDashoffset: 0, duration: 0.6, ease: 'power2.inOut' }); }
        tl.fromTo(el, from, to, t);
      });
      root.querySelectorAll('[data-out]').forEach(el => {
        const [l, f, kind = 'fade'] = el.getAttribute('data-out').split(',');
        const t = Rig.at(`${l},${f}`, scene);
        const to = { opacity: 0, duration: 0.22, ease: 'power3.in' };
        if (kind === 'shot') to.filter = 'blur(10px)';
        if (kind === 'pop') Object.assign(to, { scale: 0.6, transformOrigin: '50% 50%' });
        tl.to(el, to, t);
      });
    },
    // acting helpers (t in scene seconds)
    look(tl, p, x, y, t, d = 0.25) { tl.to([`#${p}-p1`, `#${p}-p2`], { x, y, duration: d, ease: 'power3.out' }, t); },
    mouth(tl, p, from, to, t) { tl.to(`#${p}-m-${from}`, { opacity: 0, duration: 0.08 }, t); tl.to(`#${p}-m-${to}`, { opacity: 1, duration: 0.08 }, t); },
    brows(tl, p, name, t) { const b = BROWS[name]; tl.to(`#${p}-bl`, { attr: { d: b[0] }, duration: 0.2, ease: 'power2.out' }, t); tl.to(`#${p}-br`, { attr: { d: b[1] }, duration: 0.2, ease: 'power2.out' }, t); },
    squint(tl, p, t, hold = 0.5) { tl.to(`#${p}-eyes`, { scaleY: 0.3, svgOrigin: '0 30', duration: 0.1, ease: 'power2.in' }, t); tl.to(`#${p}-eyes`, { scaleY: 1, svgOrigin: '0 30', duration: 0.2, ease: 'power2.out' }, t + hold); },
    widen(tl, p, t) { tl.to([`#${p}-p1`, `#${p}-p2`], { scale: 1.22, duration: 0.25, ease: 'back.out(2)' }, t); },
    show(tl, sel, t, d = 0.2) { tl.to(sel, { opacity: 1, duration: d }, t); },
    hide(tl, sel, t, d = 0.2) { tl.to(sel, { opacity: 0, duration: d }, t); },
    // blinks so faces never freeze; deterministic spacing
    blinks(tl, p, from, to, offset = 0) {
      for (let t = from + 1.3 + offset; t < to - 0.3; t += 3.1 + ((t * 7) % 1.3)) {
        tl.to(`#${p}-eyes`, { scaleY: 0.1, svgOrigin: '0 30', duration: 0.06, ease: 'power2.in' }, t);
        tl.to(`#${p}-eyes`, { scaleY: 1, svgOrigin: '0 30', duration: 0.1, ease: 'power2.out' }, t + 0.08);
      }
    },
  };
  window.Rig = Rig;
})();
