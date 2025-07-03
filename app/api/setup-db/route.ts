import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST() {
  try {
    // Create timetables table if it doesn't exist
    const { error: timetableError } = await supabase.rpc('create_timetables_if_not_exists', {
      sql: `
        CREATE TABLE IF NOT EXISTS timetables (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          user_id TEXT NOT NULL,
          file_path TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'pending',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
        );

        -- Enable RLS
        ALTER TABLE timetables ENABLE ROW LEVEL SECURITY;

        -- Create policies
        DROP POLICY IF EXISTS "Enable read access for all users" ON timetables;
        CREATE POLICY "Enable read access for all users" 
          ON timetables FOR SELECT 
          USING (true);

        DROP POLICY IF EXISTS "Enable insert for authenticated users" ON timetables;
        CREATE POLICY "Enable insert for authenticated users" 
          ON timetables FOR INSERT 
          WITH CHECK (true);

        DROP POLICY IF EXISTS "Enable update for users based on user_id" ON timetables;
        CREATE POLICY "Enable update for users based on user_id" 
          ON timetables FOR UPDATE 
          USING (true);

        DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON timetables;
        CREATE POLICY "Enable delete for users based on user_id" 
          ON timetables FOR DELETE 
          USING (true);
      `
    });

    if (timetableError) {
      throw new Error(`Failed to create timetables table: ${timetableError.message}`);
    }

    // Create class_schedules table if it doesn't exist
    const { error: scheduleError } = await supabase.rpc('create_class_schedules_if_not_exists', {
      sql: `
        CREATE TABLE IF NOT EXISTS class_schedules (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          timetable_id UUID NOT NULL REFERENCES timetables(id) ON DELETE CASCADE,
          course_name TEXT NOT NULL,
          day TEXT NOT NULL,
          start_time TEXT NOT NULL,
          end_time TEXT NOT NULL,
          venue TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
        );

        -- Enable RLS
        ALTER TABLE class_schedules ENABLE ROW LEVEL SECURITY;

        -- Create policies
        DROP POLICY IF EXISTS "Enable read access for all users" ON class_schedules;
        CREATE POLICY "Enable read access for all users" 
          ON class_schedules FOR SELECT 
          USING (true);

        DROP POLICY IF EXISTS "Enable insert for authenticated users" ON class_schedules;
        CREATE POLICY "Enable insert for authenticated users" 
          ON class_schedules FOR INSERT 
          WITH CHECK (true);

        DROP POLICY IF EXISTS "Enable update for users based on timetable" ON class_schedules;
        CREATE POLICY "Enable update for users based on timetable" 
          ON class_schedules FOR UPDATE 
          USING (true);

        DROP POLICY IF EXISTS "Enable delete for users based on timetable" ON class_schedules;
        CREATE POLICY "Enable delete for users based on timetable" 
          ON class_schedules FOR DELETE 
          USING (true);
      `
    });

    if (scheduleError) {
      throw new Error(`Failed to create class_schedules table: ${scheduleError.message}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Database setup completed successfully'
    });

  } catch (error) {
    console.error('Database setup error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to setup database',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
