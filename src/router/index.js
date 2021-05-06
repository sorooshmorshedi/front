import Vue from 'vue'
import VueRouter, {
  RouterOptions
} from 'vue-router'


import PanelRoutes from './Panel';
import ReportsRoutes from './Reports';
import Login from '@/views/auth/Login.vue'
import Register from '@/views/auth/Register.vue'
import ForgetPassword from '@/views/auth/ForgetPassword.vue'

import Test from '@/Test';

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'Login',
    component: Login,
    props: true,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
  {
    path: '/forgetPassword',
    name: 'ForgetPassword',
    component: ForgetPassword
  },
  ...PanelRoutes,
  ...ReportsRoutes,

  {
    path: '/test',
    name: 'Test',
    component: Test
  },

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


import navbar from "@/components/Navbar"

let getTitle = (name, params, routes) => {
  let title = ''
  for (let route of routes) {
    if (route.to) {
      let is_same = route.to.name == name
      if (route.to.params && params) {
        Object.keys(params).forEach(key => {
          if (key == 'id') return;
          is_same &= route.to.params[key] == params[key]
        })
      }
      if (is_same) return route.title
    } else if (route.children) {
      title = getTitle(name, params, route.children)
      if (title) return title;
    }
  }
  return false
}

router.afterEach((to, from) => {
  Vue.nextTick(() => {
    let title = getTitle(to.name, to.params, navbar.computed.allRoutes());
    if (!title) title = "سامانه حسابداری سبحان"
    document.title = title
  });
});

export default router