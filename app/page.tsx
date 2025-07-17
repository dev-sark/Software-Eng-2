'use client';
import { signIn } from 'next-auth/react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8 bg-gray-800/80 rounded-2xl backdrop-blur-sm">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-purple-500 mb-2">
            Timetable AI
          </h1>
          <p className="text-gray-300 text-lg">
            Intelligent Scheduling Assistant
          </p>
        </div>
        
        <div className="mt-8">
          <button
            onClick={() => signIn('google', { 
              callbackUrl: '/dashboard',
              redirect: true
            })}
            className="w-full flex items-center justify-center px-8 py-4 rounded-full bg-white text-gray-800 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <span className="mr-3">Sign in with Google</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="fill-current text-gray-800">
              <path d="M21.35 11.1H12.18V12.98h6.08c-.26 1.48-1.6 2.53-3.36 2.53-1.95 0-3.51-1.31-3.51-2.94s1.56-2.94 3.51-2.94c.98 0 1.89.43 2.54 1.07l1.8-1.79C17.89 8.38 15.27 7 12.18 7c-3.44 0-6.25 2.54-6.25 5.7s2.81 5.7 6.25 5.7c3.44 0 5.89-2.54 5.89-5.7s-2.45-5.7-5.89-5.7z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
