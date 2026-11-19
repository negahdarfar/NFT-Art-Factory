# Private artwork intake API (Cloudflare Workers + R2)

This optional backend stores original image bytes and JSON review records in a private R2 bucket. It does not publish to IPFS, mint tokens, create marketplace listings, or sign wallet transactions.

## Setup
1. Create a private R2 bucket named `nft-artwork-drafts`; do not enable public access.
2. Deploy `worker/index.mjs` as a Cloudflare Worker using `wrangler.toml`.
3. Bind the R2 bucket with binding name `ARTWORKS`.
4. Set Worker secret `DASHBOARD_ACCESS_TOKEN` to a long random value. Never commit or share it.
5. Replace `ALLOWED_ORIGIN` with the exact HTTPS origin of the dashboard.
6. Keep the Worker URL private until authentication and origin configuration are complete.

## API
- `GET /api/health` — public, non-sensitive health check.
- `GET /api/artworks` — requires `Authorization: Bearer <token>`; returns up to 100 private draft records.
- `GET /api/artworks/{id}/image` — requires the same authorization; streams the selected image privately for preview.
- `POST /api/artworks` — requires the same authorization and `multipart/form-data` fields `title`, `description`, and `image`.

Accepted images: PNG, JPEG, WebP, maximum 10 MB. Each upload gets a unique ID and SHA-256 digest.

## Security boundaries
- The dashboard must request the token at runtime; never hardcode it in browser JavaScript or repository files.
- Use HTTPS and an exact allowed origin. The bearer token is a single-owner prototype gate, not a multi-user identity system; rotate it if exposed.
- R2 objects stay private. Do not enable public bucket access or expose object URLs.
- Copyright ownership still requires human review before public publication.
- This prototype returns only the latest 100 drafts and is not designed for multi-user production.


The latest CI workflow also checks JavaScript syntax and exercises authenticated upload, listing, and private image preview behavior.
