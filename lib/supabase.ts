import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for Supabase
export type User = {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
}

export type Timetable = {
  id: string
  user_id: string
  file_path: string
  status: string
  calendar_synced: boolean
  created_at: string
  updated_at: string
}
