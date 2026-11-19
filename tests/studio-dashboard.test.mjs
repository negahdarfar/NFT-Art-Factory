import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { buildStudioStatus } from "../scripts/studio-dashboard.mjs";

test("dashboard keeps a selected work blocked while asset, rights and approvals are pending", () => {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "nft-dashboard-"));
  try {
    fs.mkdirSync(path.join(rootDir, "drafts"), { recursive: true });
    fs.writeFileSync(path.join(rootDir, "drafts", "work.json"), JSON.stringify({ image: "assets/work.png", approval: {} }));
    const report = buildStudioStatus({
      rootDir,
      catalog: { collections: [{ name: "Series", works: [{ id: "work-1", title: "Work", draft_path: "drafts/work.json", final_asset_path: "assets/work.png" }] }] },
      reviews: {}
    });
    assert.equal(report.status, "operational_review_required");
    assert.equal(report.totals.blocked, 1);
    assert.deepEqual(report.works[0].blockers, ["final_asset_missing", "rights_not_confirmed", "owner_approval_missing", "action_specific_release_authorization_missing"]);
  } finally { fs.rmSync(rootDir, { recursive: true, force: true }); }
});

test("dashboard requires both review record and draft flags plus action-specific authorization", () => {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "nft-dashboard-approved-"));
  try {
    fs.mkdirSync(path.join(rootDir, "assets"), { recursive: true });
    fs.mkdirSync(path.join(rootDir, "drafts"), { recursive: true });
    fs.writeFileSync(path.join(rootDir, "assets", "work.png"), "image");
    fs.writeFileSync(path.join(rootDir, "drafts", "work.json"), JSON.stringify({ image: "assets/work.png", approval: { rights_confirmed: true, owner_approved: true, minting_authorized: true } }));
    const catalog = { collections: [{ name: "Series", works: [{ id: "work-1", title: "Work", draft_path: "drafts/work.json", final_asset_path: "assets/work.png", release_authorization: true }] }] };
    const reviews = { Work: { rights_confirmed: true, owner_approved: true, status: "approved" } };
    const report = buildStudioStatus({ rootDir, catalog, reviews });
    assert.equal(report.status, "release_gates_passed");
    assert.equal(report.totals.release_gates_passed, 1);
  } finally { fs.rmSync(rootDir, { recursive: true, force: true }); }
});

test("dashboard rejects duplicate identifiers and paths outside assets", () => {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "nft-dashboard-unsafe-"));
  try {
    const report = buildStudioStatus({ rootDir, catalog: { collections: [{ works: [
      { id: "same", title: "A", final_asset_path: "../secret.png" },
      { id: "same", title: "B", final_asset_path: "../secret.png" }
    ] }] } });
    assert.ok(report.errors.some(error => error.code === "missing_or_duplicate_work_id"));
    assert.equal(report.totals.missing_assets, 2);
  } finally { fs.rmSync(rootDir, { recursive: true, force: true }); }
});
