import classNames from 'classnames';
import React, { useState } from 'react';

export interface SegmentedOption<T extends string | number | boolean> {
  value: T;
  icon?: React.ReactNode;
  label?: React.ReactNode;
}

interface SegmentedProps<T extends string | number | boolean = string> {
  options: SegmentedOption<T>[];
  value?: T;
  onChange?: (value: T) => void;
  classname?: string;
}

const Segmented = <T extends string | number | boolean = string>({
  value,
  options,
  onChange,
  classname,
}: SegmentedProps<T>) => {
  const [activeSegment, setActiveSegment] = useState(0);
  const activeIndex = useMemo(() => {
    if (value) {
      return options.findIndex((option) => option.value === value);
    }

    return activeSegment;
  }, [activeSegment, options, value]);

  const handleSegmentClick = (index: number) => {
    setActiveSegment(index);

    if (onChange) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      const selectedValue = options[index]?.value!;

      onChange(selectedValue);
    }
  };

  return (
    <div
      className={classNames(
        'rounded p-1 bg-neutral-100 dark:bg-neutral-900 flex gap-1',
        classname,
      )}
    >
      {options.map(({ value, label, icon }, index) => (
        <button
          key={value.toString()}
          type="button"
          onClick={() => handleSegmentClick(index)}
          className={classNames('px-4 py-1 rounded', {
            'bg-white': activeIndex === index,
            'dark:bg-neutral-700': activeIndex === index,
          })}
        >
          {icon}
          {label}
        </button>
      ))}
    </div>
  );
};

export default Segmented;
