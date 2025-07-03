'use client';

import { useState } from 'react';

export default function TestDataPage() {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const insertTestData = async () => {
    try {
      const response = await fetch('/api/test-data', {
        method: 'POST'
      });
      const data = await response.json();
      
      if (data.success) {
        setResult(data.data);
        setError('');
      } else {
        setError(data.error || 'Failed to insert test data');
        setResult(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResult(null);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Test Data Insertion</h1>
      
      <button
        onClick={insertTestData}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Insert Test Data
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 rounded">
          <h2 className="font-semibold text-red-800">Error:</h2>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-4">
          <h2 className="font-semibold mb-2">Inserted Data:</h2>
          <div className="bg-gray-100 p-4 rounded">
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
