// eslint-disable-next-line import/prefer-default-export
export const formatSong = (song: API.Common.Song) => {
  const { dt: duration, name, id, al, ar } = song;
  const cover = al?.picUrl;
  const artists = ar.map(({ id, name }) => ({ id, name }));
  const album = {
    id: al.id,
    name: al.name,
    cover: al.picUrl,
  };

  return {
    id,
    name,
    duration,
    cover,
    artists,
    album,
  };
};
