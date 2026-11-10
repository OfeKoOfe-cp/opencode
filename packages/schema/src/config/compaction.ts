export * as ConfigCompaction from "./compaction.js"

import { Schema } from "effect"
import { NonNegativeInt, optional, PositiveInt } from "../schema.js"

export class Keep extends Schema.Class<Keep>("Config.Compaction.Keep")({
  tokens: NonNegativeInt.pipe(optional),
}) {}

/** A share of the model's window such as "20%" or "12.5%", from 1% up to but not including 100%. */
export const Percent = Schema.String.check(Schema.isPattern(/^([1-9]\d?(\.\d+)?)%$/u)).annotate({
  identifier: "Config.Compaction.Percent",
})
export type Percent = typeof Percent.Type

/** A share of the model's window that may exceed it, such as "120%". */
export const Share = Schema.String.check(Schema.isPattern(/^([1-9]\d*(\.\d+)?)%$/u)).annotate({
  identifier: "Config.Compaction.Share",
})
export type Share = typeof Share.Type

/** What a summary does with tool output in the exchanges it covers. */
export const ToolPolicy = Schema.Literals(["keep", "clip", "drop"]).annotate({
  identifier: "Config.Compaction.ToolPolicy",
})
export type ToolPolicy = typeof ToolPolicy.Type

export class Info extends Schema.Class<Info>("Config.Compaction")({
  auto: Schema.Boolean.pipe(optional),
  keep: Keep.pipe(optional),
  tool_output: PositiveInt.pipe(optional).annotate({
    description:
      "Characters of tool output kept in the summary and in the conversation kept beside it. A larger value keeps more of each tool result.",
  }),
  buffer: Schema.Union([Percent, NonNegativeInt]).pipe(optional).annotate({
    description:
      'Room kept free below the model\'s context window before automatic compaction, as a share of the window from "1%" to "99%", such as "20%" to compact at 80% full. A token count is also accepted.',
  }),
  context: Schema.Union([Share, NonNegativeInt]).pipe(optional).annotate({
    description:
      'The effective context window compaction plans for, overriding the window the model reports. A token count sets it directly; a share such as "120%" scales the reported window. Use it when the endpoint accepts more than the model ID claims.',
  }),
  tools: ToolPolicy.pipe(optional).annotate({
    description:
      'What a summary does with tool output: "keep" leaves it verbatim, "clip" trims it to a sample, "drop" omits it. The oldest exchanges are shortened first.',
  }),
  precompute: Schema.Boolean.pipe(optional).annotate({
    description:
      "Summarize in the background as the context nears the threshold, so automatic compaction can swap the summary in without waiting.",
  }),
}) {}
