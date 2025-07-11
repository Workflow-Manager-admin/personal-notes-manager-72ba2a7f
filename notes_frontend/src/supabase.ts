import { createClient } from '@supabase/supabase-js'

// PUBLIC_INTERFACE
/**
 * Supabase client singleton for the notes app.
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY as string

export const supabase = createClient(supabaseUrl, supabaseKey)
