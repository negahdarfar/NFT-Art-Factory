import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const collectionPath = path.join(root, "collection.json");
const sourcePath = fs.existsSync(collectionPath) ? collectionPath : path.join(root, "collection.example.json");
const collection = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
const reviewPath = path.join(root, "reviews", "review-status.json");
const reviews = fs.existsSync(reviewPath) ? JSON.parse(fs.readFileSync(reviewPath, "utf8")) : {};
const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const cards = collection.items.map((item, index) => {
  const status = reviews[item.name]?.status || "draft";
  const image = path.posix.join("../../assets", path.basename(item.image || ""));
  const exists = item.image && fs.existsSync(path.join(root, "assets", path.basename(item.image)));
  return `<article class="card"><div class="preview">${exists ? `<img src="${esc(image)}" alt="${esc(item.name)}">` : '<span>Preview unavailable</span>'}</div><div class="body"><small>ARTWORK #${String(index + 1).padStart(3, "0")}</small><h2>${esc(item.name)}</h2><p>${esc(item.description)}</p><span class="status">${esc(status.replaceAll("_", " "))}</span><p class="file">${esc(item.image || "No image")}</p></div></article>`;
}).join("\\n");
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(collection.name)} — Creator Gallery</title><style>
:root{color-scheme:dark;font-family:Inter,system-ui,sans-serif;background:#101116;color:#f5f5f7}*{box-sizing:border-box}body{margin:0;padding:32px;max-width:1200px;margin:auto}header{padding:24px 0 36px;border-bottom:1px solid #30313a}h1{font-size:clamp(28px,5vw,48px);margin:0 0 10px}.muted,p{color:#aaaebc;line-height:1.55}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:20px;margin-top:28px}.card{background:#1b1d25;border:1px solid #30313a;border-radius:18px;overflow:hidden}.preview{aspect-ratio:4/3;background:#252833;display:grid;place-items:center;color:#8e93a3}.preview img{width:100%;height:100%;object-fit:cover}.body{padding:18px}.body h2{margin:8px 0;font-size:20px}.body small,.file{color:#8e93a3;font-size:11px;letter-spacing:.08em}.status{display:inline-block;padding:6px 10px;border-radius:20px;background:#34303f;color:#d9c7ff;font-size:12px;text-transform:capitalize}.empty{padding:30px;border:1px dashed #444;border-radius:12px;color:#aaa}footer{margin-top:40px;color:#777;font-size:12px}
</style></head><body><header><small>CREATOR WORKSPACE / NFT ART FACTORY</small><h1>${esc(collection.name)}</h1><p class="muted">${esc(collection.description)}</p><p class="muted">${collection.items.length} artwork draft(s) · Review before publication</p></header><main class="grid">${cards || '<div class="empty">No artwork yet. Add items to collection.json and place image files in assets/.</div>'}</main><footer>Private preview · No minting, listing, wallet connection, or sale is performed by this gallery.</footer></body></html>`;
const out = path.join(root, "dist", "gallery");
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, "index.html"), html);
console.log(`Creator gallery generated at dist/gallery/index.html (${collection.items.length} draft(s)).`);
