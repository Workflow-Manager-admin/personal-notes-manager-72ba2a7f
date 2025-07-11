import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AuthView from '../views/AuthView.vue'
import AboutView from '../views/AboutView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true }
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView
  },
  {
    path: '/auth',
    name: 'auth',
    component: AuthView
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const user = JSON.parse(localStorage.getItem('supabase.auth.token') || 'null')?.currentSession?.user
    if (!user) {
      next('/auth')
      return
    }
  }
  next()
})

export default router
