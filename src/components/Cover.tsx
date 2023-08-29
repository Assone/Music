import useGenerateResponsiveResources from '@/hooks/useGenerateResponsiveResources';
import Image from './Image';

interface CoverProps {
  src: string | undefined;
}

const Cover: React.FC<CoverProps> = ({ src }) => {
  const { list } = useGenerateResponsiveResources(src);

  return (
    <div className=" rounded overflow-hidden">
      <Image
        src={src}
        source={list.map((item) => ({ ...item, srcSet: item.url }))}
      />
    </div>
  );
};

export default Cover;
