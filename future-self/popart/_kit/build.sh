#!/bin/sh
# build.sh <film folder name>  -> films/<name>/<name>.mp4  (run from anywhere)
set -e
LIB=$(cd "$(dirname "$0")/../.." && pwd); cd "$LIB"; F=films/$1
export PATH="$LIB/../ffmpeg-7.0.2-amd64-static:$PATH"
node core/render/events.mjs $F --size 1080x1920 >/dev/null
.venv/bin/python films/_kit/mix.py $F
node core/render/video.mjs $F --fps 24 --workers 4 --size 1080x1920 --out $F/out/video.mp4 2>&1 | grep -E "^done|rror" || true
sh core/render/mux.sh $F/out/video.mp4 $F/out/mix.wav $F/$1.mp4 24 0 2>&1 | grep -E "LUFS|rror"
# web size: dots make big files; re-encode for upload
ffmpeg -v error -y -i $F/$1.mp4 -c:v libx264 -crf 28 -preset slow -pix_fmt yuv420p -c:a copy -movflags +faststart $F/$1-web.mp4
ls -la $F/$1-web.mp4
