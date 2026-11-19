import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const collection = JSON.parse(fs.readFileSync(path.join(root, "collection.json"), "utf8"));
const registry = JSON.parse(fs.readFileSync(path.join(root, "marketplaces", "registry.json"), "utf8"));
const outDir = path.join(root, "dist", "objkt-drafts");

if (!Array.isArray(collection.items) || collection.items.length === 0) {
  throw new Error("collection.json must contain at least one artwork item.");
}
const objkt = registry.marketplaces.find(item => item.id === "objkt");
if (!objkt) throw new Error("objkt must exist in marketplaces/registry.json.");

const items = collection.items.map((item, index) => {
  if (!item.name || !item.description || !item.image) {
    throw new Error("Every item needs name, description, and image.");
  }
  const imagePath = path.resolve(root, item.image);
  const imageExists = imagePath.startsWith(root + path.sep) && fs.existsSync(imagePath);
  const extension = path.extname(item.image).toLowerCase();
  const supportedImage = [".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(extension);
  return {
    localId: index + 1,
    name: item.name,
    description: item.description,
    artifact: item.image,
    artifactExistsInRepository: imageExists,
    imageFormatSupportedByPack: supportedImage,
    tags: [...new Set(["surrealism", "digital-art", "conceptual-art", ...(item.attributes || []).map(a => String(a.value || "").toLowerCase().replace(/[^a-z0-9]+/g, "-")).filter(Boolean)])].slice(0, 10),
    attributes: item.attributes || [],
    chain: "tezos",
    marketplace: "objkt",
    editionSize: 1,
    royaltiesPercent: null,
    price: null,
    currency: "XTZ",
    publicationStatus: "draft_only",
    blockers: [
      ...(!imageExists ? ["Original artwork binary is not present at the configured repository path."] : []),
      ...(!supportedImage ? ["Image extension is not in this pack's supported image list."] : []),
      "Upload/pin the original artwork to an approved storage provider and replace the artifact URI placeholder.",
      "Creator must review collection, edition size, royalties, price, fees and wallet address.",
      "Creator must connect their own supported Tezos wallet and personally approve each mint/list transaction."
    ],
    metadataDraft: {
      name: item.name,
      description: item.description,
      artifactUri: "ipfs://REPLACE_AFTER_PINNING_OR_USE_APPROVED_PERMANENT_STORAGE",
      displayUri: "ipfs://REPLACE_AFTER_PINNING_OR_USE_APPROVED_PERMANENT_STORAGE",
      creators: [],
      tags: ["surrealism", "digital-art", "conceptual-art"],
      attributes: item.attributes || []
    }
  };
});

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "objkt-draft.json"), JSON.stringify({
  marketplace: "objkt",
  network: "Tezos",
  currency: "XTZ",
  mode: "preparation_only",
  generatedAt: new Date().toISOString(),
  sourceCollection: collection.name,
  items,
  compliance: {
    geographicEligibility: "Official objkt FAQ states no geographic restrictions on minting, listing, selling or receiving proceeds; external wallet and payment providers have separate country availability.",
    creatorMustFollowApplicableLaw: true,
    noThirdPartyIdentityOrWallet: true
  },
  warnings: [
    "This file does not mint, upload, pin, list, or sign anything.",
    "The artifact URI is intentionally a placeholder until the original media is uploaded and pinned.",
    "A Tezos wallet must show the exact transaction and fees; the creator must personally review and sign.",
    "Never enter or share a seed phrase or private key in this project."
  ]
}, null, 2) + "\n");
console.log("Prepared " + items.length + " objkt draft(s). No blockchain or marketplace transaction was made.");
