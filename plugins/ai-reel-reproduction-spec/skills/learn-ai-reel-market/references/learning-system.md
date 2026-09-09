# Adaptive learning system

## What changes over time

The durable corpus updates five output groups under the lab root:

- `account-models/<account-key>.json`: exact-account reproduction fingerprints built from that account alone;
- `intelligence.json`: current six-lane priors and pairwise interactions;
- `learning-report.md`: readable summary, evidence coverage, positive/negative patterns, and blind spots;
- `promotion-queue.json`: sufficiently repeated patterns that may inform a reviewed plugin-rule change;
- `manifest.json`: input runs, hashes, schema version, and rebuild time.

Raw observation packs live under `accounts/<account-key>/`. The installed plugin files do not self-modify.

## Separation of scopes

One account is enough to learn how to reproduce that same account's mechanism fingerprint. Its account model is matched by normalized URL or `platform:handle` and has `scope: target-account-only`. More posts improve its coverage, but other accounts are not a prerequisite.

A model learned from one account must never be applied to another account. Cross-account transfer requires at least three independent accounts with sufficient effective evidence, and the generated record must explicitly say `transferableAcrossAccounts: true`. A look-alike niche or format is not an independent confirmation.

## Performance proxy

Prefer fixed-window owner data. When unavailable, calculate within-account public proxies from view-speed percentile, cumulative-view percentile, like/view percentile, and comment/view percentile. Use only available inputs. Never infer shares, saves, retention, profile visits, or follows from these proxies.

## Account-balanced aggregation

For each pattern, average its post scores inside each account first. Aggregate those account-level means using evidence-grade weight and time decay. This prevents one account with many posts from dominating.

Estimate association lift relative to the corpus baseline, then shrink it toward zero:

`shrunkLift = rawLift × effectiveWeight / (effectiveWeight + 5)`

The constant is a conservative prior, not a universal truth. Keep it visible in generated metadata.

## Status thresholds

Account-model coverage labels:

- `provisional_within_account`: 1–2 accessible posts;
- `observed_within_account`: 3–5 accessible posts;
- `stable_within_account`: 6 or more accessible posts.

All three remain exact-target-only.

Cross-account status labels:

- `hypothesis`: fewer than 3 independent accounts or weak effective weight;
- `candidate`: at least 3 independent accounts with usable coverage;
- `learned_prior`: at least 5 accounts, sufficient effective weight, and confidence at or above the configured threshold;
- `inconclusive`: adequate exposure but near-zero or unstable association;
- `negative_signal`: repeated below-baseline association, still non-causal.

Pairwise interactions require stronger support because the sample fragments quickly.

## Promotion policy

Only a record with `transferableAcrossAccounts: true` may influence a different account or enter `promotion-queue.json`. `learned_prior` means the pattern may influence matched cross-account planning as a prior. It does not justify automatically rewriting `SKILL.md`, changing legal or safety boundaries, publishing to GitHub, or claiming causality. The promotion queue must include counterexamples, rival explanations, recency, coverage by account, and the proposed decision change.

Plugin-rule edits require a separate review of the queue. The live `intelligence.json` can improve recommendations immediately without risky self-editing.

## Quality checks

- Deduplicate accounts and posts.
- Detect missing-component and missing-metric rates.
- Preserve negative and neutral examples.
- Separate current cumulative totals from fixed-window metrics.
- Flag patterns dominated by one topic, format, language, or account stage.
- Rebuild from all stored packs so results are reproducible.
- Never report improved accuracy without later outcome calibration.
