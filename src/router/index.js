import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/auth/Login'

import PanelRotues from './__Panel';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/Login/:cb',
      name: 'Login',
      component: Login,
      props: true,
    },
    ...PanelRotues,
  ],
  mode: 'history',
})
