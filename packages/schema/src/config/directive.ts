export * as ConfigDirective from "./directive.js"

import { Schema } from "effect"
import { Directive } from "../directive.js"
import { optional } from "../schema.js"

export class Info extends Schema.Class<Info>("Config.Directive")({
  preset: Schema.Literals(["none", "direct"]).pipe(optional).annotate({
    description:
      'A built-in set of standing instructions. "direct" tells the model to do the work instead of discussing it. "none" adds nothing.',
  }),
  layers: Schema.Array(Directive.Layer).pipe(optional).annotate({
    description: "Additional instruction layers, applied in order after the preset",
  }),
}) {}
