# Autonomous NFT Production and Sales System

## Objective
Operate an AI-assisted art business with minimal day-to-day creator involvement, aiming toward USD 1,000,000 in cumulative net wallet receipts. This is aspirational and not a forecast or guarantee.

## What can run unattended
- Trend and collector-demand research from permitted public sources.
- Concept generation and prompt variation.
- Draft image generation, metadata, collection pages, and marketing copy.
- Automated similarity screening against the project's own catalog, perceptual hashes, and near-duplicate embeddings.
- Technical checks: dimensions, format, corruption, metadata completeness, rights declarations, and collection consistency.
- Draft scheduling, analytics ingestion, sales reconciliation, and wallet receipt reporting.
- Alerts for failed jobs, suspicious requests, low balances, and new verified sales.

## Quality and originality gates
Every candidate receives a scorecard:
1. Visual craft and composition.
2. Originality versus the existing catalog (hash + perceptual similarity + embedding similarity).
3. Coherence with the collection's artistic thesis.
4. Technical quality and artifact checks.
5. Clear title, story, traits, and provenance.
6. Rights and training/source-policy review.
7. Market fit supported by evidence, not hype.

Candidates below configurable thresholds are rejected or sent back for another concept. Similarity screening reduces repetition but cannot prove global uniqueness or guarantee non-infringement. Human review remains required for rights, final selection, and publication until the process has been validated.

## Sales and wallet flow
1. Research current marketplace access, fees, API terms, supported networks, and creator eligibility.
2. Prepare listing metadata and estimate fees.
3. The creator connects their own wallet through a secure wallet interface.
4. Mint/list transactions are prepared by the service, but signed by the creator in their wallet.
5. Monitor marketplace events and on-chain settlement.
6. Record transaction hash, token, gross sale, fees, royalties, and net wallet receipt.
7. Reconcile the payout address against the creator's public wallet address.

Never request or store a seed phrase/private key. Never silently sign transactions. A marketplace listing is not a sale; a displayed asking price is not income. Sales count only after settlement is confirmed on-chain.

## Autonomous operating modes
- **Mode A — Draft factory:** fully automatic generation and screening; no public publishing.
- **Mode B — Approval queue:** creator approves each artwork and each wallet transaction.
- **Mode C — Bounded automation:** only after a separate explicit opt-in, automate low-risk publishing actions within strict spend, daily volume, marketplace, and wallet limits. Wallet signing and asset transfers remain creator-controlled. No unrestricted autonomous spending.

## Required production services
- Image-generation provider with commercial-use terms reviewed.
- Private job queue and secure object storage for drafts.
- Similarity/index service for catalog-wide duplicate detection.
- Metadata and provenance database.
- Marketplace adapters with live capability/fee checks.
- Wallet connection and transaction preparation interface.
- Chain indexer / explorer verification.
- Monitoring, retry, audit log, and backup.

## Initial implementation order
1. Build prompt/concept engine and collection style bible.
2. Add catalog fingerprinting and similarity rejection.
3. Add automated technical and artistic scorecards.
4. Add a draft review dashboard with approve/reject/rework.
5. Add marketplace capability and fee checks.
6. Add secure wallet-connect and transaction preparation (no private keys on server).
7. Add chain-confirmed sales indexer and wallet revenue dashboard.
8. Add marketing calendar and analytics feedback loop.

## Commercial reality and risk
No model can reliably predict what will sell, guarantee collector demand, or guarantee a million-dollar result. AI-generated content may be restricted by marketplace rules, model terms, copyright, publicity rights, or local law. Verify current terms and legal access before publishing. Do not bypass geographic, sanctions, identity, or platform restrictions.
