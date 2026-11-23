import fs from "node:fs/promises";
import path from "node:path";

export class PinataStorage {
  constructor({ jwt = process.env.PINATA_JWT } = {}) {
    if (!jwt) throw new Error("Set PINATA_JWT in the server environment. Never commit it.");
    this.jwt = jwt;
  }

  async uploadFile(filePath, { contentType } = {}) {
    const absolute = path.resolve(filePath);
    const bytes = await fs.readFile(absolute);
    const inferredType = path.extname(absolute).toLowerCase() === ".json"
      ? "application/json"
      : path.extname(absolute).toLowerCase() === ".svg"
        ? "image/svg+xml"
        : "application/octet-stream";
    return this.uploadBytes(bytes, path.basename(absolute), contentType || inferredType);
  }

  async uploadJson(value, filename = "metadata.json") {
    if (!filename.toLowerCase().endsWith(".json")) throw new Error("JSON uploads must use a .json filename.");
    const bytes = Buffer.from(JSON.stringify(value, null, 2) + "\n", "utf8");
    return this.uploadBytes(bytes, filename, "application/json");
  }

  async uploadBytes(bytes, filename, contentType) {
    const form = new FormData();
    form.append("file", new Blob([bytes], { type: contentType }), filename);
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
    return { cid, name: payload.data.name || filename, size: payload.data.size ?? bytes.length, mimeType: payload.data.mime_type || contentType, uri: `ipfs://${cid}` };
  }
}
