import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { CloudflareWorkersAI } from "../adapters/cloudflare-workers-ai.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const configPath = path.join(root, "workflows", "ai-generation.json");
const examplePath = path.join(root, "workflows", "ai-generation.example.json");
const config = JSON.parse(fs.readFileSync(fs.existsSync(configPath) ? configPath : examplePath, "utf8"));
if (config.enabled !== true) throw new Error("AI generation is disabled. Copy ai-generation.example.json to ai-generation.json and explicitly set enabled=true.");
if (config.publish_mode !== "draft_only") throw new Error("AI generation must remain draft_only.");
const requestedCount = Number(config.output?.count ?? 1);
if (!Number.isInteger(requestedCount) || requestedCount < 1 || requestedCount > 10) {
  throw new Error("output.count must be an integer between 1 and 10.");
}
const count = requestedCount;
const promptVariants = Array.isArray(config.prompt_variations) ? config.prompt_variations.filter(x => typeof x === "string" && x.trim()) : [];
const provider = new CloudflareWorkersAI();
const outputDir = path.join(root, "assets", "ai-generated");
fs.mkdirSync(outputDir, { recursive: true });
const queuePath = path.join(root, "reviews", "ai-generation-queue.json");
const queue = fs.existsSync(queuePath) ? JSON.parse(fs.readFileSync(queuePath, "utf8")) : [];
for (let i = 0; i < count; i++) {
  const variant = promptVariants.length ? promptVariants[i % promptVariants.length] : "";
  const prompt = [config.prompt, variant, `Create a distinct original composition, variation ${i + 1} of ${count}. Avoid repeating previous compositions.`].filter(Boolean).join("\\n\\n");
  const result = await provider.generate({
    prompt,
    negativePrompt: config.negative_prompt || "",
    width: config.output?.width || 1024,
    height: config.output?.height || 1024
  });
  const id = `ai-${new Date().toISOString().replace(/[-:.TZ]/g, "")}-${crypto.randomUUID().slice(0, 8)}-${i + 1}`;
  const filename = `${id}.png`;
  fs.writeFileSync(path.join(outputDir, filename), result.bytes, { flag: "wx" });
  queue.push({
    id, filename: `ai-generated/${filename}`, provider: result.provider, model: result.model,
    created_at: new Date().toISOString(), status: "pending_human_review",
    rights_confirmed: false, owner_approved: false, publish_mode: "draft_only",
    prompt, metadata_tags: config.metadata?.tags || []
  });
  console.log(`Generated draft: assets/ai-generated/${filename}`);
}
fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2) + "\n");
console.log(`Generation complete: ${count} draft(s). Drafts are not minted, listed, or uploaded to public IPFS.`);
