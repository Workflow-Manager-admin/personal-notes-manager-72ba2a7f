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
  }

  // PUBLIC_INTERFACE
  async function signUp(email: string, password: string) {
    loading.value = true
    authError.value = null
    const { error, data } = await supabase.auth.signUp({ email, password })
    loading.value = false
    if (error) {
      authError.value = error.message
      return false
    }
    user.value = data.user
    return true
  }

  // PUBLIC_INTERFACE
  async function signIn(email: string, password: string) {
    loading.value = true
    authError.value = null
    const { error, data } = await supabase.auth.signInWithPassword({ email, password })
    loading.value = false
    if (error) {
      authError.value = error.message
      return false
    }
    user.value = data.user
    return true
  }

  // PUBLIC_INTERFACE
  async function signOut() {
    await supabase.auth.signOut()
    user.value = null
  }

  supabase.auth.onAuthStateChange((event, session) => {
    user.value = session?.user || null
  })

  fetchUser()

  return { user, loading, authError, signIn, signUp, signOut, fetchUser }
})
