# Zero-budget hybrid NFT execution

This operating profile is owner-approved for the initial 90-day experiment.

## Locked settings

- Budget: USD 0 per month. No paid ads, subscriptions, paid APIs, or automatic top-ups.
- Business model: curated premium originals, limited editions, custom commissions, and commercial licensing.
- Automation: research, ideation, draft generation, scoring assistance, metadata, SEO drafts, marketing drafts, and sales reconciliation assistance.
- Owner approval: rights, final artwork, price, supply, publication, mint, listing, wallet signatures, refunds, and any transfer.
- Target: USD 1,000,000 within 90 days is an aspiration, not a forecast or guarantee. The primary financial KPI is verified net wallet receipts.

## Free-first production stack

1. **Existing repository pipeline:** use the Node.js scripts and CI validation already present. Do not introduce paid services or new dependencies without approval.
2. **Cloudflare Workers AI:** the existing adapter supports FLUX.1 schnell. The documented Free plan allowance has historically included 10,000 Neurons/day, but model consumption, account availability, limits, and terms must be checked in the live dashboard before relying on it. API credentials are required; never commit them.
3. **AI Horde:** optional community-run image generation fallback. It is best-effort and queue times vary; do not assume commercial rights without checking the selected model's license and service terms.
4. **Pinata/IPFS:** do not treat storage as free forever or public uploads as private. Use the existing private draft process; publish only after rights and owner approval. Confirm the current plan and any bandwidth/storage limits before upload.
5. **Organic audience:** create educational/process content and collector outreach using platform-native tools. Do not automate spam, mass unsolicited DMs, fake engagement, or paid follower acquisition.

Free service availability is a variable external dependency, not a guaranteed operating entitlement. If a free quota is exhausted, generation pauses; it must not silently switch to a paid provider.

## Hybrid offer architecture

- **Flagship original:** a small number of highly curated, provenance-documented works such as The Witness.
- **Limited collection:** coherent visual language and transparent edition size; no artificial scarcity claims.
- **Commissions:** custom work with written scope, timeline, price, revision policy, and rights/licensing terms.
- **Commercial licensing:** separately documented usage rights, territories, duration, exclusivity, and payment terms. A license is not automatically included in an NFT purchase.

## Release gates

### Gate A — technical readiness
- CI passes.
- The generation provider is configured using encrypted secrets and explicitly enabled for draft-only output.
- Drafts are stored privately and never auto-published.
- Similarity, image integrity, metadata, and provenance checks run.
- No secrets or private wallet material exist in repository history.

### Gate B — commercial readiness
- Creator's legal marketplace eligibility and payout route are checked against current official terms.
- Comparable completed sales are documented with source URLs; asking prices are not used as sales evidence.
- Qualified collector interest is recorded with consent.
- Offer terms, supply, fees, and expected net proceeds are clear.

### Gate C — public release
- The owner approves the exact artwork, metadata, rights statement, price, edition size, marketplace, and listing.
- The owner reviews and signs the wallet transaction in the marketplace's own wallet flow.
- Marketing content is published only after the real listing URL is verified and approved.

## Weekly scorecard

Track, by channel and by collection:
- qualified unique collector leads and consent source;
- listing visits, saves, offers, and completed purchases;
- gross primary sales and secondary creator earnings actually received;
- marketplace fees, network fees, refunds, taxes, and conversion costs;
- verified net wallet receipts and transaction hashes;
- conversion and sell-through, with the denominator stated.

Do not count views, likes, offers, floor prices, pending transactions, self-trades, or unverified screenshots as revenue. Do not double-count secondary-market volume as creator income.

## Zero-spend stop rules

- Stop generation if a provider asks for payment or unexpectedly bills the account.
- Stop publication if jurisdiction, KYC, sanctions, rights, or wallet payout eligibility is unclear.
- Stop scaling if no genuine buyer demand appears; revise the offer rather than increasing output volume.
- Never borrow, leverage, or spend money needed for living expenses to chase the target.
