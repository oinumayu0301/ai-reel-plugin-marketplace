---
name: learn-ai-reel-market
description: Ingest one or more public Instagram Reels, TikTok, or YouTube Shorts accounts into a workspace-local evidence corpus, then rebuild confidence-weighted patterns for hooks, scripts, visuals, audio, captions, and CTAs. Use when adding reference accounts, refreshing market research, or asking the plugin to improve its future recommendations over time. Do not claim model fine-tuning or auto-publish unreviewed rules.
---

# Learn AI Reel Market

Build a durable market-intelligence layer that improves future account analyses as more evidence is added. This updates the plugin's workspace data and decision priors; it does not retrain or change the underlying Codex model weights.

## Storage and routing

Use `<workspace>/.ai-reel-intelligence` as the default lab root. Never write learned data into the installed plugin cache because upgrades can replace it. If the user names a different durable folder, use that folder. If no writable workspace exists, produce the observation pack and exact ingest command without claiming persistence.

Read [observation-pack-schema.md](references/observation-pack-schema.md) before generating an input pack. Read [component-taxonomy.md](references/component-taxonomy.md) while classifying creative structures. Read [learning-system.md](references/learning-system.md) before interpreting or promoting aggregate patterns.

## URL ingestion workflow

For every supplied account URL:

1. Normalize the platform, handle, URL, capture time, accessible-post count, playable-video count, visible-metric count, and evidence grade.
2. Collect lawful public evidence or user-supplied media. Never bypass login, access controls, or rate limits.
3. Select all accessible posts or a representative sample covering high, middle, low, and recent performance. Disclose the stop condition and sampling bias.
4. Compare posts within matched cohorts by format, topic, post age, and account stage where possible.
5. Encode each post as mechanism patterns in the six component lanes: `hook`, `script`, `visual`, `audio`, `caption`, and `cta`. A pattern observed in one account is account-specific until independently repeated elsewhere.
6. Keep missing metrics as `null`. Do not infer retention, saves, shares, profile visits, or follows from public reactions.
7. Exclude raw video, downloaded media, biometric voice data, full transcripts, copied scripts, frame dumps, and identity-bearing assets from the learning pack.
8. Save one normalized JSON observation pack. Resolve this skill directory from the loaded `SKILL.md` path, then ingest it with:

```powershell
node <skill-directory>/scripts/ingest_observation.mjs --lab <workspace>/.ai-reel-intelligence --input <observation-pack.json>
```

The script validates the pack, deduplicates runs, rebuilds the market intelligence, and writes a human-readable learning report.

## What the learning system may update

It may update evidence-weighted priors for:

- hook families, first-frame clarity, stakes, recognition, information gaps, and first payoff;
- script complexity, progression, escalation, re-hook, payoff, loop, and natural language;
- visual realism, familiar locations, human consistency, motion, framing, cut rhythm, and continuity;
- audio voice profile without identity imitation, pacing, pauses, emotion, music role, song-led versus voice-led delivery, lyric-hook function without copied lyrics, SFX, and mix;
- caption relationship to speech, density, timing, hierarchy, safe zones, contrast, and silent comprehension;
- CTA reaction target, relevance, friction, timing, participation design, and profile handoff.

Use pattern names that describe mechanisms, not creator identity or copyrighted expression. One post may have multiple patterns in each lane.

## Two-layer learning policy

Maintain two separate layers and never blur them:

1. **Per-account reproduction layer** — one account is sufficient to create or update `<lab>/account-models/<account-key>.json`. Use it immediately only when the requested target matches that model's normalized account URL or platform/handle key. Its confidence depends on accessible post coverage, but it does not require other accounts.
2. **Cross-account market layer** — transferring a pattern to a different account, a generic plan, or a plugin-wide rule requires repeated evidence from multiple independent accounts. Only records with `transferableAcrossAccounts: true` may influence another account.

Never use a single-account model for a different URL, even when the niche, visual style, or creator format looks similar. Treat similarity as a reason to collect comparative evidence, not as permission to transfer.

## Statistical and strategic guardrails

- Weight evidence grade A/B/C/D as strong/moderate/limited/weak rather than treating every account equally reliable.
- Cap influence at the account level so one prolific account cannot dominate the market prior.
- Apply time decay so stale examples gradually carry less weight.
- Compare normalized performance inside matched accounts or cohorts; do not pool raw views across unequal accounts.
- Shrink small-sample lifts toward the corpus baseline.
- Inside an exact account model, mark coverage as `provisional_within_account` for 1–2 posts, `observed_within_account` for 3–5, and `stable_within_account` for 6 or more. These labels never imply cross-account validity.
- In the market layer, mark fewer than three independent accounts as `hypothesis` with `transferableAcrossAccounts: false`; mark sufficiently weighted evidence from three or more as `candidate`; and only stronger cross-account support as `learned_prior`.
- Treat associations as associations. Store rival explanations and never promote a causal rule from correlation alone.
- Track negative and neutral evidence, not only winners.
- Do not let a new corpus prior override clear target-account evidence.

## Use the update immediately

After ingestion, read:

- `<lab>/account-models/<account-key>.json` for the exact target account's reproduction fingerprint;
- `<lab>/intelligence.json` for machine-readable priors;
- `<lab>/learning-report.md` for the current strongest, weakest, and uncertain patterns;
- `<lab>/promotion-queue.json` for patterns that may justify a future plugin-rule update after review.

Report the change from the previous corpus: accounts added, posts added or replaced, coverage by component, patterns whose status changed, prediction uncertainty, and remaining blind spots. Do not say the system improved unless coverage, calibration, or confidence actually changed.

## Completion contract

Return the evidence grade for each account, saved pack path, deduplication result, account-model path and coverage status, corpus account/post totals, six-lane coverage, newly learned/candidate/rejected cross-account patterns, important counterexamples, and the next highest-value accounts or metrics to collect. Explicitly distinguish what may be used for this same account from what may be transferred elsewhere. Clearly state that the base model was not fine-tuned.
