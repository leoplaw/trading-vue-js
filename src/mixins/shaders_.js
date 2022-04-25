
// Parser for shader events

import {  watch } from "vue";

export function init_shaders(skin, prev) {
  if (skin !== prev) {
      if (prev) this.shaders = this.shaders.filter(
          x => x.owner !== prev.id
      )
      for (var Shader of skin.shaders) {
          let shader = new Shader()
          shader.owner = skin.id
          this.shaders.push(shader)
      }
      // TODO: Sort by zIndex
  }
}

export function on_shader_event(d, target) {
  if (d.event === 'new-shader') {
      if (d.args[0].target === target) {
          d.args[0].id = `${d.args[1]}-${d.args[2]}`
          this.shaders.push(d.args[0])
          this.rerender++
      }
  }
  if (d.event === 'remove-shaders') {
      let id = d.args.join('-')
      this.shaders = this.shaders
          .filter(x => x.id !== id)
  }
}

export function watch_skin(skin) {
  watch ( skin, (n, p) => {
    init_shaders(n, p)
  })
}

export const shaders = []
