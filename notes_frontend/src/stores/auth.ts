import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../supabase'
import type { User } from '@supabase/supabase-js'

// PUBLIC_INTERFACE
/**
 * Pinia authentication store using Supabase.
 */
export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(false)
  const authError = ref<string | null>(null)

  async function fetchUser() {
    const { data } = await supabase.auth.getUser()
    user.value = data.user
    if (typeof window !== "undefined") {
      console.debug("[Auth Store] fetchUser called. Result user.value:", user.value, data)
    }
  }

  // PUBLIC_INTERFACE
  async function signUp(email: string, password: string) {
    loading.value = true
    authError.value = null
    if (typeof window !== "undefined") console.debug("[Auth Store] signUp triggered for email", email)
    const { error, data } = await supabase.auth.signUp({ email, password })
    loading.value = false
    if (error) {
      authError.value = error.message
      if (typeof window !== "undefined") console.debug("[Auth Store] ERROR in signUp", error)
      return false
    }
    user.value = data.user
    if (typeof window !== "undefined") console.debug("[Auth Store] signUp success: user.value", user.value)
    return true
  }

  // PUBLIC_INTERFACE
  /**
   * Attempts to sign in and updates user and error state.
   * Returns true on success, false on error.
   */
  async function signIn(email: string, password: string) {
    loading.value = true
    authError.value = null
    if (typeof window !== "undefined") console.debug("[Auth Store] signIn triggered for email", email)
    const { error, data } = await supabase.auth.signInWithPassword({ email, password })
    // Defensive: also fetch session's user, as Supabase might not update directly
    if (!error) {
      user.value = data.user
      if (typeof window !== "undefined") console.debug("[Auth Store] signIn got (data):", data, "user.value:", user.value)
      if (!user.value) {
        const { data: udata } = await supabase.auth.getUser()
        user.value = udata.user || null
        if (typeof window !== "undefined") console.debug("[Auth Store] signIn fallback fetchUser result:", udata)
      }
    }
    loading.value = false
    if (error) {
      authError.value = error.message
      if (typeof window !== "undefined") console.debug("[Auth Store] ERROR in signIn", error)
      return false
    }
    if (!user.value) {
      authError.value = 'Login failed: No user returned from backend.'
      if (typeof window !== "undefined") console.debug("[Auth Store] ERROR: user.value still null after signIn, returning false")
      return false
    }
    if (typeof window !== "undefined") console.debug("[Auth Store] signIn success: user.value", user.value)
    return true
  }

  // PUBLIC_INTERFACE
  async function signOut() {
    if (typeof window !== "undefined") console.debug("[Auth Store] signOut triggered")
    await supabase.auth.signOut()
    user.value = null
    if (typeof window !== "undefined") console.debug("[Auth Store] signOut completed. user.value:", user.value)
  }

  // Session propagation debugging: log auth state changes
  supabase.auth.onAuthStateChange((event, session) => {
    if (typeof window !== "undefined") {
      console.debug("[Auth Store] onAuthStateChange event: ", event, "Session:", session)
      // Print localStorage at each auth event:
      try {
        const storageCopy = localStorage.getItem('supabase.auth.token')
        console.debug("[Auth Store] localStorage.supabase.auth.token at onAuthStateChange:", storageCopy)
      } catch {}
    }
    user.value = session?.user || null
    if (typeof window !== "undefined") {
      console.debug("[Auth Store] Pinia user.value after onAuthStateChange:", user.value)
    }
  })

  fetchUser()

  return { user, loading, authError, signIn, signUp, signOut, fetchUser }
})
