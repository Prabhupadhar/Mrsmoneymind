"""Narration for the 10-second sample: Kokoro (local, offline), one clip per line.

Writes assets/vo.wav and assets/vo.json (start/end of each line in seconds).
Run with the little-wonder-woods venv:
  ../little-wonder-woods/.venv/Scripts/python.exe tools/vo.py
"""
import json
from pathlib import Path

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

ROOT = Path(__file__).resolve().parent.parent
MODELS = ROOT.parent / "little-wonder-woods" / "models" / "kokoro"
VOICE, SPEED = "af_heart", 0.9

# (text, silence before it in seconds)
LINES = [
    ("Every month, you rob someone.", 0.40),
    ("Someone who trusts you completely.", 0.55),
    ("It's you.", 0.60),
    ("Thirty years from now.", 0.30),
]

kok = Kokoro(str(MODELS / "kokoro-v1.0.int8.onnx"), str(MODELS / "voices-v1.0.bin"))
parts, timing, t, sr = [], [], 0.0, 24000
for text, gap in LINES:
    s, sr = kok.create(text, voice=VOICE, speed=SPEED, lang="en-us")
    s = np.asarray(s, np.float32)
    nz = np.flatnonzero(np.abs(s) > 0.01)  # trim Kokoro's own silence
    s = s[max(nz[0] - 240, 0): nz[-1] + 2400]
    parts += [np.zeros(int(gap * sr), np.float32), s]
    t += gap
    timing.append({"text": text, "start": round(t, 3), "end": round(t + len(s) / sr, 3)})
    t += len(s) / sr
parts.append(np.zeros(int(0.8 * sr), np.float32))
audio = np.concatenate(parts)
audio *= 0.89 / np.max(np.abs(audio))

(ROOT / "assets").mkdir(exist_ok=True)
sf.write(ROOT / "assets" / "vo.wav", audio, sr)
(ROOT / "assets" / "vo.json").write_text(json.dumps(timing, indent=2))
print(json.dumps(timing), "total", round(len(audio) / sr, 2))
