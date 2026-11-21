# Shorts lab: formats from lemo-opuscar

Second Shorts slot, **13:00 IST Mon-Fri**, built in the Pop Art style of
[lemo-opuscar](https://github.com/lemomo-ai/lemo-opuscar) (MIT code; films we make are ours, no credit needed).
From 7 Dec 2026 this is the default for all new Shorts (see `CLAUDE.md`).

## Pick the format from the story (never the same format two days running)
| The story is about... | Format | Kit | Example |
|---|---|---|---|
| people in a situation (a parent, a teacher, a buyer vs an owner, you vs a neighbor) | **Mid-century cartoon scene**: characters, a room as colour planes, split frames, stamps | `_mc/mckit.js` | `p03-fine-mc`, `p04-mug-mc` |
| copies, crowds, a share of people (88% vs 46%), one that differs | **Pop Art wall or grid** of identical prints | `_kit/popkit.js` | `p01-neighbor`, `p05-ticket` |
| a number that grows or shrinks | **Pop Art printed chart** or a cartoon bar chart | either | `p02-raises` |
| a choice between two options | **split frame**, A vs B, one side flips | either | `p04-mug-mc` |
Write the beats first (situation, people, the one object), then choose. Pop Art has no acting characters by design;
when the story needs a face reacting, use the cartoon. More library styles can be added the same way (copy the engine
into a `_<name>` kit, keep 1080x1920, keep the bottom 420 px clear).

## Layout
- `_kit/`: our shared kit, copied into the library's `films/_kit/` at build time
  - `popkit.js`: the wall of prints, labels, headlines, camera, boot from `voice/vo.json`
  - `pop.js`: the Pop Art print engine (from the library's pop-art demo, MIT)
  - `mix.py`: narration + print-shop foley + a synthesized 60s lounge cue; a `turn` event mutes the groove 0.6 s before the twist
  - `build.sh <id>`: events, mix, render 1080x1920 at 24 fps, master to -14 LUFS, `<id>-web.mp4` (CRF 28)
- `_mc/`: the mid-century cartoon kit (`mckit.js`: `person()`, `medallion()`, `tag()`, `header()`, `script()`, `wipe()`, `iris()`, `clockFace()`; engine `toon.js`/`chars.js`/`icons.js` from the library, MIT; Canvas 2D, renders in ~30 s)
- `<id>/`: one Short: `main.js` (the film), `script.json` (voice lines), `voice/vo.json` + `vo.wav`, `index.html`, final `<id>.mp4`

## Build a new one (in a cloud run)
```sh
S=$(mktemp -d); cd $S
git clone --depth 1 https://github.com/lemomo-ai/lemo-opuscar
curl -sSL https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz | tar xJ   # ffmpeg 7 (Ubuntu ships 6.x)
mv ffmpeg-*-static ffmpeg-7.0.2-amd64-static
(cd lemo-opuscar && sh plugin/skills/lemo-opuscar/scripts/setup.sh deps)
cp -r <repo>/future-self/popart/_kit lemo-opuscar/films/_kit
cp -r <repo>/future-self/popart/_mc lemo-opuscar/films/_mc
cp -r <repo>/future-self/popart/<id> lemo-opuscar/films/<id>
# voice with our usual narrator (run from the repo root):
python3 future-self/tools/vo-film.py lemo-opuscar/films/<id>/script.json lemo-opuscar/films/<id>/voice
# check frames, then build
(cd lemo-opuscar && node core/render/still.mjs films/<id> 0.1 2 10 20 --size 1080x1920 --out films/<id>/st)
sh lemo-opuscar/films/_kit/build.sh <id>
cp lemo-opuscar/films/<id>/<id>-web.mp4 <repo>/future-self/popart/<id>/<id>.mp4
```

## Directing rules (from the style guide, kept short)
- One subject icon per film, printed as a **wall of identical tiles**; meaning comes from repetition and from
  the one tile that changes (a colourway flip, a sunburst, a dark-dot front spreading).
- Frame 0 is a stamp already landing (no empty paper). The loop: the last 3 s return to the first tile.
- Labels: one paper slip at a time, top-left, 1-3 words, never the spoken line. Numbers go in big headlines.
- Keep subjects out of the bottom 420 px (Shorts UI). No subtitles (channel rule: the screen never reads the line back).
- Darkness is dots of red and blue, never black fill. Never a colour on itself.
- Every number on screen is from the paper; put the source in the post text.
