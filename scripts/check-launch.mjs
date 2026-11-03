#!/usr/bin/env node
/**
 * Launch gate. Runs before every `npm run build`.
 *
 * Preview builds (the default) pass straight through: they are noindexed and
 * show unconfirmed facts highlighted. Production builds
 * (NEXT_PUBLIC_SITE_MODE=production) fail, listing every outstanding item,
 * while any <Tbc> placeholder remains in the source or a launch setting is
 * missing. Placeholders can therefore never reach the live site.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(import.meta.url), "..", "..");
const production = process.env.NEXT_PUBLIC_SITE_MODE === "production";

if (!production) {
  console.log("Launch check: preview build (noindexed, unconfirmed items highlighted).");
  process.exit(0);
}

const problems = [];
const site = JSON.parse(readFileSync(join(root, "src/content/site.json"), "utf8"));

if (!site.domainConfirmed) problems.push(["site.json", `Domain ${site.url} has not been purchased and connected (set domainConfirmed: true)`]);
if (!process.env.NEXT_PUBLIC_SITE_URL && !site.domainConfirmed) problems.push(["environment", "NEXT_PUBLIC_SITE_URL is not set"]);
if (process.env.NEXT_PUBLIC_ANALYTICS_SRC && !process.env.NEXT_PUBLIC_ANALYTICS_NAME) {
  problems.push(["environment", "Analytics is enabled but NEXT_PUBLIC_ANALYTICS_NAME (the provider shown on the cookie page) is not set"]);
}

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : /\.(tsx?|jsx?)$/.test(name) ? [path] : [];
  });

const TBC = /<Tbc>([\s\S]*?)<\/Tbc>/g;
for (const file of walk(join(root, "src"))) {
  if (file.endsWith("Tbc.tsx")) continue;
  const text = readFileSync(file, "utf8");
  for (const match of text.matchAll(TBC)) {
    problems.push([relative(root, file).replaceAll("\\", "/"), `Unconfirmed: ${match[1].replace(/\s+/g, " ").trim()}`]);
  }
}

if (problems.length) {
  console.error("\nProduction build blocked. Resolve these items first:\n");
  for (const [where, what] of problems) console.error(`  - ${what}\n      (${where})`);
  console.error(`\n${problems.length} item(s). See docs/launch-checklist.md.\n`);
  process.exit(1);
}
console.log("Launch check: all launch items resolved.");
