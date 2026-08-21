import { CSSProperties } from 'react';
import { campusImage } from '../utils';

export function AdminDashboard({ onLogout }: { onLogout: () => void }) {
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

          <button
            type="button"
            className="dashboard-logout"
            onClick={onLogout}
          >
            Log out
          </button>
        </div>

        <div className="dashboard-grid">
          <button type="button" className="dashboard-action-card">
            <span className="dashboard-icon">+</span>
            <strong>User Management</strong>
            <p>Manage staff and user accounts.</p>
          </button>

          <button type="button" className="dashboard-action-card">
            <span className="dashboard-icon">#</span>
            <strong>Categories</strong>
            <p>Add or remove item categories.</p>
          </button>

          <button type="button" className="dashboard-action-card">
            <span className="dashboard-icon">◷</span>
            <strong>Audit Logs</strong>
            <p>Review system activity and records.</p>
          </button>
        </div>
      </section>
    </main>
  );
}
