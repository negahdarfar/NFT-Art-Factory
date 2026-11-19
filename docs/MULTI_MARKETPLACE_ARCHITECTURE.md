# Multi-market NFT sales architecture

## Product goal

Publish original digital artworks to every marketplace that is technically compatible and legally available to the creator. Sale proceeds must settle on-chain to a creator-controlled wallet, not to an internal custodial balance.

A marketplace is enabled only after its current terms, creator eligibility, supported chain, fees, API permissions, and payout asset have been checked. "Supported" never means a guaranteed sale or guaranteed access from every country.

## Initial marketplace priorities

| Adapter | Network / settlement | Role | Initial status |
|---|---|---|---|
| OpenSea | Supported EVM chains; sale asset depends on listing | First broad EVM marketplace adapter; official SDK/API | Research complete; integration pending |
| Rarible | Ethereum, Base, Polygon, Solana and other currently supported chains; crypto settles to connected wallet | Multi-chain listing adapter | Research complete; integration pending |
| objkt | Tezos; XTZ (some auction flows may use oXTZ) | Art-focused adapter with documented creator flow and direct wallet settlement | Best first end-to-end candidate |
| Zora | EVM-based creator/content coins and NFT tooling | Optional creator-economy channel; not treated as a drop-in conventional NFT marketplace | Separate adapter / later phase |
| Magic Eden | Chain-specific marketplace support | Additional marketplace after compatibility and API review | Later phase |

## Wallet and payout model

- The creator connects their own non-custodial wallet.
- The system reads public addresses and balances only where required.
- The system never asks for, stores, logs, or commits seed phrases or private keys.
- Every mint, listing, approval, cancellation, and transfer requires an explicit wallet signature by the creator.
- Marketplace sale proceeds are paid on-chain according to the marketplace and smart-contract rules. The dashboard records transaction hash, chain, token, gross amount, fees, royalties, and net amount.
- No automatic conversion to fiat is promised. Conversion depends on a separate lawful exchange or payment provider and its country/identity rules.

## Adapter contract

Each marketplace adapter must implement:
- `capabilities()`: supported chains, standards, listing types, currencies, API availability, and geographic/compliance caveats.
- `validateArtwork(input)`: metadata, media, rights, and collection checks.
- `prepareMint(input)`: prepare transaction only; do not sign or broadcast.
- `prepareListing(input)`: prepare listing/order only; do not sign or broadcast.
- `getListings(creatorAddress)`: retrieve known listings.
- `getSales(creatorAddress, cursor?)`: retrieve sales and on-chain settlement data.
- `getFees(input)`: report marketplace, royalty, and network fees before confirmation.

Adapters must report unsupported operations explicitly; never simulate a successful listing.

## Cross-market compatibility

One NFT contract is not automatically listable everywhere. Chain, token standard, marketplace protocol, royalty enforcement, order format, and API permissions can differ. The system must run a compatibility check per marketplace and avoid duplicate or conflicting listings.

For example, OpenSea documents that its ERC721-C / ERC1155-C creator-earnings enforcement is supported on OpenSea and marketplaces powered by LimitBreak's Payment Processor, currently including Magic Eden. Do not enable that enforcement blindly if broad marketplace compatibility is more important.

## Security and compliance gates

- Marketplace terms and sanctions / restricted-jurisdiction rules must be checked for the creator's actual legal residence and activity.
- Do not bypass geographic controls, KYC, sanctions screening, API restrictions, or marketplace access controls.
- Never store secrets in Git, frontend code, logs, issue comments, or workflow artifacts.
- API keys, if needed, belong in GitHub Actions secrets or a server-side secret manager, with least-privilege access.
- Wallet signing remains user-controlled. No unattended private-key signing.
- Keep an audit log of user-approved actions and transaction hashes.

## Phased delivery

1. **Foundation:** artwork validation, metadata, content hashes, wallet-address configuration, chain/marketplace capability registry.
2. **First live test:** objkt / Tezos test environment and then a low-cost creator-approved mainnet listing.
3. **EVM adapter:** OpenSea API/SDK, then Rarible where its current API and terms permit.
4. **Creator channels:** Zora integration as a separate content-coin/rewards module.
5. **Expansion:** Magic Eden and other compatible marketplaces, selected by active API support and actual creator access.
6. **Operations:** sales indexer, crypto revenue ledger, fee/net proceeds report, alerts, and export.

## Important reality check

The software can automate preparation, metadata, eligibility checks, monitoring, and reporting. It cannot guarantee buyers, sales, market liquidity, royalty enforcement on every secondary sale, or unrestricted access to every marketplace.
