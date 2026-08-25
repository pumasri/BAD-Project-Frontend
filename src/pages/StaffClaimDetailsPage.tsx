import { useNavigate, useParams } from 'react-router-dom';
import type { StudentClaim } from '../types';

export function StaffClaimDetailsPage({ claims }: { claims: StudentClaim[] }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const claim = claims.find((c) => c.id.toString() === id) || {
    id: 999,
    item: 'Unknown Item',
    category: 'Unknown',
    status: 'Unknown',
    date: 'Unknown',
    location: 'Unknown',
    description: 'No description provided.',
  };

  return (
    <main className="page-shell">
      <section className="dashboard-card" style={{ maxWidth: '900px' }}>
        <button
          type="button"
          className="dashboard-logout"
          onClick={() => navigate('/staff/claims')}
          style={{ marginBottom: '24px' }}
        >
          ← Back to Claims
        </button>

        <div className="dashboard-header" style={{ marginBottom: '32px' }}>
          <div>
            <p className="eyebrow">CLAIM REVIEW</p>
            <h1>Claim #CLM-{claim.id.toString().padStart(3, '0')}</h1>
          </div>
          <span className={`status-badge ${claim.status === 'Potential Match' ? 'status-matched' : claim.status === 'Resolved' ? 'status-resolved' : 'status-open'}`} style={{ fontSize: '1rem', padding: '8px 16px' }}>
            {claim.status}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
          {/* Student Info */}
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.6)', padding: '24px', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 16px', color: '#a35d3f', fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Student</h3>
            <strong style={{ display: 'block', fontSize: '1.2rem', color: '#594a3a', marginBottom: '4px' }}>Khaimuk Pumasri</strong>
            <p style={{ margin: 0, color: '#918477' }}>uxxxxxxx@au.edu</p>
            <p style={{ margin: '4px 0 0', color: '#918477', fontSize: '0.9rem' }}>Student</p>
          </div>

          {/* Lost Item Info */}
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.6)', padding: '24px', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 16px', color: '#a35d3f', fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Lost Item</h3>
            <strong style={{ display: 'block', fontSize: '1.2rem', color: '#594a3a', marginBottom: '4px' }}>{claim.item}</strong>
            <p style={{ margin: 0, color: '#918477' }}>{claim.category}</p>
            <p style={{ margin: '8px 0 0', color: '#594a3a', fontSize: '0.9rem' }}>Lost: {claim.date}</p>
            <p style={{ margin: 0, color: '#594a3a', fontSize: '0.9rem' }}>Location: {claim.location || 'AU Library'}</p>
          </div>
        </div>

        {/* Potential Match */}
        {claim.status === 'Potential Match' && (
          <div style={{ background: 'rgba(87, 120, 157, 0.05)', padding: '32px', borderRadius: '24px', border: '1px solid rgba(87, 120, 157, 0.15)', marginBottom: '24px' }}>
            <h3 style={{ margin: '0 0 24px', color: '#52739a', fontSize: '1rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Potential Match</h3>

            <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
              <div style={{ flex: 1 }}>
                <p style={{ margin: '0 0 8px', color: '#918477', fontSize: '0.9rem' }}>Found Item #ITM-032</p>
                <strong style={{ display: 'block', color: '#594a3a', fontSize: '1.3rem', marginBottom: '8px' }}>{claim.item}</strong>
                <p style={{ margin: '0 0 4px', color: '#918477' }}>Found: August 22, 2026</p>
                <p style={{ margin: 0, color: '#918477' }}>Location: AU Library</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ display: 'block', color: '#918477', fontSize: '0.8rem', marginBottom: '4px', textTransform: 'uppercase' }}>Match Confidence</span>
                <strong style={{ fontSize: '2rem', color: '#52739a' }}>87%</strong>
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '24px' }}>
              <h4 style={{ margin: '0 0 16px', color: '#594a3a' }}>Verification Questions</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ background: 'white', padding: '16px', borderRadius: '12px' }}>
                  <p style={{ margin: '0 0 8px', color: '#918477', fontSize: '0.9rem' }}>Question 1</p>
                  <p style={{ margin: '0 0 12px', color: '#594a3a', fontWeight: 'bold' }}>What was inside the wallet?</p>
                  <div style={{ padding: '12px', background: '#f9f8f6', borderRadius: '8px' }}>
                    <p style={{ margin: '0 0 4px', color: '#918477', fontSize: '0.8rem', textTransform: 'uppercase' }}>Student Answer:</p>
                    <p style={{ margin: 0, color: '#594a3a' }}>Student ID + bank card</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '32px', display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
          <button className="secondary-button" onClick={() => alert('Requested more info (Phase 1 Mock)')}>
            Request More Information
          </button>
          <button className="secondary-button" style={{ color: '#d9534f', borderColor: '#d9534f' }} onClick={() => alert('Claim rejected (Phase 1 Mock)')}>
            Reject Claim
          </button>
          <button className="submit-button" style={{ margin: 0, width: 'auto' }} onClick={() => alert('Claim approved (Phase 1 Mock)')}>
            Approve Claim
          </button>
        </div>
      </section>
    </main>
  );
}
