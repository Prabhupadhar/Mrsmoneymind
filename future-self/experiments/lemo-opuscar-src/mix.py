"""Sound for The Neighbor Who Won (10 s): narration, print-shop foley from events.json, a small synthesized
60s lounge cue (vibraphone + upright bass + shaker) that drops to a held low note before the turn."""
import json, os, sys
import numpy as np, soundfile as sf, soxr
HERE = os.path.dirname(os.path.abspath(__file__)); LIB = os.path.abspath(os.path.join(HERE, '..', '..')); sys.path.insert(0, LIB)
from core.audio.sfx import SR, bp, lp, hp, add, compress, limit, thump, whoosh, ding
DUR = 10.0; N = int(DUR * SR); rng = np.random.default_rng(3)
EV = json.load(open(os.path.join(HERE, 'events.json')))['ev']
def nz(d): return rng.standard_normal(max(1, int(d * SR)))
def tt(d): return np.arange(int(d * SR)) / SR
# voice
x, sr = sf.read(os.path.join(HERE, 'voice', 'vo.wav'), dtype='float32')
if x.ndim > 1: x = x.mean(1)
vo = np.zeros(N); x = soxr.resample(x, sr, SR)[:N]; vo[:len(x)] = x
vo = compress(hp(vo, 85) / (np.abs(vo).max() + 1e-9) * .9, thr=.2, ratio=3.2)
vm = (np.convolve(np.abs(vo) > .02, np.ones(int(.25 * SR)), 'same') > 0).astype(float)
duck = 1 - .6 * np.convolve(vm, np.ones(int(.15 * SR)) / int(.15 * SR), 'same')
# foley
fo = np.zeros((N, 2))
def stamp(v):
    a = thump(v=1, f=95)[:int(.25 * SR)] * .55; s = hp(nz(.06), 900) * np.exp(-tt(.06) / .012) * .35
    o = np.zeros(len(a)); o[:len(s)] += s; return (o + a) * v
def flick(v): return bp(nz(.05), 1800, 7000) * np.exp(-tt(.05) / .01) * .45 * v
def vib(f, d=1.2, v=1.):  # vibraphone: partials 1, 4, 10 with fast decay on the upper ones, 6 Hz tremolo
    t = tt(d); trem = 1 + .25 * np.sin(2 * np.pi * 6 * t)
    return v * trem * (np.sin(2*np.pi*f*t)*np.exp(-t/.9) + .25*np.sin(2*np.pi*4*f*t)*np.exp(-t/.15) + .08*np.sin(2*np.pi*10*f*t)*np.exp(-t/.05))
SCALE = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.7, 1318.5, 1568, 1760, 2093, 2349]
for e in EV:
    t, ty, v, pan = e['t'], e['type'], e.get('v', 1.), e.get('pan', 0.)
    if ty == 'stamp': add(fo, stamp(.5 * v), max(0, t), 1, pan)
    elif ty == 'flip': add(fo, flick(v), t, 1, 0)
    elif ty == 'ding': add(fo, vib(1046.5, 1.6, .25) + vib(1318.5, 1.6, .18) + vib(1568, 1.6, .15), t, 1, 0)
    elif ty == 'pan': add(fo, whoosh(.4, .35), t, 1, .3)
    elif ty == 'rot':
        d = e['d']; c = lp(nz(d), 600) * .3 + bp(nz(d), 1500, 5000) * (np.abs(lp(nz(d), 25)) * 6) ** 2 * .12
        add(fo, c * np.minimum(1, tt(d) / .8) * np.minimum(1, (d - tt(d)) / .5) * .5, t, 1, 0)
    elif ty == 'car': add(fo, stamp(.3), t, 1, pan); add(fo, vib(SCALE[e['n']], .5, .12), t, 1, pan)
# music: 112 bpm lounge; groove 0–3.45, held low note 3.45–4.0 (the turn), dark bass pedal + bowed vib after
mu = np.zeros((N, 2)); beat = 60 / 112
def bass(f, d, v=.5): t = tt(d); return v * (np.sin(2*np.pi*f*t) + .3*np.sin(4*np.pi*f*t) + .15*np.sin(6*np.pi*f*t)) * np.exp(-t/.35)
walk = [65.4, 82.4, 98.0, 110.0, 98.0, 82.4, 73.4]
for k in range(13):
    t0 = k * beat * .5 + .05
    if t0 < 3.4: add(mu, bass(walk[k % 7], .4), t0)
for k in range(int(3.4 / (beat / 2))):
    add(mu, hp(nz(.05), 6000) * np.exp(-tt(.05) / .015) * .12, k * beat / 2)
for t0, ch in [(.05, [261.6, 329.6, 392]), (1.3, [293.7, 349.2, 440]), (2.4, [261.6, 311.1, 392])]:
    for f in ch: add(mu, vib(f, 1.1, .13), t0)
t = tt(.6); add(mu, .35 * np.sin(2*np.pi*55*t) * np.minimum(1, t/.05) * np.minimum(1, (.6 - t)/.1), 3.4)
d = 6.0; t = tt(d); add(mu, .3 * (np.sin(2*np.pi*49*t) + .3*np.sin(2*np.pi*98*t)) * np.minimum(1, t/.3) * np.minimum(1, (d - t)/.6), 4.0)
for t0, f in [(4.0, 233.1), (6.3, 220.0), (8.0, 207.7)]:
    tb = tt(2.2); add(mu, .08 * np.sin(2*np.pi*f*tb) * (1 + .3*np.sin(2*np.pi*5*tb)) * np.minimum(1, tb/.4) * np.minimum(1, (2.2 - tb)/.5), t0)
mix = np.zeros((N, 2)); mix += vo[:, None] * .95; mix += mu * (duck * .55)[:, None]; mix += fo * .7
mix = limit(mix / (np.abs(mix).max() + 1e-9) * .85, ceil=.89)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), mix.astype(np.float32), SR)
print('mix ok', mix.shape)
