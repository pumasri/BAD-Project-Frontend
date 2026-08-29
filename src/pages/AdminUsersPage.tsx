import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { api, ApiError } from '../utils';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

export function AdminUsersPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Filtering state
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // New staff form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createError, setCreateError] = useState('');

  // Get current user ID to prevent self-deactivation
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<{ sub: string }>(token);
        setCurrentUserId(decoded.sub);
      } catch (e) {
        // Handle invalid token
      }
    }
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

  async function handleCreateStaff(e: FormEvent) {
    e.preventDefault();
    setCreateError('');
    setIsSubmitting(true);

    try {
      await api.post('/admin/users', {
        name: newName,
        email: newEmail,
        password: newPassword,
        roleName: 'STAFF'
      });
      
      setNewName('');
      setNewEmail('');
      setNewPassword('');
      setShowCreateModal(false);
      
      fetchUsers();
    } catch (error) {
      if (error instanceof ApiError) {
        setCreateError(error.message);
      } else {
        setCreateError('An unexpected error occurred while creating the account.');
      }
    } finally {
      setIsSubmitting(false);
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
    <main className="page-shell">
      <section className="dashboard-card" style={{ position: 'relative' }}>
        <div className="dashboard-header">
          <div>
            <p className="eyebrow">ADMIN PORTAL</p>
            <h1>User Management</h1>
            <p>Manage system access, roles, and user accounts.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              className="submit-button"
              style={{ width: 'auto', padding: '12px 24px', margin: 0 }}
              onClick={() => setShowCreateModal(true)}
            >
              + Create Staff
            </button>
            <button
              type="button"
              className="dashboard-logout"
              onClick={() => navigate('/admin-dashboard')}
            >
              Back to Dashboard
            </button>
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
                    <span className="status-badge role-badge">{user.role}</span>
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
                        cursor: user.id === currentUserId ? 'not-allowed' : 'pointer',
                        opacity: user.id === currentUserId ? 0.5 : 1,
                        fontSize: '0.85rem',
                        fontWeight: 'bold',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        if (user.id !== currentUserId) {
                          e.currentTarget.style.background = user.isActive ? 'rgba(217, 48, 37, 0.1)' : 'rgba(83, 132, 91, 0.1)';
                        }
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                      onClick={() => toggleUserStatus(user.id, user.isActive)}
                      disabled={user.id === currentUserId}
                      title={user.id === currentUserId ? "You cannot deactivate your own account." : ""}
                    >
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Create Staff Modal */}
        {showCreateModal && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
            background: 'rgba(0, 0, 0, 0.15)', zIndex: 100,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(2px)'
          }}>
            <div style={{
              background: 'rgba(255, 250, 242, 0.95)', padding: '32px', borderRadius: '24px',
              width: '100%', maxWidth: '400px', boxShadow: '0 24px 60px rgba(69, 55, 37, 0.15)',
              border: '1px solid rgba(93, 82, 64, 0.1)'
            }}>
              <h2 style={{ margin: '0 0 24px 0', fontSize: '1.5rem', color: '#594a3a' }}>Create Staff Account</h2>
              <form onSubmit={handleCreateStaff} className="login-form">
                <div className="field">
                  <span>Full Name</span>
                  <input 
                    type="text" required 
                    value={newName} onChange={e => setNewName(e.target.value)}
                  />
                </div>
                <div className="field">
                  <span>Email Address</span>
                  <input 
                    type="email" required 
                    value={newEmail} onChange={e => setNewEmail(e.target.value)}
                  />
                </div>
                <div className="field" style={{ marginBottom: '8px' }}>
                  <span>Temporary Password</span>
                  <input 
                    type="password" required 
                    value={newPassword} onChange={e => setNewPassword(e.target.value)}
                    placeholder="Min 8 characters"
                  />
                </div>
                
                {createError && (
                  <p className="form-status" style={{ margin: '0 0 16px 0' }}>{createError}</p>
                )}

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
                  <button 
                    type="button" 
                    onClick={() => setShowCreateModal(false)}
                    className="view-item-button"
                    style={{ width: 'auto' }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="submit-button"
                    style={{ width: 'auto' }}
                  >
                    {isSubmitting ? 'Creating...' : 'Create Staff'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
