import { createApp } from 'vue';
import 'vite-plugin-svg-icons/register';

import App from './App.vue';
import './styles/index.scss';

import store, { key } from './store';
import router from './router';
import './plugins/interceptors';
import i18n from './plugins/i18n';
import directive from './plugins/directive';

import { isDev, isMobile } from './utils';

createApp(App).use(router).use(store, key).use(i18n).use(directive).mount('#app');

if (isDev && isMobile) {
  // eslint-disable-next-line import/no-extraneous-dependencies
  import('eruda').then((eruda) => {
    eruda.init();
  });
}
