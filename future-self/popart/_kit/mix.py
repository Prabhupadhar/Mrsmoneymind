"""Generic mix for Pop Art Shorts: python mix.py <film dir>. Narration (voice/vo.wav), print-shop foley from
events.json, a synthesized 60s lounge cue (vibraphone, upright bass, shaker). A 'turn' event cuts the groove for
0.6 s (a held low note) and brings it back on the turn; 'note' events climb a vibraphone scale."""
import json, os, sys
import numpy as np, soundfile as sf, soxr
HERE = os.path.abspath(sys.argv[1]); LIB = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')); sys.path.insert(0, LIB)
from core.audio.sfx import SR, bp, lp, hp, add, compress, limit, thump, whoosh
E = json.load(open(os.path.join(HERE, 'events.json'))); EV = E['ev']; DUR = float(E['dur']); N = int(DUR * SR)
rng = np.random.default_rng(3)
def nz(d): return rng.standard_normal(max(1, int(d * SR)))
def tt(d): return np.arange(int(d * SR)) / SR
x, sr = sf.read(os.path.join(HERE, 'voice', 'vo.wav'), dtype='float32')
if x.ndim > 1: x = x.mean(1)
vo = np.zeros(N); x = soxr.resample(x, sr, SR)[:N]; vo[:len(x)] = x
vo = compress(hp(vo, 85) / (np.abs(vo).max() + 1e-9) * .9, thr=.2, ratio=3.2)
vm = (np.convolve(np.abs(vo) > .02, np.ones(int(.25 * SR)), 'same') > 0).astype(float)
duck = 1 - .6 * np.convolve(vm, np.ones(int(.15 * SR)) / int(.15 * SR), 'same')
def stamp(v):
    a = thump(v=1, f=95)[:int(.25 * SR)] * .55; s = hp(nz(.06), 900) * np.exp(-tt(.06) / .012) * .35
    o = a.copy(); o[:len(s)] += s; return o * v
def flick(v): return bp(nz(.05), 1800, 7000) * np.exp(-tt(.05) / .01) * .45 * v
def vib(f, d=1.2, v=1.):
    t = tt(d); trem = 1 + .25 * np.sin(2 * np.pi * 6 * t)
    return v * trem * (np.sin(2*np.pi*f*t)*np.exp(-t/.9) + .25*np.sin(2*np.pi*4*f*t)*np.exp(-t/.15) + .08*np.sin(2*np.pi*10*f*t)*np.exp(-t/.05))
SCALE = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.7, 1318.5, 1568, 1760, 2093, 2349]
fo = np.zeros((N, 2)); turns = []
for e in EV:
    t, ty, v, pan = e['t'], e['type'], e.get('v', 1.), e.get('pan', 0.)
    if t >= DUR: continue
    if ty == 'stamp': add(fo, stamp(.5 * v), max(0, t), 1, pan)
    elif ty == 'flip': add(fo, flick(v), t, 1, pan)
    elif ty == 'ding': add(fo, vib(1046.5, 1.6, .25) + vib(1318.5, 1.6, .18) + vib(1568, 1.6, .15), t, 1, 0)
    elif ty == 'pan': add(fo, whoosh(.4, .35), t, 1, .3)
    elif ty == 'note': add(fo, vib(SCALE[min(11, e.get('n', 0))], .5, .14 * v), t, 1, pan)
    elif ty == 'rot':
        d = e['d']; c = lp(nz(d), 600) * .3 + bp(nz(d), 1500, 5000) * (np.abs(lp(nz(d), 25)) * 6) ** 2 * .12
        add(fo, c * np.minimum(1, tt(d) / .8) * np.minimum(1, (d - tt(d)) / .5) * .5, t, 1, 0)
    elif ty == 'turn': turns.append(t)
# music: 112 bpm walking bass + shaker + a vib chord every 2 bars; groove mutes 0.6 s before each turn
mu = np.zeros((N, 2)); beat = 60 / 112; gate = np.ones(N)
for t in turns: gate[max(0, int((t - .6) * SR)):int(t * SR)] = 0
walk = [65.4, 82.4, 98.0, 110.0, 98.0, 82.4, 73.4, 82.4]
def bass(f, d, v=.5): t = tt(d); return v * (np.sin(2*np.pi*f*t) + .3*np.sin(4*np.pi*f*t) + .15*np.sin(6*np.pi*f*t)) * np.exp(-t/.35)
for k in range(int(DUR / (beat / 2))):
    t0 = k * beat / 2
    if k % 1 == 0: add(mu, bass(walk[k % 8], .4), t0)
    add(mu, hp(nz(.05), 6000) * np.exp(-tt(.05) / .015) * .12, t0, 1, .3 if k % 2 else -.3)
CH = [[261.6, 329.6, 392], [293.7, 349.2, 440], [261.6, 311.1, 392], [246.9, 293.7, 392]]
for k in range(int(DUR / (beat * 8)) + 1):
    for f in CH[k % 4]: add(mu, vib(f, 2.0, .11), k * beat * 8 + .05)
mu *= gate[:, None]
for t in turns:
    tb = tt(.6); add(mu, .35 * np.sin(2*np.pi*55*tb) * np.minimum(1, tb/.05) * np.minimum(1, (.6 - tb)/.1), t - .6)
# tail fade on the music in the last 1.2 s
fade = np.ones(N); n = int(1.2 * SR); fade[-n:] = np.linspace(1, 0, n); mu *= fade[:, None]
mix = vo[:, None] * .95 + mu * (duck * .55)[:, None] + fo * .7
mix = limit(mix / (np.abs(mix).max() + 1e-9) * .85, ceil=.89)
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), mix.astype(np.float32), SR); print('mix ok', DUR)
