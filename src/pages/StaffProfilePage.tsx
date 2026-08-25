import { useNavigate } from 'react-router-dom';

export function StaffProfilePage({ onLogout }: { onLogout: () => void }) {
  const navigate = useNavigate();

  return (
    <main className="page-shell">
      <section className="dashboard-card" style={{ maxWidth: '700px' }}>
        <div className="dashboard-header">
          <div>
            <p className="eyebrow">STAFF PORTAL</p>
            <h1>My Profile</h1>
            <p>Manage your staff account and system settings.</p>
          </div>
          <button
            type="button"
            className="dashboard-logout"
            onClick={() => navigate('/staff-dashboard')}
          >
            Back to Dashboard
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', padding: '32px', background: 'rgba(255,255,255,0.7)', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)', marginBottom: '32px' }}>
          <div style={{ width: '80px', height: '80px', background: '#594a3a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontSize: '2rem', fontWeight: 'bold' }}>
            S
          </div>
          <div>
            <h2 style={{ margin: '0 0 4px', color: '#594a3a', fontSize: '1.8rem' }}>Staff Member</h2>
            <p style={{ margin: 0, color: '#918477', fontSize: '1.1rem' }}>staff@au.edu</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          <div>
            <h3 style={{ color: '#594a3a', fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>Account Details</h3>
            <div style={{ background: 'rgba(255,255,255,0.6)', padding: '24px', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.05)' }}>
              <div style={{ marginBottom: '16px' }}>
                <span style={{ display: 'block', color: '#918477', fontSize: '0.85rem', marginBottom: '4px' }}>Name</span>
                <strong style={{ color: '#594a3a', fontSize: '1.1rem' }}>Staff Member</strong>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <span style={{ display: 'block', color: '#918477', fontSize: '0.85rem', marginBottom: '4px' }}>Email</span>
                <strong style={{ color: '#594a3a', fontSize: '1.1rem' }}>staff@au.edu</strong>
              </div>
              <div>
                <span style={{ display: 'block', color: '#918477', fontSize: '0.85rem', marginBottom: '4px' }}>Role</span>
                <span className="status-badge" style={{ background: '#594a3a', color: 'white' }}>Staff</span>
              </div>
            </div>
          </div>

          <div>
            <h3 style={{ color: '#594a3a', fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>Settings</h3>
            <div style={{ background: 'rgba(255,255,255,0.6)', padding: '24px', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <button className="secondary-button" style={{ width: '100%', padding: '14px', background: 'white', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', color: '#594a3a', fontWeight: 'bold', cursor: 'pointer' }}>
                Change Password
              </button>
              <button className="secondary-button" style={{ width: '100%', padding: '14px', background: 'rgba(217, 83, 79, 0.1)', border: 'none', borderRadius: '12px', color: '#d9534f', fontWeight: 'bold', cursor: 'pointer' }} onClick={onLogout}>
                Log Out
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
