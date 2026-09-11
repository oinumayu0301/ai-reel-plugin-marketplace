# URL-to-spec workflow

## 1. Define the decision

Record target URL, platform, audience language, business/account goal, primary content objective, secondary objective, analysis date, and all inferred defaults. Accept either an account URL or a public post URL. The default deliverable is a production-ready specification, not a promise of identical performance.

## 2. Build an evidence manifest

Collect accessible profile facts and a post-level inventory. For every source, store URL or post identifier, observed date, post date if visible, media availability, visible views/likes/comments, caption availability, and evidence label. Never convert a missing field to zero.

Stop collecting when one of these conditions is met:

- all accessible posts are inventoried;
- at least 12 playable posts cover high, middle, and low visible performance plus recent posts;
- access limitations prevent further lawful collection.

State which condition ended collection. A large screenshot count does not repair a biased post sample.

## 3. Normalize the comparison

Create comparable cohorts by post age, content format, topic family, duration, and account stage where data allow. Use within-account ranks and age-normalized public proxies. Separate current totals from fixed-window performance. Never interpret an older post's larger cumulative count as proof of a better creative. For a single-post target, skip artificial winner/loser comparisons and prominently label the result post-led and provisional.

Choose matched winner/loser pairs. For each apparent cause, write at least one rival explanation and what evidence would distinguish them.

## 4. Analyze at four layers

1. **Market** — audience job, tension, desire, emotional reward, social currency, and reaction motive.
2. **Creative system** — pillars, recurring premise, hook family, escalation, payoff, loop, series promise, and CTA.
3. **Execution grammar** — voice, captions, human realism, framing, motion, cut rhythm, sound, color, typography, and continuity.
4. **Conversion system** — profile promise, pinned-post path, episodic expectation, trust, and reason to follow now.

Analyze 0.2-second frames only for playable videos selected for micro-analysis. Align frames with audio transcript, cuts, caption changes, and semantic beats. Summarize repeated spans; do not produce hundreds of redundant conclusions. For song-led posts, analyse music only when the audio is actually playable or supplied, then read [music-reel-spec.md](music-reel-spec.md); metadata cannot establish lyrics, melody, voice identity, or whether a voice is AI.

## 5. Separate transferable and protected elements

For every notable trait, assign `mechanism`, `expression`, or `asset_ip`. Transfer only the mechanism. Replace the character, voice, world, exact wording, examples, punchline, music, footage, and shot order with original equivalents.

## 6. Construct market-in/product-out intersections

Produce:

- an audience-demand map with common situations, emotions, objections, and desired reactions;
- an owned-asset map with expertise, original character/world, proof, generation skills, and sustainable production constraints;
- three intersections that are understandable without context and distinct enough to create a followable account promise.

## 7. Generate and score the portfolio

Before generating concepts, load the exact account model when its match key equals the target. Separately load only cross-account patterns marked `transferableAcrossAccounts: true`. Never transfer another account's private fingerprint merely because its niche or format looks similar.

Create ten concepts across multiple pillars and emotional engines. Assign one primary objective and at most one secondary objective. Score the full vector, record the likely failure, and choose one test variable. Use `score_concepts.mjs` for repeatable weighted rankings when structured inputs are available.

## 8. Write the flagship specification

For the selected concept, produce a complete beat sheet, spoken script, summarized on-screen text, visual actions, audio cues, shot prompts, style bible, continuity rules, edit map, cover, caption, CTA, export settings, and rejection criteria.

## 9. Forecast conditionally

Use matched cohort quantiles and observed reaction rates where available. Give low/base/high ranges, confidence, assumptions, positive drivers, and failure drivers. Make follow estimates conditional unless profile visits and attributed follows exist.

## 10. Design the validation loop

Prioritize tests by value of information, not convenience. Change one dominant variable per test: hook wording, first visual, premise, duration, payoff, caption density, CTA, or profile handoff. Define observation windows and success thresholds before publishing. Separate creative learning from distribution noise.
