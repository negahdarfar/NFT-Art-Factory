import fs from "node:fs/promises";
import path from "node:path";

export class PinataStorage {
  constructor({ jwt = process.env.PINATA_JWT } = {}) {
    if (!jwt) throw new Error("Set PINATA_JWT in the server environment. Never commit it.");
    this.jwt = jwt;
  }

  async uploadFile(filePath) {
    const absolute = path.resolve(filePath);
    const bytes = await fs.readFile(absolute);
    const form = new FormData();
    form.append("file", new Blob([bytes]), path.basename(absolute));
    form.append("network", "public");
    const response = await fetch("https://uploads.pinata.cloud/v3/files", {
      method: "POST",
      headers: { Authorization: `Bearer ${this.jwt}` },
      body: form
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(`Pinata upload failed (${response.status}): ${JSON.stringify(payload).slice(0, 500)}`);
    const cid = payload?.data?.cid;
    if (!cid) throw new Error("Pinata response did not include data.cid.");
    return { cid, name: payload.data.name, size: payload.data.size, mimeType: payload.data.mime_type, uri: `ipfs://${cid}` };
  }
}
