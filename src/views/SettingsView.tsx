const SettingsView: React.FC = () => (
  <div className="flex flex-col gap-2 p-4">
    <Typography.Title>Settings</Typography.Title>

    <div className="flex flex-col gap-2">
      <Typography.Title level={2}>Display</Typography.Title>
      <div className="flex flex-col gap-2 bg-neutral-400 p-2 rounded">
        <div className="flex flex-row gap-2 justify-between items-center">
          <Typography.Text>Theme</Typography.Text>
          <SwitchTheme />
        </div>

        <div className="flex flex-row justify-between gap-2 items-center">
          <Typography.Text>Language</Typography.Text>
          <SwitchLanguage />
        </div>
      </div>
    </div>
  </div>
);

export default SettingsView;
