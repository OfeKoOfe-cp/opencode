import { EOL } from "node:os"
import { constants as fsConstants } from "node:fs"
import { access, statfs } from "node:fs/promises"
import { Effect, Option } from "effect"
import { Global } from "@opencode/util/global"
import { Service } from "@opencode/client/effect/service"
import { Commands } from "../commands"
import { Runtime } from "../../framework/runtime"
import { databasePath } from "../../database-path"
import { ServiceConfig } from "../../services/service-config"
import { OPENCODE_ARTIFACT, OPENCODE_CHANNEL, OPENCODE_VERSION } from "../../version"

type Status = "ok" | "warn" | "fail"

interface Check {
  readonly name: string
  readonly status: Status
  readonly detail: string
}

interface Report {
  readonly product: {
    readonly name: string
    readonly version: string
    readonly channel: string
    readonly artifact: string
  }
  readonly runtime: {
    readonly bun: string
    readonly node: string
    readonly platform: string
    readonly arch: string
    readonly execPath: string
  }
  readonly paths: Record<string, string>
  readonly storage: {
    readonly free: string
    readonly total: string
  }
  readonly checks: ReadonlyArray<Check>
}

const NAME = "OfeCode"

export default Runtime.handler(
  Commands.commands.doctor,
  Effect.fn("cli.doctor")(function* (input: Runtime.Input<typeof Commands.commands.doctor>) {
    const global = yield* Global.Service
    const paths: Record<string, string> = {
      home: global.home,
      data: global.data,
      config: global.config,
      cache: global.cache,
      state: global.state,
      tmp: global.tmp,
      bin: global.bin,
      log: global.log,
      repos: global.repos,
      db: databasePath(global.data),
    }

    const checks: Check[] = []
    for (const name of ["data", "config", "state", "cache", "log"] as const) {
      const directory = paths[name]
      const writable = yield* Effect.tryPromise({
        try: async () => {
          await access(directory, fsConstants.W_OK)
          return true
        },
        catch: () => false,
      })
      checks.push({
        name: `${name} directory`,
        status: writable ? "ok" : "fail",
        detail: writable ? directory : `${directory} is not writable`,
      })
    }

    const disk = yield* Effect.tryPromise({
      try: () => statfs(paths.data),
      catch: () => undefined,
    })
    if (disk) {
      const free = Number(disk.bavail) * Number(disk.bsize)
      const total = Number(disk.blocks) * Number(disk.bsize)
      checks.push({
        name: "disk space",
        status: free < 500 * 1024 * 1024 ? "warn" : "ok",
        detail: `${bytes(free)} free of ${bytes(total)} on ${paths.data}`,
      })
    }

    const service = yield* Service.discover({ ...(yield* ServiceConfig.options()), version: undefined }).pipe(
      Effect.option,
    )
    const running = Option.getOrUndefined(service)
    checks.push({
      name: "background service",
      status: "ok",
      detail: running ? `running at ${running.url}` : "stopped",
    })

    const report: Report = {
      product: { name: NAME, version: OPENCODE_VERSION, channel: OPENCODE_CHANNEL, artifact: OPENCODE_ARTIFACT },
      runtime: {
        bun: typeof Bun === "undefined" ? "unavailable" : Bun.version,
        node: process.versions.node,
        platform: process.platform,
        arch: process.arch,
        execPath: process.execPath,
      },
      paths,
      storage: disk
        ? {
            free: bytes(Number(disk.bavail) * Number(disk.bsize)),
            total: bytes(Number(disk.blocks) * Number(disk.bsize)),
          }
        : { free: "unknown", total: "unknown" },
      checks,
    }

    if (input.json) {
      process.stdout.write(JSON.stringify(report, null, 2) + EOL)
      return
    }

    const failed = report.checks.filter((check) => check.status !== "ok")
    if (input.quiet && failed.length === 0) return

    const lines: string[] = []
    lines.push(`${NAME} doctor`, "")
    lines.push("Product")
    lines.push(field("name", report.product.name))
    lines.push(field("version", report.product.version))
    lines.push(field("channel", report.product.channel))
    lines.push(field("artifact", report.product.artifact))
    lines.push("", "Runtime")
    lines.push(field("bun", report.runtime.bun))
    lines.push(field("node", report.runtime.node))
    lines.push(field("platform", report.runtime.platform))
    lines.push(field("arch", report.runtime.arch))
    lines.push(field("exec", report.runtime.execPath))
    lines.push("", "Paths")
    for (const [name, value] of Object.entries(report.paths)) lines.push(field(name, value))
    lines.push("", "Checks")
    for (const check of report.checks) {
      if (input.quiet && check.status === "ok") continue
      lines.push(`${check.status === "ok" ? "ok  " : check.status === "warn" ? "warn" : "fail"}  ${check.name.padEnd(20)} ${check.detail}`)
    }
    process.stdout.write(lines.join(EOL) + EOL)

    if (failed.some((check) => check.status === "fail")) process.exitCode = 1
  }),
)

function field(name: string, value: string) {
  return `  ${name.padEnd(8)} ${value}`
}

function bytes(value: number) {
  const units = ["B", "KB", "MB", "GB", "TB"]
  let size = value
  let unit = 0
  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024
    unit++
  }
  return `${size.toFixed(size >= 100 || unit === 0 ? 0 : 1)} ${units[unit]}`
}

export * as Doctor from "./doctor"
