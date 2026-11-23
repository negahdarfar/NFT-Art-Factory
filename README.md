# NFT Art Factory

A draft-first creator workflow for original artwork and AI-generated artwork.

## Creator paths
- **Your own work:** prepare original image files and collection details.
- **AI-created work:** generate drafts through the Cloudflare Workers AI adapter.
- Both paths enter human review before any public upload, mint, or marketplace listing.

## NEXORIUM scheduled AI drafts

The `.github/workflows/daily-ai-drafts.yml` workflow supports a daily scheduled run and manual dispatch. It is **disabled by default** through `workflows/ai-generation.json`. To enable draft generation, first configure `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` as GitHub Actions secrets, review the prompts and output count (1–10), then explicitly set `enabled` to `true`. The workflow runs tests and stores generated images plus the review queue as a temporary Actions artifact for 14 days. It does not upload to public IPFS, mint, list, or sell anything. Cloudflare usage may incur charges or be subject to account limits; verify current pricing/free allowance before enabling.

## Creator Studio
Run `npm run studio` to generate the local-first creator page at `dist/gallery/index.html`. It previews the collection and lets you select an image, enter its title and description, and download an NFT metadata draft.

**Current boundary:** this browser intake is a local prototype. The selected image is not uploaded to a server, and the metadata draft is not automatically added to the collection. It does not mint, list, or initiate a sale.

## Pipeline
1. Prepare original artwork in `assets/`.
2. Describe items in `collection.json`.
3. Validate and build ERC-721-compatible metadata with `npm run build`.
4. Review creator rights, commercial-use permissions, marketplace eligibility, fees and royalties.
5. Upload approved artwork and its finalized token metadata to public IPFS using the Pinata adapter; the resulting image and metadata CIDs are recorded separately.
6. Use marketplace integrations only where official APIs support the selected network and account. Wallet signing and irreversible actions require explicit owner approval.

## Commands
- `npm test` — run automated tests.
- `npm run build` — validate collection and build metadata.
- `npm run gallery` — generate the read-only collection gallery.
- `npm run studio` — generate the interactive local-first creator page.
- `npm run generate` — create AI artwork drafts (requires configured provider secrets and explicit draft-only config).
- `npm run pin:approved` — upload only items that have passed the rights and owner-approval gates.
- `npm run marketplace:pack` — prepare OpenSea/Rarible listing handoff files.
- `npm run market:research` — calculate indicative price ranges from actual completed-sale comparables entered by the operator.
- `npm run sales:report` — validate the sales ledger format and export gross/fees/net reports.

## Market research and sales
Copy `market-comps.example.json` to the private `market-comps.json`, replace the example with real completed sales and source URLs, then run `npm run market:research`. Copy `sales-ledger.example.json` to `sales-ledger.json`, enter actual settlement data, then run `npm run sales:report`. The tools do not scrape live marketplace data and never invent comps or sales. Hash-format validation is not independent on-chain verification. See [market research and sales ledger](docs/MARKET_RESEARCH_AND_SALES.md).

## Tezos / objkt preparation

The marketplace packer supports `objkt` as a **draft-only** target. Add `"objkt"` to the `platforms` array in the private `marketplaces.json` configuration, then run `npm run marketplace:pack`. It creates `dist/marketplace-drafts/objkt-token-metadata-drafts.json` using the Tezos FA2 and TZIP-21 preparation fields. The image CID and creator wallet address are explicit placeholders and must be replaced only with the final public IPFS URI and the owner's verified public Tezos address. Validate the final token metadata with the official [objkt metadata validator](https://objkt-com.github.io/metadata-validator/).

This is not a mint or listing integration: collection deployment, minting, and sale listing remain in objkt's UI and require the owner's wallet review and signature. See [Tezos / objkt handoff](docs/OBJKT_TEZOS_HANDOFF.md).

## Marketplace listing preparation
Run `npm run marketplace:pack` to prepare OpenSea and Rarible listing drafts, a CSV review sheet and a publication checklist. This does not list or mint assets; wallet approval and signatures remain under the owner's control. See [marketplace listing preparation](docs/MARKETPLACE_LISTING_PREP.md).

## Private artwork storage
An optional Cloudflare Worker + private R2 intake API is available for authenticated artwork drafts. See [private intake setup](docs/PRIVATE_INTAKE_API.md). The Creator Studio includes an optional upload panel; it requires your own deployed Worker URL and access token. The token is entered at runtime and is not stored by the page.

## Provider setup
See [secure provider setup](docs/SETUP_SECRETS.md) and [provider/storage notes](docs/PROVIDERS_AND_STORAGE.md).

## Safety
- Never commit seed phrases, private keys, wallet files, or API secrets.
- Public IPFS uploads are public; only upload after confirming ownership and rights.
- No automatic transaction signing is enabled.
- A listing or asking price is not proof of a completed sale; sales must be verified on-chain.
- Provider free tiers have limits and may change.
