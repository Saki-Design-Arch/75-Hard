# 75 Hard · Fitness journey and content engine

Two halves of the same project: the training gets tracked, and the training becomes the
content.

## The tracker

`index.html` - open it in a browser. Four tabs:

- **75 Hard Tracker** - the challenge, day by day, six rules a day
- **Day to Day** - the Foundation Protocol: heavy calisthenics and Marine style
  conditioning, six months, four phases, six training days a week
- **Fitness Records** - PRs and workout log
- **Body Stats** - bodyweight over time

State lives in browser storage. The seeded baselines and the program definition are in
`assets/app.js`.

## The content engine

`content/` - the TikTok account **@saki.fitness247**, where the journey gets documented
in public.

```
content/README.md          The daily loop
content/scripts/           One file per video, ready to film
content/backlog.md         Ideas waiting on a real moment
content/performance-log.md What went out and what it did
```

The script agent lives in `.claude/skills/fitness-script/`. Ask for today's content and
it reads the program day off the tracker, checks what is new, and writes a filmable
script into `content/scripts/`.

## The arc

Started 2026-08-16 with ten push ups, zero pull ups, an 11.8 minute mile, and a 2,784
step a day baseline. First full measurement panel 2026-09-13 at 257.6 lb. Going to Marine
PT standard in six months, in public, on camera, every day.

The reach is not the goal. It is what opens the Date Miles Club, which launches
2026-10-01, and brings personal training back.
