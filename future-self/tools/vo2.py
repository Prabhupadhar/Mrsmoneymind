"""Vlogger-style narration for the 10-second sample, in one of two local engines.

  .venv-tts/Scripts/python.exe tools/vo2.py kokoro
  .venv-tts/Scripts/python.exe tools/vo2.py chatterbox

Writes sample10/assets/vo-<engine>.wav and vo-<engine>.json (start/end per line).
Both run offline after the first model download; nothing is sent anywhere.
"""
import json
import sys
from pathlib import Path

import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "sample10" / "assets"
ENGINE = sys.argv[1]

# text, silence before (s), Kokoro speed, Chatterbox exaggeration
LINES = [
    ("Okay. Quick question.", 0.30, 1.00, 0.55),
    ("When did you last open your bank app at one a.m.... and wince?", 0.35, 1.02, 0.60),
    ("Yeah. Me too.", 0.45, 0.95, 0.65),
    ("Here's the weird part. That money? You're taking it from someone.", 0.55, 0.98, 0.65),
    ("And you've definitely met him.", 0.50, 0.90, 0.70),
]

if ENGINE == "kokoro":
    from kokoro_onnx import Kokoro
    models = ROOT.parent / "little-wonder-woods" / "models" / "kokoro"
    kok = Kokoro(str(models / "kokoro-v1.0.int8.onnx"), str(models / "voices-v1.0.bin"))

    def say(text, speed, _ex):
        s, sr = kok.create(text, voice="af_heart", speed=speed, lang="en-us")
        return np.asarray(s, np.float32), sr
elif ENGINE == "chatterbox":
    import torch
    from chatterbox.tts import ChatterboxTTS
    model = ChatterboxTTS.from_pretrained(device="cpu")

    def say(text, _speed, ex):
        torch.manual_seed(7)  # same take every run
        wav = model.generate(text, exaggeration=ex, cfg_weight=0.4, temperature=0.75)
        return wav.squeeze(0).cpu().numpy().astype(np.float32), model.sr
else:
    sys.exit("engine must be kokoro or chatterbox")

parts, timing, t, sr = [], [], 0.0, 24000
for text, gap, speed, ex in LINES:
    s, sr = say(text, speed, ex)
    nz = np.flatnonzero(np.abs(s) > 0.01)  # trim the engine's own lead/tail silence
    s = s[max(nz[0] - int(0.01 * sr), 0): nz[-1] + int(0.1 * sr)]
    parts += [np.zeros(int(gap * sr), np.float32), s]
    t += gap
    timing.append({"text": text, "start": round(t, 3), "end": round(t + len(s) / sr, 3)})
    t += len(s) / sr
    print(f"{timing[-1]['start']:6.2f}-{timing[-1]['end']:6.2f}  {text}", flush=True)
parts.append(np.zeros(int(0.6 * sr), np.float32))
audio = np.concatenate(parts)
audio *= 0.89 / np.max(np.abs(audio))

OUT.mkdir(parents=True, exist_ok=True)
sf.write(OUT / f"vo-{ENGINE}.wav", audio, sr)
(OUT / f"vo-{ENGINE}.json").write_text(json.dumps(timing, indent=2))
print("total", round(len(audio) / sr, 2))
