#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

function usage() {
  console.error("Usage: node score_posts.mjs <input.json> [output.json]");
  process.exit(2);
}

const [, , inputPath, outputPath] = process.argv;
if (!inputPath) usage();

function finiteNonNegative(value) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : null;
}

function isoMillis(value) {
  if (typeof value !== "string" || value.trim() === "") return null;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function round(value, digits = 6) {
  if (value === null || !Number.isFinite(value)) return null;
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function percentile(value, values) {
  if (value === null || values.length === 0) return null;
  const below = values.filter((candidate) => candidate < value).length;
  const equal = values.filter((candidate) => candidate === value).length;
  return round(100 * (below + 0.5 * equal) / values.length, 1);
}

let source;
try {
  source = JSON.parse(fs.readFileSync(inputPath, "utf8"));
} catch (error) {
  console.error(`Could not read JSON: ${error.message}`);
  process.exit(1);
}

if (!Array.isArray(source)) {
  console.error("Input must be a JSON array of post objects.");
  process.exit(1);
}

const rows = source.map((raw, index) => {
  const post = raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {};
  const views = finiteNonNegative(post.views);
  const likes = finiteNonNegative(post.likes);
  const comments = finiteNonNegative(post.comments);
  const posted = isoMillis(post.postDate);
  const captured = isoMillis(post.capturedAt);
  const ageDays = posted !== null && captured !== null && captured >= posted
    ? (captured - posted) / 86_400_000
    : null;

  return {
    ...post,
    id: post.id ?? `row-${index + 1}`,
    account: post.account ?? "unknown",
    derived: {
      ageDays: round(ageDays, 3),
      viewsPerDay: views !== null && ageDays !== null && ageDays > 0 ? round(views / ageDays, 3) : null,
      likeRate: views !== null && views > 0 && likes !== null ? round(likes / views) : null,
      commentRate: views !== null && views > 0 && comments !== null ? round(comments / views) : null,
      percentileWithinAccount: {}
    }
  };
});

const groups = new Map();
for (const row of rows) {
  if (!groups.has(row.account)) groups.set(row.account, []);
  groups.get(row.account).push(row);
}

const percentileFields = ["views", "likes", "comments"];
const derivedFields = ["viewsPerDay", "likeRate", "commentRate"];

for (const group of groups.values()) {
  for (const field of percentileFields) {
    const values = group.map((row) => finiteNonNegative(row[field])).filter((value) => value !== null);
    for (const row of group) {
      row.derived.percentileWithinAccount[field] = percentile(finiteNonNegative(row[field]), values);
    }
  }
  for (const field of derivedFields) {
    const values = group.map((row) => row.derived[field]).filter((value) => value !== null);
    for (const row of group) {
      row.derived.percentileWithinAccount[field] = percentile(row.derived[field], values);
    }
  }
}

const output = {
  generatedAt: new Date().toISOString(),
  notice: "Public proxies only. Missing values remain null. viewsPerDay is not a retention or algorithmic growth metric.",
  rows
};

const serialized = `${JSON.stringify(output, null, 2)}\n`;
if (outputPath) {
  fs.mkdirSync(path.dirname(path.resolve(outputPath)), { recursive: true });
  fs.writeFileSync(outputPath, serialized, "utf8");
} else {
  process.stdout.write(serialized);
}

