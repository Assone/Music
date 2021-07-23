import { App, Directive } from 'vue';

import focus from './focus';
import loading from './loading';
import throttle from './throttle';
import debounce from './debounce';
import clickOutside from './click-outside';

const directives: Record<string, Directive> = {
  focus,
  loading,
  throttle,
  debounce,
  clickOutside,
};

const install = (app: App) => {
  Object.keys(directives).forEach((key) => {
    app.directive(key, directives[key]);
  });
};

export default {
  install,
};
