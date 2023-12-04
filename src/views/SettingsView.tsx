const SettingsView: React.FC = () => (
  <div className="flex flex-col gap-2 p-4">
    <Typography.Title>Settings</Typography.Title>

    <div>
      <Typography.Title level={2}>Display</Typography.Title>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-2">
          <Typography.Text>Theme</Typography.Text>
          {/* <Select defaultValue="light" style={{ width: 120 }}>
              <Select.Option value="light">Light</Select.Option>
              <Select.Option value="dark">Dark</Select.Option>
            </Select> */}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-2">
          <Typography.Text>Language</Typography.Text>
          <SwitchLanguage />
        </div>
      </div>
    </div>
  </div>
);

export default SettingsView;
