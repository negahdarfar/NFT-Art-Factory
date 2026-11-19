# AI generation and IPFS storage adapters

## Image generation: Cloudflare Workers AI

The first concrete adapter uses the official Workers AI REST API and defaults to `@cf/black-forest-labs/flux-1-schnell`. Current Cloudflare documentation lists FLUX.1 [schnell] as text-to-image. Workers AI includes 10,000 Neurons/day on the Free Workers plan; paid usage above the free allocation is billed, and some models may have additional plan restrictions. Check the current model catalog and pricing before production use.

Required server-side environment variables:
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`
- optional `CLOUDFLARE_IMAGE_MODEL`

Never place these values in source files, browser code, collection metadata, or GitHub commits. Review the model and Cloudflare terms for commercial use before selling generated outputs.

To generate drafts:
1. Copy `workflows/ai-generation.example.json` to `workflows/ai-generation.json`.
2. Set `enabled` to `true`; keep `publish_mode` as `draft_only`.
3. Configure the secrets in the server environment.
4. Run `npm run generate`.

The command limits each run to two images, writes files under `assets/ai-generated/`, and records them in `reviews/ai-generation-queue.json`. It does not add them to the collection, publish them, or mint tokens. Human review and rights approval remain mandatory.

## IPFS: Pinata

The first storage adapter uses Pinata's documented public file upload endpoint (`https://uploads.pinata.cloud/v3/files`). The current Free plan lists 1GB storage, 10GB bandwidth, one gateway, and a 500-file limit. These are account plan limits, not permanent guarantees.

Required server-side environment variable:
- `PINATA_JWT`

To pin an artwork, it must already be in `collection.json` and its entry in `reviews/review-status.json` must explicitly set both `rights_confirmed: true` and `owner_approved: true`. Then run `npm run pin:approved -- "Artwork title"`. This uploads the file to public IPFS, so do not approve private or unreviewed material. The command records the returned CID.

Pinata credentials must never be committed. Public IPFS content can be copied and remain accessible beyond the lifetime of the account; uploading is not a reversible private draft operation.

## Not yet implemented

- automatic AI title/description generation;
- automatic collection metadata CID replacement and batch upload;
- public gallery hosting/authentication;
- marketplace mint/list integrations;
- wallet connection and transaction signing;
- on-chain sales and royalty reconciliation.

Those steps remain separate from image generation and storage, and must not be described as active until tested end-to-end.
