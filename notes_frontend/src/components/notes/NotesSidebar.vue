<script setup lang="ts">
import { useNotesStore } from '../../stores/notes'
const notesStore = useNotesStore()
</script>

<template>
  <aside class="sidebar-content">
    <h1>Notes</h1>
    <input
      class="search"
      v-model="notesStore.searchText"
      placeholder="Search notes..."
      @input="notesStore.fetchNotes"
    />
    <div style="height:24px"></div>
    <span class="caption">Filters:</span>
    <input class="filter" v-model="notesStore.filter" placeholder="Title filter" />
  </aside>
</template>

<style scoped>
.sidebar-content {
  display: flex;
  flex-direction: column;
  padding: 2rem 1.4rem;
  height: 100%;
  gap: 15px;
}
h1 {
  color: #ffca28;
  font-size: 1.35rem;
  margin-bottom: 0.8rem;
  letter-spacing: 0.3px;
}
.search, .filter {
  background: #253140;
  border: none;
  padding: 0.6rem;
  color: #fff;
  border-radius: 6px;
  margin-bottom: 0.7rem;
  font-size: 0.97rem;
}
.search::placeholder, .filter::placeholder {
  color: #bcd;
}
.caption {
  color: #fff8;
  font-size: 0.89rem;
  margin-bottom: 0.2rem;
}
@media (max-width: 768px) {
  .sidebar-content {
    flex-direction: row;
    align-items: center;
    gap: 10px;
    padding: 0.6rem;
  }
  h1 {
    margin-bottom: 0; font-size: 1rem;
  }
}
</style>
