import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

// Configuration
const UPLOAD_DIR = join(process.cwd(), 'tmp', 'uploads');
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf'
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

interface UploadResponse {
  success: boolean;
  message: string;
  file?: {
    name: string;
    size: number;
    type: string;
    path: string;
  };
}

export async function POST(request: NextRequest): Promise<NextResponse<UploadResponse>> {
  try {
    // Ensure upload directory exists
    await mkdir(UPLOAD_DIR, { recursive: true });

    const formData = await request.formData();
    const file = formData.get('file') as File;

    // Validate file existence
    if (!file) {
      return NextResponse.json({
        success: false,
        message: 'No file provided'
      }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json({
        success: false,
        message: `Invalid file type. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`
      }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({
        success: false,
        message: `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB`
      }, { status: 400 });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${timestamp}-${originalName}`;
    const filePath = join(UPLOAD_DIR, fileName);

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      file: {
        name: originalName,
        size: file.size,
        type: file.type,
        path: fileName // Only return filename, not full path for security
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({
      success: false,
      message: 'Error uploading file'
    }, { status: 500 });
  }
}
