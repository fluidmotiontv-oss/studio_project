import { useEffect, useState } from 'react';

export default function App() {
  const [status, setStatus] = useState(null);
  const [audit, setAudit] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [loadingAudit, setLoadingAudit] = useState(false);

  const fetchStatus = () => {
    setLoadingStatus(true);
    fetch('/api/status')
      .then((res) => res.json())
      .then((data) => {
        setStatus(data);
        setLoadingStatus(false);
      })
      .catch((err) => {
        console.error('Status fetch error:', err);
        setLoadingStatus(false);
      });
  };

  const fetchAudit = () => {
    setLoadingAudit(true);
    fetch('/api/audit')
      .then((res) => res.json())
      .then((data) => {
        setAudit(data);
        setLoadingAudit(false);
      })
      .catch((err) => {
        console.error('Audit fetch error:', err);
        setLoadingAudit(false);
      });
  };

  useEffect(() => {
    fetchStatus();
    fetchAudit();
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '900px', margin: '0 auto', color: '#fff', backgroundColor: '#121212', minHeight: '100vh' }}>
      <header style={{ borderBottom: '2px solid #333', paddingBottom: '1rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>Fluid Motion Studio Dashboard</h1>
        <button 
          onClick={fetchAudit} 
          disabled={loadingAudit}
          style={{ padding: '0.6rem 1.2rem', backgroundColor: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          {loadingAudit ? 'Scanning...' : 'Rescan Media'}
        </button>
      </header>

      {/* System Status Section */}
      <section style={{ marginBottom: '2rem' }}>
        <h2>System Health</h2>
        {loadingStatus ? (
          <p>Connecting to backend...</p>
        ) : status ? (
          <div style={{ border: '1px solid #333', padding: '1rem', borderRadius: '8px', background: '#1e1e1e' }}>
            <p style={{ margin: '0.4rem 0' }}><strong>System:</strong> {status.system}</p>
            <p style={{ margin: '0.4rem 0' }}><strong>Status:</strong> <span style={{ color: 'limegreen' }}>{status.status}</span></p>
            <p style={{ margin: '0.4rem 0' }}><strong>Message:</strong> {status.message}</p>
          </div>
        ) : (
          <p style={{ color: 'tomato' }}>Could not connect to Flask API.</p>
        )}
      </section>

      {/* Media Inventory Audit Section */}
      <section>
        <h2>3-Way Media Audit Report</h2>
        {loadingAudit ? (
          <p>Auditing media inventory scan in progress...</p>
        ) : audit ? (
          <div style={{ border: '1px solid #333', padding: '1.5rem', borderRadius: '8px', background: '#1e1e1e' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ background: '#2a2a2a', padding: '1rem', borderRadius: '6px', textAlign: 'center' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#888' }}>Total Files</h4>
                <span style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>{audit.total_files ?? 0}</span>
              </div>
              <div style={{ background: '#2a2a2a', padding: '1rem', borderRadius: '6px', textAlign: 'center' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#888' }}>Verified</h4>
                <span style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'limegreen' }}>{audit.verified_files ?? 0}</span>
              </div>
              <div style={{ background: '#2a2a2a', padding: '1rem', borderRadius: '6px', textAlign: 'center' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#888' }}>Discrepancies</h4>
                <span style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'tomato' }}>{audit.missing_files ?? 0}</span>
              </div>
              <div style={{ background: '#2a2a2a', padding: '1rem', borderRadius: '6px', textAlign: 'center' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#888' }}>Storage Used</h4>
                <span style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#0070f3' }}>{audit.total_storage_used ?? '0 MB'}</span>
              </div>
            </div>

            {audit.timestamp && (
              <p style={{ fontSize: '0.85rem', color: '#888' }}>
                Last Scanned: {audit.timestamp} ({audit.scan_time_seconds}s)
              </p>
            )}

            {audit.recent_discrepancies && audit.recent_discrepancies.length > 0 ? (
              <div style={{ marginTop: '1rem' }}>
                <h3 style={{ color: 'tomato' }}>Flagged Discrepancies</h3>
                <ul style={{ paddingLeft: '1.2rem' }}>
                  {audit.recent_discrepancies.map((item, index) => (
                    <li key={index} style={{ marginBottom: '0.4rem' }}>
                      <strong>{item.id}</strong> — {item.issue}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p style={{ color: 'limegreen', marginTop: '1rem' }}>✓ No file integrity or zero-byte discrepancies detected.</p>
            )}
          </div>
        ) : (
          <p style={{ color: 'tomato' }}>Failed to retrieve audit report.</p>
        )}
      </section>
    </div>
  );
}