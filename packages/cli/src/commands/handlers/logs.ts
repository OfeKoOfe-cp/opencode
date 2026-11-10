import { EOL } from "node:os"
import { open } from "node:fs/promises"
import path from "node:path"
import { Effect } from "effect"
import { Global } from "@opencode/util/global"
import { Commands } from "../commands"
import { Runtime } from "../../framework/runtime"

const LOG_FILE = "opencode.log"

export default Runtime.handler(
  Commands.commands.logs,
  Effect.fn("cli.logs")(function* (input: Runtime.Input<typeof Commands.commands.logs>) {
    const global = yield* Global.Service
    const file = path.join(global.log, LOG_FILE)
    if (input.path) {
      process.stdout.write(file + EOL)
      return
    }

    const content = yield* Effect.tryPromise({
      try: () => readFile(file),
      catch: () => new Error(`No log file at ${file}`),
    }).pipe(Effect.option)
    if (content._tag === "None") {
      process.stderr.write(`No log file at ${file}${EOL}`)
      process.exitCode = 1
      return
    }

    const buffer = content.value
    const tail = input.tail ?? 50
    const slice = buffer.toString("utf8").split(/\r?\n/).slice(-tail).join(EOL)
    if (slice) process.stdout.write(slice + EOL)
    if (!input.follow) return

    let offset = buffer.length
    while (true) {
      yield* Effect.sleep("1 second")
      const chunk = yield* Effect.tryPromise({
        try: () => readFrom(file, offset),
        catch: () => new Error(`No log file at ${file}`),
      })
      if (chunk.length === 0) continue
      process.stdout.write(chunk.toString("utf8"))
      offset += chunk.length
    }
  }),
)

async function readFile(file: string) {
  const handle = await open(file, "r")
  try {
    return Buffer.from(await handle.readFile())
  } finally {
    await handle.close()
  }
}

async function readFrom(file: string, offset: number) {
  const handle = await open(file, "r")
  try {
    const size = (await handle.stat()).size
    if (size <= offset) return Buffer.alloc(0)
    const chunk = Buffer.alloc(size - offset)
    await handle.read(chunk, 0, chunk.length, offset)
    return chunk
  } finally {
    await handle.close()
  }
}

export * as Logs from "./logs"
