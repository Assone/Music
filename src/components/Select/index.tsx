import { noop } from '@/utils';
import classNames from 'classnames';

export interface SelectOptions<T> {
  name: string;
  value: T;
}

export interface SelectProps<T> {
  className?: string;
  onChange?: (value: T | T[]) => void;
  value?: T | T[];
  options: SelectOptions<T>[];
}

const Select = <T extends string>({
  className,
  onChange = noop,
  options,
  value,
}: SelectProps<T>) => (
  <div className="bg-neutral-800 inline-block rounded relative">
    <select
      className={classNames(
        'bg-transparent appearance-none focus:outline-none py-1 px-2 w-full',
        className,
      )}
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.name}
        </option>
      ))}
    </select>
  </div>
);

export default Select;
