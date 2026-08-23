import { useNavigate } from 'react-router-dom';

const mockUsers = [
  { id: 1, name: 'Khaimuk Pumasri', email: 'uxxxxxxx@au.edu', role: 'Student', status: 'Active' },
  { id: 2, name: 'Staff Member', email: 'staff@au.edu', role: 'Staff', status: 'Active' },
  { id: 3, name: 'Admin User', email: 'admin@au.edu', role: 'Admin', status: 'Active' },
  { id: 4, name: 'Inactive Student', email: 'uyyyyyyy@au.edu', role: 'Student', status: 'Inactive' },
];

export function AdminUsersPage() {
  const navigate = useNavigate();

  return (
    <main className="page-shell">
      <section className="dashboard-card">
        <div className="dashboard-header">
          <div>
            <p className="eyebrow">ADMIN PORTAL</p>
            <h1>User Management</h1>
            <p>Manage system access, roles, and user accounts.</p>
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
          <div className="staff-item-search" style={{ flex: 1, minWidth: '200px' }}>
            <input type="text" placeholder="Search by name or email..." style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)' }} />
          </div>
          <select className="staff-status-filter" style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: 'white' }}>
            <option value="ALL">All Roles</option>
            <option value="Student">Student</option>
            <option value="Staff">Staff</option>
            <option value="Admin">Admin</option>
          </select>
          <select className="staff-status-filter" style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: 'white' }}>
            <option value="ALL">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.1)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'rgba(0,0,0,0.02)', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
              <tr>
                <th style={{ padding: '16px', color: '#594a3a' }}>Name</th>
                <th style={{ padding: '16px', color: '#594a3a' }}>Email</th>
                <th style={{ padding: '16px', color: '#594a3a' }}>Role</th>
                <th style={{ padding: '16px', color: '#594a3a' }}>Status</th>
                <th style={{ padding: '16px', color: '#594a3a', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockUsers.map(user => (
                <tr key={user.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <td style={{ padding: '16px' }}><strong>{user.name}</strong></td>
                  <td style={{ padding: '16px', color: '#918477' }}>{user.email}</td>
                  <td style={{ padding: '16px' }}>
                    <span className="status-badge" style={{ background: 'rgba(0,0,0,0.05)', color: '#594a3a' }}>{user.role}</span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span className={`status-badge ${user.status === 'Active' ? 'status-resolved' : 'status-open'}`}>{user.status}</span>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <button className="secondary-button" style={{ padding: '8px 16px', fontSize: '0.9rem' }} onClick={() => alert('View user details (Phase 1 Mock)')}>
                      View
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
