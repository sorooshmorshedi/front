import Vue from 'vue'
import VueRouter, { RouterOptions } from 'vue-router'


import PanelRoutes from './__Panel';
import ReportsRoutes from './__Reports';
import Login from '@/views/auth/Login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
    props: true,
  },
  ...PanelRoutes,
  ...ReportsRoutes

  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
