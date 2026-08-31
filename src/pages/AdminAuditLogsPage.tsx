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

  // Filtering state
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

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

  const filteredLogs = logs.filter(log => {
    const searchString = `${log.actor?.fullName || ''} ${log.actor?.universityEmail || ''} ${log.entityType} ${log.entityId} ${JSON.stringify(log.details || {})}`.toLowerCase();
    const matchSearch = searchString.includes(searchTerm.toLowerCase());
    const matchAction = actionFilter === 'ALL' || log.action === actionFilter;
    return matchSearch && matchAction;
  });

  const uniqueActions = Array.from(new Set(logs.map(log => log.action))).sort();

  const formatAction = (action: string) => {
    return action
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const getActionBadgeStyle = (action: string) => {
    if (action.startsWith('CREATE_')) return { background: 'rgba(83, 132, 91, 0.12)', color: '#4f7e56' };
    if (action.startsWith('UPDATE_') || action.startsWith('MATCH_')) return { background: 'rgba(87, 120, 157, 0.1)', color: '#52739a' };
    if (action.startsWith('DELETE_') || action.startsWith('REJECT_')) return { background: 'rgba(217, 48, 37, 0.1)', color: '#d93025' };
    return { background: 'rgba(120, 109, 98, 0.1)', color: '#766c63' }; // Neutral
  };

  // Stats
  const totalLogs = filteredLogs.length;
  const userActions = filteredLogs.filter(l => l.entityType === 'User').length;
  const itemActions = filteredLogs.filter(l => l.entityType === 'ItemReport').length;
  const categoryActions = filteredLogs.filter(l => l.entityType === 'ItemCategory').length;

  return (
    <main className="page-shell">
      <section className="dashboard-card admin-table-card">
        <button type="button" className="detail-back-button" onClick={() => navigate('/admin-dashboard')}>
          ← Back to Dashboard
        </button>

        <div className="dashboard-header">
          <div>
            <p className="eyebrow">ADMIN PORTAL</p>
            <h1>Audit Logs</h1>
            <p>View and track important actions and changes in the system.</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {[
            { label: 'Total Logs', value: totalLogs },
            { label: 'User Actions', value: userActions },
            { label: 'Item Actions', value: itemActions },
            { label: 'Category Actions', value: categoryActions },
          ].map(stat => (
            <div key={stat.label} style={{
              flex: '1 1 120px',
              background: 'rgba(255, 255, 255, 0.6)',
              border: '1px solid rgba(0,0,0,0.05)',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}>
              <span className="muted-text" style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                {stat.label}
              </span>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#594a3a' }}>
                {stat.value}
              </span>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flex: 1, minWidth: '250px', background: 'white', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            <span style={{ padding: '10px 16px', color: '#918477', display: 'flex', alignItems: 'center' }}>
              🔍
            </span>
            <input
              type="text"
              placeholder="Search logs by user, entity, or details..."
              style={{ width: '100%', padding: '10px 16px 10px 0', border: 'none', outline: 'none', background: 'transparent' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            style={{ padding: '10px 16px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: 'white', outline: 'none', color: '#594a3a', minWidth: '180px' }}
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
          >
            <option value="ALL">All Actions</option>
            {uniqueActions.map(action => (
              <option key={action} value={action}>{formatAction(action)}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>User</th>
                <th>Action</th>
                <th>Target</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} style={{ padding: '48px 24px', textAlign: 'center', color: '#918477' }}>Loading audit logs...</td></tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '48px 24px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '2rem' }}>📭</span>
                      <strong style={{ color: '#594a3a', fontSize: '1.1rem' }}>No audit logs found</strong>
                      <span className="muted-text">Try changing your search or filter.</span>
                    </div>
                  </td>
                </tr>
              ) : filteredLogs.map(log => {
                const dateObj = new Date(log.createdAt);
                return (
                  <tr key={log.id} className="admin-table-row">
                    <td style={{ minWidth: '120px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <strong style={{ color: '#594a3a', fontSize: '0.9rem' }}>
                          {dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </strong>
                        <span className="muted-text" style={{ fontSize: '0.8rem' }}>
                          {dateObj.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
                        </span>
                      </div>
                    </td>
                    <td style={{ minWidth: '180px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <strong style={{ color: '#594a3a' }}>{log.actor?.fullName || 'System / OIDC'}</strong>
                        {log.actor?.universityEmail && (
                          <a href={`mailto:${log.actor.universityEmail}`} className="text-link" style={{ fontSize: '0.85rem' }}>
                            {log.actor.universityEmail}
                          </a>
                        )}
                      </div>
                    </td>
                    <td style={{ minWidth: '180px' }}>
                      <span className="status-badge" style={{ ...getActionBadgeStyle(log.action), fontSize: '0.75rem', letterSpacing: '0.05em', fontWeight: 'bold' }}>
                        {formatAction(log.action)}
                      </span>
                    </td>
                    <td style={{ minWidth: '160px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <strong style={{ color: '#a35d3f' }}>
                          {log.entityType.replace(/([A-Z])/g, ' $1').trim()}
                        </strong>
                        <span style={{ color: '#a35d3f', opacity: 0.7, fontFamily: 'monospace', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                          ID: {log.entityId.slice(0, 8)}
                        </span>
                      </div>
                    </td>
                    <td style={{ minWidth: '200px' }}>
                      {log.details && typeof log.details === 'object' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {Object.entries(log.details).map(([key, value]) => {
                            const formattedKey = key.replace(/([A-Z])/g, ' $1').trim();
                            const isBoolean = typeof value === 'boolean';
                            return (
                              <div key={key} style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ color: '#918477', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                                  {formattedKey}
                                </span>
                                {isBoolean ? (
                                  <span className="status-badge" style={{
                                    background: value ? 'rgba(83, 132, 91, 0.12)' : 'rgba(120, 109, 98, 0.1)',
                                    color: value ? '#4f7e56' : '#766c63',
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold',
                                    width: 'fit-content',
                                    marginTop: '2px',
                                    letterSpacing: '0.05em'
                                  }}>
                                    {value ? 'TRUE' : 'FALSE'}
                                  </span>
                                ) : (
                                  <span style={{ color: '#594a3a', fontSize: '0.9rem' }}>
                                    {String(value)}
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <span className="muted-text" style={{ fontSize: '0.9rem' }}>—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
