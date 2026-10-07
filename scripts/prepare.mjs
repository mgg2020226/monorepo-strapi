import { execFileSync } from "node:child_process"
import process from "node:process"

const run = (command, args, options = {}) =>
  execFileSync(command, args, {
    cwd: process.cwd(),
    stdio: "inherit",
    ...options,
  })

try {
  run(process.platform === "win32" ? "git.exe" : "git", [
    "rev-parse",
    "--is-inside-work-tree",
  ], { stdio: "ignore" })
} catch {
  console.log("Skipping lefthook install: not inside a Git worktree.")
  process.exit(0)
}

if (process.platform === "win32") {
  run("cmd.exe", [
    "/d",
    "/s",
    "/c",
    "pnpm exec lefthook install --reset-hooks-path",
  ])
} else {
  run("pnpm", ["exec", "lefthook", "install", "--reset-hooks-path"])
}
