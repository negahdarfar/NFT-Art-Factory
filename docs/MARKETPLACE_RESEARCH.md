# Marketplace research snapshot — 2026-11-19

This is an implementation shortlist, not a guarantee of account eligibility or sales.

## objkt
- Tezos art marketplace.
- Official FAQ says creators can mint/list and receive XTZ proceeds directly in their self-custody wallet.
- Official FAQ says objkt does not impose geographic restrictions on minting/listing/selling, while wallet providers and exchanges have their own country restrictions. Applicable law still applies.
- Official FAQ currently states a 5% marketplace fee on successful sales through its smart contracts; network fees and royalties may also apply.
- Public GraphQL API and Shadownet test environment are documented.
- Candidate for first end-to-end test.

## OpenSea
- Official API supports NFT/account/collection discovery, listing and offer operations, order fulfillment, and event tracking.
- API requires an API key. Official docs advertise an instant free-tier key; production use and commercial use must be checked against current terms.
- Wallet signing is still required for relevant marketplace actions.
- Creator earnings may be optional or enforced depending on contract configuration. OpenSea's current help article says ERC721-C / ERC1155-C enforcement narrows compatible marketplaces to OpenSea and LimitBreak Payment Processor-powered marketplaces (currently including Magic Eden).
- Candidate for the first EVM adapter, subject to account and legal eligibility.

## Rarible
- Official FAQ describes a non-custodial DApp; connected wallet holds assets and funds.
- Listing is available on Solana and supported EVM chains.
- Current FAQ lists marketplace fees of 2% on Ethereum, Base and Polygon and 1.5% on Solana; other chains vary. Network fees and creator royalties may also apply.
- Candidate for multi-chain adapter after current API and commercial-use review.

## Zora
- Official creator documentation describes creator/content coins and on-chain trading rewards.
- Treat this as a separate creator-economy channel, not simply another conventional NFT listing destination.
- Rewards and coin prices are variable and are not guaranteed income.

## Sources
- OpenSea API overview: https://docs.opensea.io/reference/api-overview
- OpenSea Platform Terms: https://opensea.io/tos
- OpenSea creator earnings: https://support.opensea.io/en/articles/8867026-how-do-i-set-creator-earnings-on-opensea
- Rarible FAQ: https://rarible.com/faq
- objkt FAQ: https://middleware.objkt.com/seo/faq
- objkt creator guide: https://docs.objkt.com/product/getting-started/readme/creator-starter-guide
- Zora creator rewards: https://support.zora.co/en/articles/5273729

## Before any real listing
Confirm the creator's actual legal residence, marketplace terms, wallet-provider availability, exchange access, copyright ownership, chain, gas, marketplace fees, and net settlement asset. Do not bypass access restrictions.
