import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function readJson(file, fallback) {
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : fallback;
}

function safeAssetExists(rootDir, assetPath) {
  if (typeof assetPath !== "string" || !assetPath.startsWith("assets/")) return false;
  const base = path.resolve(rootDir, "assets") + path.sep;
  const target = path.resolve(rootDir, assetPath);
  return target.startsWith(base) && fs.existsSync(target) && fs.statSync(target).isFile();
}

export function buildStudioStatus({ rootDir, catalog, reviews = {} }) {
  const works = [];
  const ids = new Set();
  const collections = Array.isArray(catalog?.collections) ? catalog.collections : [];
  const errors = [];
  for (const collection of collections) {
    for (const work of (Array.isArray(collection.works) ? collection.works : [])) {
      const id = String(work.id || "");
      if (!id || ids.has(id)) errors.push({ code: "missing_or_duplicate_work_id", id: id || null });
      ids.add(id);
      const draftPath = typeof work.draft_path === "string" ? path.resolve(rootDir, work.draft_path) : "";
      const draftSafe = draftPath && draftPath.startsWith(path.resolve(rootDir) + path.sep);
      const draft = draftSafe && fs.existsSync(draftPath) ? readJson(draftPath, {}) : {};
      const review = reviews[work.title] || {};
      const assetPresent = safeAssetExists(rootDir, work.final_asset_path || draft.image);
      const rightsApproved = review.rights_confirmed === true && draft.approval?.rights_confirmed === true;
      const ownerApproved = review.owner_approved === true && draft.approval?.owner_approved === true;
      const releaseAuthorized = work.release_authorization === true && draft.approval?.minting_authorized === true;
      const blockers = [];
      if (!assetPresent) blockers.push("final_asset_missing");
      if (!rightsApproved) blockers.push("rights_not_confirmed");
      if (!ownerApproved) blockers.push("owner_approval_missing");
      if (!releaseAuthorized) blockers.push("action_specific_release_authorization_missing");
      const ready = blockers.length === 0;
      works.push({
        id, title: work.title || "Untitled", collection: collection.name || "Unassigned",
        status: ready ? "release_gate_passed" : "blocked_pending_review",
        asset_present: assetPresent, rights_approved: rightsApproved,
        owner_approved: ownerApproved, release_authorized: releaseAuthorized,
        blockers, draft_path: work.draft_path || null, asset_path: work.final_asset_path || draft.image || null
      });
    }
  }
  if (!works.length) errors.push({ code: "catalog_has_no_works" });
  return {
    generated_at: new Date().toISOString(),
    catalog_name: catalog?.catalog_name || "NFT Art Factory",
    status: errors.length ? "configuration_error" : works.every(w => w.status === "release_gate_passed") ? "release_gates_passed" : "operational_review_required",
    totals: {
      collections: collections.length, works: works.length,
      release_gates_passed: works.filter(w => w.status === "release_gate_passed").length,
      blocked: works.filter(w => w.status !== "release_gate_passed").length,
      missing_assets: works.filter(w => !w.asset_present).length,
      rights_pending: works.filter(w => !w.rights_approved).length,
      owner_approval_pending: works.filter(w => !w.owner_approved).length
    },
    errors, works,
    safety: {
      automated_minting: false, automated_listing: false, automated_publication: false,
      note: "This dashboard is a local evidence summary. It does not verify legal rights, marketplace eligibility, identity, demand, or transactions and never authorizes an external action."
    }
  };
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

function renderHtml(report) {
  const cards = [
    ["Collections", report.totals.collections], ["Works", report.totals.works],
    ["Release gates passed", report.totals.release_gates_passed], ["Blocked", report.totals.blocked]
  ].map(([label, value]) => `<article class="metric"><span>${escapeHtml(label)}</span><strong>${value}</strong></article>`).join("");
  const rows = report.works.map(work => `<tr><td><strong>${escapeHtml(work.title)}</strong><small>${escapeHtml(work.collection)}</small></td><td>${escapeHtml(work.status)}</td><td>${work.asset_present ? "Present" : "Missing"}</td><td>${work.rights_approved ? "Approved" : "Pending"}</td><td>${work.owner_approved ? "Approved" : "Pending"}</td><td>${work.release_authorized ? "Authorized" : "Not authorized"}</td><td>${escapeHtml(work.blockers.join(", ") || "None")}</td></tr>`).join("");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>NFT Art Factory — Studio Status</title><style>
:root{color-scheme:dark;font-family:Inter,ui-sans-serif,system-ui,sans-serif;background:#101318;color:#edf1f5}*{box-sizing:border-box}body{margin:0;padding:32px;max-width:1200px;margin-inline:auto}header{display:flex;justify-content:space-between;gap:20px;align-items:center;flex-wrap:wrap}h1{font-size:clamp(1.7rem,4vw,2.6rem);margin:0}p{color:#aeb8c4;line-height:1.6}.status{border:1px solid #8d7546;border-radius:999px;padding:8px 13px;color:#f0d69b;font-size:.85rem}.metrics{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin:28px 0}.metric{background:#1a2029;border:1px solid #303946;border-radius:14px;padding:18px}.metric span{display:block;color:#aeb8c4;font-size:.85rem}.metric strong{display:block;font-size:2rem;margin-top:8px}section{background:#171d25;border:1px solid #303946;border-radius:14px;padding:18px;overflow:auto}table{width:100%;border-collapse:collapse;min-width:850px}th,td{text-align:left;padding:13px 10px;border-bottom:1px solid #303946;font-size:.9rem}th{color:#aeb8c4;font-weight:600}small{display:block;color:#aeb8c4;margin-top:4px}.note{margin-top:18px;padding:14px;border-left:3px solid #b38b49;background:#1a2029}footer{color:#8793a2;font-size:.8rem;margin-top:22px}@media(max-width:600px){body{padding:18px}}</style></head><body><header><div><h1>NFT Art Factory</h1><p>Creator-controlled operations dashboard · evidence-based status</p></div><span class="status">${escapeHtml(report.status.replaceAll("_"," "))}</span></header><div class="metrics">${cards}</div><section><h2>Collection workboard</h2><table><thead><tr><th>Artwork</th><th>Status</th><th>Asset</th><th>Rights</th><th>Owner approval</th><th>Release authorization</th><th>Open blockers</th></tr></thead><tbody>${rows || '<tr><td colspan="7">No works in catalog.</td></tr>'}</tbody></table></section><div class="note"><strong>Safety boundary</strong><p>${escapeHtml(report.safety.note)}</p><p>No minting, listing, wallet signing, public upload or social publication is performed by this dashboard.</p></div><footer>Generated ${escapeHtml(report.generated_at)} · Do not treat a draft, visual selection or passing technical check as legal clearance or transaction approval.</footer></body></html>`;
}

function main() {
  const catalog = readJson(path.join(root, "workflows", "collection-catalog.example.json"), {});
  const reviews = readJson(path.join(root, "reviews", "review-status.json"), {});
  const report = buildStudioStatus({ rootDir: root, catalog, reviews });
  const out = path.join(root, "dist", "studio-dashboard");
  fs.mkdirSync(out, { recursive: true });
  fs.writeFileSync(path.join(out, "report.json"), JSON.stringify(report, null, 2) + "\n");
  fs.writeFileSync(path.join(out, "index.html"), renderHtml(report));
  console.log(`Studio dashboard: ${report.status}; ${report.totals.works} work(s), ${report.totals.blocked} blocked.`);
  if (report.errors.length) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) main();
