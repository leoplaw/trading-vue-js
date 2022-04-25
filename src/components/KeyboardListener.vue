
<!-- Waits for an event from Keyboard.vue
     and converts it to a Vue.js event -->

<script>

export default {
  name: "KeyboardListener",
  emits: [
    "register-kb-listener",
    "remove-kb-listener",
    "keydown",
    "keyup",
    "keypress",
  ],

  setup(_props, ctx) {
    const keydown = (event) => {
      ctx.emit("keydown", event);
    };
    const keyup = (event) => {
      ctx.emit("keyup", event);
    };
    const keypress = (event) => {
      ctx.emit("keypress", event);
    };
    return { keydown, keyup, keypress };
  },

  render() {
    return [];
  },
}

</script>
