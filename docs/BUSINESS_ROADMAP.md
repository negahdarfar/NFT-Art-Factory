# NFT Art Factory — Business Roadmap

## North-star objective
Build a sustainable, multi-marketplace digital-art business with a long-term aspirational target of USD 1,000,000 in cumulative verified net receipts to the creator's wallet. This is a goal, not a forecast or guarantee. Track gross sales, marketplace fees, network fees, refunds, taxes, and net wallet receipts separately.

## Operating principles
- Never promise sales, returns, or a valuation.
- Publish only artwork whose creator rights and commercial-use permissions are documented.
- Never store wallet seed phrases, private keys, recovery codes, or signing secrets in this repository.
- Keep minting, listing, transfers, and public promotion behind explicit creator approval.
- Verify completed sales from marketplace records and on-chain transaction data; a listing or asking price is not a sale.
- Check marketplace availability, identity/KYC rules, payment rails, and applicable legal restrictions before choosing a platform. Never evade geographic or sanctions controls.

## Revenue channels to test
1. Original 1/1 artworks and small curated collections.
2. Themed limited editions with clear edition sizes and consistent quality.
3. Commissioned digital artwork and licensing where rights are explicit.
4. Carefully curated collaborations with documented splits and permissions.
5. Secondary-market royalties only where the marketplace and chain actually support and enforce them; never treat royalties as guaranteed income.

## Delivery phases
### Phase 0 — Foundation and asset integrity
- Confirm repository structure, metadata, rights records, and original image binaries.
- Make build and tests pass with the actual artwork files.
- Keep a single source of truth for each artwork's image path and publication status.

### Phase 1 — First verified release
- Finalize The Witness — Genesis #001 metadata, edition size, price, and royalty only after reviewing real market comparables.
- Confirm wallet/network compatibility and platform eligibility.
- Prepare listing; creator reviews and signs any mint/list transaction personally.
- Verify the minted token and public listing URL before announcing it.

### Phase 2 — Repeatable collection pipeline
- Create a quality-controlled pipeline for concept, creation, metadata, rights review, preview, release pack, and sales tracking.
- Produce a small coherent collection rather than flooding marketplaces with low-quality items.
- Measure views, favorites, conversion, sale price, fees, and net receipts.

### Phase 3 — Audience and distribution
- Publish consistent English-first marketing with Persian support where useful.
- Build an owned portfolio site and mailing list where legally and technically available.
- Test marketplace discovery, social channels, collector communities, and collaborations.
- Keep all posts human-approved until reliability and platform rules are established.

### Phase 4 — Scale based on evidence
- Expand formats and marketplaces only after verified sales and positive unit economics.
- Reinvest only a pre-agreed portion of actual net proceeds.
- Review monthly performance and stop channels that consume time or fees without measurable results.

## KPI dashboard
- Artworks created / rights-cleared / release-ready / minted / listed
- Verified primary sales and secondary sales
- Gross sales (USD equivalent)
- Marketplace + network fees
- Refunds / chargebacks / taxes (where applicable)
- Net amount received in wallet (asset, quantity, transaction hash, date)
- Audience metrics and conversion rate
- Cost and time per released artwork

## Current status — 2026-11-19
- Repository: public, default branch `main`.
- The Witness — Genesis #001: metadata and launch copy exist; minting and listing are not confirmed.
- Original image binary is present in the repository root as `The-witness-001.jpg` (2,153,115 bytes). Metadata path must match this exact repository path before build/release.
- An `assets/artworks/.gitkeep` placeholder directory also exists; it does not contain the original image.
- Next action: align the artwork metadata with the verified binary path, run tests/build, then review platform and wallet eligibility before any on-chain action.
