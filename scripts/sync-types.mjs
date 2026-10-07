import { cpSync, mkdirSync } from "node:fs"
import { dirname, resolve } from "node:path"

const root = resolve(import.meta.dirname, "..")
const source = resolve(root, "apps/strapi/types/generated")
const destination = resolve(root, "packages/strapi-types/generated")

mkdirSync(dirname(destination), { recursive: true })
mkdirSync(destination, { recursive: true })
cpSync(source, destination, { recursive: true })
