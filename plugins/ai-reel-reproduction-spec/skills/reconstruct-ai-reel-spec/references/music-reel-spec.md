# Music-led Reel specification

Use this reference when a target is song-led, includes an original vocal, or the user asks for an AI-generated song as part of the reproduction specification.

## 1. Classify the evidence before analysing music

Record whether the audio itself is playable, whether the lyrics are audible or user-supplied, whether timing can be inspected, and whether the post merely exposes an audio attribution. Attribution alone is not evidence of lyrics, melody, voice origin, or production method.

If playback is unavailable, analyse only visible metadata and visual pacing. Mark all music-character claims `unverified`, request a user-supplied video or transcript, and create an original music brief rather than a claimed song breakdown.

For playable material, observe only reusable functional traits:

- the first audible/visible hook and its timing;
- lyric function: recognition, escalation, joke, release, invitation, or loop;
- phrase length, chorus placement, silence/drop, beat changes, and edit synchronisation;
- vocal intelligibility, emotional distance, and whether text remains understandable with sound off;
- musical role in comments, replay, sharing, and account identity.

Do not transcribe or reproduce extensive lyrics. Do not identify a real singer from sound alone or claim a voice is AI without reliable creator evidence.

## 2. Transfer the musical mechanism, not the recording

Classify every finding as `mechanism`, `expression`, or `asset_ip`.

| Type | May be used in an original specification | Must be replaced |
|---|---|---|
| Mechanism | An immediate relatable lyric, a repeated chorus, edits that land on a drop, an unresolved final bar | — |
| Expression | Tempo range, energy curve, text cadence, original scene type | Specific wording, melody contour, chord progression if distinctive, exact edit timing |
| Asset/IP | — | Existing recording, lyrics, melody, vocal identity, artist name/style prompt, cover art, samples |

Never instruct a music generator to imitate a named artist, a reference track, a real person's voice, or a recognizable song. Never use a reference recording as a voice-cloning or style-transfer input unless the user owns the required rights and the supplier explicitly permits the use; even then, prefer a newly designed non-identifying voice.

## 3. Add the music-led appendix to the reproduction specification

When this route applies, append these sections after the normal production bible.

### A. Music mechanism fingerprint

- **Observed evidence:** audio availability, timing, repeated functional patterns, and limitations
- **Viewer job:** why a viewer would recognise, replay, quote, comment, or send the lyric
- **Sound-off path:** the independent story told by captions and visuals
- **Music-on advantage:** the emotional lift or punchline created by the original song
- **Transfer decision:** mechanism, replaceable expression, and prohibited assets

### B. Original song brief

- Listener, viewing context, desired emotion, and one-line premise
- Original hook line of no more than 12 Japanese words
- Original verse / lift / chorus / ending functions; keep the complete lyric original and concise
- Target duration, BPM range, meter, key/mode mood, energy curve, arrangement, and edit landmarks
- Vocal type: e.g. `non-identifying Japanese synthetic adult female voice, warm and conversational`; do not describe a real person or performer
- Generator-neutral prompt for a completely original song, plus negative constraints: no artist imitation, no reference melody, no sampled reference audio, no voice clone
- One instrumental fallback and one spoken/half-sung fallback for testing

### C. Music-video assembly map

| Time | Original lyric function | Sound-off text | Visual motion | Edit/music cue | Retention purpose |
|---|---|---|---|---|---|

Design the first visible motion and the first lyric together. Captions summarise the sung idea rather than duplicating every syllable. Time visual turns to original beat landmarks, not a copied reference timeline.

### D. Rights and release checklist

- All lyrics, melody, recording, artwork, and video are original or licensed for commercial social distribution.
- The synthetic voice is non-identifying, generated under a provider agreement that permits the intended use, and is not a clone or imitation of a real person.
- No reference audio, vocal sample, copyrighted lyric, or recognizable melody appears in the render.
- The selected music-generation provider's commercial-use terms, attribution requirements, territory, and Content ID policy are verified before release.
- Store only the provider, generation date, license/plan record, and asset identifiers in production records; do not store biometric voice embeddings.

## 4. Forecast and test music-led posts separately

Forecast the usual views, likes, comments, and follows conditionally, then add music-specific leading indicators: first-three-second hold, completion, replay, share/save, quoted-lyric comments, sound-on completion, and sound-off comprehension. Avoid claiming that a song will trend from one reference post.

Prioritise a controlled three-version test:

1. Same premise, different first lyric and first visual.
2. Same hook, sung chorus versus spoken/half-sung delivery.
3. Same audio, caption-on versus caption-light cut.

Predefine the observation window and select the winner with matched posting conditions where possible. A music-led concept fails if listeners cannot understand the premise in the first second, if captions are needed to repair an unclear vocal, if the chorus arrives after attention has already dropped, or if the original song adds no reason to replay or comment.
