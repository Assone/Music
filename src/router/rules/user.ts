import { h, resolveComponent } from 'vue';
import { RouteRecordRaw } from 'vue-router';

const SHUTTLE = {
  name: 'Shuttle',
  render: () => h(resolveComponent('router-view')),
};

const rules: RouteRecordRaw[] = [
  {
    path: '/artist',
    component: SHUTTLE,
    children: [
      {
        path: ':id',
        name: 'Artist Detail',
        props: (router) => ({ id: Number(router.params.id) }),
        component: () => import('@/views/ArtistDetail.vue'),
      },
    ],
  },
  {
    path: '/user/:id',
    name: 'User Detail',
    props: (router) => ({ id: Number(router.params.id) }),
    component: () => import('@/views/UserDetail.vue'),
  },
];

export default rules;
