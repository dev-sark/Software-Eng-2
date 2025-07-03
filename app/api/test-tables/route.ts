import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    // First, let's sign up a test user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'test@example.com',
      password: 'test123456'
    });

    if (authError) {
      throw new Error(`Auth error: ${authError.message}`);
    }

    const userId = authData.user?.id;
    if (!userId) {
      throw new Error('No user ID');
    }

    // Test inserting a timetable
    const { data: timetable, error: timetableError } = await supabase
      .from('timetables')
      .insert({
        user_id: userId,
        file_path: 'test-file.pdf',
        status: 'pending'
      })
      .select()
      .single();

    if (timetableError) {
      throw new Error(`Timetable error: ${timetableError.message}`);
    }

    // Test inserting a class schedule
    const { data: schedule, error: scheduleError } = await supabase
      .from('class_schedules')
      .insert({
        timetable_id: timetable.id,
        course_name: 'Test Course',
        day: 'Monday',
        start_time: '09:00',
        end_time: '10:30',
        venue: 'Room 101'
      })
      .select()
      .single();

    if (scheduleError) {
      throw new Error(`Schedule error: ${scheduleError.message}`);
    }

    // Test retrieving data
    const { data: allData, error: retrieveError } = await supabase
      .from('timetables')
      .select(`
        *,
        class_schedules (*)
      `)
      .eq('id', timetable.id)
      .single();

    if (retrieveError) {
      throw new Error(`Retrieve error: ${retrieveError.message}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Database test successful',
      data: {
        user: authData.user,
        timetable,
        schedule,
        retrievedData: allData
      }
    });

  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({
      success: false,
      message: 'Database test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
