# Tezos / objkt handoff

## Current integration boundary

The repository can prepare a draft-only objkt handoff. It does not deploy a Tezos contract, mint an NFT, sign a wallet operation, or create a marketplace listing.

objkt uses Tezos FA2 contracts and follows TZIP-16 / TZIP-21 metadata conventions. Its official documentation and validator are the source of truth:
- NFT contract and metadata requirements: https://docs.objkt.com/product/collections-and-indexing/nft-smart-contracts
- Metadata validator: https://objkt-com.github.io/metadata-validator/
- Creator guide: https://docs.objkt.com/product/getting-started/readme/creator-starter-guide
- Marketplace: https://objkt.com/

## Generate a draft

1. Copy `collection.example.json` to the private `collection.json` and add artwork you own or are licensed to mint.
2. In the private `marketplaces.json`, include `"objkt"` in `platforms`.
3. Run `npm run marketplace:pack`.
4. Review `dist/marketplace-drafts/objkt-token-metadata-drafts.json`.
5. Replace `ipfs://REPLACE_WITH_PINATA_IMAGE_CID` with the final public image URI and `REPLACE_WITH_YOUR_PUBLIC_TEZOS_WALLET_ADDRESS` with the creator's verified public Tezos address.
6. Convert each attribute into the TZIP-21 name/value representation as generated, then validate the completed metadata with the official validator.
7. Upload the approved image and final metadata to public IPFS only after confirming rights and owner approval.
8. Use objkt's official UI to create/select an FA2 collection, mint, and list. Review all wallet prompts and fees.

## Wallet safety and fees

- Only the public Tezos wallet address may be placed in metadata. Never place a seed phrase, private key, wallet backup, or authentication token in this repository.
- Kukai can be created through objkt social login or connected as an existing Tezos wallet. A successful login is not the same as a mint.
- Creating a custom collection deploys an FA2 contract and incurs Tezos network/storage fees. Minting and listing may also incur fees; inspect the wallet's exact transaction preview before signing.
- Never approve an unexpected wallet prompt. Stop if the destination, operation, amount, or fee is unclear.
- Public IPFS uploads are public and generally cannot be recalled. Upload only final, approved content.

## What is not automated

The current handoff does not:
- create or deploy an FA2 contract;
- mint or transfer tokens;
- sign or broadcast Tezos operations;
- publish or cancel objkt listings;
- verify a sale or calculate proceeds from live chain data.

A future live adapter must be built against current official wallet/contract interfaces and tested on objkt Shadownet before any mainnet use. No private-key signing should be introduced.
