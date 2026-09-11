#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

function usage() {
  console.error("Usage: node score_concepts.mjs <input.json> [output.json]");
  process.exit(2);
}

const [, , inputPath, outputPath] = process.argv;
if (!inputPath) usage();

const dimensions = [
  "reach", "first_3s_hold", "completion", "replay", "share", "save", "comment",
  "follow", "trust", "market_fit", "series_potential", "repeatability", "feasibility", "rights_safety",
  "audio_strategy_fit", "sound_off_clarity"
];

const weights = {
  reach: {
    reach: 0.13, first_3s_hold: 0.15, completion: 0.12, replay: 0.09, share: 0.08,
    save: 0.03, comment: 0.04, follow: 0.03, trust: 0.02, market_fit: 0.10,
    series_potential: 0.04, repeatability: 0.03, feasibility: 0.04, rights_safety: 0.04,
    audio_strategy_fit: 0.03, sound_off_clarity: 0.03
  },
  comment: {
    reach: 0.05, first_3s_hold: 0.09, completion: 0.09, replay: 0.05, share: 0.07,
    save: 0.03, comment: 0.20, follow: 0.04, trust: 0.06, market_fit: 0.10,
    series_potential: 0.06, repeatability: 0.03, feasibility: 0.04, rights_safety: 0.05,
    audio_strategy_fit: 0.02, sound_off_clarity: 0.02
  },
  save: {
    reach: 0.05, first_3s_hold: 0.08, completion: 0.09, replay: 0.07, share: 0.06,
    save: 0.20, comment: 0.02, follow: 0.05, trust: 0.10, market_fit: 0.09,
    series_potential: 0.05, repeatability: 0.03, feasibility: 0.03, rights_safety: 0.04,
    audio_strategy_fit: 0.02, sound_off_clarity: 0.02
  },
  follow: {
    reach: 0.05, first_3s_hold: 0.09, completion: 0.09, replay: 0.05, share: 0.05,
    save: 0.05, comment: 0.04, follow: 0.16, trust: 0.08, market_fit: 0.10,
    series_potential: 0.11, repeatability: 0.04, feasibility: 0.02, rights_safety: 0.03,
    audio_strategy_fit: 0.02, sound_off_clarity: 0.02
  },
  trust: {
    reach: 0.03, first_3s_hold: 0.06, completion: 0.09, replay: 0.03, share: 0.04,
    save: 0.08, comment: 0.03, follow: 0.07, trust: 0.20, market_fit: 0.09,
    series_potential: 0.07, repeatability: 0.04, feasibility: 0.05, rights_safety: 0.08,
    audio_strategy_fit: 0.02, sound_off_clarity: 0.02
  }
};

function boundedScore(value) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 5 ? value : null;
}

function weightedScore(scores, objective) {
  const profile = weights[objective];
  let total = 0;
  for (const dimension of dimensions) total += scores[dimension] * profile[dimension];
  return Math.round(total * 20 * 10) / 10;
}

let source;
try {
  source = JSON.parse(fs.readFileSync(inputPath, "utf8"));
} catch (error) {
  console.error(`Could not read JSON: ${error.message}`);
  process.exit(1);
}

if (!Array.isArray(source)) {
  console.error("Input must be a JSON array of concept objects.");
  process.exit(1);
}

const errors = [];
const concepts = source.map((raw, index) => {
  const concept = raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {};
  const objective = concept.primaryObjective;
  if (!Object.hasOwn(weights, objective)) errors.push(`row ${index + 1}: unsupported primaryObjective '${objective}'`);
  const scores = {};
  for (const dimension of dimensions) {
    scores[dimension] = boundedScore(concept.scores?.[dimension]);
    if (scores[dimension] === null) errors.push(`row ${index + 1}: '${dimension}' must be a number from 0 to 5`);
  }
  const eligible = scores.rights_safety >= 4 && scores.feasibility >= 2 && scores.market_fit >= 3
    && scores.audio_strategy_fit >= 3 && scores.sound_off_clarity >= 3;
  return {
    ...concept,
    id: concept.id ?? `concept-${index + 1}`,
    scores,
    objectiveScore: Object.hasOwn(weights, objective) && !dimensions.some((dimension) => scores[dimension] === null)
      ? weightedScore(scores, objective)
      : null,
    eligible,
    gateReasons: [
      ...(scores.rights_safety < 4 ? ["rights_safety_below_4"] : []),
      ...(scores.feasibility < 2 ? ["feasibility_below_2"] : []),
      ...(scores.market_fit < 3 ? ["market_fit_below_3"] : []),
      ...(scores.audio_strategy_fit < 3 ? ["audio_strategy_fit_below_3"] : []),
      ...(scores.sound_off_clarity < 3 ? ["sound_off_clarity_below_3"] : [])
    ]
  };
});

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

concepts.sort((a, b) => Number(b.eligible) - Number(a.eligible) || b.objectiveScore - a.objectiveScore);
const output = {
  generatedAt: new Date().toISOString(),
  notice: "Objective-weighted score supports comparison but does not replace the dimension vector, evidence, or failure-mode analysis.",
  concepts
};

const serialized = `${JSON.stringify(output, null, 2)}\n`;
if (outputPath) {
  fs.mkdirSync(path.dirname(path.resolve(outputPath)), { recursive: true });
  fs.writeFileSync(outputPath, serialized, "utf8");
} else {
  process.stdout.write(serialized);
}
