import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/auth/Login'

import PanelRoutes from './__Panel';
import ReportsRoutes from './__Reports';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login,
      props: true,
    },
    ...PanelRoutes,
    ...ReportsRoutes
  ],
  mode: 'history',
})
