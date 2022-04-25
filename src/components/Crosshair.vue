<script>

import { toRefs, watch } from "vue";
import Crosshair from "./js/crosshair.js";
import Utils from "../stuff/utils.js";
export default {
  name: "Crosshair",
  props: ["cursor", "colors", "layout", "sub", 
          // were passed to component but could not be automatically inherited
          "interval", "font", "config"],
  emits: ["new-grid-layer", "redraw-grid",
          // were passed to component but could not be automatically inherited
          "deleteGridLayer", "showGridLayer", "layerMetaProps", "customEvent"],

  setup(props, ctx) {
    const { cursor, colors, layout, sub } = toRefs(props);

    let ch = null

    const create = () => {
      ch = new Crosshair(this);
      ctx.emit("new-grid-layer", {
        name: "crosshair",
        renderer: ch,
      });
    };

    watch(cursor, (newVal, oldVal) => {
      if (!ch) create()

      // Explore = default mode on mobile
      const cursor = props.cursor
      const explore = cursor.mode === 'explore'

      if (!cursor.x || !cursor.y) {
          ch.hide()
          ctx.emit('redraw-grid')
          return
      }
      ch.visible = !explore
    })

    return { create };
  },

  render() {
    return [];
  }
}

</script>
