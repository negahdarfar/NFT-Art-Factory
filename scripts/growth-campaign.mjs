import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const collectionPath = path.join(root, "collection.json");
const reviewPath = path.join(root, "reviews", "review-status.json");
const reviewExamplePath = path.join(root, "reviews", "review-status.example.json");
const outputDir = path.join(root, "dist", "growth-campaign");
const read = (p, fallback) => fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf8")) : fallback;
const slug = s => String(s || "artwork").normalize("NFKD").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,60) || "artwork";
const csv = rows => rows.map(row => row.map(v => '"' + String(v ?? "").replaceAll('"','""') + '"').join(",")).join("\n") + "\n";

if (!fs.existsSync(collectionPath)) throw new Error("collection.json is missing; copy collection.example.json first.");
const collection = read(collectionPath, {});
if (!Array.isArray(collection.items)) throw new Error("collection.items must be an array.");
const reviews = read(reviewPath, read(reviewExamplePath, {}));
const eligible = collection.items.filter(item => {
  const r = reviews[item.name] || {};
  return r.status === "approved" && r.rights_confirmed === true && r.owner_approved === true;
});
const days = [
 ["D-7","Reveal the central question","Publish a detail crop and ask one open-ended question about the artwork. No price or sale claim."],
 ["D-6","Artist process","Share a real process note: concept, composition, tools and human decisions. Never invent process details."],
 ["D-5","Meaning and interpretation","Publish a short curator-style interpretation and invite thoughtful responses."],
 ["D-4","Collector education","Explain what the token represents, edition mechanics, chain, fees and what ownership does and does not include."],
 ["D-3","Close-up / visual detail","Show a different crop or a properly labelled detail; link back to the full artwork page if live."],
 ["D-2","Community conversation","Answer genuine questions, visit relevant artist communities and offer thoughtful comments; no mass DMs or engagement pods."],
 ["D-1","Release information","Only if a verified listing exists: announce exact release time, supply, price, chain, fees and verified URL. Otherwise publish a waitlist-free preview."],
 ["D0","Release day","Publish the approved launch post with the verified marketplace URL. Verify listing status before linking."],
 ["D+1","Collector FAQ","Answer recurring questions on provenance, file, edition, royalties, fees and wallet safety."],
 ["D+2","Artwork story","Publish a second interpretation or a short narrated visual story, not a repeated sales pitch."],
 ["D+3","Artist-to-artist outreach","Contact a small number of relevant artists/curators with personalized, respectful messages. No automated spam."],
 ["D+4","Behind-the-art feature","Show an authentic detail, alternate crop or studio note that adds context."],
 ["D+5","Performance review","Review qualified clicks, saves, replies, collector questions and verified sales; do not optimize on likes alone."],
 ["D+7","Decision gate","Continue, revise the story/offer, or pause. Do not mint more editions just to create activity."]
];
const campaign = eligible.map(item => {
 const title=String(item.name || "Untitled").trim();
 const desc=String(item.description || "").trim();
 const itemSlug=slug(title);
 const traits=Array.isArray(item.attributes)?item.attributes.map(a=>String(a.value)).filter(Boolean):[];
 const story = title.toLowerCase().includes("witness")
 ? "A silent witness to an empty world. What does it mean to observe when there is no one left to see?"
 : "An original artwork with a story worth discovering. What detail do you notice first?";
 const url="{{VERIFIED_LISTING_URL_AFTER_PUBLICATION}}";
 return {
  slug:itemSlug,title,description:desc,storyHook:story,verifiedListingUrlPlaceholder:url,
  audienceHypothesis:"Digital-art collectors interested in conceptual and surreal visual storytelling; validate through actual conversations and qualified visits.",
  positioning:"Artist-led original digital artwork; describe the work honestly and avoid investment or return claims.",
  contentPillars:["artwork meaning","artist process (only verified facts)","visual details","collector education","community conversation"],
  launchPostEN:title+"\n\n"+story+"\n\nAn original work from "+collection.name+".\n\nExplore: "+url+"\n\n#DigitalArt #SurrealArt #ConceptualArt",
  launchPostFA:title+" — اثری درباره نگاه، معنا و تجربهٔ انسانی.\n\nاین اثر بخشی از مجموعهٔ "+collection.name+" است.\n\nمشاهده اثر: "+url,
  seo:{title:(title+" | "+collection.name).slice(0,70),description:desc.slice(0,155),keywords:[...new Set(["original digital art","conceptual art","surreal art",...traits.map(slug)])].slice(0,12)},
  calendar:days.map(([day,theme,action])=>({day,theme,action})),
  outreachRules:["Personalize every message and contact only relevant people.","Never buy followers, likes, comments or fake volume.","Never imply guaranteed appreciation, profit or investment return.","Do not use a listing URL until it has been independently verified."],
  metricsTemplate:["qualified_profile_visits","verified_listing_clicks","saves_or_watchlist_adds","substantive_replies","collector_questions","commission_inquiries","completed_sales","gross_proceeds","marketplace_fees","network_fees","verified_net_receipts"]
 };
});
fs.rmSync(outputDir,{recursive:true,force:true});fs.mkdirSync(outputDir,{recursive:true});
const report={generatedAt:new Date().toISOString(),mode:"owner-approved drafts only",eligibleArtworkCount:campaign.length,campaigns:campaign,warnings:["No social posts, emails, DMs, minting, listings or payments are executed.","A verified public listing URL is required before release-day sales copy can be used.","A calendar is a suggested sequence, not a claim that an audience or demand exists.","Use real artwork/process facts only; no fabricated scarcity, testimonials or sales." ]};
fs.writeFileSync(path.join(outputDir,"campaigns.json"),JSON.stringify(report,null,2)+"\n");
fs.writeFileSync(path.join(outputDir,"campaign-calendar.csv"),csv([["artwork","day","theme","action"],...campaign.flatMap(c=>c.calendar.map(d=>[c.title,d.day,d.theme,d.action]))]));
fs.writeFileSync(path.join(outputDir,"metrics-tracker.csv"),csv([["artwork","date","metric","value","source_url","notes"],...campaign.flatMap(c=>c.metricsTemplate.map(m=>[c.title,"",m,"","",""]))]));
fs.writeFileSync(path.join(outputDir,"launch-copy.md"),campaign.map(c=>"# "+c.title+"\n\n## English\n\n"+c.launchPostEN+"\n\n## فارسی\n\n"+c.launchPostFA+"\n\n## SEO\n\nTitle: "+c.seo.title+"\n\nDescription: "+c.seo.description+"\n\nKeywords: "+c.seo.keywords.join(", ")+"\n").join("\n---\n\n"));
console.log("Growth campaign prepared for "+campaign.length+" owner-approved artwork(s). Draft-only; nothing was published.");
