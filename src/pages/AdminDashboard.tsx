import type { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { campusImage } from '../utils';
import { LogoutButton } from '../components/LogoutButton';

export function AdminDashboard({
  onLogout,
}: {
  onLogout: () => void | Promise<void>;
}) {
  const navigate = useNavigate();
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
        <div className="dashboard-header">
          <div>
            <p className="eyebrow">ADMIN PORTAL</p>
            <h1>Admin Dashboard</h1>
            <p>Manage users, categories, audit logs, and system settings.</p>
          </div>

          <div className="dashboard-header-actions">
            <button
              type="button"
              className="dashboard-logout"
              onClick={() => navigate('/admin-profile')}
            >
              Profile
            </button>
            <LogoutButton onLogout={onLogout} />
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
