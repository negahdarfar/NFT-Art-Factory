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
