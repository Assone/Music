/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/require-default-props */
import 'swiper/css';
import 'swiper/css/a11y';
import { A11y, Virtual } from 'swiper/modules';
import {
  Swiper,
  SwiperProps,
  SwiperSlide,
  SwiperSlideProps,
} from 'swiper/react';

interface SwiperContainerProps<T> {
  source?: T[] | undefined;
  sourceKey?: keyof T;
  containerProps?: SwiperProps;
  sliderProps?: SwiperSlideProps;
  children: (data: T, index: number) => React.ReactNode;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SwiperContainer = <T extends Record<string, any>>({
  source = [],
  sourceKey,
  containerProps,
  sliderProps,
  children,
}: SwiperContainerProps<T>) => {
  const modules = useMemo(() => {
    const list = containerProps?.modules ?? [];

    return [A11y, Virtual, ...list];
  }, [containerProps?.modules]);

  return (
    <Swiper {...containerProps} modules={modules}>
      {source.map((data, index) => (
        <SwiperSlide
          {...sliderProps}
          key={sourceKey ? data[sourceKey] : index}
          virtualIndex={index}
        >
          {children(data, index)}
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default SwiperContainer;
