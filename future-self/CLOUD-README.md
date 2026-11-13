# Mrs. Money Mind: cloud handoff (13 Nov 2026)

Start here if you are a cloud Claude Code session. Read it first.

## Channel
- YouTube: "Mrs. Money Mind" (@mrsmoneymind). Psychology, motivation and money, for a global audience.
- Psych2Go-inspired 2D look with our own characters: the kid in a mustard hoodie, navy and orange scenes, and handwritten pop words in Patrick Hand.
- Voice only. The voice is Kokoro TTS: `af_heart` blended with other voices for each mood (see `tools/vo-film.py`). It talks like a vlogger. The screen never reads a line back.
- Shorts are native 1080x1920 with the same layout as the existing ones in `shorts/` (header at y 230/350, footer at y 1540). No blur-fill and no rescaling.

## Status
- Video 1 (`film/`) and video 2 (`v2-card-vs-cash/`) are done and uploaded. Their renders and audio are left out of this zip to keep it small.
- **Video 3 (`v3-neighbor-lottery/`) is approved and ready to build.**
  - `SCRIPT.md` has the scenes, the Shorts plan and the sources.
  - `script.json` has 43 voice lines: `[text, gap before, speed, mood]`.
  - `film/` is set up with the rig and fonts. Its `compositions/` and `tools/` are still empty.
- Why we moved here: the laptop's Application Control policy blocked Kokoro's `regex` DLL, so the voice can't be made there.

## Setup (Linux)
```bash
pip install kokoro-onnx soundfile numpy scipy
sudo apt-get install -y ffmpeg      # or any ffmpeg on PATH
mkdir -p little-wonder-woods/models/kokoro && cd little-wonder-woods/models/kokoro
curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.int8.onnx
curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin
```
`tools/vo-film.py` looks for the models in `../little-wonder-woods/models/kokoro`, relative to `future-self/`. Keep that layout, or edit `MODELS` in the script.

## Build video 3
1. Voice: `python tools/vo-film.py v3-neighbor-lottery/script.json v3-neighbor-lottery/film/assets`. This writes `vo.wav` and `vo.json`.
2. Copy `v2-card-vs-cash/tools/prep.cjs` into `v3-neighbor-lottery/tools/` and write the v3 scene list.
3. Build the compositions in the same style as `v2-card-vs-cash/film/compositions/`.
   - Use the rig characters `kid`, `old` and `sil` from `assets/rig.js`. Add a new **neighbor** character with a cap and a green jacket.
   - Time each scene with `data-in="line,frac,kind"` and `Rig.at`.
4. Check and render: `npx --yes hyperframes@0.9.33 check --json`, then `snapshot --at ...`, then `render -o renders/<name>.mp4`.
   - Show the owner a check render of the cold open and part one before the full render.
5. Shorts: add `v3a` and `v3b` entries to `tools/prep-short.cjs` (see `SCRIPT.md`), then run `FFMPEG=ffmpeg node tools/prep-short.cjs v3a`. Render from `shorts/`.
6. Write the upload kit and two thumbnails, the same way as in `v2-card-vs-cash/` (`UPLOAD-KIT.md`, `thumb-a/`, `thumb-b/`).

## Rules
- Facts must come from the papers listed in `SCRIPT.md`. Do not invent numbers.
- Don't upload or publish anything. The owner uploads to YouTube.
- HyperFrames gotchas:
  - The CSS `.rk` stroke overrides the stroke attribute.
  - `fromTo` renders its from-state immediately.
  - In vertical scenes, start hidden props far off-screen (y 900+).
