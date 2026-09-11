---
name: reconstruct-ai-reel-spec
description: Analyze a public Instagram Reels, TikTok, or YouTube Shorts account or post URL, extract transferable growth mechanisms, and create an original reproduction specification with concepts, scripts, visual, audio, and music-video grammar, forecasts, and tests. Use for URL-to-spec competitor reverse-engineering. Do not use for exact copying, impersonation, bypassing access controls, or claiming hidden metrics.
---

# Reconstruct AI Reel Spec

Turn one public short-video account or post URL into a production-ready, evidence-aware reproduction specification. The output recreates transferable growth logic, not identity, protected expression, footage, character, voice, jokes, scripts, song lyrics, melody, or shot sequence.

## Route the request

For a URL-only request, proceed without routine intake questions. Infer the platform from the URL, use the observed audience language or the user's language, and default to AI-assisted Reels, reach as the primary objective, qualified follows as the secondary objective, and one CTA per concept. State these as assumptions. A post URL is a valid target: resolve the public creator account when available, but label the run as post-led and provisional unless a representative account sample is accessible.

Read [workflow.md](references/workflow.md) for every full URL-to-spec run. Read [evidence-and-scoring.md](references/evidence-and-scoring.md) when collecting or ranking posts. Read [forecasting.md](references/forecasting.md) before predicting reactions. Use [reproduction-spec-template.md](references/reproduction-spec-template.md) for the final artifact, and run [quality-gates.md](references/quality-gates.md) before delivery. Read [adaptive-intelligence.md](references/adaptive-intelligence.md) whenever a workspace intelligence corpus exists or the user wants the system to learn from the run. Read [benchmark-accounts.md](references/benchmark-accounts.md) only when cross-account benchmarking is useful or the target evidence is sparse. Read [music-reel-spec.md](references/music-reel-spec.md) for every full URL-to-spec run. It defines the required account-level choice between a music-led, music-assisted, and voice-led production route. Use its full original-song appendix only when that decision or the user's request calls for it.

## Adaptive market intelligence

Before generating concepts, look for `<workspace>/.ai-reel-intelligence/account-models/*.json` and `<workspace>/.ai-reel-intelligence/intelligence.json`. First select an account model only when its normalized URL or platform/handle exactly matches the requested target. One account is sufficient for this exact-target model. Then inspect cross-account intelligence, but apply only records marked `transferableAcrossAccounts: true`. Disclose update time, account/post coverage, evidence limitations, and every prior that materially influences the decision. Target-account evidence outranks cross-account priors. Ignore stale, low-confidence, or mismatched patterns.

For a full URL analysis, persist a compact observation pack and rebuild the corpus unless the user requested a read-only run, declined persistence, or no writable workspace exists. Use the sibling `$learn-ai-reel-market` schema and ingest script. Store transferable mechanism labels and outcome evidence only; never store downloaded videos, full transcripts, copied scripts, identity-bearing assets, voice embeddings, credentials, or cookies.

This learning layer may change recommendations for the same target immediately through its exact-account model. Recommendations for a different account may change only from eligible cross-account records in `intelligence.json`. It does not retrain the Codex base model and must not silently rewrite plugin instructions or publish to GitHub.

## Evidence boundary

- Normalize and record the URL, platform, collection time, accessible post count, playable-video count, and visible-metric count.
- Use lawful public pages, public embeds, indexed sources, creator-owned pages, and media supplied by the user. Never automate login, reuse credentials, evade rate limits, or bypass access controls.
- Label every material statement as `observation`, `calculation`, `inference`, `assumption`, or `generated_recommendation`.
- Keep unavailable metrics blank. Missing is not zero and must not be silently estimated.
- Grade evidence: A = owner Insights plus fixed-window post data; B = playable library plus public reactions; C = representative playable posts with partial metrics; D = profile URL or external commentary only.
- Never call C- or D-grade evidence a complete account analysis. Continue provisionally and list the exact evidence that would raise confidence.

## Analyze winners and losers

Avoid raw cross-account popularity comparisons. Normalize within the target account or a matched cohort by format, topic, post age, and account stage. Compare at least three strong posts and three weak posts when available. If the sample is smaller, analyze all accessible posts and say so.

For each comparison, capture and encode reusable patterns for the six learning lanes:

- viewer job, familiar tension, desired emotion, and share/save/comment/follow reason;
- hook promise, first visible event, information gap, progression, re-hook, payoff, loop, and CTA;
- spoken script function and on-screen summary function;
- visual density, subject scale, motion, cut rhythm, caption hierarchy, color, safe zones, audio role, and human realism;
- series promise, profile conversion path, production difficulty, and rights risk;
- alternative explanations such as post age, distribution timing, external traffic, novelty, and sample bias.

