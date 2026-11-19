# Marketplace listing preparation

Run `npm run marketplace:pack` to generate:
- `dist/marketplace-drafts/listing-drafts.json` — structured metadata and per-marketplace handoff steps.
- `dist/marketplace-drafts/listing-drafts.csv` — editable bulk review sheet.
- `dist/marketplace-drafts/marketplace-checklist.md` — rights, pricing, wallet and listing verification checklist.

Configure optional `marketplaces.json` from `marketplaces.example.json`. Keep price null until you have researched comparable completed sales and approved a price. Supported preparation adapters currently document OpenSea and Rarible.

## Actual listing boundary

This stage prepares and validates listing information; it does not create an order. OpenSea's current flow returns ordered blockchain actions and a Seaport signing payload; the owner must execute approvals and sign with their wallet before the signed order is submitted. Rarible's SDK sell flow also requires the connected owner's wallet and signature. Do not send private keys or seed phrases to this application.

Official references:
- OpenSea listing actions: https://docs.opensea.io/reference/create_listing_actions
- OpenSea create listing endpoint: https://docs.opensea.io/reference/post_listing
- Rarible list NFT guide: https://docs.rarible.org/reference/list-nft

Marketplace availability, supported chains, fees, creator royalties and API permissions can change. Check these immediately before publication.


## Mandatory creator eligibility and sanctions gate

The creator has stated that they are in Iran. OpenSea's current Platform Terms prohibit use by people located in, ordinarily resident in, or organized under the laws of a U.S.-sanctioned country, and prohibit enabling access for such persons. Do not attempt to bypass this through VPNs, proxy identities, another person's account, or misleading location information. OpenSea must therefore remain blocked for this creator unless their actual legal circumstances change and eligibility is independently confirmed.

Official policy: https://opensea.io/tos

Do not assume another marketplace is available merely because it supports Tezos or accepts crypto. Before selecting objkt or any alternative, review that marketplace's current terms and sanctions/export rules, and verify creator account eligibility, wallet connection, and lawful payout access. Until then, keep the marketplace unset and do not mint, list, or route proceeds through another person.

This is a compliance safeguard, not legal advice. The creator should obtain qualified legal advice for their specific circumstances before any cross-border sale.
