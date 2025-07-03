'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Timetable {
  id: string;
  user_id: string;
  file_path: string;
  status: string;
  created_at: string;
  calendar_synced: boolean;
}

export default function Dashboard() {
  const [timetables, setTimetables] = useState<Timetable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadTimetables();
  }, []);

  const loadTimetables = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('timetables')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTimetables(data || []);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load timetables');
    } finally {
      setLoading(false);
    }
  };

  const deleteTimetable = async (id: string) => {
    try {
      const { error } = await supabase
        .from('timetables')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadTimetables();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete timetable');
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Timetables Dashboard</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 rounded">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="text-center p-4">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {timetables.map((timetable) => (
                <tr key={timetable.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {timetable.id.slice(0, 8)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {timetable.user_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {timetable.file_path}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      timetable.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      timetable.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
                      'bg-green-100 text-green-800'
                    }`}>
                      {timetable.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(timetable.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => deleteTimetable(timetable.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-8 space-x-4">
        <a 
          href="/test-data" 
          className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Test Data
        </a>
        <button
          onClick={loadTimetables}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Refresh
        </button>
      </div>
    </div>
  );
}
