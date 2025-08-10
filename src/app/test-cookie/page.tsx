"use client"

import { useState } from 'react';

export default function TestCookiePage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testCookie = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-cookie');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: 'Failed to test cookie' });
    } finally {
      setLoading(false);
    }
  };

  const checkCookies = () => {
    const cookies = document.cookie;
    setResult({ cookies });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Cookie Test Page</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testCookie}
          disabled={loading}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            background: '#1E3A8A',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {loading ? 'Testing...' : 'Test Set Cookie'}
        </button>
        
        <button 
          onClick={checkCookies}
          style={{
            padding: '10px 20px',
            background: '#10B981',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Check Client Cookies
        </button>
      </div>

      {result && (
        <div style={{
          background: '#f3f4f6',
          padding: '15px',
          borderRadius: '4px',
          border: '1px solid #d1d5db'
        }}>
          <h3>Result:</h3>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
} 