
// Useful stuff for creating overlays. Include as mixin

import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

import Mouse from '../stuff/mouse.js'

export default {
    props: [
        'id', 'num', 'interval', 'cursor', 'colors',
        'layout', 'sub', 'data', 'settings', 'grid_id',
        'font', 'config', 'meta', 'tf', 'i0'
    ],
    emits: [
        'new-grid-layer', 'layer-meta-props', 'delete-grid-layer',
        'custom-event', 'show-grid-layer', 'drawing-mode-off',
        'scroll-lock', 'change-settings', 'object-selected',
        'new-shader', 'remove-tool', 'redraw-grid'
    ],
    setup(props, ctx) {

      let uxs_count = 0
      let last_ux_id = null

      watch(props.settings, (n, p) => {
        if (this.watch_uuid) this.watch_uuid(n, p)
        ctx.emit('show-grid-layer', {
            id: props.id,
            display: 'display' in props.settings ?
                props.settings['display'] : true,
        })
      })
    
      function use_for() {
        /* override it (mandatory) */
        console.warn('use_for() should be implemented')
        console.warn(
        `Format: use_for() {
              return ['type1', 'type2', ...]
        }`)
      }

      function meta_info() {
        /* override it (optional) */
        let id = props.id
        console.warn(
            `${id} meta_info() is req. for publishing`)
        console.warn(
        `Format: meta_info() {
            author: 'Satoshi Smith',
            version: '1.0.0',
            contact (opt) '<email>'
            github: (opt) '<GitHub Page>',
        }`)
      }

      function custom_event(e, ...args) {
        if (e.split(':')[0] === 'hook') return
        if (e === 'change-settings' ||
            e === 'object-selected' ||
            e === 'new-shader' ||
            e === 'new-interface' ||
            e === 'remove-tool') {
            args.push(this.grid_id, this.id)
            if (props.settings.$uuid) {
                args.push(props.settings.$uuid)
            }
        }
        if (e === 'new-interface') {
            args[0].overlay = this
            args[0].uuid = last_ux_id =
                `${this.grid_id}-${this.id}-${uxs_count++}`
        }
        ctx.emit('custom-event', {e, args})
      }
      // TODO: the event is not firing when the same
      // overlay type is added to the offchart[]

      function exec_script() {
        if (this.calc) ctx.emit('exec-script', {
            grid_id: props.grid_id,
            layer_id: props.id,
            src: this.calc(),
            use_for: use_for()
        })
      }

      onMounted(() => {
        // TODO(1): when hot reloading, dynamicaly changed mixins
        // dissapear (cuz it's a hack), the only way for now
        // is to reload the browser
        if (!this.draw) {
            this.draw = ctx => {
                let text = 'EARLY ADOPTER BUG: reload the browser & enjoy'
                console.warn(text)
            }
        }
        // Main chart?
        let main = props.sub === props.data

        this.meta_info()

        ctx.emit('new-grid-layer', {
            name: this.$options.name,
            id: props.id,
            renderer: this,
            display: 'display' in props.settings ?
               props.settings['display'] : true,
            z: props.settings['z-index'] ||
               props.settings['zIndex'] || (main ? 0 : -1),
        })

        // Overlay meta-props (adjusting behaviour)
        ctx.emit('layer-meta-props', {
            grid_id: props.grid_id,
            layer_id: props.id,
            legend: this.legend,
            data_colors: this.data_colors,
            y_range: this.y_range
        })
        this.exec_script()
        this.mouse = new Mouse(this)
        if (this.init_tool) this.init_tool()
        if (this.init) this.init()
      })

      onBeforeUnmount(() => {
        if (this.destroy) this.destroy()
        ctx.emit('delete-grid-layer', props.id)
      })
    

      return {
        use_for,
        meta_info,
        custom_event,
        exec_script
      }
    },

    render() { return [] }

}
