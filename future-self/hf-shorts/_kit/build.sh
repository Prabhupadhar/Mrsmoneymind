#!/bin/sh
# build.sh <short id>  ->  hf-shorts/<id>/<id>.mp4 (1080x1920, -14 LUFS). Run from anywhere.
set -e
K=$(cd "$(dirname "$0")" && pwd); D=$K/../$1; D=$(cd "$D" && pwd)
export PATH="/opt/ffmpeg7:$PATH"
cp "$K/kit.js" "$K/base.css" "$D/"; mkdir -p "$D/assets"; cp "$K"/assets/* "$D/assets/"
python3 "$K/prep.py" "$D"
cd "$D"
npx --yes hyperframes@0.9.33 lint . 2>&1 | tail -1
npx --yes hyperframes@0.9.33 render -o render/video.mp4 --fps 30 --quality delivery . >/dev/null 2>&1
/opt/lemo-opuscar/.venv/bin/python /opt/lemo-opuscar/films/_kit/mix.py "$D" | tail -1
sh /opt/lemo-opuscar/core/render/mux.sh render/video.mp4 out/mix.wav "$1-hq.mp4" 30 0 2>&1 | grep LUFS
ffmpeg -v error -y -i "$1-hq.mp4" -c:v libx264 -crf 24 -preset slow -pix_fmt yuv420p -c:a copy -movflags +faststart "$1.mp4"
rm -f "$1-hq.mp4"; ls -la "$1.mp4"
