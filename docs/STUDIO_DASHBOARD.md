# Studio Operations Dashboard

Run `npm run studio:status` to generate a local, static operations dashboard and machine-readable report at `dist/studio-dashboard/index.html` and `dist/studio-dashboard/report.json`.

The dashboard reads the example collection catalog, artwork draft records and review status. It deliberately requires evidence in both the review record and the artwork draft before showing rights or owner approval as complete. A final asset must exist inside `assets/`, and action-specific release authorization must be explicit before a work can pass the release gate.

## Status semantics

- `operational_review_required`: one or more works have missing assets, rights evidence, owner approval or action-specific release authorization.
- `release_gates_passed`: every catalogued work passes the local evidence checks. This is not a legal opinion, marketplace eligibility result, or permission to transact.
- `configuration_error`: catalog structure or identifiers need correction.

## Safety and limitations

The dashboard is read-only. It does not mint, list, upload, publish, connect wallets, verify identity, inspect sanctions eligibility, or prove commercial rights. It cannot infer a sale from an asking price or social metric. A human must review current official marketplace requirements and separately authorize each external action.

The report is a local generated artifact and is not automatically published to GitHub Pages.
