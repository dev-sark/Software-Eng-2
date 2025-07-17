import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    // Get the session to check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      console.error('Authentication failed');
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get the form data
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      console.error('No file provided');
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Get the user ID from the session
    const userId = session.user.id;
    console.log('Uploading file for user:', userId);

    // Upload file to Supabase storage
    const fileName = `${userId}-${Date.now()}-${file.name}`;
    const filePath = `timetables/${fileName}`;

    console.log('Uploading file to:', filePath);
    
    // First, create the file in storage
    const { error: uploadError } = await supabase.storage
      .from('timetables')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError.message);
      return NextResponse.json(
        { error: `Failed to upload file: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // Store upload metadata in the database
    // Use the user's ID from the session
    const { error: dbError } = await supabase
      .from('timetables')
      .insert({
        user_id: userId,
        file_path: filePath,
        status: 'pending',
        calendar_synced: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError.message);
      // Clean up the uploaded file if database insert fails
      await supabase.storage
        .from('timetables')
        .remove([filePath]);
      
      return NextResponse.json(
        { error: `Failed to save upload metadata: ${dbError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      file_path: filePath,
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
