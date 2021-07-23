import { usePreferredDark } from '@vueuse/core';

export * from './is';
export * from './format';

export const usePhotoResize =
  (x: number, y: number) =>
  (path: string | undefined): string =>
    `${path}?param=${x}y${y}`;

export const useSetTheme = (theme: 'auto' | 'dark' | 'light'): void => {
  if (theme === 'auto') {
    const isDark = usePreferredDark();

    if (isDark.value) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } else {
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);
  }
};
