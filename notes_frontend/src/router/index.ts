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
  // EXTENSIVE ROUTER DEBUGGING:
  if (typeof window !== "undefined") {
    console.debug("[Router Debug] --- beforeEach ----")
    console.debug("[Router Debug] from:", from.fullPath, "to:", to.fullPath, "meta:", to.meta)
    // Print router instance structure minimally
    try {
      // Print out $router options if present
      if (router && typeof router.getRoutes === "function") {
        console.debug("[Router Debug] router.getRoutes:", router.getRoutes().map(r => ({ path: r.path, name: r.name })));
      }
    } catch { }
    try {
      console.debug("[Router Debug] localStorage.supabase.auth.token (raw):", localStorage.getItem('supabase.auth.token'));
    } catch { }
    // Print all localStorage keys relevant to Supabase
    try {
      Object.keys(localStorage)
        .filter(k => k.toLowerCase().includes("supabase"))
        .forEach(k => console.debug(`[Router Debug] [localStorage] ${k}:`, localStorage.getItem(k)));
    } catch { }
  }
  if (to.meta.requiresAuth) {
    let userObj = null;
    let tokenRaw = null;
    try {
      tokenRaw = localStorage.getItem('supabase.auth.token');
      userObj = tokenRaw ? JSON.parse(tokenRaw) : null;
    } catch {
      if (typeof window !== "undefined") console.debug("[Router Debug] JSON.parse failed:", tokenRaw);
      userObj = null;
    }
    // Print parsed session token for router debug
    if (typeof window !== "undefined") {
      console.debug("[Router Debug] Parsed userObj:", userObj);
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
  // Log that navigation is allowed to continue
  if (typeof window !== "undefined") console.debug("[Router Debug] Navigation allowed for", to.fullPath)
  next()
})

export default router
