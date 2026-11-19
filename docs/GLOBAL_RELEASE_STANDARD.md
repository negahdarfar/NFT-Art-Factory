# Global Release Standard

This document defines the minimum release controls for every artwork and collection in NFT Art Factory. It is a practical operating standard, not legal, tax, investment or platform advice.

## Release states
1. **Concept** — idea and art direction only.
2. **Generated** — one or more candidate files exist.
3. **Curated** — a human has reviewed composition and craft.
4. **Rights review** — source materials, tool terms, licenses and commercial-use basis are documented.
5. **Owner approved** — the creator approves the exact final asset and metadata.
6. **Technically ready** — file integrity, metadata, provenance and delivery checks pass.
7. **Market eligible** — current platform, geography, identity, payout, chain and fee requirements have been checked.
8. **Release authorized** — owner explicitly approves the specific upload, mint, listing or publication action.
9. **Live / settled** — the platform or chain provides verifiable evidence; records are archived.

A work may not skip a state. “Approved for marketing drafts” is not approval to publish. “Ready” is not authorization to transact.

## Mandatory release gates

| Gate | Required evidence | Block condition |
|---|---|---|
| Asset integrity | Real master file, detected format, dimensions, SHA-256 | Missing, corrupt or unexpected file |
| Provenance | Creation date, tools, source assets and material changes | Unknown or misleading origin |
| Rights | Documented rights basis for every material input | Unclear ownership, license or commercial-use terms |
| Human curation | Completed review notes and accepted final version | Unreviewed or materially defective work |
| Owner approval | Explicit approval of exact asset and metadata | Pending or ambiguous approval |
| Metadata | Name, description, attributes, image reference and stable ID | Missing or contradictory fields |
| Market eligibility | Current official terms, geographic eligibility, KYC, payout and supported chain | Ineligible or unverified |
| Cost review | Network gas, marketplace fees, storage/pinning and payout costs | Unknown cost or paid service without approval |
| Transaction authorization | Explicit action-specific approval by owner | No approval for this exact action |
| Evidence archive | Transaction/listing URL, timestamp, fees and settlement evidence | No verifiable record |

## Zero-budget policy
- Prefer free and open-source workflows; verify current free-tier limits before depending on them.
- No paid API, subscription, advertising, gas sponsorship or automatic top-up.
- No fallback to a paid provider.
- If a required operation has a cost, pause and disclose the exact cost before proceeding.
- Do not imply that a marketplace is free merely because listing is free; inspect minting, network, service and payout fees.

## Marketplace and jurisdiction review
Before any platform-specific recommendation, check official current documentation for:
- Supported country and account eligibility.
- Identity verification and beneficial-owner requirements.
- Sanctions and restricted-person policies.
- Supported network, token standard and custody model.
- Listing, minting, cancellation, royalty and payout fees.
- Tax reporting and record-keeping obligations relevant to the creator.

Never conceal location, misstate identity, bypass KYC, route around sanctions or use another person's account to evade restrictions. If eligibility is uncertain, stop and request qualified advice.

## Wallet and transaction security
- Never request or store seed phrases, private keys, recovery codes or wallet export files.
- Use the wallet's official connection and signing flow.
- The owner must inspect and sign every transaction.
- Explain network, contract, token, quantity, price, fees and irreversibility before signature.
- Do not sign blind approvals or unlimited token permissions.
- A connected wallet is not proof of ownership of an artwork or permission to transact.

## Marketplace integrity
Prohibited: wash trading, fake volume, fake bids, purchased engagement, spam DMs, fabricated scarcity, fake endorsements, undisclosed paid promotion, misleading earnings claims and false sale history.

Use real completed sales—not asking prices—to inform pricing. Clearly distinguish gross sale value, platform fees, network fees, refunds, taxes and net proceeds.

## Release evidence
For each live item, archive:
- Final asset checksum and exact metadata.
- Owner approval record and timestamp.
- Official platform eligibility and fee references checked.
- Network, contract and token identifier where applicable.
- Listing URL and transaction hash.
- Gross proceeds, fees, net proceeds and settlement date.
- Corrections, takedowns, disputes and support correspondence.

## Stop conditions
Any unresolved rights question, eligibility issue, unexpected fee, compromised credential, suspicious contract, metadata mismatch or unclear owner instruction is an immediate stop. Preserve evidence and do not retry through an alternate route until reviewed.
