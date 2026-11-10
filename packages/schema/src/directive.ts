export * as Directive from "./directive.js"

import { Schema } from "effect"

/**
 * One named layer of standing instructions. Layers stack, and the model sees
 * them in order, so a later layer can refine an earlier one.
 */
export class Layer extends Schema.Class<Layer>("Directive.Layer")({
  name: Schema.String,
  text: Schema.String,
}) {}
