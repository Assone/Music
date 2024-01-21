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
  // 获取歌单所有歌曲
  tracks = '/playlist/track/all',
}

export const enum Song {
  // 获取歌曲详情
  detail = '/song/detail',
  // 获取歌曲播放地址
  url = '/song/url/v1',
}

export const enum Artist {
  // 获取歌手专辑
  album = '/artist/album',
  // 获取歌手详情
  detail = '/artist/detail',
  // 获取歌手MV
  mv = '/artist/mv',
  // 获取歌手歌曲
  songs = '/artists',
  // 获取歌手描述
  description = '/artist/desc',
}

export const enum Similar {
  // 获取相似歌手
  artist = '/simi/artist',
  // 获取相似歌单
  playlist = '/simi/playlist',
}

export const enum Search {
  // 搜索资源
  resource = '/cloudsearch',
  // 热搜列表
  hot = '/search/hot/detail',
}

export const enum User {
  // 用户账号信息
  account = '/user/account',
}

export const enum Favorite {
  // 收藏的歌手列表
  artists = '/artist/sublist',
  // 收藏的专辑列表
  albums = '/album/sublist',
}

export const enum Auth {
  // 登录状态
  loginStatus = '/login/status',
}
