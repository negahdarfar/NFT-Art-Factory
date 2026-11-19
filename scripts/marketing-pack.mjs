import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const collectionPath = path.join(root, "collection.json");
const reviewPath = path.join(root, "reviews", "review-status.json");
const reviewExamplePath = path.join(root, "reviews", "review-status.example.json");
const outputDir = path.join(root, "dist", "marketing");

function readJson(file, fallback) {
  if (!fs.existsSync(file)) return fallback;
  try { return JSON.parse(fs.readFileSync(file, "utf8")); }
  catch (error) { throw new Error(`Invalid JSON in ${path.relative(root, file)}: ${error.message}`); }
}
if (!fs.existsSync(collectionPath)) {
  console.error("Marketing pack: collection.json not found. Copy collection.example.json first.");
  process.exit(1);
}
const collection = readJson(collectionPath, {});
const reviews = readJson(reviewPath, readJson(reviewExamplePath, {}));
if (!Array.isArray(collection.items)) throw new Error("collection.items must be an array.");

const approved = collection.items.filter(item => {
  const review = reviews[item.name] || {};
  return review.status === "approved" && review.rights_confirmed === true && review.owner_approved === true;
});
const slug = value => String(value || "artwork").normalize("NFKD").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 64) || "artwork";
const tagsFor = item => [...new Set([
  "digitalart", "nftart", "cryptoart",
  ...(Array.isArray(item.attributes) ? item.attributes.map(a => a.value) : [])
].map(v => String(v).toLowerCase().replace(/[^a-z0-9]/g, "")).filter(Boolean))].slice(0, 12);

const campaigns = approved.map(item => {
  const title = String(item.name).trim();
  const description = String(item.description || "").trim();
  const tags = tagsFor(item);
  const marketplaceUrl = "{{APPROVED_MARKETPLACE_LISTING_URL}}";
  return {
    slug: slug(title),
    title,
    seoTitle: `${title} | ${collection.name}`.slice(0, 70),
    metaDescription: description.slice(0, 155),
    altText: `${title} — original digital artwork`,
    description,
    hashtags: tags.map(tag => "#" + tag),
    listingUrlPlaceholder: marketplaceUrl,
    publicationGate: "Do not publish until a real marketplace listing URL is added and owner approves the campaign.",
    channels: {
      instagram: `${title}\n\n${description}\n\nView the verified listing: ${marketplaceUrl}\n\n${tags.map(tag => "#" + tag).join(" ")}`,
      x: `${title} — ${description.slice(0, 180)}\nVerified listing: ${marketplaceUrl} ${tags.slice(0, 4).map(tag => "#" + tag).join(" ")}`,
      pinterest: `Title: ${title}\nDescription: ${description}\nDestination: ${marketplaceUrl}\nAlt text: ${title} — original digital artwork`,
      emailSubject: `New artwork: ${title}`
    }
  };
});

fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(path.join(outputDir, "campaigns.json"), JSON.stringify({
  generatedAt: new Date().toISOString(),
  mode: "draft_only",
  approvedArtworkCount: campaigns.length,
  campaigns,
  warnings: [
    "No posts, emails or marketplace listings are published by this generator.",
    "Replace the listing URL placeholder only with the real, verified marketplace listing URL.",
    "Review platform rules, image rights, claims, pricing and local advertising requirements before publication."
  ]
}, null, 2) + "\n");
const markdown = [
  "# Artwork marketing drafts",
  "",
  `Approved artworks included: ${campaigns.length}`,
  "",
  ...campaigns.flatMap(c => [
    `## ${c.title}`,
    "",
    `**SEO title:** ${c.seoTitle}`,
    "",
    `**Meta description:** ${c.metaDescription}`,
    "",
    `**Instagram**\n\n${c.channels.instagram}`,
    "",
    `**X**\n\n${c.channels.x}`,
    "",
    `**Pinterest**\n\n${c.channels.pinterest}`,
    "",
    `**Email subject:** ${c.channels.emailSubject}`,
    "",
    "---",
    ""
  ])
].join("\n");
fs.writeFileSync(path.join(outputDir, "campaigns.md"), markdown);
console.log(`Generated ${campaigns.length} approved artwork marketing draft(s) in dist/marketing.`);
