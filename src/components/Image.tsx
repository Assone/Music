/* eslint-disable react/jsx-props-no-spreading */
import { cx } from '@emotion/css';
import { AnimatePresence, m, useAnimation } from 'framer-motion';
import { ImgHTMLAttributes, SourceHTMLAttributes } from 'react';

interface ImageProps
  extends Pick<
    ImgHTMLAttributes<HTMLImageElement>,
    'className' | 'src' | 'srcSet' | 'sizes' | 'alt'
  > {
  placeholder?: React.ReactNode;
  source?: SourceHTMLAttributes<HTMLSourceElement>[];
  lazy?: boolean;
}

const Image: React.FC<ImageProps> = ({
  source,
  placeholder,
  lazy = true,
  className,
  ...props
}) => {
  const [loading, setLoading] = useState(true);
  const imageAnimation = useAnimation();
  const placeholderAnimation = useAnimation();

  const onLoad = useCallback(() => {
    setLoading(false);
    imageAnimation
      .start({ opacity: 1 })
      .catch(() => console.error('image animation error'));
    placeholderAnimation
      .start({ opacity: 0 })
      .catch(() => console.error('placeholder animation error'));
  }, [imageAnimation, placeholderAnimation]);

  return (
    <picture className={cx('relative', className)}>
      {source?.map((sourceProps, index) => (
        <source key={sourceProps.srcSet || index} {...sourceProps} />
      ))}

      <AnimatePresence>
        <m.img
          initial={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          animate={imageAnimation}
          onLoad={onLoad}
          onLoadStart={() => setLoading(true)}
          loading={lazy ? 'lazy' : undefined}
          {...props}
        />
      </AnimatePresence>

      {loading && (
        <AnimatePresence>
          <m.div
            className="absolute inset-0 bg-white dark:bg-black"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            animate={placeholderAnimation}
          >
            {placeholder}
          </m.div>
        </AnimatePresence>
      )}
    </picture>
  );
};

export default Image;
