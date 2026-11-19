import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { auditCollection, inspectImage } from "../scripts/artwork-quality.mjs";

const onePixelPng = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/pWQAAAAASUVORK5CYII=", "base64");

test("image inspector validates PNG signature and dimensions", () => {
  assert.deepEqual(inspectImage(onePixelPng), { format: "png", width: 1, height: 1 });
  assert.equal(inspectImage(Buffer.from("not-an-image")), null);
});

test("quality audit detects exact duplicates and requires human approval/provenance", () => {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "nft-quality-"));
  try {
    fs.mkdirSync(path.join(rootDir, "assets"), { recursive: true });
    fs.writeFileSync(path.join(rootDir, "assets", "one.png"), onePixelPng);
    fs.writeFileSync(path.join(rootDir, "assets", "two.png"), onePixelPng);
    const collection = { items: [
      { name: "One", image: "one.png", description: "A sufficiently detailed original artwork description.", attributes: [{trait_type:"Style",value:"Digital"},{trait_type:"Edition",value:"One"}] },
      { name: "Two", image: "two.png", description: "Another sufficiently detailed original artwork description.", attributes: [{trait_type:"Style",value:"Digital"},{trait_type:"Edition",value:"One"}] }
    ] };
    const report = auditCollection({ rootDir, collection, reviews: {}, minDimension: 1 });
    assert.equal(report.status, "failed");
    assert.ok(report.findings.some(x => x.code === "exact_duplicate"));
    assert.ok(report.findings.some(x => x.code === "rights_or_owner_approval_pending"));
    assert.ok(report.findings.some(x => x.code === "provenance_incomplete"));
  } finally {
    fs.rmSync(rootDir, { recursive: true, force: true });
  }
});

test("quality audit rejects paths that escape the assets directory", () => {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "nft-quality-path-"));
  try {
    const report = auditCollection({ rootDir, collection: { items: [{ name: "Unsafe", image: "../secret.png" }] } });
    assert.ok(report.findings.some(x => x.code === "image_missing_or_unsafe_path"));
  } finally {
    fs.rmSync(rootDir, { recursive: true, force: true });
  }
});
