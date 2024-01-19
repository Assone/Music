/* eslint-disable no-void */
import useMounted from '@/hooks/common/useMounted';
import useWatch from '@/hooks/common/useWatch';
import type { ConfigurableStyle } from '@/types/props';
import classNames from 'classnames';
import { m, useAnimation } from 'framer-motion';
import type { ReactNode } from 'react';
import IF from './IF';

export interface ImageProps
  extends Pick<
      React.ImgHTMLAttributes<HTMLImageElement>,
      'src' | 'srcSet' | 'sizes'
    >,
    Pick<ConfigurableStyle, 'className' | 'style'> {
  lazy?: boolean;

  placeholder?: ReactNode;
}

const Image: React.FC<ImageProps> = ({
  src,
  srcSet,
  sizes,

  lazy = true,

  placeholder,

  className,
  style,
}) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const ref = useRef<HTMLImageElement>(null);

  const imageAnimation = useAnimation();
  const placeholderAnimation = useAnimation();

  useWatch(src, () => {
    setError(false);
    setLoading(true);
  });

  const onError = () => {
    setError(true);
    setLoading(false);
  };

  const onLoad = () => {
    setLoading(false);
    setError(false);
  };

  useWatch([loading, error], ([isLoading, isError]) => {
    if (isLoading === false && isError === false) {
      void imageAnimation.start({
        opacity: 1,
      });
      void placeholderAnimation.start({
        opacity: 0,
      });
    }
  });

  useMounted(() => {
    if (src !== undefined && ref.current?.complete) {
      onLoad();
    }
  });

  return (
    <div className={classNames('relative', className)} style={style}>
      <m.img
        ref={ref}
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        decoding='async'
        loading={lazy ? 'lazy' : undefined}
        onError={onError}
        onLoad={onLoad}
        animate={imageAnimation}
        initial={{ opacity: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
      />

      <IF condition={error}>
        <div>Image load failed</div>
      </IF>
      <IF condition={loading}>
        <m.div
          className='absolute left-0 top-0 h-full w-full bg-white'
          animate={placeholderAnimation}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {placeholder}
        </m.div>
      </IF>
    </div>
  );
};

export default Image;
