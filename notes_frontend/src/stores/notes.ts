import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../supabase'
import { useAuthStore } from './auth'

type Note = {
  id: string
  user_id: string
  title: string
  content: string
  created_at: string
  updated_at: string
}

// PUBLIC_INTERFACE
/**
 * Pinia notes store for user notes CRUD and filtering.
 */
export const useNotesStore = defineStore('notes', () => {
  const notes = ref<Note[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filter = ref('')
  const searchText = ref('')

  const filteredNotes = computed(() => {
    let arr = notes.value
    if (filter.value) {
      arr = arr.filter(note => note.title.toLowerCase().includes(filter.value.toLowerCase()))
    }
    if (searchText.value) {
      arr = arr.filter(note =>
        note.title.toLowerCase().includes(searchText.value.toLowerCase()) ||
        note.content.toLowerCase().includes(searchText.value.toLowerCase())
      )
    }
    return arr.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
  })

  // PUBLIC_INTERFACE
  async function fetchNotes() {
    loading.value = true
    error.value = null
    const { data, error: err } = await supabase
      .from('notes')
      .select('*')
      .order('updated_at', { ascending: false })
    loading.value = false
    if (err) { error.value = err.message; return }
    notes.value = data || []
  }

  // PUBLIC_INTERFACE
  async function addNote(title: string, content: string) {
    loading.value = true
    error.value = null
    const { user } = useAuthStore()
    const { data, error: err } = await supabase
      .from('notes')
      .insert([{ title, content, user_id: user?.id }])
      .select()
    loading.value = false
    if (err) { error.value = err.message; return null }
    if (data && data[0]) notes.value.unshift(data[0] as Note)
    return data ? data[0] : null
  }

  // PUBLIC_INTERFACE
  async function updateNote(id: string, title: string, content: string) {
    loading.value = true
    error.value = null
    const { data, error: err } = await supabase
      .from('notes')
      .update({ title, content, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
    loading.value = false
    if (err) { error.value = err.message; return null }
    if (data && data[0]) {
      const idx = notes.value.findIndex(n => n.id === id)
      if (idx !== -1) notes.value[idx] = data[0] as Note
    }
    return data ? data[0] : null
  }

  // PUBLIC_INTERFACE
  async function deleteNote(id: string) {
    loading.value = true
    error.value = null
    const { error: err } = await supabase
      .from('notes')
      .delete()
      .eq('id', id)
    loading.value = false
    if (err) { error.value = err.message; return false }
    notes.value = notes.value.filter(n => n.id !== id)
    return true
  }

  return {
    notes,
    loading,
    error,
    filter,
    searchText,
    filteredNotes,
    fetchNotes,
    addNote,
    updateNote,
    deleteNote,
  }
})
