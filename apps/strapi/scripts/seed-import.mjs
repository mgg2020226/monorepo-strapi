#!/usr/bin/env node

import { spawn } from "node:child_process"
import { readdirSync } from "node:fs"
import path from "node:path"
import process from "node:process"
import { fileURLToPath } from "node:url"

const appDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const exportsDir = path.join(appDir, "seed", "exports")
const exportName = readdirSync(exportsDir, { withFileTypes: true })
  .filter(
    (entry) =>
      entry.isFile() &&
      entry.name.startsWith("strapi-export-") &&
      entry.name.endsWith(".tar.gz")
  )
  .map((entry) => entry.name)
  .sort((left, right) => left.localeCompare(right))
  .at(-1)

if (!exportName) {
  console.log("[seed:import] No seed exports found; skipping import.")
  process.exit(0)
}

const exportPath = path.join(exportsDir, exportName)
const strapiScript = path.join(
  appDir,
  "node_modules",
  "@strapi",
  "strapi",
  "bin",
  "strapi.js"
)

console.log(`[seed:import] Importing ${exportPath}`)

const child = spawn(
  process.execPath,
  [strapiScript, "import", "--force", "-f", exportPath],
  {
    cwd: appDir,
    env: process.env,
    stdio: "inherit",
  }
)

child.on("error", (error) => {
  console.error(error)
  process.exit(1)
})

child.on("exit", (exitCode, signal) => {
  if (signal) {
    console.error(`[seed:import] Strapi exited with signal ${signal}.`)
    process.exit(1)
  }

  process.exit(exitCode ?? 1)
})
