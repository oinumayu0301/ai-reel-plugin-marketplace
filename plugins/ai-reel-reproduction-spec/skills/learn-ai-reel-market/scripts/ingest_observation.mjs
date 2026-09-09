#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const COMPONENTS = ["hook", "script", "visual", "audio", "caption", "cta"];
const METRICS = ["views", "likes", "comments", "shares", "saves", "follows", "fixedWindowHours"];
const DISALLOWED_KEYS = new Set([
  "rawvideo", "videobase64", "downloadedmedia", "rawframes", "framedump", "fulltranscript",
  "voiceembedding", "voiceprint", "cookie", "cookies", "password", "accesstoken", "sessiontoken",
  "apikey", "credential", "credentials"
]);

function fail(message) {
  console.error(message);
  process.exit(1);
}

function parseArgs(argv) {
  const result = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) fail(`Unexpected argument: ${token}`);
    const key = token.slice(2);
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) fail(`Missing value for --${key}`);
    result[key] = value;
    index += 1;
  }
  return result;
}

function walkKeys(value, location = "root") {
  if (Array.isArray(value)) {
    value.forEach((item, index) => walkKeys(item, `${location}[${index}]`));
    return;
  }
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value)) {
    const normalized = key.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (DISALLOWED_KEYS.has(normalized)) fail(`Disallowed sensitive/raw field '${key}' at ${location}.`);
    walkKeys(child, `${location}.${key}`);
  }
}

function requiredString(value, label) {
  if (typeof value !== "string" || value.trim() === "") fail(`${label} must be a non-empty string.`);
  return value.trim();
}

function validDate(value, label) {
  const text = requiredString(value, label);
  if (!Number.isFinite(Date.parse(text))) fail(`${label} must be a valid ISO date.`);
  return text;
}

function nullableNonNegative(value, label) {
  if (value === null || value === undefined) return null;
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    fail(`${label} must be a non-negative number or null.`);
  }
  return value;
}

function normalizeUrl(value) {
  const text = requiredString(value, "account.url");
  try {
    const url = new URL(text);
    url.search = "";
    url.hash = "";
    return url.toString().replace(/\/$/, "");
  } catch {
    fail("account.url must be an absolute URL.");
  }
}

function slug(value) {
  const normalized = String(value ?? "")
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
  return normalized || "account";
}

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
}

function validatePack(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) fail("Input must be a JSON object.");
  walkKeys(input);
  if (input.schemaVersion !== 1) fail("schemaVersion must be 1.");
  if (!input.account || typeof input.account !== "object") fail("account is required.");
  const grade = requiredString(input.account.evidenceGrade, "account.evidenceGrade").toUpperCase();
  if (!new Set(["A", "B", "C", "D"]).has(grade)) fail("account.evidenceGrade must be A, B, C, or D.");

  const account = {
    ...input.account,
    platform: requiredString(input.account.platform, "account.platform").toLowerCase(),
    handle: typeof input.account.handle === "string" ? input.account.handle.trim() : "",
    url: normalizeUrl(input.account.url),
    capturedAt: validDate(input.account.capturedAt, "account.capturedAt"),
    evidenceGrade: grade
  };

  if (!Array.isArray(input.posts) || input.posts.length === 0) fail("posts must be a non-empty array.");
  const posts = input.posts.map((post, index) => {
    if (!post || typeof post !== "object" || Array.isArray(post)) fail(`posts[${index}] must be an object.`);
    const id = typeof post.id === "string" && post.id.trim() ? post.id.trim() : null;
    const postUrl = typeof post.url === "string" && post.url.trim() ? post.url.trim() : null;
    if (!id && !postUrl) fail(`posts[${index}] needs id or url.`);
    const outcomes = {};
    for (const metric of METRICS) outcomes[metric] = nullableNonNegative(post.outcomes?.[metric], `posts[${index}].outcomes.${metric}`);
    const components = {};
    for (const component of COMPONENTS) {
      const lane = post.components?.[component];
      if (lane === undefined || lane === null) continue;
      if (!lane || typeof lane !== "object" || !Array.isArray(lane.patterns)) {
        fail(`posts[${index}].components.${component}.patterns must be an array.`);
      }
      const patterns = [...new Set(lane.patterns.map((pattern) => requiredString(pattern, `${component} pattern`)))];
      for (const pattern of patterns) {
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(pattern)) {
          fail(`Pattern '${pattern}' must use lower-case kebab-case.`);
        }
      }
      const confidence = lane.confidence === undefined ? null : lane.confidence;
      if (confidence !== null && (typeof confidence !== "number" || confidence < 0 || confidence > 1)) {
        fail(`posts[${index}].components.${component}.confidence must be 0..1 or null.`);
      }
      components[component] = { ...lane, patterns, confidence };
    }
    if (Object.keys(components).length === 0) fail(`posts[${index}] needs at least one creative component.`);
    const normalizedPerformance = post.normalizedPerformance ?? null;
    if (normalizedPerformance !== null &&
        (typeof normalizedPerformance !== "number" || normalizedPerformance < 0 || normalizedPerformance > 100)) {
      fail(`posts[${index}].normalizedPerformance must be 0..100 or null.`);
    }
    return {
      ...post,
      id,
      url: postUrl,
      capturedAt: post.capturedAt ? validDate(post.capturedAt, `posts[${index}].capturedAt`) : account.capturedAt,
      postedAt: post.postedAt ? validDate(post.postedAt, `posts[${index}].postedAt`) : null,
      outcomes,
      components,
      normalizedPerformance
    };
  });
  return { ...input, account, posts };
}

