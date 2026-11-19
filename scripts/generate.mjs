import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { CloudflareWorkersAI } from "../adapters/cloudflare-workers-ai.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const configPath = path.join(root, "workflows", "ai-generation.json");
const examplePath = path.join(root, "workflows", "ai-generation.example.json");
const config = JSON.parse(fs.readFileSync(fs.existsSync(configPath) ? configPath : examplePath, "utf8"));
if (config.enabled !== true) throw new Error("AI generation is disabled. Copy ai-generation.example.json to ai-generation.json and explicitly set enabled=true.");
if (config.publish_mode !== "draft_only") throw new Error("AI generation must remain draft_only.");
const count = Math.min(Math.max(Number(config.output?.count || 1), 1), 2);
const provider = new CloudflareWorkersAI();
const outputDir = path.join(root, "assets", "ai-generated");
fs.mkdirSync(outputDir, { recursive: true });
const queuePath = path.join(root, "reviews", "ai-generation-queue.json");
const queue = fs.existsSync(queuePath) ? JSON.parse(fs.readFileSync(queuePath, "utf8")) : [];
for (let i = 0; i < count; i++) {
  const result = await provider.generate({
    prompt: config.prompt,
    negativePrompt: config.negative_prompt || "",
    width: config.output?.width || 1024,
    height: config.output?.height || 1024
  });
  const id = `ai-${Date.now()}-${i + 1}`;
  const filename = `${id}.png`;
  fs.writeFileSync(path.join(outputDir, filename), result.bytes, { flag: "wx" });
  queue.push({
    id, filename: `ai-generated/${filename}`, provider: result.provider, model: result.model,
    created_at: new Date().toISOString(), status: "pending_human_review",
    rights_confirmed: false, owner_approved: false, publish_mode: "draft_only",
    prompt: config.prompt, metadata_tags: config.metadata?.tags || []
  });
  console.log(`Generated draft: assets/ai-generated/${filename}`);
}
fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2) + "\n");
console.log("Generation complete. Drafts are not minted, listed, or uploaded to public IPFS.");
