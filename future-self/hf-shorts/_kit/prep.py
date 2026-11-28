"""prep.py <short dir>: voice.js (line start/end times) and events.json (foley cues) from voice/vo.json + script.json."""
import json, sys, os
D = sys.argv[1]
vo = json.load(open(os.path.join(D, 'voice', 'vo.json')))
dur = round(vo[-1]['end'] + 1.2, 2)
open(os.path.join(D, 'voice.js'), 'w').write('window.VO=%s;window.VOE=%s;window.DUR=%s;\n' % (
    json.dumps([round(v['start'], 3) for v in vo]), json.dumps([round(v['end'], 3) for v in vo]), dur))
ev = [{"t": 0.0, "type": "pan"}]
for i, v in enumerate(vo):
    if v['mood'] == 'shocked':
        ev += [{"t": max(0, v['start'] - 0.65), "type": "turn"}, {"t": v['start'], "type": "ding"}, {"t": v['start'] + 0.05, "type": "stamp", "v": 1.0}]
    elif i:
        ev.append({"t": v['start'] - 0.05, "type": "flip", "v": 0.5})
        ev.append({"t": v['start'], "type": "note", "n": min(11, i)})
json.dump({"dur": dur, "ev": ev}, open(os.path.join(D, 'events.json'), 'w'))
print('prep', D, 'dur', dur)
