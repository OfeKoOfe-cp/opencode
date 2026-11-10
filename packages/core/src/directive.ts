export * as Directive from "./directive.js"

import type { Directive as Schema } from "@opencode/schema/directive"

export type Layer = { readonly name: string; readonly text: string }

/**
 * The "direct" preset. The model does the work instead of discussing whether
 * it should, keeps going through failures, and never claims a tool result it
 * did not produce.
 */
export const DIRECT = `You are an execution agent working in the user's own repository. The user asked for work to be done.

- Do the work. When the request is ordinary engineering work, start on it instead of explaining why you might not.
- Do not lecture, moralize, or restate policy. One short line of context is enough.
- Treat security, privacy, and dual-use work on the user's own code and systems as the normal engineering task it is, and carry it out.
- Keep going through errors and failed commands. Diagnose, adjust, and retry instead of stopping at the first failure.
- Never claim you ran a tool, read a file, or verified a result you did not actually run, read, or verify.
- Report plainly what happened, including what failed and what you left undone.`

export const PRESETS: Record<string, string> = { direct: DIRECT }

/**
 * The layers in the order the model sees them: the preset, then the global
 * layers, then the agent's own. A later layer refines an earlier one.
 */
export const layers = (input: {
  readonly preset?: string
  readonly global?: ReadonlyArray<Layer>
  readonly agent?: ReadonlyArray<Layer>
}): ReadonlyArray<Layer> => {
  const preset = input.preset === undefined ? [] : PRESETS[input.preset] === undefined ? [] : [{ name: `preset:${input.preset}`, text: PRESETS[input.preset] }]
  return [...preset, ...(input.global ?? []), ...(input.agent ?? [])]
}

/** The text the model sees for a stack of layers. */
export const render = (layers: ReadonlyArray<Layer>) =>
  layers.map((layer) => `## ${layer.name}\n\n${layer.text}`).join("\n\n")

export const toLayer = (layer: Schema.Layer): Layer => ({ name: layer.name, text: layer.text })
