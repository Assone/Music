import useGenerateResponsiveResources from '@/hooks/useGenerateResponsiveResources';
import classnames from 'classnames';
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
      className={classnames(
        'overflow-hidden',
        classnames({
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
