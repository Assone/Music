import { SupportedLanguage } from '@/services/i18n';

export const SwitchLanguage: React.FC = () => {
  const { i18n } = useTranslation();
  const supportedLanguages: { name: string; value: SupportedLanguage }[] = [
    { name: 'English', value: 'en' },
    { name: '简体中文', value: 'zh' },
  ];

  const onChange = (value: SupportedLanguage) => {
    i18n
      .changeLanguage(value)
      .catch((e) => console.debug('[i18n] Failed to change language', e));
  };

  return (
    <Select
      options={supportedLanguages}
      value={i18n.language}
      onChange={(e) => onChange(e as SupportedLanguage)}
    />
  );
};

export default SwitchLanguage;
