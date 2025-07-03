import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST() {
  try {
    // First, check if we can connect to Supabase
    const { data: connectionTest, error: connectionError } = await supabase
      .from('timetables')
      .select('count');

    if (connectionError) {
      throw new Error(`Connection error: ${connectionError.message}`);
    }

    // Insert test timetable with simplified data
    const { data: timetable, error: timetableError } = await supabase
      .from('timetables')
      .insert({
        user_id: 'test-user',
        file_path: '/test/sample.pdf',
        status: 'pending'
      })
      .select()
      .single();

    if (timetableError) {
      console.error('Timetable insert error:', timetableError);
      throw new Error(`Timetable insert error: ${timetableError.message}`);
    }

    if (!timetable || !timetable.id) {
      throw new Error('Failed to create timetable: No ID returned');
    }

    // Insert a single test class schedule
    const { data: classSchedule, error: classError } = await supabase
      .from('class_schedules')
      .insert({
        timetable_id: timetable.id,
        course_name: 'Test Course',
        day: 'Monday',
        start_time: '09:00',
        end_time: '10:30',
        venue: 'Test Room'
      })
      .select()
      .single();

    if (classError) {
      console.error('Class schedule insert error:', classError);
      // Try to clean up the timetable if class schedule insert fails
      await supabase
        .from('timetables')
        .delete()
        .eq('id', timetable.id);
      throw new Error(`Class schedule insert error: ${classError.message}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Test data inserted successfully',
      data: {
        timetable,
        classSchedule
      }
    });

  } catch (error) {
    console.error('Test data insertion error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to insert test data',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
