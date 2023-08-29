import { PlaylistDetailRoute } from '@/services/router/map';
import { useQuery } from '@tanstack/react-query';
import { useRouteContext } from '@tanstack/react-router';

const PlaylistDetailView: React.FC = () => {
  const { queryOptions } = useRouteContext({ from: PlaylistDetailRoute.id });
  const { data } = useQuery(queryOptions);
  const trackIds = useMemo(() => data?.trackIds || [], [data?.trackIds]);

  return (
    <div>
      <div className="flex flex-col gap-2 p-4">
        <div className="flex flex-col items-center justify-center gap-2">
          <Cover src={data?.cover} />
          <h2 className="text-center text-xl font-bold dark:text-gray-100">
            {data?.name}
          </h2>
        </div>
      </div>
      <TrackList trackIds={trackIds} />
    </div>
  );
};

export default PlaylistDetailView;
