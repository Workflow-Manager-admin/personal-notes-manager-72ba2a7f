<script setup lang="ts">
import { useNotesStore } from '../../stores/notes'
import { ref } from 'vue'
import type { Note } from '../../types/note'

const notesStore = useNotesStore()

const editingNote = ref<Note | null>(null)
const editorTitle = ref('')
const editorContent = ref('')

// Open for create
function startNew() {
  editingNote.value = null
  editorTitle.value = ''
  editorContent.value = ''
}

/**
 * PUBLIC_INTERFACE
 * Put note into edit mode.
 */
function openEdit(note: Note) {
  editingNote.value = note
  editorTitle.value = note.title
  editorContent.value = note.content
}

// Save/create note
async function saveNote() {
  if (!editorTitle.value.trim()) return
  if (editingNote.value) {
    await notesStore.updateNote(editingNote.value.id, editorTitle.value, editorContent.value)
  } else {
    await notesStore.addNote(editorTitle.value, editorContent.value)
  }
  editingNote.value = null
  editorTitle.value = ''
  editorContent.value = ''
  await notesStore.fetchNotes()
}

// Delete
async function removeNote(id: string) {
  await notesStore.deleteNote(id)
}

</script>

<template>
  <div class="notes-main">
    <section class="notes-header">
      <h2>Your Notes</h2>
      <button class="add-btn" @click="startNew">+ New Note</button>
    </section>

    <section class="notes-list">
      <div
        v-for="note in notesStore.filteredNotes"
        :key="note.id"
        class="note-card"
        @click="openEdit(note)"
      >
        <h3>{{ note.title }}</h3>
        <div class="subtitle">{{ new Date(note.updated_at).toLocaleString() }}</div>
        <p>{{ note.content.length > 60 ? note.content.slice(0, 60) + '...' : note.content }}</p>
        <button class="delete-btn" @click.stop="removeNote(note.id)">Delete</button>
      </div>
      <div v-if="notesStore.filteredNotes.length === 0" class="empty-msg">
        No notes found. Create your first note!
      </div>
    </section>

    <section v-if="editingNote !== null || editorTitle" class="editor">
      <form @submit.prevent="saveNote">
        <input v-model="editorTitle" type="text" required placeholder="Note Title" />
        <textarea v-model="editorContent" rows="6" placeholder="Your note..."></textarea>
        <div class="actions">
          <button class="save" type="submit">Save</button>
          <button class="cancel" type="button" @click="startNew">Cancel</button>
        </div>
      </form>
    </section>
  </div>
</template>

<style scoped>
.notes-main {
  padding: 2.3rem 2.5rem 1rem 2.5rem;
  max-width: 860px;
  margin: 0 auto;
}
.notes-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.4rem;
}
.notes-header h2 {
  color: #35495e;
  font-size: 1.3rem;
}
.add-btn {
  background: #42b983;
  color: #fff;
  font-weight: bold;
  font-size: 1rem;
  border: none;
  padding: 0.65rem 1.12rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}
.add-btn:hover {
  background: #57c89a;
}

.notes-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  margin-bottom: 2.3rem;
}

.note-card {
  background: #f2f7fa;
  border-radius: 13px;
  box-shadow: 0 2px 8px #0001;
  padding: 1.15rem;
  width: 246px;
  cursor: pointer;
  position: relative;
  transition: box-shadow 0.2s;
  border: 1.3px solid #e6ecf3;
  min-height: 135px;
  display: flex;
  flex-direction: column;
  gap:8px;
}
.note-card:hover {
  box-shadow: 0 4px 18px #0002;
}
.note-card h3 {
  font-size: 1.12rem;
  color: #35495e;
  margin-bottom: 0.2rem;
}
.subtitle {
  color: #9bb5be;
  font-size: 0.93rem;
  margin-bottom: 0.19rem;
}
.note-card p {
  color: #35495e;
  font-size: 1rem;
  word-break: break-word;
}
.delete-btn {
  position: absolute;
  right: 12px;
  bottom: 11px;
  color: #fff;
  background: #ffca28;
  border: none;
  padding: 0.37rem 0.9rem;
  font-size: 0.93rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.13s;
}
.delete-btn:hover {
  background: #ffd96a;
}

.empty-msg {
  color: #aaa;
  font-style: italic;
  margin-top: 50px;
}
.editor {
  margin-top: 2.5rem;
  background: #f9fafb;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 7px #0001;
}
.editor input[type="text"] {
  width: 100%;
  padding: 0.8rem;
  font-size: 1.1rem;
  margin-bottom: 1rem;
  border: 1.13px solid #d6e3ea;
  border-radius: 7px;
}
.editor textarea {
  width: 100%;
  padding: 0.8rem;
  font-size: 1.06rem;
  margin-bottom: 1.4rem;
  border: 1.13px solid #d6e3ea;
  border-radius: 7px;
  font-family: inherit;
}
.actions {
  display: flex; gap: 1rem; justify-content: flex-end;
}
.save {
  background: #42b983;
  color: #fff;
  font-weight: bold;
  border: none;
  padding: 0.67rem 1.41rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
}
.save:hover { background: #43d48d; }
.cancel {
  background: #e6ecf3;
  color: #35495e;
  border: none;
  padding: 0.67rem 1.1rem;
  border-radius: 7px;
  cursor: pointer;
  font-weight: 500;
  font-size: 1rem;
}
.cancel:hover { background: #f2f7fa; }
@media (max-width: 900px) {
  .notes-main { padding: 1rem 0.7rem; }
  .notes-list { gap: 0.75rem; }
  .note-card { width: 98%; min-width: 188px; }
}
@media (max-width: 600px) {
  .notes-main { padding: 1rem 2vw; }
  .editor { padding: 1rem 0.4rem; }
}
</style>
