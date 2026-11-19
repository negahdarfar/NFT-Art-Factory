# Approval-gated marketing pack

Run `npm run marketing:pack` after preparing `collection.json` and the private, git-ignored `reviews/review-status.json`.

The generator includes an artwork only when its review entry has all three fields:
- `status: "approved"`
- `rights_confirmed: true`
- `owner_approved: true`

It writes draft-only SEO metadata and channel copy for Instagram, X, Pinterest and email under `dist/marketing/`. It never publishes, sends messages, creates listings, or claims that an artwork is available for sale. Replace the listing URL placeholder only after a real listing has been verified, then obtain owner approval for the campaign.

The example review file deliberately marks the sample artwork as pending. This means a clean build may correctly generate zero marketing campaigns until a real artwork has passed review.
