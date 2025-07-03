import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://emecqdmhakpnzsqphbdj.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseKey) {
  throw new Error('Missing Supabase anon key');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Example query function
export async function createTimetableEntry(userId: string, filePath: string) {
  const { data, error } = await supabase
    .from('timetables')
    .insert({
      user_id: userId,
      file_path: filePath,
      status: 'pending'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Example query function
export async function getTimetables(userId: string) {
  const { data, error } = await supabase
    .from('timetables')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}
