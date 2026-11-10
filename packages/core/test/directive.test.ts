import { expect, test } from "bun:test"
import { Directive } from "@opencode/core/directive"

test("directive layers stack the preset, the global layers, then the agent's own", () => {
  const layers = Directive.layers({
    preset: "direct",
    global: [{ name: "house", text: "House rules." }],
    agent: [{ name: "review", text: "Review every diff." }],
  })
  expect(layers.map((layer) => layer.name)).toEqual(["preset:direct", "house", "review"])
  expect(layers[0]?.text).toContain("Do the work")
  expect(layers[2]?.text).toBe("Review every diff.")
})

test("an unknown preset adds nothing", () => {
  expect(Directive.layers({ preset: "nope" })).toEqual([])
  expect(Directive.layers({})).toEqual([])
})

test("rendered layers carry their name so the model can tell them apart", () => {
  expect(Directive.render([{ name: "house", text: "House rules." }])).toBe("## house\n\nHouse rules.")
  expect(Directive.render([])).toBe("")
})
