# Creator workflows: upload your own art + AI-generated art

The factory supports two equal input routes. Both converge into one review, metadata, storage, marketplace-eligibility, listing, and sales pipeline.

## Route A — creator uploads an existing artwork
1. Upload the original image/video/3D asset through the future dashboard (or place it in `assets/` for the current repository MVP).
2. Enter title and a short description, or request AI-assisted copywriting.
3. Confirm authorship or licensing rights. The system records this confirmation; it does not prove ownership.
4. Generate metadata, tags, alt text, a collector-facing description, and a suggested price range.
5. Calculate storage/network/marketplace fees and estimated net proceeds.
6. Preview the work and approve it for mint/list preparation.
7. Connect a supported wallet and sign the mint/list transaction yourself.
8. Track the listing, sale, transaction hash, fees, and crypto received.

## Route B — the system creates artwork
1. Select a generation provider/model that is available, affordable, and permitted for the creator's use.
2. Generate original candidates from a prompt and optional style/format controls.
3. Run technical checks (file opens, dimensions, format, size, metadata) and similarity/safety review.
4. Generate title, description, attributes, tags, alt text, and promotional copy.
5. Keep candidates in a draft gallery. The owner selects and approves the final work.
6. Continue through the same wallet, marketplace, listing, and sales pipeline as Route A.

## Automation boundaries
- Automatic: file validation, metadata drafting, image resizing/thumbnail creation, hash generation, marketplace capability checks, fee estimates, draft creation, listing/sale monitoring where APIs allow.
- Requires a creator decision: rights confirmation, final artwork approval, price approval, marketplace selection when terms differ.
- Requires wallet signature: minting, token approvals, listing orders, cancellations, and transfers.
- Never: unattended private-key custody, fabricated sales, automatic uploads of unreviewed copyrighted material, or bypassing marketplace access restrictions.

## Provider architecture
Image generation is provider-neutral. A provider adapter must expose:
- `generate({ prompt, negativePrompt, width, height, count })`
- `getJob(jobId)` for asynchronous providers
- `downloadResult(assetId)` returning an image file or secure URL
- `usageCost(jobId)` where supported

Provider selection must compare free quota, commercial-use terms, output rights, API availability, rate limits, and regional access. Do not promise unlimited free generation. Keep provider keys in server-side secrets only.

## Publication modes
- `draft_only` (default): prepare everything but publish nothing.
- `approval_required`: queue a transaction/listing for the creator's explicit wallet signature.
- `auto_publish`: only for non-financial promotional metadata or channels where platform terms allow it; never bypass a required wallet signature or human rights confirmation.

## Pricing
The system may suggest a range using comparable completed sales where reliable data is available. Asking prices are not comparable sales. Always show currency, chain, network fee, marketplace fee, royalty, and estimated net proceeds before the owner signs.
