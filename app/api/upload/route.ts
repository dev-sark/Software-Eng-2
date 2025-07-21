import { NextResponse } from 'next/server';
import { tmpdir } from 'os';
import { writeFile, unlink } from 'fs/promises';
import Tesseract from 'tesseract.js';
import { Buffer } from 'buffer';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || typeof file !== 'object') {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Create a temporary file path
    const tempFilePath = `${tmpdir()}/${Date.now()}-${file.name}`;
    
    // Write file to temporary location
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    await writeFile(tempFilePath, fileBuffer);

    // Extract text using Tesseract.js
    console.log('Starting OCR processing...');
    const { data: { text } } = await Tesseract.recognize(
      tempFilePath,
      'eng',
      {
        logger: m => {
          console.log('OCR Progress:', m.progress);
          if (m.progress === 1) {
            console.log('OCR processing completed');
          }
        }
      }
    );

    // Clean up temporary file
    await unlink(tempFilePath);

    return NextResponse.json({
      success: true,
      text,
      message: 'File processed successfully'
    });

  } catch (error) {
    console.error('Error processing file:', error);
    return NextResponse.json(
      { error: 'Failed to process file', details: error.message },
      { status: 500 }
    );
  }
}