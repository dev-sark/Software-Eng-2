import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Test 1: Basic Connection - Just read data
    const { data: readTest, error: readError } = await supabase
      .from('timetables')
      .select('*');

    if (readError) {
      throw new Error(`Read error: ${readError.message}`);
    }

    // All tests passed
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      data: {
        rowCount: readTest.length,
        rows: readTest
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
