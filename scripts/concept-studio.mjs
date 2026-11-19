import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const configPath = path.join(root, "workflows", "collection-concepts.json");
const examplePath = path.join(root, "workflows", "collection-concepts.example.json");

export function curateConcepts(config) {
  const issues = [];
  const concepts = Array.isArray(config?.concepts) ? config.concepts : [];
  if (!String(config?.collection_title || "").trim()) issues.push("collection_title is required");
  if (concepts.length < 2) issues.push("At least two concepts are required to assess series variety");
  const ids = new Set();
  const metaphors = new Map();
  const normalized = value => String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const briefs = concepts.map((concept, index) => {
    const id = String(concept?.id || "").trim();
    const title = String(concept?.working_title || "").trim();
    const metaphor = String(concept?.visual_metaphor || "").trim();
    if (!id || ids.has(id)) issues.push(`Concept ${index + 1}: missing or duplicate id`);
    ids.add(id);
    if (!title) issues.push(`Concept ${index + 1}: working_title is required`);
    if (!metaphor) issues.push(`Concept ${index + 1}: visual_metaphor is required`);
    const key = normalized(metaphor);
    if (key && metaphors.has(key)) issues.push(`Concept ${title}: repeats the visual metaphor used by ${metaphors.get(key)}`);
    if (key) metaphors.set(key, title);
    const required = ["core_question","emotional_tension","composition","material_language","narrative","distinctiveness_rule"];
    for (const field of required) if (!String(concept?.[field] || "").trim()) issues.push(`Concept ${title || index + 1}: ${field} is required`);
    const palette = Array.isArray(concept?.palette) ? concept.palette : [];
    const guardrails = Array.isArray(config?.creative_guardrails) ? config.creative_guardrails : [];
    const prompt = [
      `Create an original fine-art surreal conceptual artwork titled "${title}".`,
      `Core question: ${concept.core_question}`,
      `Emotional tension: ${concept.emotional_tension}`,
      `Central visual metaphor: ${metaphor}`,
      `Composition: ${concept.composition}`,
      `Material language: ${concept.material_language}`,
      `Palette: ${palette.join(", ")}.`,
      `Narrative: ${concept.narrative}`,
      `Distinctiveness: ${concept.distinctiveness_rule}`,
      "Premium museum-grade art direction, deliberate focal hierarchy, refined texture, coherent lighting, controlled negative space, strong silhouette, visually readable at thumbnail size.",
      "No text, lettering, logo, watermark, signature, border, copied composition, copyrighted character, celebrity likeness or imitation of a living artist."
    ].join("\\n\\n");
    return {
      sequence: index + 1,
      id,
      working_title: title,
      core_question: concept.core_question,
      emotional_tension: concept.emotional_tension,
      visual_metaphor: metaphor,
      composition: concept.composition,
      material_language: concept.material_language,
      palette,
      narrative: concept.narrative,
      distinctiveness_rule: concept.distinctiveness_rule,
      audience_hypothesis: "Hypothesis only: collectors interested in symbolic surrealism and narrative-led digital art. Validate through sourced conversations and qualified engagement.",
      generation_prompt: prompt,
      negative_prompt: "watermark, signature, logo, text, typography, border, low resolution, malformed objects, incoherent perspective, clutter, imitation, copyrighted character",
      human_review_checklist: [
        "Does the final image communicate one clear visual metaphor?",
        "Is the focal point recognizable at thumbnail size?",
        "Is the composition distinct from the other works in this series?",
        "Are artifacts, accidental text, logos and watermarks absent?",
        "Are the source, model/tool and commercial-use terms documented?",
        "Has the owner approved the exact final image and its rights record?"
      ],
      creative_guardrails: guardrails
    };
  });
  return { issues, briefs };
}

function main() {
  const source = fs.existsSync(configPath) ? configPath : examplePath;
  const config = JSON.parse(fs.readFileSync(source, "utf8"));
  const result = curateConcepts(config);
  const report = {
    generatedAt: new Date().toISOString(),
    collection_title: config.collection_title,
    collection_thesis: config.collection_thesis,
    relationship_to_genesis: config.relationship_to_genesis,
    mode: "creative briefs only; no images generated",
    status: result.issues.length ? "needs_revision" : "ready_for_human_art_direction_review",
    issues: result.issues,
    concept_count: result.briefs.length,
    briefs: result.briefs,
    limitations: [
      "These are creative briefs and prompt drafts, not finished artworks.",
      "Audience fit and demand are hypotheses, not measured market signals.",
      "No living artist, copyrighted character or existing artwork should be imitated.",
      "Generation, rights clearance, final selection, minting and publication remain separate gated steps."
    ]
  };
  const out = path.join(root, "dist", "concept-studio");
  fs.mkdirSync(out, { recursive: true });
  fs.writeFileSync(path.join(out, "creative-briefs.json"), JSON.stringify(report, null, 2) + "\\n");
  fs.writeFileSync(path.join(out, "prompts.md"), result.briefs.map(b => `# ${b.sequence}. ${b.working_title}\n\n${b.generation_prompt}\n\n**Negative prompt:** ${b.negative_prompt}\n`).join("\n---\n\n"));
  console.log(`Concept studio: ${report.status} — ${report.concept_count} brief(s), ${result.issues.length} issue(s).`);
  for (const issue of result.issues) console.log("REVIEW " + issue);
  if (result.issues.length) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === new URL("file://" + path.resolve(process.argv[1])).href) main();
