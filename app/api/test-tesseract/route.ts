import { NextResponse } from 'next/server';
import Tesseract from 'tesseract.js';

export async function GET() {
  try {
    // Test Tesseract.js with a simple string
    const { data: { text } } = await Tesseract.recognize(
      'Hello World',
      'eng',
      {
        logger: m => console.log('Tesseract progress:', m.progress)
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Tesseract.js is working correctly',
      testResult: text
    });
  } catch (error) {
    console.error('Tesseract.js test failed:', error);
    return NextResponse.json(
      { 
        error: 'Tesseract.js test failed', 
        details: error.message 
      },
      { status: 500 }
    );
  }
}
