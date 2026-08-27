// Usage: node scripts/fetch-pexels.mjs "<search query>" <output-path.jpg> [resultIndex]
// Requires PEXELS_API_KEY in the environment.
import fs from "node:fs";
import path from "node:path";

const [, , query, outputPath, indexArg] = process.argv;
const index = Number(indexArg ?? 0);
const apiKey = process.env.PEXELS_API_KEY;

if (!apiKey) {
  console.error("Missing PEXELS_API_KEY in environment");
  process.exit(1);
}
if (!query || !outputPath) {
  console.error("Usage: node scripts/fetch-pexels.mjs \"<query>\" <output-path.jpg> [resultIndex]");
  process.exit(1);
}

const searchUrl = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${index + 1}&orientation=landscape`;
const searchRes = await fetch(searchUrl, { headers: { Authorization: apiKey } });
if (!searchRes.ok) {
  console.error(`Pexels search failed (${searchRes.status}): ${await searchRes.text()}`);
  process.exit(1);
}
const data = await searchRes.json();
const photo = data.photos?.[index];
if (!photo) {
  console.error(`No result at index ${index} for query "${query}"`);
  process.exit(1);
}

const imgRes = await fetch(photo.src.large2x);
const buffer = Buffer.from(await imgRes.arrayBuffer());
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, buffer);
console.log(`${outputPath} <- ${query} (photo by ${photo.photographer}, id ${photo.id})`);
