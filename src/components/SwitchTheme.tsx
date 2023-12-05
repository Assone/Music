import { SegmentedOption } from './Segmented';

enum Theme {
  Auto,
  Light,
  Dark,
}

const SwitchTheme: React.FC = () => {
  const matches = useMediaQuery({ query: '(prefers-color-scheme: dark)' });
  const [theme, setTheme] = useState<Theme>(Theme.Auto);
  const options: SegmentedOption<Theme>[] = [
    {
      label: 'Auto',
      value: Theme.Auto,
    },
    {
      label: 'Light',
      value: Theme.Light,
    },
    {
      label: 'Dark',
      value: Theme.Dark,
    },
  ];

  const onChangeTheme = (theme: Theme) => {
    setTheme(theme);
  };

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
    <Segmented classname="text-sm" options={options} onChange={onChangeTheme} />
  );
};

export default SwitchTheme;
