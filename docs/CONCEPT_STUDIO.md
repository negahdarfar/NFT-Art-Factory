# Curated Concept Studio

Run `npm run concept:studio` to turn the collection art-direction file into structured creative briefs and image-generation prompt drafts.

## Inputs

- Template: `workflows/collection-concepts.example.json`
- Optional private override: `workflows/collection-concepts.json` (not committed)

Each concept should define a core question, emotional tension, visual metaphor, composition, material language, palette, narrative and a distinctiveness rule.

## Outputs

- `dist/concept-studio/creative-briefs.json`
- `dist/concept-studio/prompts.md`

The included example series, **The Archive of Silence**, is designed as a thematic companion to **The Witness**, not a repetition of its eye, ornate frame or empty-landscape composition. Its three concepts use different central metaphors: a radio with a living shoot, a floating atlas whose lines become constellations, and an empty chair with an impossible upright shadow.

## Quality rules

The script checks for missing fields, duplicate IDs and repeated exact visual metaphors. It does not score artistic merit, detect all visual similarity, predict demand or generate image files. Prompts include constraints against living-artist imitation, copyrighted characters, logos, signatures and text artifacts.

A concept is not a finished artwork. Review every generated image for visual quality, distinctiveness, provenance and commercial-use rights before owner approval. No API calls, paid services, minting, uploads, listings or public posts are performed.
