interface SourceInfo {
  id: ID;
  name: Name;
}

export const formatSourceInfo = (data: SourceInfo) => {
  const { id, name } = data;
  return {
    id,
    name,
  };
};

export const formatSong = (song: API.Common.Song) => {
  const { dt: duration, name, id, al, ar } = song;
  const cover = al?.picUrl;
  const artists = ar.map(formatSourceInfo);
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

export const formatPlaylistInfo = (playlist: API.Common.Playlist) => {
  const sourceInfo = formatSourceInfo(playlist);
  const { description, coverImgUrl: cover } = playlist;

  return {
    ...sourceInfo,
    description,
    cover,
  };
};

export const formatArtist = (artist: API.Common.Artist) => {
  const { id, name, picUrl: avatar } = artist;

  return {
    id,
    name,
    avatar,
  };
};
