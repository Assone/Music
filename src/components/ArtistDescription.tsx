import { getArtistDescription } from '@/apis';
import { useQuery } from '@tanstack/react-query';

export interface ArtistDescriptionProps {
  id: number;
}

const ArtistDescription: React.FC<ArtistDescriptionProps> = ({ id }) => {
  const query = useQuery({
    queryKey: ['artist', 'description', id],
    queryFn: () => lastValueFrom(getArtistDescription(id)),
  });

  return <div>{query.data?.briefDesc}</div>;
};

export default ArtistDescription;
