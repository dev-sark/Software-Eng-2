'use client';
import { signIn, signOut, useSession } from 'next-auth/react';

export default function Home() {
  const { data: session, status } = useSession();

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
    <main style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', backgroundColor: '#141414', color: 'white' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', background: 'linear-gradient(to right, #6c5ce7, #b62bf7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Timetable AI App
        </h1>
        <p style={{ marginBottom: '2rem', color: '#a3a3a3' }}>
          Intelligent scheduling made simple
        </p>
        
        {status === 'loading' ? (
          <div>Loading...</div>
        ) : session ? (
          <div>
            <div style={{ marginBottom: '2rem', backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '16px', borderRadius: '8px' }}>
              {session.user?.image && (
                <img
                  src={session.user.image}
                  alt="Profile"
                  style={{ width: '64px', height: '64px', borderRadius: '50%', margin: '0 auto' }}
                />
              )}
              <h2 style={{ color: 'white' }}>{session.user?.name}</h2>
              <p style={{ color: '#a3a3a3' }}>{session.user?.email}</p>
              <button
                onClick={() => signOut()}
                style={{ 
                  padding: '8px 16px',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginTop: '1rem'
                }}
              >
                Sign Out
              </button>
            </div>
            
            <div style={{ maxWidth: '400px', margin: '0 auto', backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '16px', borderRadius: '8px' }}>
              <h2 style={{ marginBottom: '1rem', color: 'white' }}>Upload Timetable</h2>
              <form onSubmit={handleSubmit}>
                <input 
                  type="file" 
                  name="file"
                  accept=".jpg,.jpeg,.png,.webp,.pdf"
                  style={{ marginBottom: '1rem', display: 'block', width: '100%' }}
                />
                <button 
                  type="submit"
                  style={{ 
                    width: '100%',
                    padding: '8px 16px',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Upload File
                </button>
              </form>
            </div>
          </div>
        ) : (
          <button
            onClick={() => signIn('google', { callbackUrl: '/' })}
            style={{ 
              padding: '12px 24px',
              backgroundColor: 'white',
              color: 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              margin: '0 auto'
            }}
          >
            <img
              src="https://www.google.com/favicon.ico"
              alt="Google"
              style={{ width: '24px', height: '24px', marginRight: '12px' }}
            />
            Sign in with Google
          </button>
        )}
      </div>
    </main>
  );
}
