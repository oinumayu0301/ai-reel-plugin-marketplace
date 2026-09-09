# Observation pack schema

An observation pack is a JSON object. It stores compact mechanism labels and evidence, not copied creative assets. Ingesting one account creates an exact-target account model; it does not make that account's patterns transferable to other accounts.

## Required shape

```json
{
  "schemaVersion": 1,
  "runId": "optional-readable-id",
  "account": {
    "platform": "instagram",
    "handle": "example",
    "url": "https://www.instagram.com/example/",
    "capturedAt": "2026-09-09T12:00:00+09:00",
    "evidenceGrade": "B",
    "language": "ja",
    "accessiblePosts": 12,
    "playablePosts": 10,
    "visibleMetricPosts": 12,
    "samplingStop": "representative-12"
  },
  "posts": [
    {
      "id": "post-01",
      "url": "https://www.instagram.com/reel/example/",
      "postedAt": "2026-09-01T10:00:00+09:00",
      "capturedAt": "2026-09-09T12:00:00+09:00",
      "durationSec": 31.4,
      "format": "ai-realism-story",
      "topic": "workplace",
      "outcomes": {
        "views": 12000,
        "likes": 540,
        "comments": 21,
        "shares": null,
        "saves": null,
        "follows": null,
        "fixedWindowHours": null
      },
      "components": {
        "hook": { "patterns": ["consequence-first", "immediate-recognition"], "confidence": 0.8 },
        "script": { "patterns": ["three-step-escalation", "midpoint-reframe"] },
        "visual": { "patterns": ["familiar-real-location", "motion-every-beat"] },
        "audio": { "patterns": ["conversational-pacing", "pause-before-reveal"] },
        "caption": { "patterns": ["summary-not-transcript", "silent-readable"] },
        "cta": { "patterns": ["binary-choice-comment"] }
      }
    }
  ],
  "notes": {
    "observations": ["Short factual notes only"],
    "limitations": ["Public totals are not fixed-window performance"],
    "rivalExplanations": ["Post age", "external distribution"]
  }
}
```

## Validation rules

- `schemaVersion` must be `1`.
- `account.url`, `account.platform`, `account.capturedAt`, and `account.evidenceGrade` are required.
- `posts` must contain at least one post.
- Metrics are non-negative numbers or `null`.
- Every component uses a `patterns` array of kebab-case mechanism labels. Labels are account-specific until cross-account aggregation independently validates transferability.
- Pattern confidence, when present, is from `0` to `1`.
- The ingest script rejects keys associated with raw media, full transcripts, voice embeddings, credentials, cookies, and tokens.
- Repeated account/post observations are deduplicated by account and post identity; the latest capture replaces older cumulative totals while preserving the run files.

## Normalized performance

The rebuild script first prefers an explicitly supplied `normalizedPerformance` from `0` to `100` when it came from a valid matched cohort. Otherwise it calculates a public proxy using within-account percentiles of age-normalized views, views, like/view rate, and comment/view rate. The proxy is labeled as such and never treated as retention or causal lift.

## Generated scopes

- One pack updates `account-models/<account-key>.json`, usable only for the same normalized account URL or platform/handle.
- `intelligence.json` aggregates patterns across accounts. A row is reusable elsewhere only when `transferableAcrossAccounts` is `true`.
- `promotion-queue.json` excludes all single-account-only observations.
