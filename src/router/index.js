import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import Home from '../views/Home.vue'
import SignIn from '../views/SignIn.vue'
import SignUp from '../views/SignUp.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    beforeEnter: (to, from, next) => {
      if (store.state.auth.isLoggedIn) next()
      else next({ path: '/auth/sign-in' })
    }
  },
  {
    path: '/auth/sign-in',
    name: 'SignIn',
    component: SignIn,
    beforeEnter: (to, from, next) => {
      if (store.state.auth.isLoggedIn) next({ path: '/' })
      else next()
    }
  },
  {
    path: '/auth/sign-up',
    name: 'SignUp',
    component: SignUp,
    beforeEnter: (to, from, next) => {
      if (store.state.auth.isLoggedIn) next({ path: '/' })
      else next()
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
