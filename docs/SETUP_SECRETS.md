# Secure provider setup

Do not paste API keys into chat, source files, collection JSON, or screenshots.

## Cloudflare Workers AI

1. Open the [Cloudflare dashboard](https://dash.cloudflare.com/).
2. Select the account that will run Workers AI and copy its Account ID.
3. Create an API token with the minimum permissions needed for Workers AI inference.
4. Configure these environment variables only in the server/hosting environment:
   - `CLOUDFLARE_ACCOUNT_ID`
   - `CLOUDFLARE_API_TOKEN`
   - optional `CLOUDFLARE_IMAGE_MODEL`

The default model is FLUX.1 [schnell]. Workers AI currently documents 10,000 free Neurons per day on Workers Free, with usage/availability dependent on the model and account. Check the live pricing and model catalog before increasing generation volume.

## Pinata IPFS

1. Open [Pinata](https://app.pinata.cloud/).
2. Create an account and an API key with only the permissions needed for public file uploads.
3. Store its JWT as `PINATA_JWT` in the server environment.

The free plan currently lists 1GB storage, 10GB bandwidth, and a 500-file limit. Uploads made through this factory are public IPFS uploads, not private drafts.

## Important

The GitHub repository is source code, not a secure runtime for long-lived production secrets. Do not add API keys as ordinary repository files or commit them. Use a hosting provider's encrypted secret manager when the authenticated backend is deployed. Generation is draft-only; IPFS publication is separately gated by creator rights confirmation and owner approval.


## Private Creator Studio intake

For authenticated image intake, follow [PRIVATE_INTAKE_API.md](PRIVATE_INTAKE_API.md). Create a private R2 bucket, deploy the Worker, bind `ARTWORKS`, and configure the `DASHBOARD_ACCESS_TOKEN` secret plus the exact `ALLOWED_ORIGIN`. Do not paste the token into GitHub source files or chat. The Creator Studio upload panel remains optional until this backend is deployed.
