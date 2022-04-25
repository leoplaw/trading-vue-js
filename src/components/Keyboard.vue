
<!-- Listens to native keyboard events,
     propagates to all KeyboardListeners -->

<script>

import { onBeforeUnmount } from 'vue'

export default {
  name: "Keyboard",
  setup(props, ctx) {

    const _listeners = {}

    const keydown = (event) => {
      for (var id in _listeners) {
        let l = _listeners[id];
        if (l && l.keydown) {
          l.keydown(event);
        } else {
          console.warn(`No 'keydown' listener for ${id}`);
        }
      }
    };
    const keyup = (event) => {
      for (var id in _listeners) {
        let l = _listeners[id];
        if (l && l.keyup) {
          l.keyup(event);
        } else {
          console.warn(`No 'keyup' listener for ${id}`);
        }
      }
    };
    const keypress = (event) => {
      for (var id in _listeners) {
        let l = _listeners[id];
        if (l && l.keypress) {
          l.keypress(event);
        } else {
          console.warn(`No 'keypress' listener for ${id}`);
        }
      }
    };
    const register = (listener) => {
      _listeners[listener.id] = listener;
    };
    const remove = (listener) => {
      delete _listeners[listener.id];
    };

    onBeforeUnmount(() => {
      window.removeEventListener('keydown', keydown)
      window.removeEventListener('keyup', keyup)
      window.removeEventListener('keypress', keypress)
    })

    window.addEventListener('keydown', keydown)
    window.addEventListener('keyup', keyup)
    window.addEventListener('keypress', keypress)

    return { keydown, keyup, keypress, register, remove };
  },
  render() {
    return [];
  },
}

</script>
