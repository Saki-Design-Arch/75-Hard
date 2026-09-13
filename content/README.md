# Content · @saki.fitness247

Where every video gets built before the camera turns on.

The account: a 256 lb man rebuilding to Marine standard in public, day by day. The
purpose: enough reach to open the Date Miles Club and bring personal training back.

The club has its own file: `.claude/skills/fitness-script/references/date-miles-club.md`
holds the charter, the arithmetic on why the first attempt never stuck, the fixed rule,
and the launch sequence. Read it before writing any club copy.

## Layout

```
scripts/            One file per video, ready to film. YYYY-MM-DD-slug.md
scripts/TEMPLATE.md The shape every script follows
backlog.md          Ideas that are not scheduled yet
performance-log.md  What went out and what it actually did
```

## The daily loop

1. Ask the agent for today's content, or run the `fitness-script` skill directly.
2. It reads the program day and phase off the tracker, checks what is new in the
   journey file, and writes a script into `scripts/`.
3. Film it. The script is a checklist, not an outline - nothing left to decide.
4. Post it, answer comments for the first hour.
5. Add the numbers to `performance-log.md` at 24 hours and again at 7 days.

## Standards

The skill lives in `.claude/skills/fitness-script/`. Read it and its references before
writing anything. The short version:

- Every number comes from the tracker or ships as a bracket to fill. No invented stats.
- One idea per video, one action for the viewer, one ask at most.
- Hope, not fear. Convicting, not condemning. From the journey, never from a pedestal.
- Motivational and identity videos end with the signature line, word for word.
- The bad days get posted too. That rule is the whole credibility of the account.

Voice inherits from ABY: `../../aby/brand/voice.md`.

## A note on the flops

Log the posts that did nothing, with the same detail as the ones that worked. They are
the most useful data this account will ever have and the easiest to skip writing down.
