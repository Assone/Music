import { Ref, computed } from 'vue';

import useStoreMutations from './useStoreMutations';
import useStoreState from './useStoreState';

export const useThemeColorHSL = (colorRaw: Ref<IAppConfig['themeColor'][0]>) =>
  computed(() => {
    const [h, s, l] = colorRaw.value.split(', ');

    return {
      h,
      s,
      l,
    };
  });

export const useTheme = () => {
  const { color, themeColor } = useStoreState();
  const { setTheme } = useStoreMutations();

  const theme: ['auto', 'light', 'dark'] = ['auto', 'light', 'dark'];

  return {
    color,
    themeColor,
    theme,

    setTheme,
  };
};
