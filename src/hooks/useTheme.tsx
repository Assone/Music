import { PropsWithChildren, createContext } from 'react';

export enum Theme {
  Auto,
  Light,
  Dark,
}

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>(null!);

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const isDark = useMediaQuery({ query: '(prefers-color-scheme: dark)' });
  const [theme, setTheme] = useLocalStorage<Theme>('theme', Theme.Auto);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
    }),
    [setTheme, theme],
  );

  useEffect(() => {
    switch (theme) {
      case Theme.Auto:
        if (isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }

        break;
      case Theme.Light:
        document.documentElement.classList.remove('dark');

        break;
      case Theme.Dark:
        document.documentElement.classList.add('dark');
        break;
      default:
        break;
    }
  }, [isDark, theme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
