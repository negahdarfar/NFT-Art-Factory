import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PinataStorage } from "../storage/pinata.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const reviewPath = path.join(root, "reviews", "review-status.json");
if (!fs.existsSync(reviewPath)) throw new Error("Create reviews/review-status.json with explicit rights_confirmed and owner_approved flags first.");
const reviews = JSON.parse(fs.readFileSync(reviewPath, "utf8"));
const key = process.argv[2];
if (!key || !reviews[key]) throw new Error('Usage: npm run pin:approved -- "Artwork title"');
const review = reviews[key];
if (review.rights_confirmed !== true || review.owner_approved !== true) {
  throw new Error("Public IPFS upload blocked: rights_confirmed and owner_approved must both be true.");
}
if (review.metadata_cid) throw new Error("Metadata is already pinned. Check metadata_cid before retrying.");

const collectionPath = path.join(root, "collection.json");
if (!fs.existsSync(collectionPath)) throw new Error("collection.json is required.");
const collection = JSON.parse(fs.readFileSync(collectionPath, "utf8"));
const itemIndex = collection.items.findIndex((entry) => entry.name === key);
if (itemIndex < 0) throw new Error("Artwork title not found in collection.json.");
const item = collection.items[itemIndex];
if (!item?.image || !item.description) throw new Error("Artwork needs an image and description.");
const assetsDir = path.join(root, "assets");
const filePath = path.resolve(assetsDir, item.image);
if (!filePath.startsWith(assetsDir + path.sep) || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
  throw new Error("Artwork file is missing or outside assets/.");
}

const storage = new PinataStorage();
let imageResult;
if (review.image_cid) {
  imageResult = { cid: review.image_cid, uri: review.image_uri || `ipfs://${review.image_cid}`, reused: true };
} else {
  imageResult = await storage.uploadFile(filePath);
  review.image_cid = imageResult.cid;
  review.image_uri = imageResult.uri;
  review.image_uploaded_at = new Date().toISOString();
  // Persist the image CID immediately so a metadata-upload failure does not cause a duplicate public image upload.
  fs.writeFileSync(reviewPath, JSON.stringify(reviews, null, 2) + "\n");
}

const metadata = {
  name: item.name,
  description: item.description,
  image: imageResult.uri,
  ...(collection.external_url ? { external_url: collection.external_url } : {}),
  ...(Array.isArray(item.attributes) ? { attributes: item.attributes } : {})
};
const metadataName = `${String(itemIndex + 1).padStart(4, "0")}.json`;
const metadataDir = path.join(root, "dist", "published-metadata");
fs.mkdirSync(metadataDir, { recursive: true });
fs.writeFileSync(path.join(metadataDir, metadataName), JSON.stringify(metadata, null, 2) + "\n");

const metadataResult = await storage.uploadJson(metadata, metadataName);
review.metadata_cid = metadataResult.cid;
review.metadata_uri = metadataResult.uri;
review.public_ipfs_uploaded = true;
review.uploaded_at = new Date().toISOString();
fs.writeFileSync(reviewPath, JSON.stringify(reviews, null, 2) + "\n");

console.log(JSON.stringify({
  title: key,
  image: { cid: imageResult.cid, uri: imageResult.uri, reused: Boolean(imageResult.reused) },
  metadata: { cid: metadataResult.cid, uri: metadataResult.uri, name: metadataResult.name },
  status: "image_and_metadata_pinned_to_public_ipfs"
}, null, 2));
