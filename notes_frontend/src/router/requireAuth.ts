import { useAuthStore } from '../stores/auth'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

// PUBLIC_INTERFACE
export function requireAuth(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const { user } = useAuthStore()
  if (!user) {
    next('/auth')
    return
  }
  next()
}
