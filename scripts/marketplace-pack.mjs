import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const collectionPath = path.join(root, "collection.json");
const configPath = path.join(root, "marketplaces.json");
const outDir = path.join(root, "dist", "marketplace-drafts");

function fail(message) {
  console.error("Marketplace pack error: " + message);
  process.exit(1);
}
if (!fs.existsSync(collectionPath)) fail("collection.json not found.");
let collection;
try { collection = JSON.parse(fs.readFileSync(collectionPath, "utf8")); }
catch (error) { fail("collection.json is invalid: " + error.message); }
if (!Array.isArray(collection.items) || collection.items.length === 0) fail("collection.items must contain at least one item.");

const config = fs.existsSync(configPath)
  ? JSON.parse(fs.readFileSync(configPath, "utf8"))
  : { currency: "ETH", chain: "ethereum", price: null, platforms: ["opensea", "rarible"] };

const supported = {
  opensea: {
    name: "OpenSea",
    networkModel: "EVM and supported non-EVM chains; confirm exact chain and token support.",
    flow: "Prepare metadata, connect the owner's wallet, obtain listing actions, approve the required contract action if requested, sign the order, then submit it to OpenSea.",
    api: "https://docs.opensea.io/reference/create_listing_actions",
    market: "https://opensea.io/",
    walletSignatureRequired: true,
    apiKeyRequired: true
  },
  rarible: {
    name: "Rarible",
    networkModel: "Multi-chain; confirm the selected chain and asset standard.",
    flow: "Use the Rarible SDK sell flow with the owner's connected wallet; the owner confirms required approvals and signs the order.",
    api: "https://docs.rarible.org/reference/list-nft",
    market: "https://rarible.com/",
    walletSignatureRequired: true,
    apiKeyRequired: true
  },
  objkt: {
    name: "objkt",
    networkModel: "Tezos mainnet; FA2 token contract and TZIP-16/TZIP-21 metadata.",
    flow: "Create or select a collection on objkt, upload the artwork and TZIP-21 metadata, mint through the connected Tezos wallet, then create a listing on objkt. Every on-chain action requires the owner's review and wallet signature.",
    api: "https://data.objkt.com/docs/",
    market: "https://objkt.com/",
    walletSignatureRequired: true,
    apiKeyRequired: false
  }
};

