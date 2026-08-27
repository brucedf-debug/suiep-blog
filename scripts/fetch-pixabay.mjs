// Usage: node scripts/fetch-pixabay.mjs "<search query>" <output-path.jpg> [resultIndex]
// Requires PIXABAY_API_KEY in the environment.
import fs from "node:fs";
import path from "node:path";

const [, , query, outputPath, indexArg] = process.argv;
const index = Number(indexArg ?? 0);
const apiKey = process.env.PIXABAY_API_KEY;

if (!apiKey) {
  console.error("Missing PIXABAY_API_KEY in environment");
  process.exit(1);
}
if (!query || !outputPath) {
  console.error("Usage: node scripts/fetch-pixabay.mjs \"<search query>\" <output-path.jpg> [resultIndex]");
  process.exit(1);
}

const searchUrl = `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(query)}&image_type=photo&orientation=horizontal&per_page=${Math.max(index + 1, 3)}`;
const searchRes = await fetch(searchUrl);
if (!searchRes.ok) {
  console.error(`Pixabay search failed (${searchRes.status}): ${await searchRes.text()}`);
  process.exit(1);
}
const data = await searchRes.json();
const hit = data.hits?.[index];
if (!hit) {
  console.error(`No result at index ${index} for query "${query}"`);
  process.exit(1);
}

const imgRes = await fetch(hit.largeImageURL);
const buffer = Buffer.from(await imgRes.arrayBuffer());
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, buffer);
console.log(`${outputPath} <- ${query} (photo by ${hit.user}, id ${hit.id})`);
