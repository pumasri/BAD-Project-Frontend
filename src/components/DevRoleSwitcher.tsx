import { useState } from 'react';
import { api } from '../utils/api';

export function DevRoleSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Only render in development mode
  if (!import.meta.env.DEV) return null;

  async function switchRole(roleName: string) {
    setLoading(true);
    try {
      await api.post('/auth/dev/switch-role', { roleName });
      // Reload the page to reset the app state and AuthContext
      window.location.reload();
    } catch (error) {
      alert('Failed to switch role');
      console.error(error);
      setLoading(false);
    }
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      zIndex: 9999,
      fontFamily: 'sans-serif'
    }}>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            background: '#ffeb3b',
            color: '#000',
            border: '2px solid #000',
            borderRadius: '8px',
            padding: '8px 16px',
            fontWeight: 'bold',
            boxShadow: '4px 4px 0px #000',
            cursor: 'pointer'
          }}
        >
          🛠 Dev: Switch Role
        </button>
      ) : (
        <div style={{
          background: '#fff',
          border: '2px solid #000',
          borderRadius: '8px',
          padding: '16px',
          boxShadow: '4px 4px 0px #000',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <strong style={{ fontSize: '0.9rem' }}>Force Role:</strong>
            <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
          </div>
          
          <button disabled={loading} onClick={() => switchRole('ADMIN')} style={btnStyle}>ADMIN</button>
          <button disabled={loading} onClick={() => switchRole('STAFF')} style={btnStyle}>STAFF</button>
          <button disabled={loading} onClick={() => switchRole('STUDENT')} style={btnStyle}>STUDENT</button>
        </div>
      )}
    </div>
  );
}

const btnStyle = {
  background: '#f0f0f0',
  border: '1px solid #ccc',
  padding: '6px 12px',
  borderRadius: '4px',
  cursor: 'pointer',
  textAlign: 'left' as const,
  width: '100%'
};
