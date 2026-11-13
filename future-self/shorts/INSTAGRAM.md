# Instagram Reels: Mrs. Money Mind

All four Reels are in `renders/`, native 1080x1920, voice only. Post one every 1-2 days.
For each Reel: turn on "AI info" (AI label) for the AI voice. Put the bio link to the YouTube channel.

| File | Caption |
|---|---|
| `v1-short1-robbing-someone.mp4` | Every 1 a.m. purchase takes money from someone you know. Guess who. 👀 Full video on YouTube (link in bio). #psychology #money #futureself #savingmoney #personalfinance |
| `v1-short2-saving-is-charity.mp4` | To your brain, saving money feels like giving it to a stranger. That's why it's so hard. Full video on YouTube (link in bio). #psychology #money #behavioraleconomics #savingmoney |
| `v2-short1-double-same-seats.mp4` | Same seats, same game. People paying by card bid more than twice as much. Full video on YouTube (link in bio). #psychology #money #creditcard #spending |
| `v2-short2-tap-doesnt-hurt.mp4` | Cash says ouch. A card tap says nothing. Full video on YouTube (link in bio). #psychology #money #painofpaying #savingmoney |

Sources: Ersner-Hershfield et al. (2009); Prelec & Simester (2001); Prelec & Loewenstein (1998). Education only, not financial advice.

Rebuild a Reel: `node ../tools/prep-short.cjs v1a|v1b|v2a|v2b`, then `npx --yes hyperframes@0.9.33 render -o renders/<name>.mp4` in this folder.
