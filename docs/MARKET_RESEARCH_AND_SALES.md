# Market research and sales ledger

## Comparable-sale research

1. Copy `market-comps.example.json` to the private, git-ignored `market-comps.json`.
2. Replace the example record with actual completed sales and their public source URLs.
3. Run `npm run market:research`.
4. Review `dist/market-research/price-research.json` and CSV.

Only records marked `saleType: "completed"`, with a positive numeric price, matching currency/chain, a parseable sale date and an HTTPS source URL are included. Records are supplied by the operator; the script does not scrape marketplaces or claim live data. Median/range are indicative only. A small sample is explicitly labelled low confidence. No result is automatically copied into listing prices.

## Sales ledger

Copy `sales-ledger.example.json` to `sales-ledger.json`, replace all example values with actual transaction data, then run `npm run sales:report`. The generated JSON and CSV include gross, entered fees and net totals grouped by currency. The validator requires a transaction hash in 32-byte hex form and an HTTPS transaction URL.

Important: format validation is not blockchain verification. Open the transaction URL in the correct chain explorer and confirm success, token, amount, recipient and settlement yourself. Taxes, refunds, royalties and conversion costs may not be included in the entered fee amount. Do not store wallet secrets.

Private input files are excluded from Git. Generated reports are local build outputs and must be reviewed before sharing.
