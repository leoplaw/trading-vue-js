<template>
  <!-- Horizontal section: (grid + sidebar) -->
  <div class="trading-vue-section">
    <chart-legend
      ref="legend"
      v-bind:values="section_values"
      v-bind:grid_id="grid_id"
      v-bind:common="legend_props"
      v-bind:meta_props="get_meta_props"
      @legend-button-click="button_click"
    >
    </chart-legend>
    <grid
      v-bind="grid_props"
      ref="grid"
      v-bind:grid_id="grid_id"
      @register-kb-listener="register_kb"
      @remove-kb-listener="remove_kb"
      @range-changed="range_changed"
      @cursor-changed="cursor_changed"
      @cursor-locked="cursor_locked"
      @layer-meta-props="emit_meta_props"
      @custom-event="emit_custom_event"
      @sidebar-transform="sidebar_transform"
      @rezoom-range="rezoom_range"
    >
    </grid>
    <sidebar
      ref="sb"
      v-bind="sidebar_props"
      v-bind:grid_id="grid_id"
      v-bind:rerender="rerender"
      @sidebar-transform="sidebar_transform"
    >
    </sidebar>
  </div>
</template>

<script>
import {
  toRefs,
  ref,
  computed,
  onMounted,
} from "vue";
import Grid from "./Grid.vue";
import Sidebar from "./Sidebar.vue";
import ChartLegend from "./Legend.vue";
import {
  init_shaders,
  on_shader_event,
  watch_skin,
  shaders,
} from "../mixins/shaders_.js";
export default {
  name: "GridSection",
  components: {
    Grid,
    Sidebar,
    ChartLegend,
  },
  props: ["common", "grid_id"],
  emits: [
    "register-kb-listener",
    "remove-kb-listener",
    "range-changed",
    "cursor-changed",
    "cursor-locked",
    "sidebar-transform",
    "layer-meta-props",
    "custom-event",
    "legend-button-click",
  ],

  setup(props, ctx) {
    const { common, grid_id } = toRefs(props);
    const meta_props = ref({});
    const sb = ref(null);
    const rerender = ref(0);
    const last_ghash = ref("");
    const grid_props = computed(() => {
      const id = props.grid_id;
      let p = Object.assign({}, props.common);
      if (id > 0) {
        let all = p.data;
        p.data = [p.data[id - 1]];
        p.data.push(...all.filter((x) => x.grid && x.grid.id === id));
      }
      p.width = p.layout.grids[id].width;
      p.height = p.layout.grids[id].height;
      p.y_transform = p.y_ts[id];
      p.shaders = grid_shaders.value;
      return p;
    });
    const sidebar_props = computed(() => {
      const id = props.grid_id;
      let p = Object.assign({}, props.common);
      p.width = p.layout.grids[id].sb;
      p.height = p.layout.grids[id].height;
      p.y_transform = p.y_ts[id];
      p.shaders = sb_shaders.value;
      return p;
    });
    const section_values = computed(() => {
      const id = props.grid_id;
      let p = Object.assign({}, props.common);
      p.width = p.layout.grids[id].width;
      return p.cursor.values[id];
    });
    const legend_props = computed(() => {
      const id = props.grid_id;
      let p = Object.assign({}, props.common);
      if (id > 0) {
        let all = p.data;
        p.offchart = all;
        p.data = [p.data[id - 1]];
        p.data.push(...all.filter((x) => x.grid && x.grid.id === id));
      }
      return p;
    });
    const get_meta_props = computed(() => {
      return meta_props.value;
    });
    const grid_shaders = computed(() => {
      return shaders.filter((x) => x.target === "grid");
    });
    const sb_shaders = computed(() => {
      return shaders.filter((x) => x.target === "sidebar");
    });
    function range_changed(r) {
      ctx.emit("range-changed", r);
    }
    function cursor_changed(c) {
      c.grid_id = props.grid_id;
      ctx.emit("cursor-changed", c);
    }
    function cursor_locked(state) {
      ctx.emit("cursor-locked", state);
    }
    function sidebar_transform(s) {
      ctx.emit("sidebar-transform", s);
    }
    function emit_meta_props(d) {
      meta_props[d.layer_id] = d;
      ctx.emit("layer-meta-props", d);
    }
    function emit_custom_event(d) {
      on_shader_event(d, "sidebar");
      ctx.emit("custom-event", d);
    }
    function button_click(event) {
      ctx.emit("legend-button-click", event);
    }
    function register_kb(event) {
      ctx.emit("register-kb-listener", event);
    }
    function remove_kb(event) {
      ctx.emit("remove-kb-listener", event);
    }
    function rezoom_range(event) {
      if (sb) {
        sb.renderer.rezoom_range(event.z, event.diff1, event.diff2);
      }
    }
    function ghash(val) {
      // Measures grid heights configuration
      let hs = val.layout.grids.map((x) => x.height);
      return hs.reduce((a, b) => a + b, "");
    }
    onMounted(() => {
      init_shaders(props.common.skin);
    });
    return {
      meta_props,
      rerender,
      last_ghash,
      grid_props,
      sidebar_props,
      section_values,
      legend_props,
      get_meta_props,
      grid_shaders,
      sb_shaders,
      range_changed,
      cursor_changed,
      cursor_locked,
      sidebar_transform,
      emit_meta_props,
      emit_custom_event,
      button_click,
      register_kb,
      remove_kb,
      rezoom_range,
      ghash,
    };
  },
}
</script>
<style>
.trading-vue-section {
  height: 0;
  position: absolute;
}
</style>
