import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lpcfgukzgmwcwezllslv.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwY2ZndWt6Z213Y3dlemxsc2x2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MTYyMDEsImV4cCI6MjA3NTQ5MjIwMX0.RUUMYIjCWK9PgsZxShBHYzW8YejhU6ueMYMFCyrgvKI'

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey)
