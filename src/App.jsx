import { useEffect, useState } from 'react';

export default function App() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Relative path routed through Vite's proxy to http://localhost:5000/api/status
    fetch('/api/status')
      .then((res) => res.json())
      .then((data) => {
        setStatus(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error connecting to Flask backend:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Fluid Motion Studio Dashboard</h1>
      {loading ? (
        <p>Connecting to Python API...</p>
      ) : status ? (
        <div style={{ border: '1px solid #444', padding: '1rem', borderRadius: '8px' }}>
          <p><strong>System:</strong> {status.system}</p>
          <p><strong>Status:</strong> {status.status}</p>
          <p><strong>Message:</strong> {status.message}</p>
        </div>
      ) : (
        <p style={{ color: 'red' }}>Could not connect to Flask API.</p>
      )}
    </div>
  );
}