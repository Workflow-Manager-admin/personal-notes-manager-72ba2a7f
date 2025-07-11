<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const email = ref('')
const password = ref('')
const isLogin = ref(true)

/**
 * Handles form submission for login/register.
 * Performs loading state via Pinia, and on success navigates to home,
 * on error keeps user on form and displays feedback.
 */
async function submit() {
  // Prevent double submit if already loading
  if (authStore.loading) return

  let result = false
  if (isLogin.value) {
    result = await authStore.signIn(email.value, password.value)
  } else {
    result = await authStore.signUp(email.value, password.value)
  }

  if (result) {
    // Small visual delay for feedback before routing (optional)
    await new Promise(res => setTimeout(res, 250))
    router.push('/')
  }
  // else: error will be shown below via authStore.authError
}
</script>

<template>
  <div class="auth-container">
    <form @submit.prevent="submit">
      <h2 class="primary">{{ isLogin ? 'Sign In' : 'Register' }}</h2>
      <input v-model="email" type="email" placeholder="Email" required autocomplete="username" />
      <input v-model="password" type="password" placeholder="Password" required autocomplete="current-password" />
      <!--
        PUBLIC_INTERFACE
        The sign-in/register button triggers authentication. Ensuring click and submit behaviors are handled.
      -->
      <button
        class="primary"
        type="submit"
        :disabled="authStore.loading"
        @click.prevent="submit"
        aria-busy="true"
      >
        <span v-if="authStore.loading" style="margin-right: 7px;">⏳</span>
        {{ isLogin ? 'Sign In' : 'Register' }}
      </button>
      <div class="switch">
        <span>
          {{ isLogin ? "Don't have an account?" : "Already have an account?" }}
        </span>
        <a @click.prevent="isLogin = !isLogin">
          {{ isLogin ? 'Register' : 'Sign In' }}
        </a>
      </div>
      <div v-if="authStore.authError" class="error">{{ authStore.authError }}</div>
      <div v-if="!authStore.authError && !authStore.loading && authStore.user && isLogin" class="success" style="color:#42b983;text-align:center;">
        Login successful! Redirecting...
      </div>
    </form>
  </div>
</template>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 7vh auto;
  padding: 2rem 2rem 1.5rem 2rem;
  background: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 4px 24px 0 #0001;
}
form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
h2.primary {
  color: #42b983;
  text-align: center;
}
input {
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 1px solid #e3e3e3;
  border-radius: 8px;
  transition: border 0.2s;
}
input:focus {
  border: 1.5px solid #42b983;
  outline: none;
}
button.primary {
  background: #42b983;
  color: #fff;
  border: none;
  padding: 0.9rem 0;
  font-size: 1.1rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}
button.primary:disabled {
  background: #a3d1b6;
  cursor: wait;
}
.switch {
  text-align: center;
  font-size: 0.95rem;
}
.switch a {
  color: #35495e;
  margin-left: 7px;
  cursor: pointer;
  font-weight: 600;
}
.error {
  color: #b82e2e;
  text-align: center;
}
</style>
