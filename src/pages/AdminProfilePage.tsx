import { AdminTopNav } from '../components/AdminTopNav';
import type { AuthUser } from '../types';

export function AdminProfilePage({
  user,
  onLogout,
}: {
  user: AuthUser;
  onLogout: () => void | Promise<void>;
}) {
  const initial = user.name.trim().charAt(0).toUpperCase() || 'A';

  return (
    <main className="page-shell admin-shell">
      <section className="dashboard-card admin-profile-card admin-content-card">
        <AdminTopNav />

        <div className="dashboard-header">
          <div>
            <h1>Profile</h1>
            <p>Your Lost &amp; Found administrator account.</p>
          </div>
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
