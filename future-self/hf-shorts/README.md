# HyperFrames Shorts (hf-shorts)

Character-led vertical Shorts built with HyperFrames (HTML + SVG + one paused GSAP timeline), our kid and
a small cast, smooth motion with motion blur. Owner asked (24 Nov 2026) for 3-4 Shorts a day on **different topics**.

## Build one
1. Pick an unused topic from the hook bank in `../CONTENT-PLAN.md` (never a topic already posted or scheduled).
   Read the paper **in full** (OpenAlex `best_oa_location`, NBER, PMC and author pages usually have a PDF).
   Write its facts in `FACTS.md`. No number on screen or in the voice that is not in the paper.
2. `mkdir <id>` (ids: `h04-...`, `h05-...`), write `<id>/script.json` (10 lines, `[text, gap, speed, mood]`,
   speed 1.12, the twist line mood `shocked`), then `python3 ../tools/vo-film.py <id>/script.json <id>/voice`.
   Keep the last line's end under 33 s.
3. Copy the kit and write `<id>/index.html` (start from `h01-traders/index.html`):
   `cp _kit/kit.js _kit/base.css <id>/ && mkdir -p <id>/assets && cp _kit/assets/* <id>/assets/ && python3 _kit/prep.py <id>`
   `window.VO[i]` is the start time of voice line i: time every beat to it.
4. Check: `npx --yes hyperframes@0.9.33 lint <id>` then
   `npx --yes hyperframes@0.9.33 snapshot <id> --at 0.3,3,8,...  --no-end -o <scratch>` and LOOK at the sheet.
5. Build: `sh _kit/build.sh <id>` -> `<id>/<id>.mp4` (render ~5-10 min with motion blur, mix, -14 LUFS, CRF 24).

## Kit (`_kit/kit.js`, global `K`)
- `K.person(id, look, {x,y,s,flip})` bust characters: `kid`, `neighbor`, `boss`, `friend`.
- `K.face(tl, id, {m, e, br, look, blush, sweat}, t)` mouths `flat|smile|o|frown`, eyes `n|h(hearts)|d($)|s(swirl)`.
- `K.blink`, `K.react` (bob + tuft lag), `K.sway` (idle), `K.words` + `K.title` (per-word blur-in),
  `K.counter` (seek-safe count-up), `K.grid` + `K.fillGrid` (100 people for a %), `K.cut` (whip pan), `K.pop`, `K.camera`.

## Rules learned the hard way
- Never animate an element that has its own `transform` attribute: wrap it, `<g transform="..."><g id="x">`, animate `#x`.
- `fromTo` must list every property in the "to" vars too (an opacity only in "from" never arrives).
- A class `k` sets the stroke to ink and overrides a `stroke=` attribute: drop `k` on coloured strokes.
- Nothing important below y = 1500 (Shorts UI). Titles live at y 210-260.
- Never draw a number the paper does not give (draw equal bars without labels instead).
