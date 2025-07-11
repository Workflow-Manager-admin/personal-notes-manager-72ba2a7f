<script setup lang="ts">
import type { User } from '@supabase/supabase-js'
defineProps<{ user: User | null }>()
</script>

<template>
  <header class="topbar-content">
    <div class="left"><span class="logo-dot"></span> NotesManager</div>
    <div class="right">
      <span v-if="user" class="user">{{ user.email }}</span>
      <button class="logout" @click="$emit('signOut')">Sign Out</button>
    </div>
  </header>
</template>

<style scoped>
.topbar-content {
  height: 50px;
  display: flex;
  align-items: center;
  background: #fff;
  border-bottom: 1px solid #f2f2f2;
  padding: 0 2.2rem 0 1.4rem;
  justify-content: space-between;
  gap: 2rem;
}
.left {
  color: #35495e;
  font-weight: 700;
  font-size: 1.13rem;
  letter-spacing: 0.2px;
  display: flex;
  align-items: center;
  gap: 7px;
}
.logo-dot {
  display: inline-block;
  background: #42b983;
  width: 13px;height:13px;
  border-radius: 50%;
  margin-right: 4px;
}
.right {
  display: flex;align-items: center;gap:12px;
}
.user {
  color: #35495e;
  font-size: 1rem;
}
.logout {
  background: #ffca28;
  color: #fff;
  font-weight: bold;
  border: none;
  padding: 0.5rem 1.1rem;
  border-radius: 7px;
  cursor: pointer;
  transition: background 0.2s;
}
.logout:hover {
  background: #ffd96a;
}
</style>
