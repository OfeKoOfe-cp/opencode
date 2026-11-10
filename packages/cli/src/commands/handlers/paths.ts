import { EOL } from "node:os"
import { Effect, Option } from "effect"
import { Global } from "@opencode/util/global"
import { Commands } from "../commands"
import { Runtime } from "../../framework/runtime"
import { databasePath } from "../../database-path"

export const pathsOf = (global: Global.Interface) => ({
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
})

export default Runtime.handler(
  Commands.commands.paths,
  Effect.fn("cli.paths")(function* (input: Runtime.Input<typeof Commands.commands.paths>) {
    const global = yield* Global.Service
    const paths = pathsOf(global)
    const name = Option.getOrUndefined(input.name)
    if (name) {
      process.stdout.write(paths[name] + EOL)
      return
    }
    if (input.json) {
      process.stdout.write(JSON.stringify(paths, null, 2) + EOL)
      return
    }
    process.stdout.write(
      Object.entries(paths)
        .map(([key, value]) => `${key.padEnd(10)} ${value}${EOL}`)
        .join(""),
    )
  }),
)

export * as Paths from "./paths"
