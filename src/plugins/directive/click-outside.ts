import { isFunction } from '@/utils';
import { Directive } from 'vue';

const clickOutside: Directive = {
  beforeMount(el, binding) {
    const { value } = binding;

    el.event = (event: Event) => {
      if (!(el === event.target || el.contains(event.target))) {
        if (isFunction(value)) {
          value();
        }
      }
    };

    document.body.addEventListener('click', el.event, true);
  },

  beforeUnmount(el) {
    document.body.removeEventListener('click', el.event, true);
  },
};

export default clickOutside;
