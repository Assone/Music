/* eslint-disable no-underscore-dangle */
import Image from '@/components/Image';
import TrackList from '@/components/TrackList';
import { artistKeys } from '@/services/query/keys';
import { useQuery } from '@tanstack/react-query';

const ArtistDetailView: React.FC = () => {
  const { id } = useParams<'id'>();
  const { data: detail } = useQuery(artistKeys.detail(+id!));
  const { data: mvs } = useQuery(artistKeys.detail(+id!)._ctx.mv());
  const { data: songs } = useQuery(artistKeys.detail(+id!)._ctx.songs());

  return (
    <div className="flex flex-col gap-2">
      <Image src={detail?.cover} />
      <Typography.Title>{detail?.name}</Typography.Title>
      <div>
        <SwiperContainer
          source={mvs}
          sourceKey="id"
          containerProps={{
            slidesPerView: 3.2,
            spaceBetween: 10,
          }}
        >
          {(mv) => <Image src={mv.cover} />}
        </SwiperContainer>
      </div>

      <TrackList tracks={songs} cover />
    </div>
  );
};

export default ArtistDetailView;
