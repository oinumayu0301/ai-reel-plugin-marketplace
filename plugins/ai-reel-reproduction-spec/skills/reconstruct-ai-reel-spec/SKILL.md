---
name: reconstruct-ai-reel-spec
description: Analyze a public Instagram Reels, TikTok, or YouTube Shorts account URL, compare accessible strong and weak posts, extract transferable AI-short growth mechanisms, and create an original reproduction specification with concepts, scripts, visual and audio grammar, forecasts, and tests. Use for URL-to-spec competitor reverse-engineering. Do not use for exact copying, impersonation, bypassing access controls, or claiming hidden metrics.
---

# Reconstruct AI Reel Spec

Turn one public short-video account URL into a production-ready, evidence-aware reproduction specification. The output recreates the account's transferable growth logic, not its identity, protected expression, footage, character, voice, jokes, scripts, or shot sequence.

## Route the request

For a URL-only request, proceed without routine intake questions. Infer the platform from the URL, use the observed audience language or the user's language, and default to AI-assisted Reels, reach as the primary objective, qualified follows as the secondary objective, and one CTA per concept. State these as assumptions.

Read [workflow.md](references/workflow.md) for every full URL-to-spec run. Read [evidence-and-scoring.md](references/evidence-and-scoring.md) when collecting or ranking posts. Read [forecasting.md](references/forecasting.md) before predicting reactions. Use [reproduction-spec-template.md](references/reproduction-spec-template.md) for the final artifact, and run [quality-gates.md](references/quality-gates.md) before delivery. Read [benchmark-accounts.md](references/benchmark-accounts.md) only when cross-account benchmarking is useful or the target evidence is sparse.

## Evidence boundary

- Normalize and record the URL, platform, collection time, accessible post count, playable-video count, and visible-metric count.
- Use lawful public pages, public embeds, indexed sources, creator-owned pages, and media supplied by the user. Never automate login, reuse credentials, evade rate limits, or bypass access controls.
- Label every material statement as `observation`, `calculation`, `inference`, `assumption`, or `generated_recommendation`.
- Keep unavailable metrics blank. Missing is not zero and must not be silently estimated.
- Grade evidence: A = owner Insights plus fixed-window post data; B = playable library plus public reactions; C = representative playable posts with partial metrics; D = profile URL or external commentary only.
- Never call C- or D-grade evidence a complete account analysis. Continue provisionally and list the exact evidence that would raise confidence.

## Analyze winners and losers

Avoid raw cross-account popularity comparisons. Normalize within the target account or a matched cohort by format, topic, post age, and account stage. Compare at least three strong posts and three weak posts when available. If the sample is smaller, analyze all accessible posts and say so.

For each comparison, capture:

- viewer job, familiar tension, desired emotion, and share/save/comment/follow reason;
- hook promise, first visible event, information gap, progression, re-hook, payoff, loop, and CTA;
- spoken script function and on-screen summary function;
- visual density, subject scale, motion, cut rhythm, caption hierarchy, color, safe zones, audio role, and human realism;
- series promise, profile conversion path, production difficulty, and rights risk;
- alternative explanations such as post age, distribution timing, external traffic, novelty, and sample bias.

Use 0.2-second sampling only when the source video is actually available and the precision is valuable. Treat adjacent samples as one continuous sequence, align them to semantic beats and cuts, and do not pretend each frame is an independent observation.

## Extract the mechanism, not the costume

Separate findings into:

- `mechanism`: transferable cause, such as immediate recognition, escalating stakes, or a binary choice;
- `expression`: replaceable treatment, such as a specific setting, wording, color, or prop;
- `asset_ip`: protected or identity-bearing element that must not be copied;
- `evidence_strength`: direct, repeated, plausible, or speculative.

Use market-in to define the opening demand: audience, situation, pain, desire, viewing context, and reaction motive. Use product-out to define owned differentiation: expertise, original character, world, proof, generation capability, visual grammar, and repeatable series system. Select concepts at their intersection. Reject a generic trend with no account promise and an elaborate idea that requires prior explanation.

## Build the original concept portfolio

Generate ten materially different concepts across at least four content pillars and three emotional engines. Give each one a primary objective, at most one secondary objective, one CTA, one expected failure mode, and one variable to test. Score the full vector instead of using a single viral score:

`reach`, `first_3s_hold`, `completion`, `replay`, `share`, `save`, `comment`, `follow`, `trust`, `market_fit`, `series_potential`, `repeatability`, `feasibility`, `rights_safety`.

When a machine-readable concept file is useful, run:

```powershell
node scripts/score_concepts.mjs concepts.json scored-concepts.json
```

Select the top concept for the stated primary objective. Do not select any concept that fails rights safety, audience clarity, or production feasibility, even if its total is high.

## Specify one production-ready video

Write natural spoken Japanese when the audience is Japanese. On-screen text must summarize rather than transcribe the voice, remain understandable with sound off, use one semantic unit per screen, and stay inside vertical-video safe zones. Specify:

- premise, audience, objective, emotional trajectory, novelty, and series promise;
- second-by-second script beats, voice lines, concise captions, visual actions, transitions, audio cues, and purpose;
- original character/world bible, realistic locations, props, wardrobe, camera behavior, typography, palette, motion, edit rhythm, and negative constraints;
- reusable generation prompts per shot, continuity controls, assembly order, audio mix, and export settings;
- cover, caption, CTA, pinned-comment option, and profile handoff;
- production QA and rejection criteria.

The opening must be understandable in under one second. Show the event, consequence, object, number, or social reaction immediately. Give a partial answer by about three seconds, add at least three meaningful updates, include a new reveal or choice around 55–75% of duration, and make the ending resolve or reframe the opening.

## Forecast conditionally

Forecast views, likes, comments, and follows as low/base/high scenarios with a confidence grade and named assumptions. Prefer matched account cohorts and fixed post-age windows. Never claim deterministic growth. If profile visits or attributed follows are unavailable, make follows explicitly conditional on editable profile-visit and visit-to-follow assumptions. Report both positive drivers and failure drivers.

Use [forecasting.md](references/forecasting.md) and, when public post data are available:

```powershell
node scripts/score_posts.mjs posts.json scored-posts.json
```

## Completion contract

Deliver one self-contained Markdown reproduction specification following the template. It must distinguish evidence from recommendations, include winner/loser comparisons, show the market-in/product-out intersection, contain ten concepts plus one full script and production spec, provide conditional reaction ranges, list failure modes, and end with a prioritized evidence and test plan. If evidence grade is D, label the document `provisional` prominently.

