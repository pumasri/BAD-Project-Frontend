import { useNavigate } from 'react-router-dom';
import type { AuthUser } from '../types';

export function AdminProfilePage({
  user,
  onLogout,
}: {
  user: AuthUser;
  onLogout: () => void | Promise<void>;
}) {
  const navigate = useNavigate();
  const initial = user.name.trim().charAt(0).toUpperCase() || 'A';

  return (
    <main className="page-shell">
      <section className="dashboard-card admin-profile-page">
        <div className="dashboard-header">
          <div>
            <p className="eyebrow">ADMIN PORTAL</p>
            <h1>Profile</h1>
            <p>Your Lost &amp; Found administrator account.</p>
          </div>
          <button
            type="button"
            className="dashboard-logout"
            onClick={() => navigate('/admin-dashboard')}
          >
            Back to Dashboard
          </button>
        </div>

        <div className="admin-profile-summary">
          <div className="admin-profile-avatar" aria-hidden="true">
            {initial}
          </div>
          <div className="admin-profile-identity">
            <span className="admin-profile-role">Administrator</span>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
          </div>
          <button type="button" className="admin-profile-logout" onClick={() => void onLogout()}>
            Log out
          </button>
        </div>
      </section>
    </main>
  );
}
