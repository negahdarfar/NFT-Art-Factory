# Artwork Quality and Provenance Gate

Run `npm run quality:artwork` before preparing an artwork for a marketplace. The command writes `dist/quality-review/report.json`.

## What it checks

- Every collection item points to a real file inside `assets/`; path traversal outside that directory is rejected.
- Image file signatures and basic dimensions are parsed for PNG, JPEG, WebP and GIF. Renaming a text file to `.png` does not make it an image.
- SHA-256 exact-byte duplicates are flagged. This is only exact duplicate detection, not perceptual similarity, plagiarism detection or proof of originality.
- Low-resolution images, thin descriptions and sparse metadata are flagged for improvement.
- Human review is required for rights confirmation, owner approval and provenance. The audit never infers commercial rights from a tool or model name.

## Strict mode

Use `node scripts/artwork-quality.mjs --strict` as a local release gate. Strict mode exits unsuccessfully when the report is not fully passed. The default command is suitable for CI previews: it reports human-review items without pretending that an example collection is approved.

Set `NFT_MIN_IMAGE_DIMENSION` to change the minimum recommended pixel dimension (default: 512). This is a technical threshold, not an artistic-quality score.

## Required human evidence before listing

For each work, maintain a review record containing:
- explicit owner approval and rights confirmation;
- a plain-language rights basis (created by the owner, commissioned with documented rights, or a license that explicitly permits the intended commercial use);
- the actual source/process and model or tools used;
- any model/provider license terms relevant to commercial use;
- a final visual review for composition, artifacts, legibility and distinctiveness.

Do not add unsupported claims such as "copyright cleared", "unique worldwide" or "AI-generated with commercial rights". A passing image check is not legal advice, a market-demand forecast or a marketplace acceptance guarantee.

The gate is draft-only. It does not mint, upload to IPFS, publish, list, message collectors or move funds.
