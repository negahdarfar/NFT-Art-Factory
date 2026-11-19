import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

test("growth campaign source contains approval gates and no publishing action", () => {
 const source=fs.readFileSync(new URL("../scripts/growth-campaign.mjs",import.meta.url),"utf8");
 assert.match(source,/status === "approved"/);
 assert.match(source,/rights_confirmed === true/);
 assert.match(source,/owner_approved === true/);
 assert.match(source,/No social posts, emails, DMs, minting, listings or payments are executed/);
 assert.doesNotMatch(source,/fetch\(|https?:\/\/api\./);
});
