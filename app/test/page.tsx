'use client';

import { useState } from 'react';
import { signIn, signUp, signOut } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export default function TestPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [testData, setTestData] = useState<any>(null);

  // Test authentication
  const handleSignUp = async () => {
    const { data, error } = await signUp(email, password);
    setMessage(error ? `Error: ${error.message}` : 'Signed up successfully!');
  };

  const handleSignIn = async () => {
    const { data, error } = await signIn(email, password);
    setMessage(error ? `Error: ${error.message}` : 'Signed in successfully!');
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    setMessage(error ? `Error: ${error.message}` : 'Signed out successfully!');
  };

  // Test database operations
  const testDatabase = async () => {
    try {
      // Test inserting a timetable
      const { data: timetable, error: timetableError } = await supabase
        .from('timetables')
        .insert({
          user_id: email, // Using email as user_id for test
          file_path: 'test-file.pdf',
          status: 'pending'
        })
        .select()
        .single();

      if (timetableError) throw timetableError;

      // Test inserting a class schedule
      const { data: schedule, error: scheduleError } = await supabase
        .from('class_schedules')
        .insert({
          timetable_id: timetable.id,
          course_name: 'Test Course',
          day: 'Monday',
          start_time: '09:00',
          end_time: '10:30',
          venue: 'Room 101'
        })
        .select()
        .single();

      if (scheduleError) throw scheduleError;

      setTestData({ timetable, schedule });
      setMessage('Database test successful!');
    } catch (error: any) {
      setMessage(`Database error: ${error.message}`);
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Test Page</h1>
      
      {/* Auth Test Section */}
      <div className="mb-8 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-4">Authentication Test</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <div className="space-x-2">
          <button
            onClick={handleSignUp}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Sign Up
          </button>
          <button
            onClick={handleSignIn}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Sign In
          </button>
          <button
            onClick={handleSignOut}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Database Test Section */}
      <div className="mb-8 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-4">Database Test</h2>
        <button
          onClick={testDatabase}
          className="bg-purple-500 text-white px-4 py-2 rounded w-full"
        >
          Test Database
        </button>
      </div>

      {/* Message Display */}
      {message && (
        <div className="p-4 border rounded bg-gray-100">
          <h2 className="font-semibold mb-2">Status:</h2>
          <p>{message}</p>
        </div>
      )}

      {/* Test Data Display */}
      {testData && (
        <div className="mt-4 p-4 border rounded bg-gray-100">
          <h2 className="font-semibold mb-2">Test Data:</h2>
          <pre className="whitespace-pre-wrap">
            {JSON.stringify(testData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
