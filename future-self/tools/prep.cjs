// Point sample10 at one voice: copies its wav, writes assets/timing.js, sets scene and film lengths.
//   node tools/prep.js kokoro|chatterbox
const fs = require('fs');
const path = require('path');
const engine = process.argv[2];
const dir = path.join(__dirname, '..', 'sample10');
const V = JSON.parse(fs.readFileSync(path.join(dir, 'assets', `vo-${engine}.json`), 'utf8'));
fs.copyFileSync(path.join(dir, 'assets', `vo-${engine}.wav`), path.join(dir, 'assets', 'vo.wav'));
fs.writeFileSync(path.join(dir, 'assets', 'timing.js'), `window.VO = ${JSON.stringify(V)};\n`);

const r = (x) => Math.round(x * 100) / 100;
const cut = r(V[3].start - 0.05);           // hook -> reveal on line 4
const total = r(V[4].end + 1.4);             // hold the reveal a beat after the last word
let html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
html = html
  .replace(/(id="root"[^>]*data-duration=")[\d.]+/, `$1${total}`)
  .replace(/(id="phook"[\s\S]*?data-duration=")[\d.]+/, `$1${cut}`)
  .replace(/(id="reveal"[\s\S]*?data-start=")[\d.]+("[^>]*?data-duration=")[\d.]+/, `$1${cut}$2${r(total - cut)}`);
fs.writeFileSync(path.join(dir, 'index.html'), html);
console.log(engine, 'cut', cut, 'total', total);
