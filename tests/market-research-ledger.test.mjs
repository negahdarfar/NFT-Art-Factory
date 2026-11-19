import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const sourceRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const temp=fs.mkdtempSync(path.join(os.tmpdir(),"nft-market-ledger-"));
fs.mkdirSync(path.join(temp,"scripts"),{recursive:true});
const copy=(a,b)=>fs.copyFileSync(path.join(sourceRoot,a),path.join(temp,b));
copy("scripts/market-research.mjs","scripts/market-research.mjs");
copy("scripts/sales-ledger.mjs","scripts/sales-ledger.mjs");
const run=script=>spawnSync(process.execPath,[path.join(temp,"scripts",script)],{cwd:temp,encoding:"utf8"});
test("market research uses only completed, sourced comps and does not auto-set listing prices",()=>{
 copy("collection.example.json","collection.json");copy("market-comps.example.json","market-comps.json");
 const r=run("market-research.mjs");assert.equal(r.status,0,r.stderr);
 const report=JSON.parse(fs.readFileSync(path.join(temp,"dist/market-research/price-research.json")));
 assert.equal(report.results[0].comparableCount,1);assert.equal(report.results[0].indicativeMedian,0.08);
 assert.equal(report.results[0].confidence,"very_low_sample");
});
test("sales ledger exports format-valid sales and computes net",()=>{
 copy("sales-ledger.example.json","sales-ledger.json");
 const r=run("sales-ledger.mjs");assert.equal(r.status,0,r.stderr);
 const report=JSON.parse(fs.readFileSync(path.join(temp,"dist/sales-ledger/sales-report.json")));
 assert.equal(report.totals.salesCount,1);assert.ok(Math.abs(report.totals.byCurrency.ETH.net-0.076)<1e-10);
 assert.equal(report.verification,"format_validated_only_chain_confirmation_not_checked");
});
test("sales ledger rejects malformed transaction hashes",()=>{
 copy("sales-ledger.example.json","sales-ledger.json");
 const p=path.join(temp,"sales-ledger.json"),data=JSON.parse(fs.readFileSync(p));
 data.sales[0].transactionHash="fake";fs.writeFileSync(p,JSON.stringify(data));
 const r=run("sales-ledger.mjs");assert.equal(r.status,2);
 const report=JSON.parse(fs.readFileSync(path.join(temp,"dist/sales-ledger/sales-report.json")));
 assert.equal(report.totals.rejectedCount,1);
});
