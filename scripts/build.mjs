import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const configPath = path.join(root, "collection.json");
const assetsDir = path.join(root, "assets");
const outDir = path.join(root, "dist", "metadata");

function fail(message) {
  console.error(`NFT build error: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(configPath)) {
  fail("collection.json not found. Copy collection.example.json to collection.json and edit it.");
}

let collection;
try {
  collection = JSON.parse(fs.readFileSync(configPath, "utf8"));
} catch (error) {
  fail(`collection.json is invalid JSON: ${error.message}`);
}

if (!collection.name || !collection.description || !Array.isArray(collection.items) || collection.items.length === 0) {
  fail("collection requires name, description and at least one item.");
}
if (!Number.isInteger(collection.seller_fee_basis_points) || collection.seller_fee_basis_points < 0 || collection.seller_fee_basis_points > 10000) {
  fail("seller_fee_basis_points must be an integer from 0 to 10000.");
}

fs.rmSync(path.join(root, "dist"), { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(assetsDir, { recursive: true });

const seen = new Set();
const manifest = [];

for (let i = 0; i < collection.items.length; i++) {
  const item = collection.items[i];
  if (!item.name || !item.description || !item.image) fail(`item ${i + 1} needs name, description and image.`);
  if (seen.has(item.name)) fail(`duplicate item name: ${item.name}`);
  seen.add(item.name);

  const imagePath = path.resolve(assetsDir, item.image);
  if (!imagePath.startsWith(assetsDir + path.sep) || !fs.existsSync(imagePath) || !fs.statSync(imagePath).isFile()) {
    fail(`artwork not found or invalid path for item ${i + 1}: ${item.image}`);
  }

  const imageBytes = fs.readFileSync(imagePath);
  const sha256 = crypto.createHash("sha256").update(imageBytes).digest("hex");
  const metadata = {
    name: item.name,
    description: item.description,
    image: `ipfs://PENDING_UPLOAD/${path.basename(item.image)}`,
    ...(collection.external_url ? { external_url: collection.external_url } : {}),
    ...(Array.isArray(item.attributes) ? { attributes: item.attributes } : {})
  };

  const filename = `${String(i + 1).padStart(4, "0")}.json`;
  fs.writeFileSync(path.join(outDir, filename), JSON.stringify(metadata, null, 2) + "\n");
  manifest.push({
    token_number: i + 1,
    name: item.name,
    source_image: item.image,
    image_sha256: sha256,
    metadata_file: filename
  });
}

fs.writeFileSync(path.join(root, "dist", "manifest.json"), JSON.stringify({
  collection: collection.name,
  symbol: collection.symbol || "",
  item_count: manifest.length,
  seller_fee_basis_points: collection.seller_fee_basis_points,
  fee_recipient_configured: Boolean(collection.fee_recipient),
  items: manifest,
  next_step: "Upload assets and metadata to IPFS, then replace PENDING_UPLOAD with the returned content identifiers."
}, null, 2) + "\n");

console.log(`Built metadata for ${manifest.length} artwork item(s) in dist/metadata.`);
