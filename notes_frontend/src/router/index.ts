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

import { useAuthStore } from '../stores/auth'
import { nextTick } from 'vue'

router.beforeEach(async (to, from, next) => {
  // EXTENSIVE ROUTER DEBUGGING:
  if (typeof window !== "undefined") {
    console.debug("[Router Debug] --- beforeEach ----")
    console.debug("[Router Debug] from:", from.fullPath, "to:", to.fullPath, "meta:", to.meta)
    try {
      if (router && typeof router.getRoutes === "function") {
        console.debug("[Router Debug] router.getRoutes:", router.getRoutes().map(r => ({ path: r.path, name: r.name })));
      }
    } catch { }
    try {
      console.debug("[Router Debug] localStorage.supabase.auth.token (raw):", localStorage.getItem('supabase.auth.token'));
    } catch { }
    try {
      Object.keys(localStorage)
        .filter(k => k.toLowerCase().includes("supabase"))
        .forEach(k => console.debug(`[Router Debug] [localStorage] ${k}:`, localStorage.getItem(k)));
    } catch { }
  }

  // Patch: Ensure latest Pinia user state is considered for ALL auth-protected routes, synchronize localStorage and Pinia if needed.
  // Solution: We check both Pinia and localStorage to maximize reliability after login.
  if (to.meta.requiresAuth) {
    let piniaUser = null;
    try {
      piniaUser = useAuthStore().user;
    } catch {}
    let sessionUser = null;
    let tokenRaw = null;
    try {
      tokenRaw = localStorage.getItem('supabase.auth.token');
      const userObj = tokenRaw ? JSON.parse(tokenRaw) : null;
      sessionUser = userObj?.currentSession?.user || null;
    } catch (e) {
      if (typeof window !== "undefined") console.debug("[Router Debug] JSON.parse failed:", tokenRaw, e);
    }
    if (typeof window !== "undefined") {
      console.debug("[Router Debug] [beforeEach] Pinia user:", piniaUser, "Session user from LS:", sessionUser);
    }
    // Pinia sometimes lags after login, so wait one tick if user is missing just after login from /auth.
    if (!piniaUser && sessionUser && from.path === '/auth') {
      if (typeof window !== "undefined") console.debug("[Router Fix] Pinia user not yet hydrated after login, awaiting nextTick...");
      await nextTick();
      piniaUser = useAuthStore().user;
      if (typeof window !== "undefined") console.debug("[Router Fix] Pinia user after nextTick:", piniaUser);
    }
    if (!piniaUser && !sessionUser) {
      if (typeof window !== "undefined") console.debug("[Router Debug] No valid user in Pinia or session, redirecting to /auth")
      next('/auth')
      return
    } else {
      if (typeof window !== "undefined") console.debug("[Router Debug] Authenticated user found (either Pinia or session):", piniaUser || sessionUser)
    }
  }
  if (typeof window !== "undefined") console.debug("[Router Debug] Navigation allowed for", to.fullPath)
  next()
})


export default router
