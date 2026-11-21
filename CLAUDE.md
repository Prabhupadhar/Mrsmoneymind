# Mrs. Money Mind: standing instructions

Faceless YouTube channel on psychology and money. Production lives in `future-self/`
(read `future-self/CLOUD-README.md` and `future-self/VIDEO-TEMPLATE.md` for the pipeline).

## Automation policy (set by the owner, 20 Nov 2026)
The owner does not want to approve each step. Run the pipeline end to end without pausing:
- No approval stops for topic research, scripts, voice, check renders, Shorts or thumbnails.
- Schedule finished posts in Metricool directly (`draft: false`), at least **48 hours ahead**,
  so the owner can still move or cancel them in the Metricool calendar. Tell the owner what
  was scheduled, with the planner links.
- Default cadence: one long video every two weeks (Wednesday 16:00 IST, its Shorts on the next two
  days at 16:00) and standalone Shorts Mon-Fri:
  - until 4 Dec 2026: the already-scheduled classic Shorts (s01-s10) at 20:30 IST **plus** a Pop Art
    Short at 13:00 IST (an A/B test of the two styles on the same days);
  - from 7 Dec 2026: **Pop Art is the default** for all new Shorts, 5 a week at 13:00 IST. Build them
    with `future-self/popart/README.md`. Long videos keep the classic HyperFrames pipeline.
  - Pick each Short's format from its story (cartoon scene for people in a situation, Pop Art wall/grid for
    crowds and percentages, chart for a changing number, split frame for a choice); never the same format two days running.
- Do not merge pull requests into `main` unless the owner asks; push to `claude/loving-turing-6gvkvm`.
- What to make next, and the weekly run's steps: `future-self/CONTENT-PLAN.md`.

## Style test: decision rule (fixed 21 Nov 2026, before any results)
Freeze formats, slots and cadence until the test ends. Test window: Shorts published 23 Nov - 4 Dec 2026
(classic s01-s10 at 20:30 vs new-format P01-P10 at 13:00). On or after 7 Dec, from YouTube Studio
(Metricool lags; ask the owner for screenshots if Studio is not readable) compare per Short:
**"viewed" % in "viewed vs swiped away"** (primary) and **average % viewed** (secondary). Raw views only break ties.
- A format **wins** if its median "viewed" % beats the classic median by **10 points or more** across at least 3 Shorts.
- Within 10 points: no winner; keep the new formats (cheaper to make) and pick the better-performing slot.
- Classic wins by 10+ points: go back to classic for people stories and tell the owner.
- After the test: one Short a day in the winning slot; record the numbers and the decision in the data section below.

## Never automated (stop and ask)
- Facts: every number must come from the original paper, read in full. If a paper cannot be
  read, or the evidence is weak or mixed, say so in the script's fact check; if it is too weak
  to stand on, pick another topic and tell the owner why.
- Anything that deletes or unpublishes content, changes channel settings, or spends money.
- A failed render, failed check, or a Metricool error that a retry does not fix.

## Shorts rules
- The first 3 seconds carry the hook: 8 words or fewer, a surprising claim or number by second 2,
  motion in frame 0 (no fade-ins), and an open loop that the end closes.
- 20-35 s, native 1080x1920, nothing important in the bottom 420 px (Shorts UI).
- The hook must be exactly true to the paper; teasing is fine, overclaiming is not.
- New standalone Shorts are built in `future-self/popart/<id>/` with the lemo-opuscar kits
  (`future-self/popart/README.md`). The old HyperFrames Shorts (`shorts-src/`, `tools/prep-short.cjs`)
  are only for cutting Shorts out of a long video.

## Storytelling (every Short and every long video)
The channel wins on story, not on facts read aloud. Write each Short as a 25-second story:
1. **Hook (0-3 s):** a pattern interrupt plus an open loop. Rotate the hook types in the hook bank
   (shocking number, myth bust, you-accusation, dilemma, weird, story, hack); never the same type
   two days in a row.
2. **Stakes (3-7 s):** make it about "you". Put the kid (or the neighbor) in the situation.
3. **The experiment as a mini-story (7-18 s):** who, where, what they did, with one concrete detail
   (a number, a place, an object). Tell it like an anecdote ("So researchers handed 60 people $40..."),
   never like a lecture ("Studies show...").
4. **The twist (18-23 s):** the surprising result, landed with a beat of silence and a pop word.
5. **Payoff (23-28 s):** one line on what it means for the viewer.
6. **Loop line:** end on a line that makes the first line make sense again, so a rewatch feels natural.

Writing rules: chain beats with "but" and "so", never "and then"; one idea per Short; short spoken
sentences; the kid reacts on screen at the hook and at the twist. Long videos use the same arc per part,
with a cliffhanger line before each chapter card and a callback to the cold open at the end.
"Crazy" hooks are welcome; misleading ones are not. If the honest version of a hook is weaker, write
the honest version better rather than stretching the claim.

### Story frames (adapted from the owner's "80 storytelling hooks" swipe file)
Pick a frame per Short and say it in the hook. The narrator never claims a personal past ("I went from...",
"a client told me...") because none of it happened; put the "I" on the people in the study, on "you", or on
the kid as a clearly fictional character.
- Transformation: "[before] to [after]. Here's what changed." (H01)
- Mistake: "The mistake that cost them [X] was..." / "One small decision created a bigger problem."
- Turning point: "Everything changed when they tried one thing." (H11)
- Behind the scenes: "Here's what nobody saw behind [famous study]." (H07, H15)
- Contrarian: "Everyone says [advice]. The data disagrees." (H21, H43, H45)
- Relatable: "You know that feeling when [money moment]?" (H06, H31)
- Lesson: "If you could tell your younger self one money thing..." (future-self videos)
- Curiosity: "Something didn't add up, so researchers looked closer." (H50)
- Decision: "Two choices: [A] or [B]. Most people pick wrong." (H09, H14, H28, H44)
Skip the client/customer frame (no clients). Frames count as hook types for the no-repeat rule.

### What our data says (YouTube Studio, 21 Nov 2026, first 6 Shorts)
"Your neighbor won. You went broke?" 497 views; "Your neighbor's new car costs YOU" 186; "You're robbing
someone you know" 138; "Pay by card, pay DOUBLE?" 60; "Why tapping your card doesn't hurt" 48;
"Saving feels awful? Here's why" 27. So:
- Prefer "you lose because of someone else" hooks (a second character on screen in frame 0: the neighbor,
  a stranger, a coworker). Reuse the neighbor as a recurring character when the study fits.
- Never open with "Why..." or "Here's why"; turn the explanation into a conflict or a loss.
- Always native vertical; never a cropped 16:9 clip on a blurred background.
Re-check against YouTube Studio (Metricool lags several days) and update this list as data grows.

## Other rules
- Voice only (Kokoro, `af_heart` mood blends); the screen never reads a line back.
- Mark AI content as altered/synthetic; not made for kids; category Education.
