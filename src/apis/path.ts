export const enum Recommend {
  // 推荐歌单
  playlist = '/personalized',
}

export const enum Album {
  // 根据风格获取专辑列表
  listByStyle = '/album/list/style',
  // 获取专辑详情
  detail = '/album',
}

export const enum Playlist {
  // 获取歌单详情
  detail = '/playlist/detail',
}

export const enum Song {
  // 获取歌曲详情
  detail = '/song/detail',
}

export const enum Artist {
  // 获取歌手专辑
  album = '/artist/album',
  // 获取歌手详情
  detail = '/artist/detail',
}

export const enum Similar {
  // 获取相似歌手
  artist = '/simi/artist',
}

export const enum Search {
  // 搜索资源
  resource = '/cloudsearch',
}
