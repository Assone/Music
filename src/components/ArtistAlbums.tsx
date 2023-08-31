import { artistKeys } from '@/services/query/keys';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';

interface ArtistAlbumsProps {
  id?: ID;
  more?: boolean;
  limit?: number;
}

const ArtistAlbums: React.FC<ArtistAlbumsProps> = ({ id, more, limit }) => {
  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    ...artistKeys.albums(id || 0),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.more ? { offset: allPages.length + 1, limit } : undefined,
    enabled: !!id,
  });

  const albums = useMemo(
    () => data?.pages.map((page) => page.hotAlbums).flat(),
    [data?.pages],
  );

  const onLoadingMore = () => {
    if (hasNextPage && more) {
      fetchNextPage().catch((err) =>
        console.error('%c[Query Error]', 'color: red;', err),
      );
    }
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
