# Artwork Provenance Dossier

This dossier records the creation history and evidence associated with each artwork. It is an evidence-management aid, not a legal opinion, copyright registration, originality detector, or proof of commercial-use permission.

## Required record sections

- Stable work and collection identifiers.
- Creation method and tool, with dates and generation references when available.
- Prompt and iteration archive references, where safe and permitted.
- Creator statements, recorded as attestations rather than independent verification.
- Master asset path, format, dimensions and SHA-256 checksum calculated from the committed master.
- Rights review covering applicable generation-service terms, third-party inputs, jurisdiction-specific rules and marketplace terms.
- Separate owner approvals for minting, listing and public promotion.
- Append-only history of material changes and evidence.

## Evidence handling rules

1. Never infer ownership or commercial rights solely from an originality statement.
2. Do not mark a rights review complete until the relevant terms and inputs have actually been reviewed.
3. Calculate the checksum only from the final master file in the repository; a local checksum is not a repository asset receipt.
4. Preserve original masters. Put derivatives and previews in clearly named separate paths.
5. Keep private prompts, personal data, credentials and confidential correspondence out of public Git history.
6. A technical validation pass never authorizes minting, listing, public upload, publication or wallet transactions.

## Current example

See workflows/provenance-records.example.json for the structured example record for The Last Listener. Its creator originality statement is recorded as an attestation. Rights review, asset commit and all release authorizations remain pending.

## Suggested workflow

1. Add the final master to assets/.
2. Verify file signature, dimensions and visual integrity.
3. Calculate SHA-256 from that exact committed file.
4. Update the asset path, status and checksum in the provenance record.
5. Review applicable service terms and any source materials.
6. Record approvals separately for each intended external action.
7. Run npm test, npm run quality:artwork and npm run studio:status.
