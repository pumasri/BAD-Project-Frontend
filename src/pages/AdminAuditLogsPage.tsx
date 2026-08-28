import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils';

interface AuditLog {
  id: string;
  createdAt: string;
  action: string;
  entityType: string;
  entityId: string;
  details?: any;
  actor?: {
    fullName: string;
    universityEmail: string;
  } | null;
}

export function AdminAuditLogsPage() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/audit-logs')
      .then(data => {
        setLogs(data);
      })
      .catch(err => {
        console.error('Error fetching audit logs:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <main className="page-shell">
      <section className="dashboard-card">
        <div className="dashboard-header">
          <div>
            <p className="eyebrow">ADMIN PORTAL</p>
            <h1>Audit Logs</h1>
            <p>Track all system actions and changes.</p>
          </div>
          <button
            type="button"
            className="dashboard-logout"
            onClick={() => navigate('/admin-dashboard')}
          >
            Back to Dashboard
          </button>
        </div>

        <div className="staff-item-toolbar" style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <input type="text" placeholder="Search logs..." style={{ flex: 1, minWidth: '200px', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)' }} />
          <select style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: 'white' }}>
            <option value="ALL">Filter Action</option>
            <option value="CREATE_ITEM">CREATE_ITEM</option>
            <option value="CREATE_CLAIM">CREATE_CLAIM</option>
            <option value="UPDATE_ITEM">UPDATE_ITEM</option>
            <option value="APPROVE_CLAIM">APPROVE_CLAIM</option>
            <option value="REJECT_CLAIM">REJECT_CLAIM</option>
            <option value="REQUEST_MORE_INFORMATION">REQUEST_MORE_INFORMATION</option>
            <option value="UPDATE_USER_ROLE">UPDATE_USER_ROLE</option>
            <option value="DEACTIVATE_USER">DEACTIVATE_USER</option>
          </select>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.1)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'rgba(0,0,0,0.02)', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
              <tr>
                <th style={{ padding: '16px', color: '#594a3a', fontSize: '0.85rem' }}>TIME</th>
                <th style={{ padding: '16px', color: '#594a3a', fontSize: '0.85rem' }}>USER</th>
                <th style={{ padding: '16px', color: '#594a3a', fontSize: '0.85rem' }}>ACTION</th>
                <th style={{ padding: '16px', color: '#594a3a', fontSize: '0.85rem' }}>TARGET</th>
                <th style={{ padding: '16px', color: '#594a3a', fontSize: '0.85rem' }}>DETAILS</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} style={{ padding: '24px', textAlign: 'center' }}>Loading audit logs...</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: '24px', textAlign: 'center' }}>No audit logs recorded yet.</td></tr>
              ) : logs.map(log => (
                <tr key={log.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <td style={{ padding: '16px', color: '#918477', fontSize: '0.9rem' }}>
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <strong>{log.actor?.fullName || 'System / OIDC'}</strong>
                    <br />
                    <small style={{ color: '#918477' }}>{log.actor?.universityEmail || ''}</small>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ padding: '4px 8px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>{log.action}</span>
                  </td>
                  <td style={{ padding: '16px', color: '#a35d3f', fontWeight: 'bold' }}>
                    {log.entityType} ({log.entityId.slice(0, 8)})
                  </td>
                  <td style={{ padding: '16px', color: '#594a3a' }}>
                    {log.details ? JSON.stringify(log.details) : 'N/A'}
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
