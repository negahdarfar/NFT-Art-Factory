import test from "node:test";
import assert from "node:assert/strict";
import { CloudflareWorkersAI } from "../adapters/cloudflare-workers-ai.mjs";
import { PinataStorage } from "../storage/pinata.mjs";

test("Cloudflare adapter requires server credentials", () => {
  assert.throws(() => new CloudflareWorkersAI({ accountId: "", apiToken: "" }), /CLOUDFLARE_ACCOUNT_ID/);
});

test("Cloudflare adapter rejects empty prompts before making a request", async () => {
  const provider = new CloudflareWorkersAI({ accountId: "test-account", apiToken: "test-token" });
  await assert.rejects(provider.generate({ prompt: " " }), /meaningful image prompt/);
});

test("Pinata adapter requires a JWT", () => {
  assert.throws(() => new PinataStorage({ jwt: "" }), /PINATA_JWT/);
});

test("Pinata adapter uploads JSON metadata with the public network flag", async () => {
  const originalFetch = globalThis.fetch;
  let request;
  globalThis.fetch = async (url, options) => {
    request = { url, options };
    return new Response(JSON.stringify({ data: { cid: "bafy-test-metadata", name: "0001.json", size: 42, mime_type: "application/json" } }), {
      status: 200,
      headers: { "content-type": "application/json" }
    });
  };
  try {
    const storage = new PinataStorage({ jwt: "test-jwt" });
    const result = await storage.uploadJson({ name: "Test artwork", image: "ipfs://bafy-image" }, "0001.json");
    assert.equal(request.url, "https://uploads.pinata.cloud/v3/files");
    assert.equal(request.options.headers.Authorization, "Bearer test-jwt");
    assert.equal(request.options.body.get("network"), "public");
    assert.equal(request.options.body.get("file").type, "application/json");
    assert.equal(request.options.body.get("file").name, "0001.json");
    assert.equal(result.cid, "bafy-test-metadata");
    assert.equal(result.uri, "ipfs://bafy-test-metadata");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("Pinata JSON upload rejects non-JSON filenames", async () => {
  const storage = new PinataStorage({ jwt: "test-jwt" });
  await assert.rejects(storage.uploadJson({ name: "Test" }, "metadata.txt"), /\.json filename/);
});
