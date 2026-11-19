import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(root, "workflows", "provenance-records.example.json");
const outDir = path.join(root, "dist", "collector-dossiers");
if (!fs.existsSync(source)) {
  console.error("Collector dossier error: provenance record not found.");
  process.exit(1);
}
const data = JSON.parse(fs.readFileSync(source, "utf8"));
if (!Array.isArray(data.works) || data.works.length === 0) {
  console.error("Collector dossier error: no works in provenance record.");
  process.exit(1);
}
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });
for (const work of data.works) {
  const safe = value => String(value ?? "Not provided");
  const rights = work.rights_review?.status ?? "unknown";
  const asset = work.asset?.status ?? "unknown";
  const release = work.release ?? {};
  const lines = [
    "# " + safe(work.title),
    "",
    "**Collection:** " + safe(work.collection_id),
    "**Work ID:** " + safe(work.work_id),
    "",
    "## Work statement",
    "",
    "A surreal artwork developed around the idea of listening after the world has fallen quiet. This short curatorial statement is a working description, not a claim about market reception or valuation.",
    "",
    "## Creation and provenance",
    "",
    "- Method: " + safe(work.creation?.method),
    "- Tool: " + safe(work.creation?.tool),
    "- Creator statement: " + safe(work.creator_attestation?.statement),
    "- Attestation independently verified: " + safe(work.creator_attestation?.independently_verified),
    "- Master asset status: " + safe(asset),
    "- Master asset path: " + safe(work.asset?.path),
    "- SHA-256: " + safe(work.asset?.sha256),
    "",
    "## Rights and release status",
    "",
    "- Rights review: " + safe(rights),
    "- Owner release approval: " + safe(release.owner_approved),
    "- Mint authorized: " + safe(release.mint_authorized),
    "- Listing authorized: " + safe(release.listing_authorized),
    "- Public promotion authorized: " + safe(release.public_promotion_authorized),
    "",
    "## Collector notice",
    "",
    "This is a preparation dossier, not a live offer, proof of copyright registration, legal opinion, appraisal, or guarantee of authenticity or future value. Do not treat this document as authorization to mint, list, promote, or transfer the work. Confirm the final master, rights review, marketplace eligibility, fees, and written release authorization before any transaction.",
    "",
    "## Bilingual short description",
    "",
    "EN: A weathered shortwave radio and a small sign of new life become a quiet meditation on memory, isolation, and the persistence of listening.",
    "",
    "FA: رادیویی موج‌کوتاه و فرسوده در کنار نشانه‌ای کوچک از زندگی تازه؛ تأملی آرام درباره حافظه، تنهایی و تداوم شنیدن.",
    ""
  ];
  const filename = work.work_id.replace(/[^a-z0-9-]/gi, "-") + ".md";
  fs.writeFileSync(path.join(outDir, filename), lines.join("\n"));
}
console.log("Prepared " + data.works.length + " draft collector dossier(s) in dist/collector-dossiers. No publication or listing performed.");
