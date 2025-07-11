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
  // Log route changes and localStorage for debugging
  if (typeof window !== "undefined") {
    console.debug("[Router Debug] Navigation from", from.fullPath, "to", to.fullPath)
    console.debug("[Router Debug] localStorage.supabase.auth.token:", localStorage.getItem('supabase.auth.token'));
  }
  if (to.meta.requiresAuth) {
    let userObj = null;
    try {
      userObj = JSON.parse(localStorage.getItem('supabase.auth.token') || 'null');
    } catch {
      /* swallow */
    }
    const currentUser = userObj?.currentSession?.user;
    if (!currentUser) {
      if (typeof window !== "undefined") console.debug("[Router Debug] No valid user found, redirecting to /auth")
      next('/auth')
      return
    } else {
      if (typeof window !== "undefined") console.debug("[Router Debug] Authenticated user found:", currentUser)
    }
  }
  next()
})

export default router
