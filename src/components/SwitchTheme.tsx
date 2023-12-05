import { SegmentedOption } from './Segmented';

enum Theme {
  Auto,
  Light,
  Dark,
}

const SwitchTheme: React.FC = () => {
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
    switch (theme) {
      case Theme.Auto:
        // document.documentElement.classList.remove('light', 'dark');
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
  };

  return (
    <Segmented classname="text-sm" options={options} onChange={onChangeTheme} />
  );
};

export default SwitchTheme;
