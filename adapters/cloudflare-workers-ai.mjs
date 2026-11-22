const DEFAULT_MODEL = "@cf/black-forest-labs/flux-1-schnell";

export class CloudflareWorkersAI {
  constructor({ accountId = process.env.CLOUDFLARE_ACCOUNT_ID, apiToken = process.env.CLOUDFLARE_API_TOKEN, model = process.env.CLOUDFLARE_IMAGE_MODEL || DEFAULT_MODEL } = {}) {
    if (!accountId || !apiToken) throw new Error("Set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN in the server environment.");
    this.accountId = accountId;
    this.apiToken = apiToken;
    this.model = model;
  }

  async generate({ prompt, negativePrompt = "", width = 1024, height = 1024 }) {
    if (typeof prompt !== "string" || prompt.trim().length < 8) throw new Error("A meaningful image prompt is required.");
    if (!Number.isInteger(width) || !Number.isInteger(height) || width < 256 || height < 256 || width > 2048 || height > 2048) {
      throw new Error("Image dimensions must be integers between 256 and 2048.");
    }
    const url = `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/ai/run/${this.model}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${this.apiToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: prompt.trim(), negative_prompt: negativePrompt, width, height })
    });
    if (!response.ok) throw new Error(`Cloudflare Workers AI failed (${response.status}): ${(await response.text()).slice(0, 500)}`);
    const payload = await response.json();
    const encoded = payload?.result?.image ?? payload?.result?.images?.[0];
    if (typeof encoded !== "string" || !encoded.length) throw new Error("Cloudflare response did not contain an image payload.");
    return { bytes: Buffer.from(encoded, "base64"), mimeType: "image/png", provider: "cloudflare-workers-ai", model: this.model };
  }
}
