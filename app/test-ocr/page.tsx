"use client";

import { useState } from 'react';

export default function TestOCRPage() {
  const [extractedText, setExtractedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file, file.name);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process file');
      }

      setExtractedText(data.text);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Test OCR Processing</h1>
      
      <div className="mb-6">
        <input
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={handleFileUpload}
          disabled={loading}
          className="block w-full text-sm text-slate-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-violet-50 file:text-violet-700
            hover:file:bg-violet-100"
        />
      </div>

      {loading && <p className="text-blue-500">Processing file...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {extractedText && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Extracted Text:</h2>
          <pre className="bg-gray-100 p-4 rounded-lg whitespace-pre-wrap">
            {extractedText}
          </pre>
        </div>
      )}
    </div>
  );
}
