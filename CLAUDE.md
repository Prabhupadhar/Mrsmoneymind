# Mrs. Money Mind: standing instructions

Faceless YouTube channel on psychology and money. Production lives in `future-self/`
(read `future-self/CLOUD-README.md` and `future-self/VIDEO-TEMPLATE.md` for the pipeline).

## Automation policy (set by the owner, 20 Nov 2026)
The owner does not want to approve each step. Run the pipeline end to end without pausing:
- No approval stops for topic research, scripts, voice, check renders, Shorts or thumbnails.
- Schedule finished posts in Metricool directly (`draft: false`), at least **48 hours ahead**,
  so the owner can still move or cancel them in the Metricool calendar. Tell the owner what
  was scheduled, with the planner links.
- Default cadence: about 5 standalone Shorts a week (Mon-Fri, 20:30 IST) and one long video
  every two weeks (Wednesday 16:00 IST, its Shorts on the next two days at 16:00).
- Do not merge pull requests into `main` unless the owner asks; push to `claude/loving-turing-6gvkvm`.
- What to make next, and the weekly run's steps: `future-self/CONTENT-PLAN.md`.

## Never automated (stop and ask)
- Facts: every number must come from the original paper, read in full. If a paper cannot be
  read, or the evidence is weak or mixed, say so in the script's fact check; if it is too weak
  to stand on, pick another topic and tell the owner why.
- Anything that deletes or unpublishes content, changes channel settings, or spends money.
- A failed render, failed check, or a Metricool error that a retry does not fix.

## Shorts rules
- The first 3 seconds carry the hook: 8 words or fewer, a surprising claim or number by second 2,
  motion in frame 0 (no fade-ins), and an open loop that the end closes.
- 20-35 s, native 1080x1920, same header/footer layout as `future-self/shorts/`.
- The hook must be exactly true to the paper; teasing is fine, overclaiming is not.
- Build standalone Shorts from `future-self/shorts-src/<name>/script.json` and
  `node tools/prep-short.cjs <id>` entries (see the s01-s05 entries).

## Other rules
- Voice only (Kokoro, `af_heart` mood blends); the screen never reads a line back.
- Mark AI content as altered/synthetic; not made for kids; category Education.