Use 0.2-second sampling only when the source video is actually available and the precision is valuable. Treat adjacent samples as one continuous sequence, align them to semantic beats and cuts, and do not pretend each frame is an independent observation. Do not infer lyrics, melody, singer identity, or voice-generation method from post metadata alone.

## Extract the mechanism, not the costume

Separate findings into:

- `mechanism`: transferable cause, such as immediate recognition, escalating stakes, or a binary choice;
- `expression`: replaceable treatment, such as a specific setting, wording, color, or prop;
- `asset_ip`: protected or identity-bearing element that must not be copied;
- `evidence_strength`: direct, repeated, plausible, or speculative.

Use market-in to define the opening demand: audience, situation, pain, desire, viewing context, and reaction motive. Use product-out to define owned differentiation: expertise, original character, world, proof, generation capability, visual grammar, and repeatable series system. Select concepts at their intersection. Reject a generic trend with no account promise and an elaborate idea that requires prior explanation.

## Decide the role of song before writing concepts

For every target account, make an explicit `audio_strategy_decision`: `music-led`, `music-assisted`, or `voice-led`. Compare matched high- and low-performing posts when accessible; inspect whether music is a repeatable account promise, whether it earns replay, quoted comments, or shares, and whether the premise still works muted. A single music post or audio attribution is insufficient evidence of causal lift. In that case, label the decision a hypothesis and propose a controlled test rather than force song creation.

- `music-led`: an original song or sung hook is the primary delivery system. Use the music-led appendix, create original lyrics and an original arrangement/voice brief, and include sound-on and sound-off success criteria.
- `music-assisted`: music supports pacing or emotional lift, but the core message remains voice/text/visual-led. Specify the music role and mix, but do not create a full song unless it is an explicit test variant.
- `voice-led`: song would add friction, obscure the premise, or conflict with target evidence. Specify speech, ambience, or simple SFX instead, and document why a music route was rejected.

## Build the original concept portfolio

Generate ten materially different concepts across at least four content pillars and three emotional engines. Give each one a primary objective, at most one secondary objective, one CTA, one expected failure mode, one variable to test, and an audio route consistent with the account-level decision. Where `music-led` is selected, include an original song premise and lyric-hook function; where `music-assisted` is selected, include one song-versus-non-song test only when it has learning value. Score the full vector instead of using a single viral score:

`reach`, `first_3s_hold`, `completion`, `replay`, `share`, `save`, `comment`, `follow`, `trust`, `market_fit`, `series_potential`, `repeatability`, `feasibility`, `rights_safety`, `audio_strategy_fit`, `sound_off_clarity`.

When a machine-readable concept file is useful, run:

```powershell
node scripts/score_concepts.mjs concepts.json scored-concepts.json
```

Select the top concept for the stated primary objective. Do not select any concept that fails rights safety, audience clarity, or production feasibility, even if its total is high.

## Specify one production-ready video

Write natural spoken Japanese when the audience is Japanese. On-screen text must summarize rather than transcribe the voice, remain understandable with sound off, use one semantic unit per screen, and stay inside vertical-video safe zones. Specify:

- premise, audience, objective, emotional trajectory, novelty, series promise, and audio strategy decision;
- second-by-second script beats, voice lines, concise captions, visual actions, transitions, audio cues, and purpose;
- original character/world bible, realistic locations, props, wardrobe, camera behavior, typography, palette, motion, edit rhythm, and negative constraints;
- reusable generation prompts per shot, continuity controls, assembly order, audio mix, and export settings;
- cover, caption, CTA, pinned-comment option, and profile handoff;
- production QA and rejection criteria.

The opening must be understandable in under one second. Show the event, consequence, object, number, or social reaction immediately. Give a partial answer by about three seconds, add at least three meaningful updates, include a new reveal or choice around 55–75% of duration, and make the ending resolve or reframe the opening. For a music-led short, design an original lyric hook within the first 0.8 seconds and ensure the visual/text narrative works without sound.

## Forecast conditionally

Forecast views, likes, comments, and follows as low/base/high scenarios with a confidence grade and named assumptions. Prefer matched account cohorts and fixed post-age windows. Never claim deterministic growth. If profile visits or attributed follows are unavailable, make follows explicitly conditional on editable profile-visit and visit-to-follow assumptions. Report both positive drivers and failure drivers.

Use [forecasting.md](references/forecasting.md) and, when public post data are available:

```powershell
node scripts/score_posts.mjs posts.json scored-posts.json
```

## Completion contract

Deliver one self-contained Markdown reproduction specification following the template. It must distinguish evidence from recommendations, include winner/loser comparisons, show the market-in/product-out intersection, contain ten concepts plus one full script and production spec, provide conditional reaction ranges, list failure modes, and end with a prioritized evidence and test plan. State whether an exact-account model and/or cross-account priors were used, their coverage and confidence, and whether this run updated the corpus. Never apply a single-account model to a different target. If evidence grade is D, label the document `provisional` prominently.
