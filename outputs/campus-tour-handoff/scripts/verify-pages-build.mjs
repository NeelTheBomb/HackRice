import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import { stdout } from "node:process";
import { URL } from "node:url";

const distDirectory = new URL("../dist/", import.meta.url);
const html = await readFile(new URL("index.html", distDirectory), "utf8");

assert.doesNotMatch(
  html,
  /\b(?:src|href)="\//,
  "Built HTML contains a root-absolute asset URL.",
);

const htmlAssetUrls = Array.from(
  html.matchAll(/\b(?:src|href)="([^"]+)"/g),
  (match) => match[1],
);

for (const assetUrl of htmlAssetUrls) {
  if (/^(?:data:|https?:|#)/.test(assetUrl)) continue;
  const cleanUrl = assetUrl.split(/[?#]/, 1)[0];
  const assetStats = await stat(new URL(cleanUrl, distDirectory));
  assert.equal(assetStats.isFile(), true, `Built HTML asset is missing: ${assetUrl}`);
}

const assetDirectory = new URL("assets/", distDirectory);
const assetFiles = await readdir(assetDirectory);
const bundledSourceFiles = assetFiles.filter((file) => /\.(?:css|js)$/.test(file));
const rootAssetPattern =
  /(?:["'`(])\/(?!\/)[^"'`()\s]+?\.(?:avif|css|gif|jpe?g|js|mp4|png|svg|webm|webp|woff2?)(?:[?#][^"'`()\s]*)?(?:["'`)])/i;

for (const file of bundledSourceFiles) {
  const source = await readFile(new URL(file, assetDirectory), "utf8");
  assert.doesNotMatch(
    source,
    rootAssetPattern,
    `Built source ${file} contains a root-absolute local asset URL.`,
  );
}

stdout.write("GitHub Pages build uses portable asset URLs.\n");
