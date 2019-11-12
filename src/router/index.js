import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: resolve => require(['@/components/Login'], resolve)
  }
]
const router = new VueRouter({
  mode: 'hash',
  routes: routes
})

export default router
