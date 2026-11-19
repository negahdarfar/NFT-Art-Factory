import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("collector dossier generator produces draft-only bilingual dossier with release warnings", () => {
  const run = spawnSync(process.execPath, ["scripts/collector-dossier.mjs"], { cwd: root, encoding: "utf8" });
  assert.equal(run.status, 0, run.stderr || run.stdout);
  const file = path.join(root, "dist", "collector-dossiers", "the-last-listener-001.md");
  assert.ok(fs.existsSync(file));
  const content = fs.readFileSync(file, "utf8");
  assert.match(content, /Creator statement/);
  assert.match(content, /independently verified: false/i);
  assert.match(content, /Rights review: pending/i);
  assert.match(content, /Mint authorized: false/i);
  assert.match(content, /Not a live offer/);
  assert.match(content, /رادیویی موج‌کوتاه/);
});
