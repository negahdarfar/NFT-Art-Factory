import test from "node:test";
import assert from "node:assert/strict";
import { scoreIdea } from "../scripts/demand-research.mjs";

const now = Date.parse("2026-11-19T12:00:00Z");
const evidence = [{ sourceUrl: "https://market.example/sale/1", observedAt: "2026-11-18T12:00:00Z" }];

test("scores recent sourced demand signals and returns a review-only recommendation", () => {
  const result = scoreIdea({
    id: "a", topic: "Original fine art",
    signals: { completedSales30d: 20, uniqueBuyers30d: 10, watchlistAdds30d: 100, communityGrowthPct30d: 50, commissionInquiries30d: 10, competingListings: 0 },
    evidence
  }, now);
  assert.equal(result.score, 100);
  assert.equal(result.recommendation, "prepare_human_review");
  assert.equal(result.confidence, "operator_supplied_signals");
});

test("does not score unsupported or stale evidence", () => {
  const result = scoreIdea({
    id: "b", topic: "Unsupported",
    signals: { completedSales30d: 20, uniqueBuyers30d: 10 },
    evidence: [{ sourceUrl: "https://market.example/old", observedAt: "2026-08-01T00:00:00Z" }]
  }, now);
  assert.equal(result.score, 0);
  assert.equal(result.recommendation, "hold_for_evidence");
});

test("handles missing metrics without inventing demand", () => {
  const result = scoreIdea({ id: "c", topic: "Sparse", signals: {}, evidence }, now);
  assert.equal(result.demandScore, 0);
  assert.equal(result.confidence, "insufficient_metrics");
});
