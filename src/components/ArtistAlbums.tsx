import { artistKeys } from '@/services/query/keys';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';

interface ArtistAlbumsProps {
  id?: ID;
}

const ArtistAlbums: React.FC<ArtistAlbumsProps> = ({ id }) => {
  const { data, fetchNextPage } = useInfiniteQuery({
    ...artistKeys.albums(id || 0),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.more ? { offset: allPages.length + 1 } : undefined,
    enabled: !!id,
  });

  const albums = useMemo(
    () => data?.pages.map((page) => page.hotAlbums).flat(),
    [data?.pages],
  );

  const onLoadingMore = () => {
    fetchNextPage().catch((err) =>
      console.error('%c[Query Error]', 'color: red;', err),
    );
  };

  return (
    <SwiperContainer
      source={albums}
      containerProps={{
        slidesPerView: 3.5,
        spaceBetween: 10,
        onReachEnd: onLoadingMore,
      }}
    >
      {({ picUrl, id }) => (
        <Link to="/albums/$id" params={{ id: id.toString() }}>
          <Cover src={picUrl} />
        </Link>
      )}
    </SwiperContainer>
  );
};

export default ArtistAlbums;
