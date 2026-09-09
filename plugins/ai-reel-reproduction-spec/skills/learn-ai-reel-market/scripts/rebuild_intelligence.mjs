#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const COMPONENTS = ["hook", "script", "visual", "audio", "caption", "cta"];
const GRADE_WEIGHT = { A: 1, B: 0.8, C: 0.55, D: 0.25 };
const HALF_LIFE_DAYS = 365;
const PRIOR_STRENGTH = 5;

function fail(message) {
  console.error(message);
  process.exit(1);
}

function parseArgs(argv) {
  const result = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) fail(`Unexpected argument: ${token}`);
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) fail(`Missing value for ${token}`);
    result[token.slice(2)] = value;
    index += 1;
  }
  return result;
}

function finite(value) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : null;
}

function round(value, digits = 3) {
  if (!Number.isFinite(value)) return null;
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function average(values) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
}

function weightedAverage(items) {
  const usable = items.filter((item) => Number.isFinite(item.value) && Number.isFinite(item.weight) && item.weight > 0);
  const weight = usable.reduce((sum, item) => sum + item.weight, 0);
  if (weight === 0) return null;
  return usable.reduce((sum, item) => sum + item.value * item.weight, 0) / weight;
}

function percentile(value, values) {
  if (!Number.isFinite(value) || values.length === 0) return null;
  const below = values.filter((candidate) => candidate < value).length;
  const equal = values.filter((candidate) => candidate === value).length;
  return 100 * (below + 0.5 * equal) / values.length;
}

