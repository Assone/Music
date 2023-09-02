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
}

const TabBar: React.FC<TabBarProps> = ({ activeKey, items, className }) => {
  const [active, setActive] = useState(activeKey);

  useEffect(() => {
    if (activeKey) {
      setActive(activeKey);
    } else {
      setActive(items?.[0]?.key);
    }
  }, [activeKey, items]);

  return (
    <m.ul className={cx('flex justify-center h-full items-center', className)}>
      {items.map(({ key, ...options }) => {
        const isActive = active === key;
        const icon = isFunction(options.icon)
          ? options.icon(isActive)
          : options.icon;
        const title = isFunction(options.title)
          ? options.title(isActive)
          : options.title;

        return (
          <m.li key={key} className="flex flex-1 flex-col gap-1 items-center">
            {icon}
            {title}
          </m.li>
        );
      })}
    </m.ul>
  );
};

export default TabBar;
