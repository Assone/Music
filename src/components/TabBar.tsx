import { isFunction } from '@/utils/is';
import { cx } from '@emotion/css';
import { m } from 'framer-motion';

type TabBarItemContent =
  | React.ReactNode
  | ((isActive: boolean) => React.ReactNode);

interface TabBarItemOptions {
  key: string;
  title: TabBarItemContent;
  icon?: TabBarItemContent;
}

interface TabBarProps {
  activeKey?: string;
  items: TabBarItemOptions[];
  className?: string;
  onChange?: (key: string) => void;
}

const TabBar: React.FC<TabBarProps> = ({
  activeKey,
  items,
  className,
  onChange,
}) => {
  const [active, setActive] = useState(activeKey);

  useEffect(() => {
    if (activeKey) {
      setActive(activeKey);
    } else {
      setActive(items?.[0]?.key);
    }
  }, [activeKey, items]);

  const onActiveChange = useCallback(
    (key: string) => {
      setActive(key);
      onChange?.(key);
    },
    [onChange],
  );

  return (
    <div className={className}>
      <m.ul className={cx('flex justify-center h-full items-center py-2')}>
        {items.map(({ key, ...options }) => {
          const isActive = active === key;
          const icon = isFunction(options.icon)
            ? options.icon(isActive)
            : options.icon;
          const title = isFunction(options.title)
            ? options.title(isActive)
            : options.title;

          return (
            <m.li
              key={key}
              className="flex flex-1 flex-col gap-1 items-center"
              onClick={() => onActiveChange(key)}
              css={(theme) => ({
                color: isActive ? theme.color.primary : theme.color.secondary,
              })}
            >
              {icon}
              {title}
            </m.li>
          );
        })}
      </m.ul>
      <SafeArea position="bottom" />
    </div>
  );
};

export default TabBar;
