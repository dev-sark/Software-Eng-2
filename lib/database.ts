import { supabase } from './supabase';

// Timetable functions
export async function createTimetable(userId: string, filePath: string) {
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

export async function updateTimetableStatus(id: string, status: string) {
  const { data, error } = await supabase
    .from('timetables')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getTimetableById(id: string) {
  const { data, error } = await supabase
    .from('timetables')
    .select(`
      *,
      class_schedules (*)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function getUserTimetables(userId: string) {
  const { data, error } = await supabase
    .from('timetables')
    .select(`
      *,
      class_schedules (*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Class Schedule functions
export async function createClassSchedule(
  timetableId: string,
  courseData: {
    course_name: string;
    day: string;
    start_time: string;
    end_time: string;
    venue: string;
  }
) {
  const { data, error } = await supabase
    .from('class_schedules')
    .insert({
      timetable_id: timetableId,
      ...courseData
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateClassSchedule(
  id: string,
  updates: {
    course_name?: string;
    day?: string;
    start_time?: string;
    end_time?: string;
    venue?: string;
    calendar_event_id?: string;
  }
) {
  const { data, error } = await supabase
    .from('class_schedules')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteClassSchedule(id: string) {
  const { error } = await supabase
    .from('class_schedules')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

export async function getClassSchedulesByTimetable(timetableId: string) {
  const { data, error } = await supabase
    .from('class_schedules')
    .select('*')
    .eq('timetable_id', timetableId)
    .order('day');

  if (error) throw error;
  return data;
}