const selected = [...new Set(config.platforms || ["opensea", "rarible"])];
for (const platform of selected) if (!supported[platform]) fail("Unsupported platform: " + platform);
if (config.price !== null && config.price !== undefined && (!Number.isFinite(Number(config.price)) || Number(config.price) <= 0)) {
  fail("price must be a positive number or null.");
}
const slug = value => String(value).normalize("NFKD").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 72) || "digital-art";
const cleanTags = item => {
  const tags = new Set([...(Array.isArray(item.tags) ? item.tags : []), collection.name, "digital art", "NFT"].map(x => String(x).trim()).filter(Boolean));
  return [...tags].slice(0, 15);
};
const drafts = collection.items.map((item, index) => {
  const title = String(item.name || "").trim();
  const description = String(item.description || "").trim();
  if (!title || !description || !item.image) fail("Each item needs name, description and image.");
  const tezosAttributes = (Array.isArray(item.attributes) ? item.attributes : []).map(attribute => ({
    name: String(attribute.name || attribute.trait_type || "Attribute"),
    value: String(attribute.value ?? "")
  }));
  const mimeType = /\\.svg$/i.test(item.image) ? "image/svg+xml"
    : /\\.jpe?g$/i.test(item.image) ? "image/jpeg"
      : /\\.webp$/i.test(item.image) ? "image/webp" : "image/png";
  const objktMetadataDraft = {
    name: title,
    description,
    artifactUri: "ipfs://REPLACE_WITH_PINATA_IMAGE_CID",
    displayUri: "ipfs://REPLACE_WITH_PINATA_IMAGE_CID",
    thumbnailUri: "ipfs://REPLACE_WITH_PINATA_IMAGE_CID",
    creators: ["REPLACE_WITH_YOUR_PUBLIC_TEZOS_WALLET_ADDRESS"],
    attributes: tezosAttributes,
    formats: [{ uri: "ipfs://REPLACE_WITH_PINATA_IMAGE_CID", mimeType }]
  };
  return {
    localId: index + 1,
    slug: slug(title),
    title,
    description,
    imageFile: path.basename(item.image),
    externalUrl: collection.external_url || "",
    attributes: Array.isArray(item.attributes) ? item.attributes : [],
    tags: cleanTags(item),
    ...(selected.includes("objkt") ? {
      objkt: {
        network: "tezos",
        tokenStandard: "FA2",
        metadataStandard: ["TZIP-16", "TZIP-21"],
        metadata: objktMetadataDraft,
        readiness: "draft_requires_public_image_cid_and_verified_creator_wallet_address"
      }
    } : {}),
    listing: {
      status: "draft_not_listed",
      suggestedPrice: config.price ?? null,
      currency: config.currency || "ETH",
      chain: config.chain || "ethereum",
      ownerMustConfirmPrice: true
    },
    marketplaces: selected.map(id => ({
      id,
      ...supported[id],
      status: "not_submitted",
      requiredNextAction: "Owner reviews asset, network, price and fees; wallet signature is required before listing."
    }))
  };
});

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "listing-drafts.json"), JSON.stringify({
  collection: { name: collection.name, description: collection.description, symbol: collection.symbol || "" },
  generatedAt: new Date().toISOString(),
  publicationMode: "draft_only",
  items: drafts,
  warnings: [
    "These are preparation files, not marketplace listings.",
    "No price is recommended unless explicitly configured; check comparable sales and network fees.",
    "Marketplace support, creator royalties, fees and regional restrictions vary by chain and can change.",
    "Never share a seed phrase or private key. The owner must approve all wallet prompts."
  ]
}, null, 2) + "\n");

const csv = [
  ["id","title","description","image","tags","price","currency","chain","status"],
  ...drafts.map(x => [x.localId,x.title,x.description,x.imageFile,x.tags.join("|"),x.listing.suggestedPrice ?? "",x.listing.currency,x.listing.chain,x.listing.status])
].map(row => row.map(v => '"' + String(v).replaceAll('"','""') + '"').join(",")).join("\n") + "\n";
fs.writeFileSync(path.join(outDir, "listing-drafts.csv"), csv);
if (selected.includes("objkt")) {
  fs.writeFileSync(path.join(outDir, "objkt-token-metadata-drafts.json"), JSON.stringify({
    standard: "TZIP-21",
    network: "tezos",
    publicationMode: "draft_only",
    items: drafts.map(item => ({
      localId: item.localId,
      title: item.title,
      metadata: item.objkt.metadata,
      readiness: item.objkt.readiness
    })),
    warnings: [
      "Replace every IPFS placeholder with the final public Pinata image URI.",
      "Replace the creator placeholder with the owner's verified public Tezos address.",
      "Validate the final token metadata with objkt's official metadata validator.",
      "This file does not deploy an FA2 contract, mint a token, or create a listing."
    ]
  }, null, 2) + "\n");
}
fs.writeFileSync(path.join(outDir, "marketplace-checklist.md"), `# Marketplace publication checklist

For each item, complete these checks separately on each marketplace:

- [ ] Confirm original authorship, license and commercial resale rights.
- [ ] Confirm the correct chain, contract address and token ID after minting.
- [ ] Review image and metadata on the public IPFS gateway.
- [ ] Research comparable completed sales; set a price only after review.
- [ ] Check network gas, marketplace fees, creator-fee/royalty settings and payout address.
- [ ] Connect the owner's wallet directly to the marketplace.
- [ ] Review every approval and order; sign only after verifying asset, price, currency, recipient and expiry.
- [ ] Verify the resulting listing ID and active status on the marketplace.
- [ ] Record final URL, order ID, chain and transaction hash in the sales ledger.

No marketplace listing is created by this generator.
`);
console.log("Prepared " + drafts.length + " listing draft(s) for: " + selected.join(", ") + ".");
