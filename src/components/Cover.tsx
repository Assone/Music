import useGenerateResponsiveResources from '@/hooks/useGenerateResponsiveResources';
import { cx } from '@emotion/css';
import classNames from 'classnames';
import { ImgHTMLAttributes } from 'react';
import Image from './Image';

interface CoverProps
  extends Pick<
    ImgHTMLAttributes<HTMLImageElement>,
    'className' | 'alt' | 'src'
  > {
  rounded?: boolean;
}

const Cover: React.FC<CoverProps> = ({
  src,
  className,
  alt,
  rounded = true,
}) => {
  const { list } = useGenerateResponsiveResources(src);

  return (
    <div
      className={cx(
        'overflow-hidden',
        classNames({
          rounded,
        }),
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        source={list.map((item) => ({ ...item, srcSet: item.url }))}
      />
    </div>
  );
};

export default Cover;
