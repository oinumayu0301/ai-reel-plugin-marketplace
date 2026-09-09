# Evidence and scoring standard

## Evidence labels

| Label | Meaning | Permitted use |
|---|---|---|
| `owner_insights` | Creator-owned analytics with a defined window | Retention, shares, saves, profile visits, follows, fixed-window comparisons |
| `public_post` | Public post and visible reactions | Content analysis and public performance proxies |
| `content_only` | Playable media without reliable reactions | Script, visual, audio, and execution grammar |
| `external_commentary` | Indexed third-party mention | Discovery and weak corroboration only |

## Statement labels

- `observation`: directly visible or supplied.
- `calculation`: formula derived only from cited inputs.
- `inference`: plausible interpretation with alternatives.
- `assumption`: editable input used to continue.
- `generated_recommendation`: new creative or strategic proposal.

## Completeness grades

- **A** — owner Insights, videos, and fixed-window data for a representative library.
- **B** — playable library with public dates and visible reactions.
- **C** — representative playable posts with partial metrics or dates.
- **D** — URL/profile facts or external commentary only.

The grade measures evidence coverage, not the quality of the account.

## Public post input schema

`score_posts.mjs` accepts a JSON array. All metrics are nullable.

```json
[
  {
    "id": "post-01",
    "account": "example",
    "postDate": "2026-09-01T10:00:00+09:00",
    "capturedAt": "2026-09-09T10:00:00+09:00",
    "views": 12000,
    "likes": 540,
    "comments": 21,
    "format": "ai-realism-story",
    "topic": "workplace"
  }
]
```

The script calculates only defensible values: age in days, views per day, like/view rate, comment/view rate, and within-account percentiles for visible metrics. Invalid or unavailable inputs remain `null`. The output does not infer retention, shares, saves, profile visits, or follows.

## Concept input schema

`score_concepts.mjs` accepts an array of concepts with a primary objective and 0–5 dimension scores.

```json
[
  {
    "id": "idea-01",
    "title": "Concept title",
    "primaryObjective": "reach",
    "scores": {
      "reach": 4,
      "first_3s_hold": 4,
      "completion": 3,
      "replay": 3,
      "share": 4,
      "save": 2,
      "comment": 3,
      "follow": 3,
      "trust": 3,
      "market_fit": 4,
      "series_potential": 4,
      "repeatability": 4,
      "feasibility": 4,
      "rights_safety": 5
    }
  }
]
```

Supported primary objectives are `reach`, `comment`, `save`, `follow`, and `trust`. A weighted score aids comparison but never replaces the dimension vector or the failure-mode analysis.

## Winner/loser table

For each matched pair, record: cohort rule, public outcome proxy, meaningful creative differences, shared variables, leading hypothesis, rival hypothesis, confidence, and next evidence required. Do not attribute causality from one pair.

