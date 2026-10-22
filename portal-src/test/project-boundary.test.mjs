import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readProjectFile = (path) => readFile(resolve(projectRoot, path), "utf8");

test("standalone API client preserves portal endpoints and configurable API host", async () => {
  const api = await readProjectFile("src/api.ts");

  for (const path of [
    "/portal/auth/login",
    "/portal/me",
    "/portal/demo-centres",
    "/portal/appointments",
    "/portal/services",
    "/portal/urgencies",
  ]) {
    assert.ok(api.includes(path), `expected portal API path ${path}`);
  }
  assert.match(api, /VITE_API_URL/);
});

test("portal has its own entry point and stylesheet", async () => {
  const entry = await readProjectFile("src/main.tsx");
  const viteConfig = await readProjectFile("vite.config.ts");

  assert.match(entry, /\.\/PortalApp/);
  assert.match(entry, /\.\/portal\.css/);
  assert.match(viteConfig, /base:\s*["']\.\/["']/);
});

test("standalone project ignores generated output and local environment secrets", async () => {
  const ignore = await readProjectFile(".gitignore");

  assert.match(ignore, /node_modules/);
  assert.match(ignore, /dist/);
  assert.match(ignore, /tsbuildinfo/);
  assert.match(ignore, /^\.env$/m);
  assert.match(ignore, /!\.env\.example/);
});