const args = parseArgs(process.argv.slice(2));
if (!args.lab || !args.input) fail("Usage: node ingest_observation.mjs --lab <directory> --input <pack.json>");
const lab = path.resolve(args.lab);
const inputPath = path.resolve(args.input);

let raw;
try {
  raw = JSON.parse(fs.readFileSync(inputPath, "utf8"));
} catch (error) {
  fail(`Could not read input JSON: ${error.message}`);
}

const pack = validatePack(raw);
const canonical = JSON.stringify(stable(pack));
const sourceHash = crypto.createHash("sha256").update(canonical).digest("hex");
const accountKey = slug(`${pack.account.platform}-${pack.account.handle || new URL(pack.account.url).hostname}`);
const captured = new Date(pack.account.capturedAt).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
const requestedRunId = pack.runId ? slug(pack.runId) : "";
const runId = requestedRunId || `${captured}-${sourceHash.slice(0, 10)}`;
const accountDir = path.join(lab, "accounts", accountKey);
const destination = path.join(accountDir, `${runId}.json`);

fs.mkdirSync(accountDir, { recursive: true });
let duplicate = false;
for (const file of fs.readdirSync(accountDir).filter((name) => name.endsWith(".json"))) {
  try {
    const existing = JSON.parse(fs.readFileSync(path.join(accountDir, file), "utf8"));
    if (existing._ingest?.sourceHash === sourceHash) duplicate = true;
  } catch {
    // The rebuild script will report malformed corpus files.
  }
}

if (!duplicate) {
  const stored = {
    ...pack,
    _ingest: {
      sourceHash,
      ingestedAt: new Date().toISOString(),
      sourceFile: path.basename(inputPath)
    }
  };
  fs.writeFileSync(destination, `${JSON.stringify(stored, null, 2)}\n`, "utf8");
}

const rebuildScript = path.join(path.dirname(fileURLToPath(import.meta.url)), "rebuild_intelligence.mjs");
const rebuilt = spawnSync(process.execPath, [rebuildScript, "--lab", lab], { encoding: "utf8" });
if (rebuilt.stdout) process.stdout.write(rebuilt.stdout);
if (rebuilt.stderr) process.stderr.write(rebuilt.stderr);
if (rebuilt.status !== 0) process.exit(rebuilt.status ?? 1);

process.stdout.write(`${JSON.stringify({
  status: duplicate ? "duplicate_skipped" : "ingested",
  lab,
  accountKey,
  runFile: duplicate ? null : destination,
  sourceHash
}, null, 2)}\n`);
