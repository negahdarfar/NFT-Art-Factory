import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
test("marketplace pack generates draft-only JSON, CSV and checklist", () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "nft-marketplace-"));
  try {
    fs.copyFileSync(path.join(root, "collection.example.json"), path.join(temp, "collection.json"));
    fs.writeFileSync(path.join(temp, "marketplaces.json"), JSON.stringify({ platforms:["opensea","rarible","objkt"], chain:"base", currency:"ETH", price:null }));
    fs.mkdirSync(path.join(temp, "scripts"));
    fs.copyFileSync(path.join(root, "scripts", "marketplace-pack.mjs"), path.join(temp, "scripts", "marketplace-pack.mjs"));
    const run = spawnSync(process.execPath, [path.join(temp, "scripts", "marketplace-pack.mjs")], { encoding:"utf8" });
    assert.equal(run.status, 0, run.stderr);
    const out = path.join(temp, "dist", "marketplace-drafts");
    const data = JSON.parse(fs.readFileSync(path.join(out, "listing-drafts.json"), "utf8"));
    assert.equal(data.publicationMode, "draft_only");
    assert.equal(data.items.length, 1);
    assert.equal(data.items[0].listing.suggestedPrice, null);
    assert.deepEqual(data.items[0].marketplaces.map(x => x.id), ["opensea","rarible","objkt"]);
    assert.equal(data.items[0].objkt.network, "tezos");
    assert.equal(data.items[0].objkt.tokenStandard, "FA2");
    assert.equal(data.items[0].objkt.metadataStandard.join(","), "TZIP-16,TZIP-21");
    assert.equal(data.items[0].objkt.metadata.artifactUri, "ipfs://REPLACE_WITH_PINATA_IMAGE_CID");
    const objktDraft = JSON.parse(fs.readFileSync(path.join(out, "objkt-token-metadata-drafts.json"), "utf8"));
    assert.equal(objktDraft.standard, "TZIP-21");
    assert.equal(objktDraft.publicationMode, "draft_only");
    assert.match(fs.readFileSync(path.join(out, "listing-drafts.csv"), "utf8"), /Artwork 001/);
    assert.match(fs.readFileSync(path.join(out, "marketplace-checklist.md"), "utf8"), /wallet/);
  } finally { fs.rmSync(temp, { recursive:true, force:true }); }
});
test("marketplace pack rejects unsupported marketplace names", () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "nft-marketplace-invalid-"));
  try {
    fs.copyFileSync(path.join(root, "collection.example.json"), path.join(temp, "collection.json"));
    fs.writeFileSync(path.join(temp, "marketplaces.json"), JSON.stringify({ platforms:["unknown-market"] }));
    fs.mkdirSync(path.join(temp, "scripts"));
    fs.copyFileSync(path.join(root, "scripts", "marketplace-pack.mjs"), path.join(temp, "scripts", "marketplace-pack.mjs"));
    const run = spawnSync(process.execPath, [path.join(temp, "scripts", "marketplace-pack.mjs")], { encoding:"utf8" });
    assert.notEqual(run.status, 0);
    assert.match(run.stderr, /Unsupported platform/);
  } finally { fs.rmSync(temp, { recursive:true, force:true }); }
});
