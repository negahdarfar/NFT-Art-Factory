import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const profilePath = path.join(root, "workflows", "90-day-operating-profile.json");
const profile = JSON.parse(fs.readFileSync(profilePath, "utf8"));
const generationConfigPath = path.join(root, "workflows", "ai-generation.json");
const generationConfig = fs.existsSync(generationConfigPath)
  ? JSON.parse(fs.readFileSync(generationConfigPath, "utf8"))
  : null;
const checks = [
  { id: "zero_budget", status: profile.budget?.monthly_usd === 0 && profile.budget?.paid_ads_allowed === false && profile.budget?.paid_api_allowed === false ? "pass" : "fail", detail: "No paid services or advertising are authorized." },
  { id: "hybrid_model", status: profile.business_model?.type === "hybrid" && profile.business_model.offers?.length >= 3 ? "pass" : "fail", detail: "Premium art, limited editions, commissions, and licensing are configured." },
  { id: "human_transaction_gate", status: profile.automation?.minting === "owner_signature_required" && profile.automation?.wallet_transfers === "owner_signature_required" ? "pass" : "fail", detail: "Minting and transfers require owner signatures." },
  { id: "generation_config", status: generationConfig?.enabled === true && generationConfig?.publish_mode === "draft_only" ? "configured" : "blocked", detail: "AI generation is not live until explicitly enabled in a private local config and provider credentials are configured." },
  { id: "cloudflare_credentials", status: process.env.CLOUDFLARE_ACCOUNT_ID && process.env.CLOUDFLARE_API_TOKEN ? "configured" : "missing", detail: "Credential presence only; values are never printed." },
  { id: "private_review_file", status: fs.existsSync(path.join(root, "reviews", "review-status.json")) ? "present" : "missing", detail: "Owner rights and artwork approval file." },
  { id: "private_wallet_config", status: "owner_action_required", detail: "No wallet address or private key is read by this report. Connect and verify a public payout address only through the marketplace's official wallet flow." }
];
const blocked = checks.filter(c => ["fail", "blocked", "missing"].includes(c.status));
const report = {
  generatedAt: new Date().toISOString(),
  profile: profile.program,
  target: profile.revenue_target,
  status: blocked.length ? "not_ready" : "review_required",
  checks,
  warnings: [
    "This is a configuration readiness check, not a deployment or marketplace eligibility verification.",
    "A passing check does not prove artwork rights, buyer demand, legal eligibility, or sale probability.",
    "No mint, listing, public upload, post, or wallet transaction is performed."
  ]
};
const out = path.join(root, "dist", "launch-readiness");
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, "report.json"), JSON.stringify(report, null, 2) + "\n");
console.log("Launch readiness: " + report.status + " (" + blocked.length + " blocking check(s)).");
for (const check of checks) console.log(check.status.toUpperCase() + " " + check.id + ": " + check.detail);
if (blocked.length) process.exitCode = 2;
