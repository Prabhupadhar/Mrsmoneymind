#!/usr/bin/env bash
# Vertical 1080x1920 Shorts cut from the finished film: blurred fill, film in the middle,
# hook text on top, footer below. Run from future-self/film/shorts:
#   bash ../../tools/shorts.sh <out> <start> <duration> <top-line-1.txt> <top-line-2.txt>
set -e
FF="../../../little-wonder-woods/tools/ffmpeg/ffmpeg.exe"
F="../assets/fonts/PatrickHand-Regular.ttf"
SRC="../renders/the-stranger-youre-robbing-v2-voice-only.mp4"
OUT=$1; SS=$2; D=$3; T1=$4; T2=$5
END=$(awk "BEGIN{print $D-0.4}")
"$FF" -v error -y -ss "$SS" -t "$D" -i "$SRC" -filter_complex "\
[0:v]split[a][b];\
[a]scale=-2:1920,crop=1080:1920,boxblur=30:5,eq=brightness=-0.18[bg];\
[b]scale=1080:-2[fg];\
[bg][fg]overlay=0:(H-h)/2,\
drawtext=fontfile=$F:textfile=$T1:fontsize=104:fontcolor=white:borderw=8:bordercolor=0x0d0f22:x=(w-text_w)/2:y=330,\
drawtext=fontfile=$F:textfile=$T2:fontsize=104:fontcolor=0xffb35c:borderw=8:bordercolor=0x0d0f22:x=(w-text_w)/2:y=460,\
drawtext=fontfile=$F:textfile=foot.txt:fontsize=60:fontcolor=white:borderw=6:bordercolor=0x0d0f22:x=(w-text_w)/2:y=1500,\
fade=t=out:st=$END:d=0.4[v]" \
  -map "[v]" -map 0:a -af "afade=t=out:st=$END:d=0.4" \
  -c:v libx264 -crf 20 -preset medium -pix_fmt yuv420p -c:a aac -b:a 160k -r 30 "$OUT"
