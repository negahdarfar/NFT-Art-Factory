import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function readJson(file, fallback) {
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : fallback;
}

export function inspectImage(buffer) {
  if (!Buffer.isBuffer(buffer)) buffer = Buffer.from(buffer);
  // PNG
  if (buffer.length >= 24 && buffer.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) {
    return { format: "png", width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  }
  // JPEG: walk marker segments until a Start Of Frame marker is found.
  if (buffer.length >= 4 && buffer[0] === 0xff && buffer[1] === 0xd8) {
    let offset = 2;
    while (offset + 4 < buffer.length) {
      if (buffer[offset] !== 0xff) { offset++; continue; }
      const marker = buffer[offset + 1];
      offset += 2;
      if (marker === 0xd9 || marker === 0xda) break;
      if (offset + 2 > buffer.length) break;
      const length = buffer.readUInt16BE(offset);
      if (length < 2 || offset + length > buffer.length) break;
      if ([0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf].includes(marker) && length >= 7) {
        return { format: "jpg", height: buffer.readUInt16BE(offset + 3), width: buffer.readUInt16BE(offset + 5) };
      }
      offset += length;
    }
    return null;
  }
  // WebP (VP8X, VP8, VP8L)
  if (buffer.length >= 30 && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP") {
    const chunk = buffer.toString("ascii", 12, 16);
    if (chunk === "VP8X" && buffer.length >= 30) {
      return { format: "webp", width: 1 + buffer.readUIntLE(24, 3), height: 1 + buffer.readUIntLE(27, 3) };
    }
    if (chunk === "VP8 " && buffer.length >= 30) {
      return { format: "webp", width: buffer.readUInt16LE(26) & 0x3fff, height: buffer.readUInt16LE(28) & 0x3fff };
    }
    if (chunk === "VP8L" && buffer.length >= 25) {
      const b1=buffer[21], b2=buffer[22], b3=buffer[23], b4=buffer[24];
      return { format: "webp", width: 1 + (((b2 & 0x3f) << 8) | b1), height: 1 + (((b4 & 0x0f) << 10) | (b3 << 2) | ((b2 & 0xc0) >> 6)) };
    }
    return null;
  }
  // GIF logical screen descriptor
  if (buffer.length >= 10 && ["GIF87a","GIF89a"].includes(buffer.toString("ascii", 0, 6))) {
    return { format: "gif", width: buffer.readUInt16LE(6), height: buffer.readUInt16LE(8) };
  }
  return null;
}

function resolveArtwork(rootDir, imagePath) {
  if (typeof imagePath !== "string" || !imagePath.trim()) return null;
  const clean = imagePath.replaceAll("\\", "/");
  const candidate = path.resolve(rootDir, clean.startsWith("assets/") ? clean : path.join("assets", clean));
  const allowed = path.resolve(rootDir, "assets") + path.sep;
  if (!candidate.startsWith(allowed)) return null;
  return candidate;
}

export function auditCollection({ rootDir, collection, reviews = {}, minDimension = 512 }) {
  const findings = [];
  const hashes = new Map();
  const items = Array.isArray(collection?.items) ? collection.items : [];
  if (!items.length) findings.push({ level: "error", code: "empty_collection", message: "Collection has no artwork items." });
  for (let index = 0; index < items.length; index++) {
    const item = items[index] || {};
    const name = String(item.name || "Untitled");
    const review = reviews[name] || {};
    const file = resolveArtwork(rootDir, item.image);
    if (!file || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
      findings.push({ level: "error", code: "image_missing_or_unsafe_path", artwork: name, message: "Image file is missing or path escapes assets/." });
      continue;
    }
    const bytes = fs.readFileSync(file);
    const image = inspectImage(bytes);
    if (!image || image.width < 1 || image.height < 1) {
      findings.push({ level: "error", code: "invalid_image", artwork: name, message: "File signature or image dimensions could not be validated." });
      continue;
    }
    const hash = crypto.createHash("sha256").update(bytes).digest("hex");
    if (hashes.has(hash)) {
      findings.push({ level: "error", code: "exact_duplicate", artwork: name, duplicateOf: hashes.get(hash), message: "Exact byte-for-byte duplicate artwork detected." });
    } else hashes.set(hash, name);
    if (image.width < minDimension || image.height < minDimension) {
      findings.push({ level: "warning", code: "low_resolution", artwork: name, width: image.width, height: image.height, message: `Image is below the recommended ${minDimension}px minimum on each side.` });
    }
    if (review.rights_confirmed !== true || review.owner_approved !== true || review.status !== "approved") {
      findings.push({ level: "review", code: "rights_or_owner_approval_pending", artwork: name, message: "Rights confirmation and explicit owner approval are not both recorded as approved." });
    }
    if (!item.description || String(item.description).trim().length < 30) {
      findings.push({ level: "warning", code: "weak_description", artwork: name, message: "Add a specific, factual description of concept, medium and distinctive details." });
    }
    if (!Array.isArray(item.attributes) || item.attributes.length < 2) {
      findings.push({ level: "warning", code: "thin_metadata", artwork: name, message: "Add accurate, non-invented attributes that help collectors understand the work." });
    }
    if (!item.provenance || !item.provenance.source || !item.provenance.model_or_tool) {
      findings.push({ level: "review", code: "provenance_incomplete", artwork: name, message: "Record the source/process and tools or model used; do not infer commercial rights from tool use." });
    }
    if (review.commercial_rights_basis && typeof review.commercial_rights_basis !== "string") {
      findings.push({ level: "error", code: "invalid_rights_record", artwork: name, message: "commercial_rights_basis must be a plain-language string." });
    }
  }
  const errors = findings.filter(x => x.level === "error").length;
  const reviewsNeeded = findings.filter(x => x.level === "review").length;
  const warnings = findings.filter(x => x.level === "warning").length;
  return {
    status: errors ? "failed" : reviewsNeeded ? "review_required" : warnings ? "passed_with_warnings" : "passed",
    itemCount: items.length,
    counts: { errors, reviewsNeeded, warnings },
    findings
  };
}

function main() {
  const collectionPath = path.join(root, "collection.json");
  const examplePath = path.join(root, "collection.example.json");
  const collection = readJson(fs.existsSync(collectionPath) ? collectionPath : examplePath, {});
  const reviews = readJson(path.join(root, "reviews", "review-status.json"), {});
  const minDimension = Number(process.env.NFT_MIN_IMAGE_DIMENSION || 512);
  const report = {
    generatedAt: new Date().toISOString(),
    policy: "No automated plagiarism, aesthetic, legal or market-demand determination is claimed.",
    ...auditCollection({ rootDir: root, collection, reviews, minDimension }),
    warnings: [
      "A valid image header does not prove artistic quality, originality, copyright ownership or marketplace acceptance.",
      "Exact hash matching detects byte-identical files only; it is not perceptual similarity or plagiarism detection.",
      "Rights, provenance and final curation require human review. No minting, upload or publication is performed."
    ]
  };
  const outDir = path.join(root, "dist", "quality-review");
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "report.json"), JSON.stringify(report, null, 2) + "\n");
  for (const f of report.findings) console.log(`${f.level.toUpperCase()} ${f.code}: ${f.artwork || ""} ${f.message}`);
  console.log(`Artwork quality gate: ${report.status} — ${report.itemCount} item(s), ${report.counts.errors} error(s), ${report.counts.reviewsNeeded} human review item(s).`);
  if (process.argv.includes("--strict") && report.status !== "passed") process.exitCode = 1;
  if (report.counts.errors) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) main();
