import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const input = path.join(root, "market-comps.json");
const collectionFile = path.join(root, "collection.json");
const outDir = path.join(root, "dist", "market-research");
const fail = message => { console.error("Market research error: " + message); process.exit(1); };
if (!fs.existsSync(collectionFile)) fail("collection.json not found.");
const collection = JSON.parse(fs.readFileSync(collectionFile, "utf8"));
const comps = fs.existsSync(input) ? JSON.parse(fs.readFileSync(input, "utf8")) : { currency:"ETH", chain:"ethereum", records:[] };
if (!Array.isArray(comps.records)) fail("records must be an array.");
const valid = comps.records.filter((r, i) => {
  const ok = r && typeof r.price === "number" && Number.isFinite(r.price) && r.price > 0 &&
    r.currency === comps.currency && r.chain === comps.chain &&
    typeof r.sourceUrl === "string" && /^https:\/\//.test(r.sourceUrl) &&
    typeof r.saleDate === "string" && !Number.isNaN(Date.parse(r.saleDate)) &&
    r.saleType === "completed";
  if (!ok) console.warn("Ignoring unverified/invalid comparable record at index " + i + ".");
  return ok;
});
const median = values => {
  if (!values.length) return null;
  const a = [...values].sort((x,y)=>x-y), m = Math.floor(a.length/2);
  return a.length % 2 ? a[m] : (a[m-1]+a[m])/2;
};
const byTitle = collection.items.map((item, index) => {
  const matching = valid.filter(r => !r.itemName || r.itemName.toLowerCase() === String(item.name).toLowerCase());
  const values = matching.map(r => r.price);
  return {
    localId:index+1, title:item.name, comparableCount:values.length,
    currency:comps.currency, chain:comps.chain,
    indicativeMedian:median(values),
    indicativeLow:values.length ? Math.min(...values) : null,
    indicativeHigh:values.length ? Math.max(...values) : null,
    confidence:values.length >= 5 ? "limited_market_sample" : values.length ? "very_low_sample" : "no_data",
    comparableSources:matching.map(r=>({price:r.price,saleDate:r.saleDate,sourceUrl:r.sourceUrl,marketplace:r.marketplace||"unspecified"})),
    disclaimer:"Indicative reference only; not an appraisal or guaranteed sale price."
  };
});
fs.rmSync(outDir,{recursive:true,force:true}); fs.mkdirSync(outDir,{recursive:true});
fs.writeFileSync(path.join(outDir,"price-research.json"),JSON.stringify({
  generatedAt:new Date().toISOString(),method:"user-supplied completed-sale comparables only",
  currency:comps.currency,chain:comps.chain,recordsAccepted:valid.length,recordsProvided:comps.records.length,
  results:byTitle,
  warnings:["No live marketplace API data is fetched by this tool.","Only records explicitly marked completed with a source URL are included.","Verify each source and comparability manually; collection, rarity, creator reputation and fees affect value.","No price is auto-applied to a listing."]
},null,2)+"\n");
const rows=[["id","title","comparable_count","median","low","high","currency","confidence"],...byTitle.map(x=>[x.localId,x.title,x.comparableCount,x.indicativeMedian??"",x.indicativeLow??"",x.indicativeHigh??"",x.currency,x.confidence])];
fs.writeFileSync(path.join(outDir,"price-research.csv"),rows.map(r=>r.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(",")).join("\n")+"\n");
console.log("Market research generated. Accepted " + valid.length + " completed-sale comparables; no automatic prices applied.");
