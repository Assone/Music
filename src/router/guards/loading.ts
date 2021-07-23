import { NavigationGuard, NavigationHookAfter } from 'vue-router';
import { useNProgress } from '@vueuse/integrations/useNProgress';

const { isLoading } = useNProgress();

export const startLoading: NavigationGuard = () => {
  isLoading.value = true;
};

export const stopLoading: NavigationHookAfter = () => {
  isLoading.value = false;
};
