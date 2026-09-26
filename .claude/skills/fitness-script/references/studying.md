# Studying other content

Saki watches a lot of content. Some of it works on him, and some of it is working on
millions of people. Study mode turns that into something this account can use: why a
piece of content holds attention, stated as a mechanism, and what that mechanism looks
like in his voice and his real numbers.

The studies are shared. The same library feeds Auren and the ABY Marketing and Content
agent, who use it to make better content for the clothing brand. So every study answers
two questions: what it means for @saki.fitness247, and what it means for ABY.

## When to use it

Whenever Saki shares something to learn from, even if he does not say "study":

- A TikTok, Reel or Short link, with or without a note ("why did this blow up", "break
  this down", "I want to make something like this").
- Screenshots or a screen recording of a video.
- A transcript, or his own description of a video he watched.
- A creator's name and "what is this person doing right".
- One of his own posts that did well or badly and he wants to know why. His own
  content gets studied with the same template, and it is the most useful kind.

## What can actually be read

Be honest about this with him every time. A study built on guesses is worse than none.

| Source | What you get | How |
|---|---|---|
| TikTok link | Caption, creator name and handle, the cover image | `https://www.tiktok.com/oembed?url=<the video URL>` with WebFetch. Save the `thumbnail_url` image with curl and Read it to see the cover frame |
| Screenshots Saki drops in | Every frame he captured, including on screen text | Read the images |
| A transcript or his description | The spoken words and the beats | As given |
| Instagram, YouTube links | Sometimes a title and description | WebFetch, and say plainly if nothing came back |

You cannot play a video. So the spoken hook, the pacing, the cuts and the audio come
from Saki: ask for two or three screenshots (the first frame, the moment it turns, the
last frame) or the first line said out loud. One question, not a questionnaire. If he
cannot give it, write the study from what you have and mark each unknown `[NOT SEEN]`.

Views, likes, shares and follower counts go in only if they are visible in something he
gave you, with the date he saw them. Never estimate them, never search for them and
report a number you cannot trace. The facts rule in `SKILL.md` applies to other people's
numbers exactly as it does to his.

## How to study a piece

Fill `aby/content/studies/_template.md`. The parts that matter most:

1. **The hook, verbatim.** The first spoken line and the first on screen text, word for
   word, plus what is moving in frame in the first second. Then name its structure with
   the laws in `hooks.md` (flat confession, number gap, day counter, opposite
   expectation, cost reveal) or say it is a new one and describe it.
2. **The beats.** Second ranges where known, what is said, what is shown. Map it to the
   nearest of the nine formats in `formats.md`, or describe the new shape.
3. **The mechanism.** One or two sentences on why it holds attention. Not "it is
   relatable" or "good energy". Something testable: "the number in frame one is absurd
   enough that you have to watch the proof," "the loop closes on the same shot it
   opened, so it replays."
4. **The ask.** What it asks the viewer to do and how hard it pushes. Soft, one ask, or
   several.
5. **What to take.** The principle, stated so it transfers. One or two, not ten.
6. **What not to take.** Anything that would break a hard rule: fake urgency, shame,
   staged failure, borrowed footage, a pedestal voice, numbers without proof. Great
   performing content often does these things. Name them so nobody copies them by
   accident.
7. **For the fitness account.** The principle rewritten against his real journey: which
   series, which format, a hook off a real number from `journey.md`.
8. **For ABY.** The same principle applied to the clothing brand: a Become hoodie video,
   a drop, the storefront, the identity message. Read `aby/brand/voice.md` and
   `aby/brand/audience.md` first. If it does not fit ABY, say so rather than forcing it.

## Rules

- **Study the mechanism, never copy the words.** No line from someone else's video goes
  into a script, not even reworded closely. The hook structure transfers; the sentence
  does not. This is also the brand: Always Be Yourself is not a slogan you get to say
  while wearing someone else's voice.
- **No mocking.** A study is respectful even when the content is bad. It is about what
  works, not about the person.
- **Flops count.** A video that did nothing, his or anyone's, teaches as much as a hit.
  Study it the same way.
- **One study, one file.** Short beats thorough. If a section has nothing true to say,
  write `[NOT SEEN]` or "nothing here" and move on.

## Where it goes

1. Save the study to `../aby/content/studies/YYYY-MM-DD-creator-or-topic.md`. The path
   is relative to this repository's root and assumes `aby` is cloned beside it, as it is
   on Saki's machine. This repository is public and `aby` is private, so studies never
   live here. If the `aby` folder is not on disk, stop and tell him where it needs to
   be rather than saving the study in this repository.
2. Add a row to the index in `../aby/content/studies/README.md`.
3. Update `../aby/content/studies/playbook.md`. A lesson seen in one study goes under
   "Seen once". When a second study shows the same mechanism, move it to "Holds" and
   list both studies. A lesson that a later study contradicts gets the contradiction
   written next to it, not deleted.
4. **Use it straight away.** End with one concrete thing for his account: either a script
   filed in `content/scripts/` built on the lesson, or a line in `content/backlog.md` if
   it needs footage he does not have. A study that changes nothing was a waste of his
   evening.

## Before writing any script

Read `../aby/content/studies/playbook.md` if it is on disk. Anything under "Holds" is
proven on real content: prefer it when picking the hook and the format. Anything under
"Seen once" is worth trying, and worth logging in `content/performance-log.md` as a test
so the result feeds back into the next study.
