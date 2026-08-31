import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, ApiError } from '../utils';

interface Partner {
  id: string;
  name: string;
  description?: string | null;
  baseUrl: string;
  apiKeyIdentifier: string;
  isActive: boolean;
  createdAt: string;
  syncedItemCount: number;
  lastSync: {
    createdAt: string;
    receivedCount: number;
    createdCount: number;
    updatedCount: number;
    deactivatedCount: number;
  } | null;
}

export function AdminApiIntegrationsPage() {
  const navigate = useNavigate();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New partner state
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdSecret, setCreatedSecret] = useState('');
  const [createError, setCreateError] = useState('');

  useEffect(() => {
    fetchPartners();
  }, []);

  async function fetchPartners() {
    try {
      setIsLoading(true);
      const data = await api.get('/admin/partners');
      setPartners(data);
    } catch (error) {
      console.error('Error fetching partners:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreatePartner(e: FormEvent) {
    e.preventDefault();
    setCreateError('');
    setCreatedSecret('');
    setIsSubmitting(true);

    try {
      const response = await api.post('/admin/partners', {
        name: newName,
        description: newDesc,
        baseUrl: newUrl
      });

      setCreatedSecret(response.secret);
      setNewName('');
      setNewDesc('');
      setNewUrl('');

      fetchPartners();
    } catch (error) {
      if (error instanceof ApiError) {
        setCreateError(error.message);
      } else {
        setCreateError('An unexpected error occurred while creating the partner.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="page-shell">
      <section className="dashboard-card" style={{ position: 'relative' }}>
        <button type="button" className="detail-back-button" onClick={() => navigate('/admin-dashboard')}>
          ← Back to Dashboard
        </button>

        <div className="dashboard-header" style={{ alignItems: 'flex-start' }}>
          <div>
            <p className="eyebrow">ADMIN PORTAL</p>
            <h1>API Integrations</h1>
            <p>Manage x-api-key authentication and connections for Partner Teams.</p>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', color: '#594a3a', margin: 0 }}>Peer API Connections</h2>
          <button
            className="submit-button"
            style={{ width: 'auto', margin: 0, padding: '12px 24px' }}
            onClick={() => {
              setCreatedSecret('');
              setCreateError('');
              setShowCreateModal(true);
            }}
          >
            + Connect Partner
          </button>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.1)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'rgba(0,0,0,0.02)', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
              <tr>
                <th style={{ padding: '16px', color: '#594a3a', fontSize: '0.9rem' }}>Partner Team</th>
                <th style={{ padding: '16px', color: '#594a3a', fontSize: '0.9rem' }}>Status</th>
                <th style={{ padding: '16px', color: '#594a3a', fontSize: '0.9rem' }}>Sync activity</th>
                <th style={{ padding: '16px', color: '#594a3a', fontSize: '0.9rem' }}>Configuration</th>
                <th style={{ padding: '16px', color: '#594a3a', fontSize: '0.9rem' }}>Identifier</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} style={{ padding: '24px', textAlign: 'center' }}>Loading connections...</td></tr>
              ) : partners.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: '24px', textAlign: 'center' }}>No integrations configured.</td></tr>
              ) : partners.map(conn => (
                <tr key={conn.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <td style={{ padding: '16px', fontWeight: 'bold', color: '#594a3a' }}>
                    {conn.name}
                    <br />
                    <small style={{ fontWeight: 'normal', color: '#918477' }}>{conn.description}</small>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span className={`status-badge ${conn.isActive ? 'status-resolved' : 'status-open'}`}>
                      {conn.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '16px', fontSize: '0.85rem', color: '#594a3a' }}>
                    <strong>{conn.syncedItemCount}</strong> stored item{conn.syncedItemCount === 1 ? '' : 's'}
                    <br />
                    <small style={{ color: '#918477' }}>
                      {conn.lastSync
                        ? `Last sync: ${new Date(conn.lastSync.createdAt).toLocaleString()}`
                        : 'No sync received yet'}
                    </small>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontSize: '0.85rem', marginBottom: '4px' }}>
                      <strong style={{ color: '#594a3a' }}>Base URL:</strong> <span style={{ color: '#918477' }}>{conn.baseUrl}</span>
                    </div>
                    <div style={{ fontSize: '0.85rem' }}>
                      <strong style={{ color: '#594a3a' }}>Auth Type:</strong> <span style={{ fontFamily: 'monospace', color: '#a35d3f' }}>x-api-key</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px', fontFamily: 'monospace', color: '#918477', fontSize: '0.85rem' }}>
                    {conn.apiKeyIdentifier}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Connect Partner Modal */}
        {showCreateModal && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', zIndex: 100,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <div style={{
              background: 'white', padding: '32px', borderRadius: '16px',
              width: '100%', maxWidth: '450px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
            }}>
              <h2 style={{ margin: '0 0 24px 0', fontSize: '1.5rem', color: '#31281f' }}>Connect Partner Team</h2>

              {!createdSecret ? (
                <form onSubmit={handleCreatePartner}>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Partner Team Name</label>
                    <input
                      type="text" required
                      value={newName} onChange={e => setNewName(e.target.value)}
                      placeholder="e.g. Library Services"
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}
                    />
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Partner API Base URL</label>
                    <input
                      type="url" required
                      value={newUrl} onChange={e => setNewUrl(e.target.value)}
                      placeholder="https://library.au.edu/api/v1"
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}
                    />
                  </div>
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Description</label>
                    <textarea
                      value={newDesc} onChange={e => setNewDesc(e.target.value)}
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', minHeight: '80px', fontFamily: 'inherit' }}
                    />
                  </div>

                  {createError && (
                    <p style={{ color: '#d93025', marginBottom: '16px', fontSize: '0.9rem' }}>{createError}</p>
                  )}

                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #ccc', background: 'transparent', cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#31281f', color: 'white', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
                    >
                      {isSubmitting ? 'Connecting...' : 'Connect Partner'}
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <p style={{ color: '#2b7a78', fontWeight: 600, marginBottom: '16px' }}>
                    ✔ Partner successfully registered!
                  </p>
                  <p style={{ fontSize: '0.95rem', color: '#594a3a', marginBottom: '16px' }}>
                    Below is the API secret key generated for this partner. <strong>Copy it now.</strong> It will not be shown again.
                  </p>
                  <div style={{
                    background: '#f5f5f5', padding: '16px', borderRadius: '8px',
                    border: '1px solid #ddd', fontFamily: 'monospace',
                    wordBreak: 'break-all', marginBottom: '24px', userSelect: 'all'
                  }}>
                    {createdSecret}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#31281f', color: 'white', cursor: 'pointer' }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </section>
    </main>
  );
}
