export interface ImageProps {
  src?: string;
}

const Image: React.FC<ImageProps> = ({ src }) => (
  <picture>
    <img src={src} alt='cover' />
  </picture>
);

export default Image;
