'use client';

import { useState } from 'react';

export default function SetupPage() {
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string>('');

  const setupDatabase = async () => {
    try {
      setStatus('Setting up database...');
      const response = await fetch('/api/setup-db', {
        method: 'POST'
      });
      const data = await response.json();
      
      if (data.success) {
        setStatus('Database setup completed successfully!');
        setError('');
      } else {
        setError(data.error || 'Failed to setup database');
        setStatus('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setStatus('');
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Database Setup</h1>
      
      <div className="space-y-4">
        <button
          onClick={setupDatabase}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Setup Database
        </button>

        {status && (
          <div className="p-4 bg-green-100 border border-green-400 rounded">
            <p className="text-green-700">{status}</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-100 border border-red-400 rounded">
            <h2 className="font-semibold text-red-800">Error:</h2>
            <p className="text-red-700">{error}</p>
          </div>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Next Steps:</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Click "Setup Database" to create tables and policies</li>
          <li>Visit <a href="/test-data" className="text-blue-500 hover:underline">/test-data</a> to insert test data</li>
          <li>Visit <a href="/api/test-connection" className="text-blue-500 hover:underline">/api/test-connection</a> to verify the connection</li>
        </ol>
      </div>
    </div>
  );
}
