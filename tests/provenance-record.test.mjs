import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const record = JSON.parse(fs.readFileSync(path.join(root, "workflows/provenance-records.example.json"), "utf8"));

test("provenance example has unique work identifiers and required evidence sections", () => {
  assert.equal(record.schema_version, 1);
  assert.equal(record.policy.records_are_evidence_not_legal_opinions, true);
  assert.equal(record.policy.creator_attestation_does_not_equal_legal_clearance, true);
  assert.ok(Array.isArray(record.works) && record.works.length > 0);
  const ids = new Set();
  for (const work of record.works) {
    assert.ok(work.work_id && !ids.has(work.work_id));
    ids.add(work.work_id);
    assert.ok(work.creation && work.creator_attestation && work.asset && work.rights_review && work.release);
    assert.equal(typeof work.creator_attestation.independently_verified, "boolean");
    assert.equal(typeof work.release.mint_authorized, "boolean");
    assert.equal(typeof work.release.listing_authorized, "boolean");
  }
});

test("The Last Listener attestation cannot silently pass rights or release gates", () => {
  const work = record.works.find(item => item.work_id === "the-last-listener-001");
  assert.ok(work);
  assert.equal(work.creator_attestation.status, "attested");
  assert.equal(work.creator_attestation.independently_verified, false);
  assert.equal(work.rights_review.status, "pending");
  assert.equal(work.asset.status, "generated_locally_not_committed");
  assert.equal(work.asset.sha256, null);
  assert.equal(work.release.owner_approved, false);
  assert.equal(work.release.mint_authorized, false);
  assert.equal(work.release.listing_authorized, false);
  assert.equal(work.release.public_promotion_authorized, false);
});
