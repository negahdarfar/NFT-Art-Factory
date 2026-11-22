# Creator gallery MVP

The current dashboard is a static, private preview generated from the collection manifest. It is intentionally read-only: it does not expose upload credentials, connect a wallet, mint, list, or claim that an item is for sale.

## Generate the gallery

```bash
cd nft-art-factory
npm run build
npm run gallery
```

Open `dist/gallery/index.html` in a browser. Put original image files in `assets/`, then add an item to `collection.json`. The dashboard reads optional statuses from `reviews/review-status.json`; copy `reviews/review-status.example.json` as a starting point.

## Artwork intake contract

Each item in `collection.json` includes a unique name, description, local image filename, and optional attributes. The metadata build validates that the image exists inside `assets/`, computes its SHA-256 digest, and writes an ERC-721-style metadata JSON file.

Before any external upload, record:
- creator identity/account for the marketplace (never put secrets in this repository);
- rights basis: original work, licensed work, or public-domain work;
- whether AI generation was used and which provider/terms apply;
- human review and owner approval;
- target chain, marketplace, listing currency and price.

The current repository workflow does not accept binary uploads through GitHub's text-file API. Use the repository web upload or a future authenticated storage endpoint for image bytes; never encode private keys or provider secrets into artwork records.

## Next integration boundary

A hosted dashboard needs authenticated object storage and a server-side API. The next implementation should use a signed upload URL, file-size/MIME validation, malware scanning, and a private draft record before any public IPFS pinning. Public IPFS publication is effectively permanent, so it must happen only after review.
