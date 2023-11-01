import { queryKeys } from '@/services/query/keys';
import { useQuery } from '@tanstack/react-query';

const PlaylistDetailView: React.FC = () => {
  const { id } = useParams<'id'>();
  const { data, isFetched } = useQuery(queryKeys.playlist.detail(+id!));
  const trackIds = useMemo(() => data?.trackIds || [], [data?.trackIds]);

  return (
    <div>
      {isFetched && (
        <div className="flex flex-col gap-2 p-4">
          <div className="flex flex-col items-center justify-center gap-2">
            <Cover src={data?.cover} />
            <h2 className="text-center text-xl font-bold dark:text-gray-100">
              {data?.name}
            </h2>
          </div>
          <div className="flex gap-4 p-2">
            <PlayButton />
            <PlayButton />
          </div>
        </div>
      )}
      <TrackList className="px-4" trackIds={trackIds} cover artists />
    </div>
  );
};

export default PlaylistDetailView;