function dateMillis(value) {
  const parsed = typeof value === "string" ? Date.parse(value) : NaN;
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeAccountUrl(value) {
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    const url = new URL(value.trim());
    const pathname = url.pathname.replace(/\/+$/, "") || "/";
    const hostname = url.hostname.toLowerCase().replace(/^www\./, "");
    return `${url.protocol.toLowerCase()}//${hostname}${pathname.toLowerCase()}`;
  } catch {
    return value.trim().toLowerCase().replace(/[?#].*$/, "").replace(/\/+$/, "");
  }
}

function accountKey(pack) {
  const platform = String(pack.account?.platform ?? "unknown").toLowerCase();
  const handle = String(pack.account?.handle ?? "").toLowerCase().replace(/^@/, "");
  const identity = handle ? `handle:${handle}` : `url:${normalizeAccountUrl(pack.account?.url) ?? "unknown"}`;
  return `${platform}:${identity}`;
}

function postKey(pack, post, index) {
  return `${accountKey(pack)}:${post.url ?? post.id ?? index}`.toLowerCase();
}

function listJsonFiles(root) {
  if (!fs.existsSync(root)) return [];
  const files = [];
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const full = path.join(root, entry.name);
    if (entry.isDirectory()) files.push(...listJsonFiles(full));
    else if (entry.isFile() && entry.name.endsWith(".json")) files.push(full);
  }
  return files.sort();
}

function buildRows(packs) {
  const newest = new Map();
  for (const pack of packs) {
    for (let index = 0; index < (pack.posts ?? []).length; index += 1) {
      const post = pack.posts[index];
      const key = postKey(pack, post, index);
      const capturedAt = dateMillis(post.capturedAt ?? pack.account?.capturedAt) ?? 0;
      const current = newest.get(key);
      if (!current || capturedAt >= current.capturedAt) {
        newest.set(key, {
          key,
          accountKey: accountKey(pack),
          account: pack.account,
          post,
          capturedAt,
          grade: String(pack.account?.evidenceGrade ?? "D").toUpperCase()
        });
      }
    }
  }
  return [...newest.values()];
}

function scoreRows(rows) {
  const groups = new Map();
  for (const row of rows) {
    if (!groups.has(row.accountKey)) groups.set(row.accountKey, []);
    groups.get(row.accountKey).push(row);
  }
  for (const group of groups.values()) {
    for (const row of group) {
      const outcomes = row.post.outcomes ?? {};
      row.views = finite(outcomes.views);
      row.likes = finite(outcomes.likes);
      row.comments = finite(outcomes.comments);
      const posted = dateMillis(row.post.postedAt);
      const ageDays = posted !== null && row.capturedAt >= posted ? (row.capturedAt - posted) / 86_400_000 : null;
      row.viewSpeed = row.views !== null && ageDays !== null && ageDays > 0 ? row.views / ageDays : null;
      row.likeRate = row.views && row.likes !== null ? row.likes / row.views : null;
      row.commentRate = row.views && row.comments !== null ? row.comments / row.views : null;
    }
    const fields = ["views", "viewSpeed", "likeRate", "commentRate"];
    const distributions = Object.fromEntries(fields.map((field) => [field, group.map((row) => row[field]).filter(Number.isFinite)]));
    for (const row of group) {
      const supplied = finite(row.post.normalizedPerformance);
      if (supplied !== null && supplied <= 100) {
        row.performance = supplied;
        row.performanceBasis = "supplied-matched-cohort";
      } else {
        const primaryField = row.viewSpeed !== null ? "viewSpeed" : "views";
        const parts = [
          { value: percentile(row[primaryField], distributions[primaryField]), weight: 0.7 },
          { value: percentile(row.likeRate, distributions.likeRate), weight: 0.2 },
          { value: percentile(row.commentRate, distributions.commentRate), weight: 0.1 }
        ];
        row.performance = weightedAverage(parts);
        row.performanceBasis = row.performance === null ? "unavailable" : `public-proxy:${primaryField}`;
      }
      row.accountSampleWeight = Math.min(1, group.length / 6);
    }
  }
  return groups;
}

function timeDecay(capturedAt, now) {
  if (!capturedAt) return 0.5;
  const ageDays = Math.max(0, (now - capturedAt) / 86_400_000);
  return 0.5 ** (ageDays / HALF_LIFE_DAYS);
}

function rowWeight(row, confidence, now) {
  return (GRADE_WEIGHT[row.grade] ?? 0.25) * row.accountSampleWeight * timeDecay(row.capturedAt, now) * confidence;
}

function baselineByAccount(groups, now) {
  const entries = [];
  for (const group of groups.values()) {
    const scored = group.filter((row) => Number.isFinite(row.performance));
    if (!scored.length) continue;
    const gradeWeight = Math.max(...scored.map((row) => GRADE_WEIGHT[row.grade] ?? 0.25));
    const latest = Math.max(...scored.map((row) => row.capturedAt));
    entries.push({ value: average(scored.map((row) => row.performance)), weight: gradeWeight * timeDecay(latest, now) });
  }
  return weightedAverage(entries) ?? 50;
}

function aggregateEvents(events, baseline, thresholds) {
  const byLabel = new Map();
  for (const event of events) {
    if (!byLabel.has(event.label)) byLabel.set(event.label, new Map());
    const byAccount = byLabel.get(event.label);
    if (!byAccount.has(event.accountKey)) byAccount.set(event.accountKey, []);
    byAccount.get(event.accountKey).push(event);
  }
  const output = [];
  for (const [label, byAccount] of byLabel.entries()) {
    const accountEntries = [];
    let postCount = 0;
    for (const [key, accountEvents] of byAccount.entries()) {
      const score = weightedAverage(accountEvents.map((event) => ({ value: event.score, weight: event.weight })));
      const weight = Math.min(1, average(accountEvents.map((event) => event.weight)) ?? 0);
      postCount += accountEvents.length;
      if (score !== null && weight > 0) accountEntries.push({ key, value: score, weight });
    }
    const mean = weightedAverage(accountEntries);
    if (mean === null) continue;
    const effectiveWeight = accountEntries.reduce((sum, entry) => sum + entry.weight, 0);
    const accountCount = accountEntries.length;
    const rawLift = mean - baseline;
    const posteriorLift = rawLift * effectiveWeight / (effectiveWeight + PRIOR_STRENGTH);
    const averageEvidence = average(accountEntries.map((entry) => entry.weight)) ?? 0;
    const confidence = Math.min(1, accountCount / thresholds.learnedAccounts) * Math.min(1, effectiveWeight / thresholds.learnedWeight) * averageEvidence;
    let status = "hypothesis";
    if (accountCount >= thresholds.learnedAccounts && effectiveWeight >= thresholds.learnedWeight && confidence >= thresholds.learnedConfidence) {
      status = "learned_prior";
    } else if (accountCount >= thresholds.candidateAccounts && effectiveWeight >= thresholds.candidateWeight) {
      status = "candidate";
    }
    if (status !== "hypothesis" && Math.abs(posteriorLift) < 2) status = "inconclusive";
    if (status !== "hypothesis" && posteriorLift <= -4) status = "negative_signal";
    const transferableAcrossAccounts = accountCount >= thresholds.candidateAccounts
      && ["candidate", "learned_prior", "negative_signal"].includes(status);
    output.push({
      pattern: label,
      status,
      transferableAcrossAccounts,
      usePolicy: transferableAcrossAccounts ? "matched-cross-account-prior" : "do-not-transfer",
      accountCount,
      postCount,
      effectiveWeight: round(effectiveWeight),
      meanPerformance: round(mean, 1),
      baselinePerformance: round(baseline, 1),
      posteriorLift: round(posteriorLift, 1),
      confidence: round(confidence, 3)
    });
  }
  return output.sort((a, b) => b.posteriorLift - a.posteriorLift || b.confidence - a.confidence || a.pattern.localeCompare(b.pattern));
}

function safeAccountModelName(key, account) {
  const platform = String(account?.platform ?? "unknown").toLowerCase().replace(/[^a-z0-9_-]+/g, "-");
  const handle = String(account?.handle ?? "account").toLowerCase().replace(/^@/, "").replace(/[^a-z0-9._-]+/g, "-");
  const digest = crypto.createHash("sha256").update(key).digest("hex").slice(0, 10);
  return `${platform}-${handle || "account"}-${digest}.json`;
}

function withinAccountPatterns(group, component, baseline, now) {
  const byPattern = new Map();
  for (const row of group) {
    const lane = row.post.components?.[component];
    const confidence = Number.isFinite(lane?.confidence) ? lane.confidence : 0.65;
    const patterns = Array.isArray(lane?.patterns) ? [...new Set(lane.patterns)] : [];
    for (const pattern of patterns) {
      if (!byPattern.has(pattern)) byPattern.set(pattern, []);
      byPattern.get(pattern).push({ row, confidence });
    }
  }
  const output = [];
  for (const [pattern, observations] of byPattern.entries()) {
    const scored = observations.filter(({ row }) => Number.isFinite(row.performance));
    const mean = weightedAverage(scored.map(({ row, confidence }) => ({
      value: row.performance,
      weight: Math.max(0.01, rowWeight(row, confidence, now))
    })));
    const evidenceConfidence = average(scored.map(({ row, confidence }) =>
      (GRADE_WEIGHT[row.grade] ?? 0.25) * timeDecay(row.capturedAt, now) * confidence)) ?? 0;
    output.push({
      pattern,
      posts: observations.length,
      prevalence: round(observations.length / group.length, 3),
      meanPerformance: round(mean, 1),
      accountBaselinePerformance: round(baseline, 1),
      observedLift: mean === null || baseline === null ? null : round(mean - baseline, 1),
      confidence: round(Math.min(1, observations.length / 3) * evidenceConfidence, 3),
      transferableAcrossAccounts: false,
      usePolicy: "exact-target-account-only"
    });
  }
  return output.sort((a, b) => b.prevalence - a.prevalence || (b.observedLift ?? -Infinity) - (a.observedLift ?? -Infinity));
}

function buildAccountModels(groups, now) {
  const models = [];
  for (const [key, group] of groups.entries()) {
    const account = group[0]?.account ?? {};
    const scored = group.filter((row) => Number.isFinite(row.performance));
    const baseline = scored.length ? average(scored.map((row) => row.performance)) : null;
    const evidenceGrades = [...new Set(group.map((row) => row.grade))].sort();
    const postCount = group.length;
    const modelStatus = postCount >= 6 ? "stable_within_account" : postCount >= 3 ? "observed_within_account" : "provisional_within_account";
    const components = {};
    for (const component of COMPONENTS) {
      components[component] = withinAccountPatterns(group, component, baseline, now);
    }
    const normalizedUrl = normalizeAccountUrl(account.url);
    const handleKey = account.handle ? `${String(account.platform ?? "unknown").toLowerCase()}:${String(account.handle).toLowerCase().replace(/^@/, "")}` : null;
    const model = {
      schemaVersion: 1,
      generatedAt: new Date(now).toISOString(),
      scope: "target-account-only",
      transferableAcrossAccounts: false,
      usePolicy: "Use only when the requested target matches one of matchKeys. Never use this model as evidence for a different account.",
      account: {
        platform: account.platform ?? null,
        handle: account.handle ?? null,
        url: account.url ?? null,
        normalizedUrl,
        language: account.language ?? null
      },
      matchKeys: [normalizedUrl, handleKey].filter(Boolean),
      evidence: {
        grades: evidenceGrades,
        posts: postCount,
        scoredPosts: scored.length,
        modelStatus,
        note: "One account is sufficient for its own reproduction model. Confidence describes within-account coverage, not cross-account transferability."
      },
      baseline: {
        performance: round(baseline, 1),
        note: "Within-account 0..100 proxy; not raw views or causal lift"
      },
      components
    };
    models.push({ key, file: safeAccountModelName(key, account), model });
  }
  return models;
}

function buildEvents(rows, now) {
  const componentEvents = Object.fromEntries(COMPONENTS.map((component) => [component, []]));
  const interactionEvents = [];
  for (const row of rows) {
    if (!Number.isFinite(row.performance)) continue;
    const lanes = [];
    for (const component of COMPONENTS) {
      const lane = row.post.components?.[component];
      const confidence = Number.isFinite(lane?.confidence) ? lane.confidence : 0.65;
      const patterns = Array.isArray(lane?.patterns) ? [...new Set(lane.patterns)] : [];
      if (!patterns.length) continue;
      lanes.push({ component, patterns, confidence });
      for (const pattern of patterns) {
        componentEvents[component].push({
          label: pattern,
          accountKey: row.accountKey,
          score: row.performance,
          weight: rowWeight(row, confidence, now)
        });
      }
    }
    for (let left = 0; left < lanes.length; left += 1) {
      for (let right = left + 1; right < lanes.length; right += 1) {
        for (const leftPattern of lanes[left].patterns) {
          for (const rightPattern of lanes[right].patterns) {
            interactionEvents.push({
              label: `${lanes[left].component}:${leftPattern} × ${lanes[right].component}:${rightPattern}`,
              accountKey: row.accountKey,
              score: row.performance,
              weight: rowWeight(row, Math.min(lanes[left].confidence, lanes[right].confidence), now)
            });
          }
        }
      }
    }
  }
  return { componentEvents, interactionEvents };
}

function coverage(rows) {
  const result = {};
  for (const component of COMPONENTS) {
    const count = rows.filter((row) => Array.isArray(row.post.components?.[component]?.patterns) && row.post.components[component].patterns.length > 0).length;
    result[component] = { posts: count, rate: rows.length ? round(count / rows.length, 3) : 0 };
  }
  const metricMissing = {};
  for (const metric of ["views", "likes", "comments", "shares", "saves", "follows"]) {
    const present = rows.filter((row) => finite(row.post.outcomes?.[metric]) !== null).length;
    metricMissing[metric] = { present, missingRate: rows.length ? round(1 - present / rows.length, 3) : 1 };
  }
  return { components: result, metrics: metricMissing };
}

function reportMarkdown(intelligence) {
  const lines = [
    "# AI Reel Learning Report",
    "",
    `Updated: ${intelligence.generatedAt}`,
    "",
    `Accounts: ${intelligence.coverage.accounts} / Posts: ${intelligence.coverage.posts} / Runs: ${intelligence.coverage.runs}`,
    "",
    `Corpus baseline: ${intelligence.baseline.performance} (${intelligence.baseline.note})`,
    "",
    "## Two-layer use policy",
    "",
    `Account-specific models: ${intelligence.accountModels.length}. Each may be used immediately for its exact matching target only.`,
    "Cross-account transfer is allowed only where `transferableAcrossAccounts` is `true`; this requires repeated evidence from multiple independent accounts.",
    "",
    "## Six-lane coverage",
    "",
    "| Lane | Posts | Coverage |",
    "|---|---:|---:|"
  ];
  for (const component of COMPONENTS) {
    const item = intelligence.coverage.detail.components[component];
    lines.push(`| ${component} | ${item.posts} | ${(item.rate * 100).toFixed(1)}% |`);
  }
  for (const component of COMPONENTS) {
    lines.push("", `## ${component}`, "");
    const patterns = intelligence.components[component];
    if (!patterns.length) {
      lines.push("No scored patterns yet.");
      continue;
    }
    lines.push("| Pattern | Status | Accounts | Lift | Confidence |", "|---|---|---:|---:|---:|");
    for (const item of patterns.slice(0, 10)) {
      lines.push(`| ${item.pattern} | ${item.status} | ${item.accountCount} | ${item.posteriorLift} | ${item.confidence} |`);
    }
  }
  lines.push(
    "",
    "## Interpretation boundary",
    "",
    "These are evidence-weighted associations, not causal claims. Public metrics cannot reveal retention, shares, saves, profile visits, or follows when those fields are missing. The underlying Codex model was not fine-tuned."
  );
  return `${lines.join("\n")}\n`;
}

const args = parseArgs(process.argv.slice(2));
if (!args.lab) fail("Usage: node rebuild_intelligence.mjs --lab <directory>");
const lab = path.resolve(args.lab);
const accountsRoot = path.join(lab, "accounts");
fs.mkdirSync(accountsRoot, { recursive: true });
const files = listJsonFiles(accountsRoot);
const packs = [];
const errors = [];
for (const file of files) {
  try {
    packs.push(JSON.parse(fs.readFileSync(file, "utf8")));
  } catch (error) {
    errors.push({ file, error: error.message });
  }
}

const rows = buildRows(packs);
const groups = scoreRows(rows);
const now = Date.now();
const accountModels = buildAccountModels(groups, now);
const baseline = baselineByAccount(groups, now);
const events = buildEvents(rows, now);
const componentThresholds = {
  candidateAccounts: 3, candidateWeight: 1.5,
  learnedAccounts: 5, learnedWeight: 3, learnedConfidence: 0.55
};
const interactionThresholds = {
  candidateAccounts: 4, candidateWeight: 2,
  learnedAccounts: 7, learnedWeight: 4, learnedConfidence: 0.6
};
const components = {};
for (const component of COMPONENTS) {
  components[component] = aggregateEvents(events.componentEvents[component], baseline, componentThresholds);
}
const interactions = aggregateEvents(events.interactionEvents, baseline, interactionThresholds).slice(0, 100);
const grades = {};
for (const row of rows) grades[row.grade] = (grades[row.grade] ?? 0) + 1;

const intelligence = {
  schemaVersion: 1,
  generatedAt: new Date(now).toISOString(),
  methodology: {
    accountInfluenceCap: 1,
    halfLifeDays: HALF_LIFE_DAYS,
    priorStrength: PRIOR_STRENGTH,
    note: "Account-specific fingerprints are exact-target-only. Cross-account priors use account-balanced weighting, time decay, and small-sample shrinkage. Associations are not causal effects."
  },
  transferPolicy: {
    exactTargetAccount: "A single account may create and update its own reproduction model.",
    differentAccountOrGlobalRule: "Requires repeated evidence from at least 3 independent accounts and transferableAcrossAccounts=true.",
    singleAccountKnowledge: "May be retained as a hypothesis but must never be transferred to another account."
  },
  coverage: {
    runs: packs.length,
    accounts: groups.size,
    posts: rows.length,
    malformedFiles: errors,
    evidenceGradePosts: grades,
    detail: coverage(rows)
  },
  baseline: {
    performance: round(baseline, 1),
    note: "0..100 corpus proxy; not raw views or retention"
  },
  accountModels: accountModels.map(({ file, model }) => ({
    file: `account-models/${file}`,
    account: model.account,
    matchKeys: model.matchKeys,
    modelStatus: model.evidence.modelStatus,
    posts: model.evidence.posts,
    scope: model.scope
  })),
  components,
  interactions
};

const promotionQueue = {
  schemaVersion: 1,
  generatedAt: intelligence.generatedAt,
  notice: "Only cross-account transferable items appear here. Review before changing plugin rules. Do not auto-publish or claim causality.",
  items: COMPONENTS.flatMap((component) => components[component]
    .filter((item) => item.transferableAcrossAccounts)
    .map((item) => ({ component, ...item, proposedAction: "Use as a prior and seek counterexamples before promoting to a fixed rule." })))
};

const manifest = {
  schemaVersion: 1,
  generatedAt: intelligence.generatedAt,
  runFiles: files.map((file) => path.relative(lab, file).replaceAll("\\", "/")),
  runHashes: packs.map((pack) => pack._ingest?.sourceHash).filter(Boolean),
  corpus: { accounts: groups.size, posts: rows.length, runs: packs.length },
  accountModels: accountModels.map(({ file }) => `account-models/${file}`),
  outputs: ["account-models/*.json", "intelligence.json", "promotion-queue.json", "manifest.json", "learning-report.md"]
};

const accountModelsRoot = path.join(lab, "account-models");
fs.mkdirSync(accountModelsRoot, { recursive: true });
for (const { file, model } of accountModels) {
  fs.writeFileSync(path.join(accountModelsRoot, file), `${JSON.stringify(model, null, 2)}\n`, "utf8");
}
fs.writeFileSync(path.join(lab, "intelligence.json"), `${JSON.stringify(intelligence, null, 2)}\n`, "utf8");
fs.writeFileSync(path.join(lab, "promotion-queue.json"), `${JSON.stringify(promotionQueue, null, 2)}\n`, "utf8");
fs.writeFileSync(path.join(lab, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
fs.writeFileSync(path.join(lab, "learning-report.md"), reportMarkdown(intelligence), "utf8");

process.stdout.write(`${JSON.stringify({
  status: "rebuilt",
  lab,
  runs: packs.length,
  accounts: groups.size,
  posts: rows.length,
  accountModels: accountModels.map(({ file }) => `account-models/${file}`),
  malformedFiles: errors.length,
  outputs: ["account-models/*.json", "intelligence.json", "promotion-queue.json", "manifest.json", "learning-report.md"]
}, null, 2)}\n`);
