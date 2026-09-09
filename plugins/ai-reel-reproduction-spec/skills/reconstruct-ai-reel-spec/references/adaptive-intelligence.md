# Adaptive intelligence integration

## Read before planning

Use the workspace-local corpus at `.ai-reel-intelligence` when present. First read `account-models/*.json` and use a model only if its `matchKeys` exactly match the target's normalized URL or platform/handle. One account is enough to build this same-account model. Then read `intelligence.json`; for a different target or general recommendation, apply only records whose `transferableAcrossAccounts` field is `true` and whose audience, language, format, account stage, and objective are reasonably relevant. Record each applied model or prior and its confidence in the reproduction specification.

Priority order:

1. owner Insights and current matched target-account evidence;
2. exact-match account model, even when it was built from one account only;
3. matched cross-account learned priors with `transferableAcrossAccounts: true`;
4. matched cross-account candidates with `transferableAcrossAccounts: true`;
5. generic hypotheses, disclosed but not treated as learned evidence.

Never allow a lower lane to overrule a higher lane without a stated reason.

Never use an exact-account model for a different URL. A single-account hypothesis in `intelligence.json` is visible for research continuity but is not transferable.

## Six-lane application

Use the corpus separately for `hook`, `script`, `visual`, `audio`, `caption`, and `cta`. Do not collapse these into one virality score. A pattern can raise reach while lowering comments or follows. Inspect pairwise interactions only when they have enough independent-account support.

For detailed labels and pack structure, read the sibling resources:

- `../learn-ai-reel-market/references/component-taxonomy.md`
- `../learn-ai-reel-market/references/observation-pack-schema.md`
- `../learn-ai-reel-market/references/learning-system.md`

## Persist after analysis

After completing the account evidence table:

1. create a schema-version-1 observation pack;
2. keep unavailable metrics `null`;
3. encode mechanism patterns and counterevidence; keep them exact-account-only until cross-account validation marks them transferable;
4. save the pack in a workspace output folder;
5. resolve the installed `learn-ai-reel-market` skill directory and run its `scripts/ingest_observation.mjs` with the lab and pack paths;
6. read the rebuilt summary and disclose what changed.

Do not claim that more rows automatically mean better recommendations. Improvement requires better coverage, matched comparisons, reduced uncertainty, or demonstrated forecast calibration.
