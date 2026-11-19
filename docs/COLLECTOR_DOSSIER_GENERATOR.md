# Collector dossier generator

Run `npm run collector:dossier` to create one draft Markdown dossier per work in `workflows/provenance-records.example.json`.

Output is written to `dist/collector-dossiers/` and is intended for internal review or later adaptation. It includes the work statement, provenance fields, rights/release status, a bilingual short description and an explicit collector notice.

The generator does not publish, email, mint, list, price, or claim independent verification. Pending rights or release gates are shown as pending/false, not silently upgraded. Rebuild after updating the provenance record. Review every generated dossier before sharing externally.
