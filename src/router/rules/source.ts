import { h, resolveComponent } from 'vue';
import { RouteRecordRaw } from 'vue-router';

const SHUTTLE = {
  name: 'Shuttle',
  render: () => h(resolveComponent('router-view')),
};

const rules: RouteRecordRaw[] = [
  {
    path: '/playlist',
    component: SHUTTLE,
    children: [
      {
        path: '',
        name: 'Playlists',
        component: () => import('@/views/Playlists.vue'),
      },
      {
        path: ':id',
        name: 'Playlist Detail',
        props: (router) => ({ id: Number(router.params.id) }),
        component: () => import('@/views/PlaylistDetail.vue'),
      },
    ],
  },
  {
    path: '/album',
    component: SHUTTLE,
    children: [
      {
        path: '',
        name: 'Albums',
        component: () => import('@/views/Albums.vue'),
      },
      {
        path: ':id',
        name: 'Album Detail',
        props: (router) => ({ id: Number(router.params.id) }),
        component: () => import('@/views/AlbumDetail.vue'),
      },
    ],
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/views/Search.vue'),
  },
];

export default rules;
