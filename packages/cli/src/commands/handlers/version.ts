import { EOL } from "node:os"
import { Effect } from "effect"
import { Global } from "@opencode/util/global"
import { Commands } from "../commands"
import { Runtime } from "../../framework/runtime"
import { OPENCODE_ARTIFACT, OPENCODE_CHANNEL, OPENCODE_VERSION } from "../../version"
import { pathsOf } from "./paths"

const NAME = "OfeCode"

export default Runtime.handler(
  Commands.commands.version,
  Effect.fn("cli.version")(function* (input: Runtime.Input<typeof Commands.commands.version>) {
    const global = yield* Global.Service
    const report = {
      name: NAME,
      version: OPENCODE_VERSION,
      channel: OPENCODE_CHANNEL,
      artifact: OPENCODE_ARTIFACT,
      runtime: {
        bun: typeof Bun === "undefined" ? "unavailable" : Bun.version,
        node: process.versions.node,
        platform: process.platform,
        arch: process.arch,
        execPath: process.execPath,
      },
      paths: pathsOf(global),
    }
    if (input.json) {
      process.stdout.write(JSON.stringify(report, null, 2) + EOL)
      return
    }
    const lines = [
      `${NAME} ${OPENCODE_VERSION}`,
      "",
      "Product",
      field("name", NAME),
      field("version", OPENCODE_VERSION),
      field("channel", OPENCODE_CHANNEL),
      field("artifact", OPENCODE_ARTIFACT),
      "",
      "Runtime",
      field("bun", report.runtime.bun),
      field("node", report.runtime.node),
      field("platform", report.runtime.platform),
      field("arch", report.runtime.arch),
      field("exec", report.runtime.execPath),
      "",
      "Paths",
      ...Object.entries(report.paths).map(([name, value]) => field(name, value)),
    ]
    process.stdout.write(lines.join(EOL) + EOL)
  }),
)

function field(name: string, value: string) {
  return `  ${name.padEnd(8)} ${value}`
}

export * as Version from "./version"
