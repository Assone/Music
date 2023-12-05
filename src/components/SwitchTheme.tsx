import { Theme } from '@/hooks/useTheme';
import { SegmentedOption } from './Segmented';

const SwitchTheme: React.FC = () => {
  const { setTheme, theme } = useTheme();
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

  return (
    <Segmented
      classname="text-sm"
      value={theme}
      options={options}
      onChange={setTheme}
    />
  );
};

export default SwitchTheme;
