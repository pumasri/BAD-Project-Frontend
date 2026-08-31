import { CSSProperties, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { campusImage, api } from '../utils';

export function AdminDashboard({
  onLogout,
}: {
  onLogout: () => void | Promise<void>;
}) {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Admin');
  const [userEmail, setUserEmail] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const handleClick = () => setIsProfileOpen(false);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  useEffect(() => {
    api.get('/auth/me')
      .then(res => {
        if (res?.user) {
          setUserName(res.user.name || 'Admin');
          setUserEmail(res.user.email || '');
        }
      })
      .catch(console.error);
  }, []);

  return (
    <main
      className="page-shell"
      style={
        {
          '--page-background-image': `url(${campusImage})`,
        } as CSSProperties
      }
    >
      <section className="dashboard-card">
        <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p className="eyebrow">ADMIN PORTAL</p>
            <h1>Admin Dashboard</h1>
            <p>Manage users, categories, audit logs, and system settings.</p>
          </div>

          <div className="student-profile-dropdown-container" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="student-profile-avatar-btn"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              title="My Account"
            >
              {userName[0]?.toUpperCase() || 'A'}
            </button>

            {isProfileOpen && (
              <div className="student-profile-dropdown">
                <div className="student-profile-info">
                  <p className="eyebrow">MY ACCOUNT</p>
                  <h2>{userName}</h2>
                  <p>{userEmail || 'admin@au.edu'}</p>
                </div>
                
                <div className="student-profile-actions">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => {
                      navigate('/admin-profile');
                      setIsProfileOpen(false);
                    }}
                  >
                    View Profile
                  </button>
                  <button
                    type="button"
                    className="dashboard-logout dropdown-logout"
                    onClick={onLogout}
                  >
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="dashboard-grid">
          <button type="button" className="dashboard-action-card" onClick={() => navigate('/admin-users')}>
            <span className="dashboard-icon">+</span>
            <strong>User Management</strong>
            <p>Manage staff and user accounts.</p>
          </button>

          <button type="button" className="dashboard-action-card" onClick={() => navigate('/admin-categories')}>
            <span className="dashboard-icon">#</span>
            <strong>Categories</strong>
            <p>Add or remove item categories.</p>
          </button>

          <button type="button" className="dashboard-action-card" onClick={() => navigate('/admin-audit-logs')}>
            <span className="dashboard-icon">◷</span>
            <strong>Audit Logs</strong>
            <p>Review system activity and records.</p>
          </button>

          <button type="button" className="dashboard-action-card" onClick={() => navigate('/admin-api-integrations')}>
            <span className="dashboard-icon">🔗</span>
            <strong>API Integrations</strong>
            <p>Manage API keys and webhooks.</p>
          </button>

          <button type="button" className="dashboard-action-card" onClick={() => navigate('/admin/matches')}>
            <span className="dashboard-icon">≈</span>
            <strong>AI Match Review</strong>
            <p>Review suggestions and retry matching for eligible reports.</p>
          </button>
        </div>
      </section>
    </main>
  );
}
