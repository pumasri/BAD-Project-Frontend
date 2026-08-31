import { useState, useEffect } from 'react';
import { AdminTopNav } from '../components/AdminTopNav';
import { api, ApiError } from '../utils';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

export function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // Filtering state
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');



  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      setIsLoading(true);
      const data = await api.get('/admin/users');
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function changeUserRole(userId: string, oldRole: string, newRole: string) {
    if (!window.confirm(`Change role from ${oldRole} to ${newRole}?`)) {
      return;
    }
    try {
      await api.patch(`/admin/users/${userId}/role`, { roleName: newRole });
      fetchUsers();
    } catch (error) {
      if (error instanceof ApiError) {
        alert(error.message);
      } else {
        alert('Failed to update user role.');
      }
    }
  }

  async function toggleUserStatus(userId: string, currentStatus: boolean) {
    try {
      await api.patch(`/admin/users/${userId}/status`, { isActive: !currentStatus });
      fetchUsers();
    } catch (error) {
      if (error instanceof ApiError) {
        alert(error.message);
      } else {
        alert('Failed to update user status.');
      }
    }
  }



  const filteredUsers = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = roleFilter === 'ALL' || u.role.toUpperCase() === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <main className="page-shell admin-shell">
      <section className="dashboard-card admin-content-card" style={{ position: 'relative' }}>
        <AdminTopNav />

        {/* Header */}
        <div className="dashboard-header" style={{ alignItems: 'flex-start' }}>
          <div>
            <h1>User Management</h1>
            <p>Manage system access, roles, and user accounts.</p>
          </div>

        </div>

        {/* Summary Stats */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {[
            { label: 'Total Users', value: users.length },
            { label: 'Active Users', value: users.filter(u => u.isActive).length },
            { label: 'Students', value: users.filter(u => u.role === 'STUDENT').length },
            { label: 'Staff & Admin', value: users.filter(u => u.role === 'STAFF' || u.role === 'ADMIN').length },
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

        <div className="staff-item-toolbar" style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="staff-item-search" style={{ display: 'flex', flex: 1, minWidth: '250px', background: 'white', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            <span style={{ padding: '10px 16px', color: '#918477', display: 'flex', alignItems: 'center' }}>
              🔍
            </span>
            <input
              type="text"
              placeholder="Search by name or email..."
              style={{ width: '100%', padding: '10px 16px 10px 0', border: 'none', outline: 'none', background: 'transparent' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="staff-status-filter"
            style={{ padding: '10px 16px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: 'white', outline: 'none', color: '#594a3a', minWidth: '180px' }}
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="ALL">All Roles</option>
            <option value="STUDENT">Student</option>
            <option value="STAFF">Staff</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} style={{ padding: '48px 24px', textAlign: 'center', color: '#918477' }}>Loading users...</td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '48px 24px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '2rem' }}>📭</span>
                      <strong style={{ color: '#594a3a', fontSize: '1.1rem' }}>No users found</strong>
                      <span className="muted-text">Try changing your search or filter.</span>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.map(user => (
                <tr key={user.id} className="admin-table-row">
                  <td><strong>{user.name}</strong></td>
                  <td>
                    <a href={`mailto:${user.email}`} className="text-link" style={{ fontSize: '0.9rem' }}>
                      {user.email}
                    </a>
                  </td>
                  <td>
                    <select
                      className="role-select-dropdown"
                      value={user.role}
                      onChange={(e) => changeUserRole(user.id, user.role, e.target.value)}
                    >
                      <option value="STUDENT">STUDENT</option>
                      <option value="STAFF">STAFF</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                  <td>
                    <span className={`status-badge ${user.isActive ? 'status-resolved' : 'status-archived'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button
                      className="action-btn"
                      style={{
                        background: 'transparent',
                        border: user.isActive ? '1px solid rgba(217, 48, 37, 0.3)' : '1px solid rgba(83, 132, 91, 0.3)',
                        color: user.isActive ? '#d93025' : '#4f7e56',
                        padding: '6px 16px',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: 'bold',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = user.isActive ? 'rgba(217, 48, 37, 0.1)' : 'rgba(83, 132, 91, 0.1)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                      onClick={() => toggleUserStatus(user.id, user.isActive)}
                    >
                      {user.isActive ? 'Deactivate' : 'Activate'}
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
