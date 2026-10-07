import { cpSync, existsSync, readdirSync, statSync } from "node:fs"
import { join, resolve } from "node:path"

const root = resolve(import.meta.dirname, "..")

function visit(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    if (entry.name === "node_modules" || entry.name === ".git") continue
    if (entry.isDirectory()) {
      visit(path)
      continue
    }
    if (!entry.name.endsWith(".example")) continue

    const destination = path.slice(0, -".example".length)
    if (!existsSync(destination)) cpSync(path, destination)
  }
}

visit(root)
