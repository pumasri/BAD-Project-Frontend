import { useNavigate } from 'react-router-dom';

const mockApiConnections = [
  {
    id: 1,
    partnerTeam: 'Library Services',
    status: 'Connected',
    outboundApi: 'https://library.au.edu/api/v1/lost-and-found',
    inboundEndpoint: '/api/v1/external/library',
    lastRequest: 'Aug 24, 2026 10:15 AM',
    requestStatus: 'Success'
  },
  {
    id: 2,
    partnerTeam: 'Campus Security',
    status: 'Disconnected',
    outboundApi: 'https://security.au.edu/api/sync',
    inboundEndpoint: '/api/v1/external/security',
    lastRequest: 'Aug 20, 2026 04:30 PM',
    requestStatus: 'Failed (401)'
  },
];

export function AdminApiIntegrationsPage() {
  const navigate = useNavigate();

  return (
    <main className="page-shell">
      <section className="dashboard-card" style={{ maxWidth: '1000px' }}>
        <div className="dashboard-header">
          <div>
            <p className="eyebrow">ADMIN PORTAL</p>
            <h1>API Integrations</h1>
            <p>Manage x-api-key authentication and connections for Partner Teams.</p>
          </div>
          <button
            type="button"
            className="dashboard-logout"
            onClick={() => navigate('/admin-dashboard')}
          >
            Back to Dashboard
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', color: '#594a3a', margin: 0 }}>Peer API Connections</h2>
          <button className="submit-button" style={{ width: 'auto', margin: 0, padding: '12px 24px' }} onClick={() => alert('Connect new partner (Phase 1 Mock)')}>
            + Connect Partner
          </button>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.1)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'rgba(0,0,0,0.02)', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
              <tr>
                <th style={{ padding: '16px', color: '#594a3a', fontSize: '0.9rem' }}>Partner Team</th>
                <th style={{ padding: '16px', color: '#594a3a', fontSize: '0.9rem' }}>Status</th>
                <th style={{ padding: '16px', color: '#594a3a', fontSize: '0.9rem' }}>Configuration</th>
                <th style={{ padding: '16px', color: '#594a3a', fontSize: '0.9rem' }}>Last Activity</th>
                <th style={{ padding: '16px', color: '#594a3a', textAlign: 'right', fontSize: '0.9rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockApiConnections.map(conn => (
                <tr key={conn.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <td style={{ padding: '16px', fontWeight: 'bold', color: '#594a3a' }}>{conn.partnerTeam}</td>
                  <td style={{ padding: '16px' }}>
                    <span className={`status-badge ${conn.status === 'Connected' ? 'status-resolved' : 'status-open'}`}>
                      {conn.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontSize: '0.85rem', marginBottom: '4px' }}>
                      <strong style={{ color: '#594a3a' }}>Outbound:</strong> <span style={{ color: '#918477' }}>{conn.outboundApi}</span>
                    </div>
                    <div style={{ fontSize: '0.85rem', marginBottom: '4px' }}>
                      <strong style={{ color: '#594a3a' }}>Inbound:</strong> <span style={{ color: '#918477' }}>{conn.inboundEndpoint}</span>
                    </div>
                    <div style={{ fontSize: '0.85rem' }}>
                      <strong style={{ color: '#594a3a' }}>Auth:</strong> <span style={{ fontFamily: 'monospace', color: '#a35d3f' }}>x-api-key</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontSize: '0.85rem', marginBottom: '4px', color: '#918477' }}>{conn.lastRequest}</div>
                    <div style={{ fontSize: '0.85rem', color: conn.requestStatus.includes('Failed') ? '#d9534f' : '#5cb85c' }}>
                      {conn.requestStatus}
                    </div>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <button className="secondary-button" style={{ padding: '6px 12px', fontSize: '0.85rem', color: '#594a3a' }} onClick={() => alert('Manage API Key (Phase 1 Mock)')}>
                      Manage Key
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
