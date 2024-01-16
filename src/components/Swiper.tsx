/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/require-default-props */
import 'swiper/css';
import {
  Swiper as SwiperContainer,
  SwiperSlide,
  type SwiperProps as SwiperContainerProps,
  type SwiperSlideProps,
} from 'swiper/react';

interface SwiperProps<T extends Record<string, any>> {
  source?: T[];
  sourceKey?: keyof T;
  container?: SwiperContainerProps;
  item?: SwiperSlideProps;
  children?: (data: T, index: number) => React.ReactNode;
}

const Swiper = <T extends Record<string, any>>({
  source,
  sourceKey,
  container,
  item,
  children,
}: SwiperProps<T>) => (
  <SwiperContainer {...container}>
    {source?.map((data, index) => (
      <SwiperSlide {...item} key={sourceKey ? data[sourceKey] : index}>
        {children?.(data, index)}
      </SwiperSlide>
    ))}
  </SwiperContainer>
);

export default Swiper;
