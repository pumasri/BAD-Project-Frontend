import { useNavigate, useParams } from 'react-router-dom';
import type { StudentClaim } from '../types';

export function StudentClaimDetailsPage({ claims }: { claims: StudentClaim[] }) {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const claim = claims.find((c) => c.id.toString() === id) || {
    id: 'Unknown',
    item: 'Unknown Item',
    category: 'Unknown',
    status: 'Unknown',
    date: 'Unknown',
    location: 'Unknown',
    description: 'No description provided.',
  };

  return (
    <main className="page-shell">
      <section className="detail-card">
        <button
          type="button"
          className="detail-back-button"
          onClick={() => navigate('/student-claims')}
        >
          ← Back to Claims
        </button>

        <div style={{ marginBottom: '32px' }}>
          <p className="eyebrow">CLAIM #CLM-{claim.id.toString().padStart(3, '0')}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <h1 style={{ margin: 0, fontSize: '2.5rem', color: '#594a3a' }}>{claim.item}</h1>
            <span className={`status-badge ${claim.status === 'Potential Match' ? 'status-matched' : claim.status === 'Resolved' ? 'status-resolved' : 'status-open'}`} style={{ fontSize: '1rem', padding: '8px 16px' }}>
              {claim.status}
            </span>
          </div>
        </div>

        <div className="detail-layout">
          <div>
            <div style={{ background: 'rgba(255,255,255,0.6)', padding: '24px', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.05)', marginBottom: '24px' }}>
              <h3 style={{ margin: '0 0 16px', color: '#a35d3f', fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Your Lost Item</h3>
              
              <div style={{ marginBottom: '16px' }}>
                <strong style={{ display: 'block', color: '#594a3a', fontSize: '1.2rem', marginBottom: '4px' }}>{claim.item}</strong>
                <span style={{ color: '#918477' }}>{claim.category}</span>
              </div>
              
              <p style={{ margin: '0 0 8px', color: '#594a3a' }}><strong>Lost:</strong> {claim.date}</p>
              <p style={{ margin: '0 0 16px', color: '#594a3a' }}><strong>Location:</strong> {claim.location || 'AU Library'}</p>
              
              <h4 style={{ margin: '0 0 8px', color: '#594a3a' }}>Description:</h4>
              <p style={{ margin: 0, color: '#918477', lineHeight: '1.6' }}>{claim.description || 'Black leather wallet with AU student ID inside.'}</p>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.6)', padding: '24px', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.05)' }}>
              <h3 style={{ margin: '0 0 16px', color: '#a35d3f', fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Status</h3>
              <p style={{ margin: 0, color: '#594a3a', lineHeight: '1.6' }}>
                {claim.status === 'Potential Match' 
                  ? 'We have found a potential match! Please review the verification questions.' 
                  : claim.status === 'Resolved'
                  ? 'This claim has been resolved and the item was returned.'
                  : 'Staff is currently reviewing your ownership claim. We will notify you if a match is found.'}
              </p>
            </div>
          </div>

          <div>
            {claim.status === 'Potential Match' && (
              <div style={{ background: 'rgba(87, 120, 157, 0.05)', padding: '32px', borderRadius: '24px', border: '1px solid rgba(87, 120, 157, 0.15)', marginBottom: '24px' }}>
                <h3 style={{ margin: '0 0 24px', color: '#52739a', fontSize: '1rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Potential Match Found</h3>
                
                <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
                  <div style={{ flex: 1 }}>
                    <strong style={{ display: 'block', color: '#594a3a', fontSize: '1.3rem', marginBottom: '8px' }}>{claim.item}</strong>
                    <p style={{ margin: '0 0 4px', color: '#918477' }}>Found at AU Library</p>
                    <p style={{ margin: 0, color: '#918477' }}>August 22, 2026</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ display: 'block', color: '#918477', fontSize: '0.8rem', marginBottom: '4px', textTransform: 'uppercase' }}>Match Confidence</span>
                    <strong style={{ fontSize: '2rem', color: '#52739a' }}>87%</strong>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '24px' }}>
                  <h4 style={{ margin: '0 0 16px', color: '#594a3a' }}>Verification Required</h4>
                  <div style={{ background: 'rgba(255,255,255,0.8)', padding: '16px', borderRadius: '12px', marginBottom: '16px' }}>
                    <p style={{ margin: '0 0 8px', color: '#918477', fontSize: '0.9rem' }}>Question:</p>
                    <p style={{ margin: 0, color: '#594a3a', fontWeight: 'bold' }}>What was inside the wallet?</p>
                  </div>
                  <div className="field">
                    <textarea rows={3} placeholder="Your answer..." defaultValue="Student ID + bank card"></textarea>
                  </div>
                  <button className="submit-button" style={{ marginTop: '16px', background: '#52739a' }}>Submit Verification</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
