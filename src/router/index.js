import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/auth/Login'

import PanelRoutes from './__Panel';
import ListsRoutes from './__Lists';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/Login/:cb',
      name: 'Login',
      component: Login,
      props: true,
    },
    ...PanelRoutes,
    ...ListsRoutes
  ],
  mode: 'history',
})
