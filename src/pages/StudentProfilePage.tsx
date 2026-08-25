import { useNavigate } from 'react-router-dom';

export function StudentProfilePage({ onLogout }: { onLogout: () => void }) {
  const navigate = useNavigate();

  return (
    <main className="page-shell">
      <section className="dashboard-card" style={{ maxWidth: '700px' }}>
        <div className="dashboard-header">
          <div>
            <p className="eyebrow">STUDENT PORTAL</p>
            <h1>My Profile</h1>
            <p>Manage your account settings and personal information.</p>
          </div>
          <button
            type="button"
            className="dashboard-logout"
            onClick={() => navigate('/student-home')}
          >
            Back to Home
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', padding: '32px', background: 'rgba(255,255,255,0.7)', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)', marginBottom: '32px' }}>
          <div style={{ width: '80px', height: '80px', background: '#a35d3f', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontSize: '2rem', fontWeight: 'bold' }}>
            K
          </div>
          <div>
            <h2 style={{ margin: '0 0 4px', color: '#594a3a', fontSize: '1.8rem' }}>Khaimuk Pumasri</h2>
            <p style={{ margin: 0, color: '#918477', fontSize: '1.1rem' }}>uxxxxxxx@au.edu</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          <div>
            <h3 style={{ color: '#a35d3f', fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>Personal Information</h3>
            <div style={{ background: 'rgba(255,255,255,0.6)', padding: '24px', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.05)' }}>
              <div style={{ marginBottom: '16px' }}>
                <span style={{ display: 'block', color: '#918477', fontSize: '0.85rem', marginBottom: '4px' }}>Name</span>
                <strong style={{ color: '#594a3a', fontSize: '1.1rem' }}>Khaimuk Pumasri</strong>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <span style={{ display: 'block', color: '#918477', fontSize: '0.85rem', marginBottom: '4px' }}>Student ID</span>
                <strong style={{ color: '#594a3a', fontSize: '1.1rem' }}>uxxxxxxx</strong>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <span style={{ display: 'block', color: '#918477', fontSize: '0.85rem', marginBottom: '4px' }}>AU Email</span>
                <strong style={{ color: '#594a3a', fontSize: '1.1rem' }}>uxxxxxxx@au.edu</strong>
              </div>
              <div>
                <span style={{ display: 'block', color: '#918477', fontSize: '0.85rem', marginBottom: '4px' }}>Role</span>
                <span className="status-badge status-open">Student</span>
              </div>
            </div>
          </div>

          <div>
            <h3 style={{ color: '#a35d3f', fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>Account Settings</h3>
            <div style={{ background: 'rgba(255,255,255,0.6)', padding: '24px', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <button className="secondary-button" style={{ width: '100%', padding: '14px', background: 'white', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', color: '#594a3a', fontWeight: 'bold', cursor: 'pointer' }}>
                Change Password
              </button>
              <button className="secondary-button" style={{ width: '100%', padding: '14px', background: 'rgba(163,93,63,0.1)', border: 'none', borderRadius: '12px', color: '#a35d3f', fontWeight: 'bold', cursor: 'pointer' }} onClick={onLogout}>
                Log Out
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
