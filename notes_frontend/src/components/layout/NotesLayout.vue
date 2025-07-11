<script setup lang="ts">
import { useAuthStore } from '../../stores/auth'
import { useNotesStore } from '../../stores/notes'
import { onMounted } from 'vue'
import NotesSidebar from '../notes/NotesSidebar.vue'
import NotesTopbar from '../notes/NotesTopbar.vue'
import NotesMain from '../notes/NotesMain.vue'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const notesStore = useNotesStore()
const router = useRouter()

onMounted(() => {
  if (!authStore.user) router.push('/auth')
  else notesStore.fetchNotes()
})

function signOut() {
  authStore.signOut()
  router.push('/auth')
}
</script>

<template>
  <div class="layout">
    <NotesSidebar class="sidebar" />
    <div class="main-wrapper">
      <NotesTopbar class="topbar" :user="authStore.user" @signOut="signOut" />
      <NotesMain class="main-content" />
    </div>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
  width: 100vw;
  background: #f8f8f8;
}
.sidebar {
  width: 240px;
  background: #35495e;
  color: white;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.main-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.topbar {
  height: 50px;
}
.main-content {
  flex: 1;
  background: #fff;
  min-height: 0;
  overflow-y: auto;
}
@media (max-width: 768px) {
  .layout {
    flex-direction: column;
  }
  .sidebar {
    width: 100vw;
    flex-direction: row;
    height: 60px;
    min-height: 0;
  }
  .main-wrapper {
    flex: 1;
    min-height: 0;
  }
}
</style>
