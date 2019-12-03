import Vue from 'vue'
import VueRouter from 'vue-router'
import MineSweeping from '../views/MineSweeping.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'MineSweeping',
    component: MineSweeping
  }
]

const router = new VueRouter({
  routes
})

export default router
