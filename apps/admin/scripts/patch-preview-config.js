import { readFileSync, writeFileSync } from "node:fs";

const configPath = "build/server/wrangler.json";
const originalPath = "wrangler.jsonc";

const redirected = JSON.parse(readFileSync(configPath, "utf8"));

const originalText = readFileSync(originalPath, "utf8");
const stripped = originalText
  .split("\n")
  .filter((line) => !line.trim().startsWith("//"))
  .join("\n");
const original = JSON.parse(stripped);

const preview = original.env?.preview;
if (!preview) {
  console.error("env.preview not found in wrangler.jsonc");
  process.exit(1);
}

if (preview.name) redirected.name = preview.name;
if (preview.vars) redirected.vars = preview.vars;
if (preview.routes) redirected.routes = preview.routes;
if (preview.d1_databases) redirected.d1_databases = preview.d1_databases;
if (preview.r2_buckets) redirected.r2_buckets = preview.r2_buckets;
if (preview.kv_namespaces) redirected.kv_namespaces = preview.kv_namespaces;

writeFileSync(configPath, JSON.stringify(redirected));
console.log(`Patched ${configPath} with preview config (${redirected.name})`);
