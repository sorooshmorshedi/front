import Vue from 'vue'
import VueRouter, {
  RouterOptions
} from 'vue-router'


import PanelRoutes from './Panel';
import ReportsRoutes from './Reports';
import Login from '@/views/auth/Login.vue'
import ForgetPassword from '@/views/auth/ForgetPassword.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'Login',
    component: Login,
    props: true,
  },
  {
    path: '/forgetPassword',
    name: 'ForgetPassword',
    component: ForgetPassword
  },
  ...PanelRoutes,
  ...ReportsRoutes,

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