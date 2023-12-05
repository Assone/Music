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
  const matches = useMediaQuery({ query: '(prefers-color-scheme: dark)' });
  const [theme, setTheme] = useState<Theme>(Theme.Auto);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
    }),
    [theme],
  );

  useEffect(() => {
    switch (theme) {
      case Theme.Auto:
        if (matches) {
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
  }, [matches, theme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
