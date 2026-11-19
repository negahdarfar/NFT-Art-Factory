import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const inputPath = path.join(root, "demand-signals.json");
const outputDir = path.join(root, "dist", "demand-research");
const DAY = 86400000;

const clamp = (n, min = 0, max = 100) => Math.min(max, Math.max(min, n));
const scoreScale = (value, ceiling) => clamp((Number(value) / ceiling) * 100);
const validEvidence = (evidence, now) => Array.isArray(evidence) && evidence.some(item =>
  item && typeof item.sourceUrl === "string" && /^https:\/\//i.test(item.sourceUrl) &&
  typeof item.observedAt === "string" && Number.isFinite(Date.parse(item.observedAt)) &&
  Date.parse(item.observedAt) <= now && now - Date.parse(item.observedAt) <= 45 * DAY
);

export function scoreIdea(idea, now = Date.now()) {
  const s = idea?.signals || {};
  const evidenceOk = validEvidence(idea?.evidence, now);
  const metrics = [
    ["completedSales30d", 20, 35],
    ["uniqueBuyers30d", 10, 20],
    ["watchlistAdds30d", 100, 15],
    ["communityGrowthPct30d", 50, 10],
    ["commissionInquiries30d", 10, 15]
  ];
  let demand = 0;
  for (const [key, ceiling, weight] of metrics) {
    const value = Number(s[key]);
    if (Number.isFinite(value) && value >= 0) demand += scoreScale(value, ceiling) * weight / 100;
  }
  const listings = Number(s.competingListings);
  const competition = Number.isFinite(listings) && listings >= 0
    ? 100 - scoreScale(listings, 500) : null;
  const total = evidenceOk ? clamp(demand + (competition === null ? 0 : competition * 0.05)) : 0;
  const hasMetrics = metrics.some(([key]) => Number.isFinite(Number(s[key])) && s[key] !== null);
  return {
    id: String(idea?.id || ""),
    topic: String(idea?.topic || ""),
    audience: String(idea?.audience || ""),
    score: Math.round(total * 10) / 10,
    demandScore: Math.round(demand * 10) / 10,
    competitionScore: competition === null ? null : Math.round(competition * 10) / 10,
    confidence: !evidenceOk ? "no_recent_evidence" : hasMetrics ? "operator_supplied_signals" : "insufficient_metrics",
    recommendation: !evidenceOk ? "hold_for_evidence" : total >= 65 ? "prepare_human_review" : total >= 40 ? "test_small_draft" : "do_not_prioritize",
    evidence: evidenceOk ? idea.evidence : [],
    signals: s,
    caveats: [
      "Scores are directional prioritization signals, not a forecast of sales.",
      "Only operator-entered metrics with at least one recent HTTPS evidence link are scored.",
      "Marketplace listings are not completed sales; enter completed sales separately.",
      "Do not infer unique buyers from transaction count or combine duplicated marketplace data."
    ]
  };
}

function main() {
  if (!fs.existsSync(inputPath)) {
    console.error("Missing demand-signals.json. Copy demand-signals.example.json and enter sourced observations.");
    process.exitCode = 1;
    return;
  }
  const input = JSON.parse(fs.readFileSync(inputPath, "utf8"));
  if (!Array.isArray(input.ideas)) throw new Error("demand-signals.json must contain an ideas array.");
  const results = input.ideas.map(idea => scoreIdea(idea));
  results.sort((a, b) => b.score - a.score || a.topic.localeCompare(b.topic));
  fs.rmSync(outputDir, { recursive: true, force: true });
  fs.mkdirSync(outputDir, { recursive: true });
  const report = {
    generatedAt: new Date().toISOString(),
    method: "transparent weighted score from operator-entered, sourced observations",
    weights: {
      completedSales30d: 35, uniqueBuyers30d: 20, watchlistAdds30d: 15,
      communityGrowthPct30d: 10, commissionInquiries30d: 15, competition: 5
    },
    ideasReviewed: results.length,
    results,
    safety: [
      "No live marketplace scraping or paid API calls are performed.",
      "No minting, listing, posting, wallet connection or payment is performed.",
      "A high score is a research priority only; owner review is required."
    ]
  };
  fs.writeFileSync(path.join(outputDir, "demand-ranking.json"), JSON.stringify(report, null, 2) + "\n");
  const rows = [["rank","id","topic","score","confidence","recommendation"], ...results.map((r,i) => [i+1,r.id,r.topic,r.score,r.confidence,r.recommendation])];
  fs.writeFileSync(path.join(outputDir, "demand-ranking.csv"), rows.map(row => row.map(v => '"' + String(v).replaceAll('"','""') + '"').join(",")).join("\n") + "\n");
  console.log("Demand research complete: " + results.length + " ideas ranked. Review evidence before acting.");
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
