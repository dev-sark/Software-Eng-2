'use client';
import { signIn } from 'next-auth/react';

export default function Home() {
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
    </main>
  );
}
