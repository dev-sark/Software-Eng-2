'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Redirect to login if not authenticated
  if (status === 'unauthenticated') {
    router.push('/');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setUploading(true);

    const formData = new FormData(e.currentTarget);
    const file = formData.get('file') as File;

    if (!file) {
      setError('Please select a file to upload');
      setUploading(false);
      return;
    }

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setSuccessMessage('File uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      setError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-purple-500 mb-8">
            Timetable Upload
          </h1>
          
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl text-white mb-6">Upload Your Timetable</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input 
                  type="file" 
                  name="file"
                  accept=".jpg,.jpeg,.png,.webp,.pdf"
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-purple-50 file:text-purple-700
                    hover:file:bg-purple-100"
                  required
                />
              </div>
              
              {error && (
                <div className="text-red-500 text-sm mb-4">
                  {error}
                </div>
              )}
              
              {successMessage && (
                <div className="text-green-500 text-sm mb-4">
                  {successMessage}
                </div>
              )}
              
              <button 
                type="submit"
                disabled={uploading}
                className={`w-full py-3 px-4 rounded-full font-semibold 
                  ${uploading ? 'bg-purple-300 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}
                  text-white transition-colors duration-200`}
              >
                {uploading ? 'Uploading...' : 'Upload Timetable'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
