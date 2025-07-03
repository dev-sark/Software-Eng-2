// eslint-disable-next-line @next/next/no-document-import-in-page
'use client';
import { signIn } from 'next-auth/react';

export default function Home() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      console.log('Upload response:', data);
      alert(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Timetable AI App
          </h1>
          <p className="text-xl text-gray-300 mb-12">
            Intelligent scheduling made simple
          </p>
          
          {/* Large Sign In Button */}
          <button
            onClick={() => signIn('google', { callbackUrl: '/' })}
            className="transform hover:scale-105 transition-transform duration-200 inline-flex items-center px-8 py-4 bg-white text-gray-900 rounded-lg shadow-lg hover:shadow-xl text-xl font-semibold"
          >
            <img
              src="https://www.google.com/favicon.ico"
              alt="Google"
              className="w-6 h-6 mr-4"
            />
            Sign in with Google
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto mt-12">
        <h1 className="text-2xl font-bold mb-4">API Test Page</h1>
        
        {/* Test Upload Form */}
        <div className="p-4 bg-white rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Test File Upload</h2>
          <form onSubmit={handleSubmit}>
            <input 
              type="file" 
              name="file"
              accept=".jpg,.jpeg,.png,.webp,.pdf"
              className="mb-4 block w-full"
            />
            <button 
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Upload File
            </button>
          </form>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          <p>Open browser console to see detailed response</p>
        </div>
      </div>
    </main>
  );
}
