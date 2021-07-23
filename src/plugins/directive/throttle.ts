import { Directive } from 'vue';
import { throttle as lodashThrottle } from 'lodash-es';
import { isFunction } from '@/utils';

const throttle: Directive = {
  mounted(el: HTMLElement, binding) {
    const { modifiers, value } = binding;
    const time = Number(el.dataset.throttle) || 1000;

    if (isFunction(value)) {
      Object.keys(modifiers).forEach((key) => {
        if (modifiers[key]) {
          el.addEventListener(key, lodashThrottle(value, time));
        }
      });
    } else {
      console.error('value must is a function');
    }
  },
};

export default throttle;
