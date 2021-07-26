import { computed } from 'vue';

import useStoreMutations from './useStoreMutations';
import useStoreState from './useStoreState';

export const useThemeColorHSL = () => {
  const { color } = useStoreState();

  const themeColorStyle = computed(() => {
    const [h, s, l] = color.value.split(', ');

    return [
      `--theme-color-raw: ${color.value}`,
      `--theme-color-h: ${h}`,
      `--theme-color-s: ${s}`,
      `--theme-color-l: ${l}`,
    ];
  });

  return {
    themeColorStyle,
  };
};

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
