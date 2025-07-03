import { readdir, unlink, stat } from 'fs/promises';
import { join } from 'path';

const UPLOAD_DIR = join(process.cwd(), 'tmp', 'uploads');
const FILE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export async function cleanupTempFiles() {
  try {
    // Read all files in the upload directory
    const files = await readdir(UPLOAD_DIR);
    const now = Date.now();

    for (const file of files) {
      const filePath = join(UPLOAD_DIR, file);
      const stats = await stat(filePath);
      const fileAge = now - stats.mtimeMs;

      // Delete files older than TTL
      if (fileAge > FILE_TTL) {
        try {
          await unlink(filePath);
          console.log(`Deleted old temporary file: ${file}`);
        } catch (error) {
          console.error(`Error deleting file ${file}:`, error);
        }
      }
    }
  } catch (error) {
    console.error('Cleanup error:', error);
  }
}
