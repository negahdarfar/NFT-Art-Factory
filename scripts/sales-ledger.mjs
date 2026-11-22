import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const input=path.join(root,"sales-ledger.json");
const out=path.join(root,"dist","sales-ledger");
const fail=m=>{console.error("Sales ledger error: "+m);process.exit(1);};
if(!fs.existsSync(input)) fail("sales-ledger.json not found. Copy sales-ledger.example.json and add verified sales.");
const ledger=JSON.parse(fs.readFileSync(input,"utf8"));
if(!Array.isArray(ledger.sales)) fail("sales must be an array.");
const valid=[], rejected=[];
for(const [i,s] of ledger.sales.entries()){
 const errors=[];
 if(!s||typeof s!=="object") errors.push("record must be an object");
 else {
  for(const k of ["marketplace","chain","currency","tokenId","transactionHash","saleDate","payoutAddress"]) if(!String(s[k]??"").trim()) errors.push(k+" is required");
  if(typeof s.salePrice!=="number"||!Number.isFinite(s.salePrice)||s.salePrice<=0) errors.push("salePrice must be positive");
  if(typeof s.fees!=="number"||!Number.isFinite(s.fees)||s.fees<0) errors.push("fees must be zero or positive");
  if(!/^0x[a-fA-F0-9]{64}$/.test(String(s.transactionHash||""))) errors.push("transactionHash must be a 0x-prefixed 32-byte hash");
  if(!/^https:\/\//.test(String(s.transactionUrl||""))) errors.push("transactionUrl must be an https URL");
  if(Number.isNaN(Date.parse(s.saleDate||""))) errors.push("saleDate must be a valid date");
 }
 (errors.length?rejected:valid).push({index:i+1,record:s,errors});
}
fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out,{recursive:true});
const totals={salesCount:valid.length,rejectedCount:rejected.length,byCurrency:{}};
for(const {record:s} of valid){
 const t=totals.byCurrency[s.currency]??{gross:0,fees:0,net:0};
 t.gross+=s.salePrice;t.fees+=s.fees;t.net+=s.salePrice-s.fees;totals.byCurrency[s.currency]=t;
}
const report={generatedAt:new Date().toISOString(),verification:"format_validated_only_chain_confirmation_not_checked",totals,validSales:valid.map(x=>x.record),rejectedSales:rejected,warnings:["A valid transaction-hash format does not prove on-chain settlement; verify each transaction on the chain explorer.","Net is salePrice minus entered fees only; royalties, taxes, refunds and conversion costs may be additional.","Never record seed phrases or private keys."]};
fs.writeFileSync(path.join(out,"sales-report.json"),JSON.stringify(report,null,2)+"\n");
const rows=[["marketplace","chain","tokenId","salePrice","currency","fees","net","saleDate","transactionHash","transactionUrl"],...valid.map(({record:s})=>[s.marketplace,s.chain,s.tokenId,s.salePrice,s.currency,s.fees,s.salePrice-s.fees,s.saleDate,s.transactionHash,s.transactionUrl])];
fs.writeFileSync(path.join(out,"sales-report.csv"),rows.map(r=>r.map(v=>'"'+String(v??"").replaceAll('"','""')+'"').join(",")).join("\n")+"\n");
console.log("Sales ledger: "+valid.length+" format-valid record(s), "+rejected.length+" rejected. On-chain settlement is not independently verified.");
if(rejected.length) process.exitCode=2;
