# Demand research and intelligent subject selection

## Purpose
Rank art themes and offer ideas before spending time on production. The engine is a transparent prioritization aid, not an automated market oracle or sales forecast.

## Zero-cost workflow
1. Copy `demand-signals.example.json` to the private, git-ignored `demand-signals.json`.
2. Enter observations from public sources. Keep the exact source URL and observation timestamp.
3. Distinguish completed sales from listings, unique buyers from transaction count, and audience growth from raw follower totals.
4. Run `npm run demand:research`.
5. Review `dist/demand-research/demand-ranking.json` and CSV. Verify evidence manually before selecting a theme.

## Score model
The directional score weights completed sales in the last 30 days (35%), unique buyers (20%), watchlist/favorite additions (15%), community growth percentage (10%), commission inquiries (15%), and lower competing listing count (5%). Each signal is normalized against a documented ceiling in the script. Missing signals contribute zero; competition is omitted when unknown. At least one valid HTTPS evidence URL observed within 45 days is required for any score.

## Data quality and limitations
- Inputs are manually supplied; this version does not scrape marketplace APIs or claim live market coverage.
- Do not count the same sale on multiple aggregators. Use completed-sale records only for sales metrics.
- Wash trading, self-purchases, suspicious wallet clusters and bot engagement can distort public metrics; flag or exclude them during human verification.
- A source link is traceability, not proof that every entered number is correct.
- A high score only means "research this idea first." It never changes artwork pricing, approves rights, mints, lists, publishes, signs, or spends.
- No paid services or API fallback are enabled. Keep the project's zero-dollar monthly budget.

## Next research iteration
Add marketplace-specific public data adapters only after reviewing their official API terms, geographic eligibility, rate limits, and no-cost availability. Keep every adapter optional and preserve the manual evidence workflow as a fallback.
