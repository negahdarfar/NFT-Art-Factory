# Marketplace fee policy

## Creator preference
Use marketplaces that deduct their marketplace commission from completed sale proceeds. Do not use subscription-only, pay-to-promote, or upfront marketplace packages as a default business model.

## Current fee references checked 2026-11-19
- **objkt (Tezos):** official help center says 5% marketplace fee on successful sales through its contracts, paid by the seller and deducted from sale proceeds. Creator royalties may also be deducted. Network transaction fees for minting/listing are separate and may be payable before a sale.
  - https://docs.objkt.com/product/fundamentals/fee-structure
- **OpenSea:** official help center says typically 1% fee on NFT sales; primary drops have a separate 10% minting fee. Gas/network fees are separate. Eligibility must be checked before enabling.
  - https://support.opensea.io/en/articles/8867091-what-fees-do-i-pay-on-opensea
- **Rarible:** official FAQ updated 2026-09-01 says seller-side marketplace fee is 2% on Ethereum, Base and Polygon and 1.5% on Solana; other chains vary and exact fee is shown during listing. Gas and creator royalties are separate.
  - https://rarible.com/faq

## Operating rule
Before each listing, retrieve or inspect the platform's current fee preview and calculate estimated net proceeds:
net proceeds = sale price - marketplace fee - creator royalty - seller-paid network/transaction costs - applicable taxes/other costs.
Never assume a fee percentage is permanent. Never describe network gas as marketplace commission.

## Initial preference
Keep objkt as the first art-focused Tezos candidate already configured in this repository. Evaluate OpenSea and Rarible as additional candidates only after confirming current creator eligibility, country/platform access, wallet/network compatibility, and live fee preview. Do not bypass restrictions.

## Payout
Use the creator's own non-custodial wallet. Confirm the actual payout address and chain before mint/list. Verify every sale and receipt on-chain; a listing or displayed price is not income. Never store wallet seed phrases or private keys.
