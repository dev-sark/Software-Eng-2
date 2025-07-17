// This file should be deleted as we're no longer using Supabase
// Consider implementing a different storage solution (e.g., MongoDB, PostgreSQL, or Firebase)
// for storing timetable data

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
  name: string
  description: string | null
  created_at: string
  updated_at: string
}
