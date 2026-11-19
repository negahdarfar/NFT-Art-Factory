# objkt preparation workflow

This module prepares a reviewable metadata/listing draft for objkt on Tezos. It does not connect to a wallet, upload media, mint tokens, list items, or sign transactions.

## Run

```bash
npm run objkt:pack
```

Output: `dist/objkt-drafts/objkt-draft.json`.

## The Witness

- Title: The Witness
- Proposed edition: 1/1 (not minted)
- Currency: XTZ
- Proposed royalty: unset; choose only after reviewing the marketplace form and your own preference.
- Price: unset; research completed sales and approve a price manually.
- Media: original attachment was verified as a 1536×1536 JPEG. The repository media file is still pending binary upload; the generator flags this blocker rather than pretending it exists.

## Current marketplace checks

The official objkt FAQ says there are no geographic restrictions imposed by objkt on minting, listing, selling, or receiving proceeds. It also says external wallet providers, payment/on-ramp services and exchanges have their own country availability. Applicable laws and the current Terms still apply.

- FAQ: https://middleware.objkt.com/seo/faq
- Terms: https://objkt.com/terms
- Creator guide: https://docs.objkt.com/product/creating/creator-starter-guide
- Marketplace: https://objkt.com/

The FAQ currently lists Temple, Kukai and AirGap among supported Tezos wallets. Confirm the current supported-wallet list in objkt before connecting.

## Manual release checklist

1. Confirm the original JPEG is present and inspect the exact media preview.
2. Pin the original media to a storage provider and verify the resulting URI.
3. Review title, description, tags, creator attribution, edition count and royalties; token metadata may be immutable after minting.
4. Open objkt directly and connect only the creator's own wallet.
5. Check network, contract, amount, fees and every requested permission in the wallet.
6. The creator signs the mint transaction personally.
7. After confirmation, verify contract and token ID on-chain.
8. Set the listing price in XTZ and review marketplace/royalty/network fees.
9. The creator signs the listing transaction personally.
10. Verify the public token and listing URLs, then record them in the sales ledger.

Never use another person's identity or wallet to bypass provider restrictions. Never share a seed phrase or private key.
