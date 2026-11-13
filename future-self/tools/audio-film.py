"""Music bed and sound effects for the film, made on this laptop (no downloads).

  .venv-tts/Scripts/python.exe tools/audio-film.py
Writes film/assets/music.wav (ducked under the voice) and film/assets/sfx.wav.
Pop sounds follow every data-in="line,frac,pop" in film/compositions, so new scenes get them for free.
"""
import json
import re
from pathlib import Path

import numpy as np
import soundfile as sf
from scipy.signal import butter, sosfilt

FILM = Path(__file__).resolve().parent.parent / "film"
SR = 44100
V = json.loads((FILM / "assets" / "vo.json").read_text())
DUR = sf.info(FILM / "assets" / "vo.wav").duration
N = int(DUR * SR)
rng = np.random.default_rng(7)
t_all = np.arange(N) / SR
L = lambda i, f=0.0: V[i]["start"] + (V[i]["end"] - V[i]["start"]) * f
hz = lambda m: 440 * 2 ** ((m - 69) / 12)
lp = lambda x, f: sosfilt(butter(2, f, "low", fs=SR, output="sos"), x)
hp = lambda x, f: sosfilt(butter(2, f, "high", fs=SR, output="sos"), x)


def add(buf, at, s, g=1.0):
    i = int(at * SR)
    if i >= len(buf):
        return
    s = s[: len(buf) - i]
    buf[i: i + len(s)] += s * g


# ---------- music: calm lo-fi loop, 80 bpm, Am7 Fmaj7 Cmaj7 G6 ----------
BEAT = 60 / 80
CHORDS = [[57, 60, 64, 67], [53, 57, 60, 64], [48, 52, 55, 59], [55, 59, 62, 64]]
music = np.zeros(N)
bar = 4 * BEAT
for b in range(int(DUR / bar) + 1):
    c, t0 = CHORDS[b % 4], b * bar
    n = int(bar * SR) + SR
    tt = np.arange(n) / SR
    env = np.minimum(tt / 0.6, 1) * np.exp(-np.maximum(tt - bar, 0) * 3)
    pad = sum(np.sin(2 * np.pi * hz(m) * tt + k) + 0.3 * np.sin(4 * np.pi * hz(m) * tt) for k, m in enumerate(c))
    add(music, t0, lp(pad * env, 1400), 0.05)
    bt = np.arange(int(0.9 * SR)) / SR  # bass on beats 1 and 3
    for k in (0, 2):
        add(music, t0 + k * BEAT, np.sin(2 * np.pi * hz(c[0] - 24) * bt) * np.exp(-bt * 3), 0.22)
    for k in range(8):  # soft plucked arpeggio in eighths
        m = c[[0, 2, 1, 3, 2, 1, 3, 2][k]] + 12
        pt = np.arange(int(0.7 * SR)) / SR
        pl = (np.sin(2 * np.pi * hz(m) * pt) + 0.25 * np.sin(6 * np.pi * hz(m) * pt)) * np.exp(-pt * 7)
        add(music, t0 + k * BEAT / 2, pl, 0.07 if k % 2 == 0 else 0.045)
    for k in range(4):  # brushed kick and hat
        kt = np.arange(int(0.3 * SR)) / SR
        if k in (0, 2):
            add(music, t0 + k * BEAT, np.sin(2 * np.pi * (50 + 60 * np.exp(-kt * 30)) * kt) * np.exp(-kt * 12), 0.25)
        add(music, t0 + k * BEAT + BEAT / 2, hp(rng.standard_normal(int(0.05 * SR)), 7000) * np.exp(-np.arange(int(0.05 * SR)) / SR * 80), 0.025)
music = lp(music, 5000)

# duck under the voice: 1.0 in gaps, 0.32 while speaking, smoothed
gain = np.ones(N)
for v in V:
    gain[int((v["start"] - 0.15) * SR): int((v["end"] + 0.25) * SR)] = 0.32
k = int(0.25 * SR)
c = np.concatenate([[0], np.cumsum(np.pad(gain, (k // 2, k - k // 2), mode="edge"))])
gain = (c[k:] - c[:-k])[:N] / k  # moving average via cumsum (np.convolve is far too slow here)
fade = np.minimum(t_all / 2.5, 1) * np.minimum((DUR - t_all) / 3, 1)
music = music * gain * fade
music *= 0.32 / np.max(np.abs(music))

# ---------- sound effects ----------
def pop():
    tt = np.arange(int(0.12 * SR)) / SR
    return np.sin(2 * np.pi * np.cumsum(900 * np.exp(-tt * 25) + 260) / SR) * np.exp(-tt * 30)

def whoosh(d=0.45):
    n = int(d * SR)
    x = rng.standard_normal(n)
    x = sosfilt(butter(2, [400, 3000], "band", fs=SR, output="sos"), x)
    return x * np.sin(np.pi * np.arange(n) / n) ** 2

def tick():
    tt = np.arange(int(0.05 * SR)) / SR
    return np.sin(2 * np.pi * 1800 * tt) * np.exp(-tt * 90)

def slam():
    tt = np.arange(int(0.4 * SR)) / SR
    return np.sin(2 * np.pi * (60 + 80 * np.exp(-tt * 20)) * tt) * np.exp(-tt * 9) + lp(rng.standard_normal(len(tt)), 2000) * np.exp(-tt * 40) * 0.6

def chime():
    tt = np.arange(int(1.2 * SR)) / SR
    return sum(np.sin(2 * np.pi * hz(m) * tt) * np.exp(-tt * 4) for m in (76, 81, 88)) / 3

sfx = np.zeros(N)
cues = []
for f in sorted((FILM / "compositions").glob("*.html")):
    for l, fr, kind in re.findall(r'data-in="(\d+),([-\d.]+),(\w+)"', f.read_text(encoding="utf8")):
        if kind == "pop":
            cues.append((L(int(l), float(fr)), "pop"))
        elif kind in ("left", "right"):
            cues.append((L(int(l), float(fr)) - 0.1, "whoosh"))
scenes = json.loads(re.search(r"SCENES = (\{.*\})", (FILM / "assets" / "timing.js").read_text()).group(1))
cues += [(s - 0.2, "whoosh") for k, s in scenes.items() if s > 0]
# hand-placed moments in scenes written before the data-in helper
cues += [(L(1, 0.2 + i * 0.15), "tick") for i in range(3)] + [(L(1, 0.5), "pop"), (L(1, 0.86), "whoosh"),
         (L(3, 0.35), "pop"), (L(3, 0.8), "pop"), (L(4, 0.15), "chime"), (L(4, 0.75), "pop"),
         (L(8, 0.4), "chime"), (L(13, 0.75), "pop"), (L(14, 0.4), "whoosh"), (L(14, 0.84) + 0.14, "slam")]
make = {"pop": (pop, 0.5), "whoosh": (whoosh, 0.18), "tick": (tick, 0.35), "slam": (slam, 0.7), "chime": (chime, 0.25)}
for at, kind in sorted(cues):
    fn, g = make[kind]
    add(sfx, max(at, 0), fn(), g)
sfx *= 0.6 / max(np.max(np.abs(sfx)), 1e-9)

sf.write(FILM / "assets" / "music.wav", music.astype(np.float32), SR)
sf.write(FILM / "assets" / "sfx.wav", sfx.astype(np.float32), SR)
print("music+sfx", round(DUR, 2), "s,", len(cues), "cues")
