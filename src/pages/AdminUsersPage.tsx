import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
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

  // New staff form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createError, setCreateError] = useState('');

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
      
      // Reset form and close modal
      setNewName('');
      setNewEmail('');
      setNewPassword('');
      setShowCreateModal(false);
      
      // Refresh user list
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

        <div className="staff-item-toolbar" style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <div className="staff-item-search" style={{ flex: 1, minWidth: '200px' }}>
            <input type="text" placeholder="Search by name or email..." style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)' }} />
          </div>
          <select className="staff-status-filter" style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: 'white' }}>
            <option value="ALL">All Roles</option>
            <option value="STUDENT">Student</option>
            <option value="STAFF">Staff</option>
            <option value="ADMIN">Admin</option>
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
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={4} style={{ padding: '24px', textAlign: 'center' }}>Loading users...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: '24px', textAlign: 'center' }}>No users found.</td></tr>
              ) : users.map(user => (
                <tr key={user.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <td style={{ padding: '16px' }}><strong>{user.name}</strong></td>
                  <td style={{ padding: '16px', color: '#918477' }}>{user.email}</td>
                  <td style={{ padding: '16px' }}>
                    <span className="status-badge" style={{ background: 'rgba(0,0,0,0.05)', color: '#594a3a' }}>{user.role}</span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span className={`status-badge ${user.isActive ? 'status-resolved' : 'status-open'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
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
            background: 'rgba(0,0,0,0.5)', zIndex: 100,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <div style={{
              background: 'white', padding: '32px', borderRadius: '16px',
              width: '100%', maxWidth: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
            }}>
              <h2 style={{ margin: '0 0 24px 0', fontSize: '1.5rem', color: '#31281f' }}>Create Staff Account</h2>
              <form onSubmit={handleCreateStaff}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Full Name</label>
                  <input 
                    type="text" required 
                    value={newName} onChange={e => setNewName(e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }} 
                  />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Email Address</label>
                  <input 
                    type="email" required 
                    value={newEmail} onChange={e => setNewEmail(e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }} 
                  />
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Temporary Password</label>
                  <input 
                    type="password" required 
                    value={newPassword} onChange={e => setNewPassword(e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }} 
                    placeholder="Min 8 characters"
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
