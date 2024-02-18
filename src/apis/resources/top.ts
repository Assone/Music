import http from '@/services/http';
import { formatArtist, formatSourceInfo } from '@/utils/format';
import { mapArray } from '@/utils/rxjs';
import { Top } from '../path';

// eslint-disable-next-line import/prefer-default-export
export const getTopMvs = (options: API.RequestArgs.PaginationOptions) =>
  from(http.get<API.Top.Mvs>(Top.mv, { params: options })).pipe(
    map((res) => res.data),
    mapArray((data) => {
      const sourceInfo = formatSourceInfo(data);
      const { cover } = data;
      const artists = data.artists.map(formatArtist);

      return {
        ...sourceInfo,
        cover,
        artists,
      };
    }),
  );
