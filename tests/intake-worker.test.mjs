import test from "node:test";
import assert from "node:assert/strict";
import worker from "../worker/index.mjs";

function bucketMock() {
  const objects = new Map();
  return {
    objects,
    async put(key, value, options) { objects.set(key, { value, options }); },
    async get(key) {
      const item = objects.get(key);
      if (!item) return null;
      return { body: item.value, httpMetadata: item.options?.httpMetadata, async json() { return JSON.parse(item.value); } };
    },
    async delete(key) { objects.delete(key); },
    async list({ prefix }) {
      return { objects: [...objects.keys()].filter(key => key.startsWith(prefix)).map(key => ({ key })) };
    }
  };
}

const token = "test-dashboard-token";
const env = () => ({ DASHBOARD_ACCESS_TOKEN: token, ALLOWED_ORIGIN: "https://creator.example", ARTWORKS: bucketMock() });
const request = (url, options = {}) => new Request("https://worker.example" + url, options);

test("health endpoint exposes only draft-only service status", async () => {
  const response = await worker.fetch(request("/api/health"), env());
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true, service: "nft-art-intake", mode: "draft-only" });
});

test("artwork API rejects requests without bearer token", async () => {
  const response = await worker.fetch(request("/api/artworks"), env());
  assert.equal(response.status, 401);
});

test("artwork API accepts an authorized draft and lists its record", async () => {
  const bindings = env();
  const form = new FormData();
  form.set("title", "Test artwork");
  form.set("description", "A test image for the private draft intake.");
  form.set("image", new Blob([new Uint8Array([137, 80, 78, 71])], { type: "image/png" }), "test.png");
  const response = await worker.fetch(request("/api/artworks", {
    method: "POST",
    headers: { Authorization: "Bearer " + token, Origin: "https://creator.example" },
    body: form
  }), bindings);
  assert.equal(response.status, 201);
  const body = await response.json();
  assert.equal(body.item.title, "Test artwork");
  assert.equal(body.item.status, "pending_human_review");
  assert.equal(body.item.publishMode, "draft_only");
  assert.equal(body.item.rightsConfirmed, false);
  assert.equal(bindings.ARTWORKS.objects.size, 2);

  const list = await worker.fetch(request("/api/artworks", {
    headers: { Authorization: "Bearer " + token }
  }), bindings);
  assert.equal(list.status, 200);
  const records = await list.json();
  assert.equal(records.items.length, 1);
  assert.equal(records.items[0].id, body.item.id);

  const preview = await worker.fetch(request("/api/artworks/" + body.item.id + "/image", { headers: { Authorization: "Bearer " + token } }), bindings);
  assert.equal(preview.status, 200);
  assert.equal(preview.headers.get("content-type"), "image/png");
});

test("artwork API rejects unsupported image types", async () => {
  const form = new FormData();
  form.set("title", "Bad file");
  form.set("description", "Not an image.");
  form.set("image", new Blob(["not an image"], { type: "text/plain" }), "bad.txt");
  const response = await worker.fetch(request("/api/artworks", {
    method: "POST",
    headers: { Authorization: "Bearer " + token },
    body: form
  }), env());
  assert.equal(response.status, 415);
});
