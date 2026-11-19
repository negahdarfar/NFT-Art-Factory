# 90-Day NFT Growth & Revenue Experiment Plan

**Objective:** pursue the user's aspirational USD 1,000,000 gross-sales target within 90 days while reporting verified net wallet receipts separately. This is an aggressive target, not a forecast or guarantee. No system can guarantee buyers, marketplace discovery, or sale prices.

## Evidence-led principles

1. **Build a recognizable body of work, not a mass-upload bot.** OpenSea's published Creature World case study reports 38,045 mints and about $2.6M GMV for the 24-hour Crowd release; the project had an established creative universe, original art, timing, community engagement, and platform support. This is an exceptional historical case, not a reproducible baseline.
2. **Community before public mint.** Rarible's 2025 Composables case study reports 4,500 allowlist mints followed by 500 public mints, with nearly 700 ETH in volume. The useful lesson is sequencing and community alignment, not assuming the same outcome.
3. **Use generative systems as production infrastructure, not as a substitute for artistic direction.** HashLips Art Engine is a widely forked layer-composition reference. Art Blocks documents deterministic, hash-seeded generative art and on-chain permanence. Evaluate licensing, dependencies, provenance, storage costs, and suitability before adopting code.
4. **Do not confuse marketplace volume with creator proceeds.** Track gross sale value, marketplace fees, creator royalties actually received, gas, payment/provider fees, refunds, taxes, and net wallet receipts as separate ledger fields.
5. **Marketplace fees are only one selection factor.** Verify current eligibility, supported chain, buyer liquidity, creator-earnings policy, payout asset, and total fee breakdown before each launch. Never evade geographic, sanctions, or KYC restrictions.

## Product strategy

- Lead with one coherent, signature collection (starting with *The Witness — Genesis #001*); do not dilute the brand with unrelated bulk-generated drops.
- Create a small, curated first release plus clearly differentiated follow-on editions only after collector feedback.
- Offer optional high-value paths only when genuinely deliverable: commissioned original works, commercial licensing, physical archival prints, and collector experiences. These are separate products and must not be represented as guaranteed NFT utility.
- Each artwork must have documented authorship, source/provenance, rights review, metadata validation, duplicate screening, and human quality approval.
- Similarity checks (cryptographic hash, perceptual hash, and embeddings) can detect duplicates within the project's catalog; they cannot prove global uniqueness or absence of copyright infringement.

## 90-day execution gates

### Days 1–14: readiness and validation
- Audit the existing code, workflow, dependencies, provider costs, and security settings.
- Confirm creator eligibility and payout mechanics for candidate marketplaces from current official terms.
- Validate the original artwork, metadata, pricing hypotheses, wallet ownership, and custody model.
- Interview prospective collectors and test demand with a landing page and permission-based waitlist.
- Do not mint or publish automatically.

**Gate:** proceed only with rights evidence, a working preview, secure storage, tested ledger, marketplace eligibility, and credible collector interest.

### Days 15–30: audience and offer testing
- Publish a consistent artist story and process content across relevant channels.
- Run small, measurable experiments with distinct audiences and calls to action.
- Collect qualified collector interest; do not buy fake followers, wash trade, fabricate scarcity, or promise returns.
- Test price/edition hypotheses with transparent offers and collector feedback.

**Gate:** proceed to a public sale only if real prospective buyers and conversion evidence justify it.

### Days 31–60: controlled launch
- Launch one curated drop with a clear supply, price, provenance, and buyer experience.
- Use marketplace-native sale mechanics; creator reviews and signs every mint/listing transaction.
- Monitor qualified traffic, saves, offers, conversion, sell-through, net receipts, refunds, and support issues.
- Adjust only from measured evidence; do not inflate sales through self-trading or paid wash activity.

**Gate:** expand only if there are genuine external buyers, positive net economics, and no unresolved rights/security issues.

### Days 61–90: scale what converts
- Expand the best-performing audience and content channels.
- Release follow-on works only when demand and quality justify them.
- Pursue carefully qualified collector, gallery, brand, and licensing partnerships.
- Review channel concentration, marketplace terms, settlement delays, and net receipts weekly.

## Dashboard definitions

- **Gross sales:** confirmed primary and secondary sale value attributed to the creator, without double-counting.
- **Marketplace fees:** actual fees deducted by each marketplace.
- **Creator earnings:** royalties actually paid to the creator; never assume optional royalties are enforced.
- **Net wallet receipts:** verified on-chain receipts attributable to sales, less applicable marketplace/provider deductions; report gas and taxes separately.
- **Qualified audience:** unique, permission-based people who have shown credible collector intent.
- **Conversion:** completed genuine purchases divided by qualified buyer visits or leads, with the denominator stated.
- **Sell-through:** sold primary supply divided by supply offered.

A sale counts as verified only after the relevant marketplace/on-chain transaction is confirmed and the proceeds are reconciled to the wallet. Screenshots, offers, listing views, and unconfirmed orders are not revenue.

## Security and autonomy boundaries

- AI may research, draft, generate candidate artwork, score quality, prepare metadata, schedule draft content, and reconcile public sale data.
- A human must approve rights, final artwork, price, supply, public claims, minting, listings, wallet signatures, refunds, and any financial transfer.
- Never store seed phrases or private keys in GitHub, CI secrets, chat, or third-party generation services. Use wallet-native signing.
- Do not promise that an artwork is globally unique or copyright-safe based only on automated similarity scans.
- No fake engagement, wash trading, undisclosed paid promotion, fabricated testimonials, or misleading investment claims.

## Reference projects and case studies

- HashLips Art Engine: https://github.com/HashLips/hashlips_art_engine
- Art Blocks documentation: https://github.com/ArtBlocks/artblocks-docs
- Creature World / Crowd case study: https://partners-v2.opensea.io//case-studies/crowd
- Rarible / The Composables case study: https://og.rarible.com/blog/case-study-the-composables/

These are reference implementations and reported case studies, not promises of future performance. Check current licenses, platform rules, and source terms before reuse.
