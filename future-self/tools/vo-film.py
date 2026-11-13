"""Full narration for the film with Kokoro (local, offline).

  .venv-tts/Scripts/python.exe tools/vo-film.py [script.json] [out_dir]
Reads script.json ([text, silence before, speed, mood?]) and writes
vo.wav and vo.json (start/end per line) into out_dir (default film/assets).

mood (optional) blends Kokoro voices and sets loudness, to give lines emotion:
  neutral, curious, excited, shocked, sad, whisper, warm, firm
Speed in the line still applies (multiplied by the mood's speed factor).
"""
import json
import sys
from pathlib import Path

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

ROOT = Path(__file__).resolve().parent.parent
SCRIPT = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "film" / "script.json"
OUT = Path(sys.argv[2]) if len(sys.argv) > 2 else ROOT / "film" / "assets"
MODELS = ROOT.parent / "little-wonder-woods" / "models" / "kokoro"
kok = Kokoro(str(MODELS / "kokoro-v1.0.int8.onnx"), str(MODELS / "voices-v1.0.bin"))

# mood: ({voice: weight}, speed factor, gain)
MOODS = {
    "neutral": ({"af_heart": 1.0}, 1.00, 1.00),
    "curious": ({"af_heart": 0.8, "af_bella": 0.2}, 1.02, 0.95),
    "excited": ({"af_heart": 0.5, "af_bella": 0.5}, 1.10, 1.00),
    "shocked": ({"af_bella": 0.6, "af_heart": 0.4}, 1.04, 1.00),
    "sad":     ({"af_heart": 0.6, "af_nicole": 0.4}, 0.86, 0.75),
    "whisper": ({"af_nicole": 0.8, "af_heart": 0.2}, 0.92, 0.65),
    "warm":    ({"af_heart": 0.7, "af_sarah": 0.3}, 0.92, 0.90),
    "firm":    ({"af_heart": 0.6, "af_kore": 0.4}, 0.97, 1.00),
}
STYLE = {m: sum(w * kok.get_voice_style(v) for v, w in mix.items()) for m, (mix, _, _) in MOODS.items()}

parts, timing, t, sr = [], [], 0.0, 24000
for i, line in enumerate(json.loads(SCRIPT.read_text(encoding="utf8"))):
    text, gap, speed = line[:3]
    mood = line[3] if len(line) > 3 else "neutral"
    _, mspeed, gain = MOODS[mood]
    s, sr = kok.create(text, voice=STYLE[mood], speed=speed * mspeed, lang="en-us")
    s = np.asarray(s, np.float32)
    nz = np.flatnonzero(np.abs(s) > 0.01)
    s = s[max(nz[0] - int(0.01 * sr), 0): nz[-1] + int(0.1 * sr)]
    s *= gain / np.max(np.abs(s))
    parts += [np.zeros(int(gap * sr), np.float32), s]
    t += gap
    timing.append({"text": text, "mood": mood, "start": round(t, 3), "end": round(t + len(s) / sr, 3)})
    t += len(s) / sr
    print(f"{i:2d} {timing[-1]['start']:7.2f}-{timing[-1]['end']:7.2f} {mood:8s} {text[:60]}", flush=True)
parts.append(np.zeros(int(2.5 * sr), np.float32))
audio = np.concatenate(parts)
audio *= 0.89 / np.max(np.abs(audio))
OUT.mkdir(parents=True, exist_ok=True)
sf.write(OUT / "vo.wav", audio, sr)
(OUT / "vo.json").write_text(json.dumps(timing, indent=1))
print("total", round(len(audio) / sr, 2))
