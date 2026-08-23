import { useNavigate } from 'react-router-dom';

const mockLogs = [
  { id: 1, time: 'Aug 24 10:32', user: 'Staff Member', action: 'APPROVE_CLAIM', target: 'CLM-001', details: 'Claim approved' },
  { id: 2, time: 'Aug 24 10:20', user: 'Khaimuk Pumasri', action: 'CREATE_CLAIM', target: 'CLM-002', details: 'New claim submitted' },
  { id: 3, time: 'Aug 23 15:44', user: 'Staff Member', action: 'CREATE_ITEM', target: 'ITM-035', details: 'Found item reported' },
  { id: 4, time: 'Aug 23 14:10', user: 'Admin User', action: 'UPDATE_USER_ROLE', target: 'USR-102', details: 'Role changed to STAFF' },
  { id: 5, time: 'Aug 23 11:05', user: 'Staff Member', action: 'REQUEST_MORE_INFORMATION', target: 'CLM-003', details: 'Requested missing evidence' },
];

export function AdminAuditLogsPage() {
  const navigate = useNavigate();

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
          <select style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: 'white' }}>
            <option value="ALL">Filter User</option>
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
              {mockLogs.map(log => (
                <tr key={log.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <td style={{ padding: '16px', color: '#918477', fontSize: '0.9rem' }}>{log.time}</td>
                  <td style={{ padding: '16px' }}><strong>{log.user}</strong></td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ padding: '4px 8px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>{log.action}</span>
                  </td>
                  <td style={{ padding: '16px', color: '#a35d3f', fontWeight: 'bold' }}>{log.target}</td>
                  <td style={{ padding: '16px', color: '#594a3a' }}>{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
