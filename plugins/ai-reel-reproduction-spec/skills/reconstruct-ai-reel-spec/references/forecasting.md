# Conditional forecasting

## Principle

Forecast a range under explicit conditions, not an exact result. Platform distribution, post timing, account health, external traffic, and creative novelty create irreducible uncertainty. A forecast is decision support, not a guarantee.

## Preferred baseline order

1. Same account, same format/topic, same fixed post-age window.
2. Same account, recent comparable posts with age normalization.
3. Matched accounts normalized by account stage and format.
4. Broad benchmark assumptions, clearly labeled low confidence.

Do not compare raw counts across accounts when audience size, account age, or observation windows differ.

## Views

Use matched-cohort public quantiles or owner fixed-window distributions:

- low: pessimistic matched-cohort quartile or failure scenario;
- base: matched-cohort median adjusted only by explicit test factors;
- high: optimistic quartile or breakout scenario.

When only current cumulative views exist, state that post-age effects remain. `viewsPerDay` is a rough exposure-speed proxy, not an algorithmic growth rate and not a replacement for fixed-window data.

## Likes and comments

Calculate visible rates only when both numerator and views are present:

`likeRate = likes / views`

`commentRate = comments / views`

Apply low/base/high cohort rate bands to each view scenario. Avoid false precision; round to sensible ranges. Explain why the concept may increase or suppress each reaction. A strong hold mechanism can raise views without raising comments.

## Follows

Prefer owner data:

`follows = views × profileVisitRate × visitToFollowRate`

If either rate is unavailable, provide editable conditional scenarios rather than a hidden estimate. Also give a qualitative follow-strength grade based on series promise, profile clarity, audience specificity, trust, and the gap between this post and the next expected episode.

## Confidence

- **High** — evidence grade A, matched cohort, sufficient sample, fixed windows.
- **Medium** — grade B, stable public metrics, reasonable matching.
- **Low** — grade C or D, sparse posts, missing dates, cross-account transfer, or major assumptions.

Every forecast table includes: range, observation window, data basis, confidence, assumptions, positive drivers, downside drivers, and invalidation signal.

