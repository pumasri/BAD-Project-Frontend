import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api, ApiError } from '../utils';
import type { StudentClaim } from '../types';

export function StudentClaimDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [claim, setClaim] = useState<StudentClaim | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchClaim() {
      try {
        const data = await api.get(`/claims/${id}`);
        setClaim(data);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Failed to fetch claim details.');
        }
      } finally {
        setIsLoading(false);
      }
    }
    
    if (id) {
      fetchClaim();
    }
  }, [id]);

  if (isLoading) {
    return (
      <main className="page-shell">
        <section className="detail-card">
          <p>Loading claim details...</p>
        </section>
      </main>
    );
  }

  if (error || !claim) {
    return (
      <main className="page-shell">
        <section className="detail-card">
          <p>Error: {error || 'Claim not found'}</p>
          <button onClick={() => navigate('/student-claims')} className="submit-button">Back to Claims</button>
        </section>
      </main>
    );
  }

  const claimIdDisplay = claim.id.substring(0, 8);
  const titleDisplay = claim.foundReport?.title || 'Unknown Item';
  const categoryDisplay = claim.foundReport?.category?.name || 'Unknown Category';
  const locationDisplay = claim.foundReport?.location || 'Unknown Location';
  const dateDisplay = new Date(claim.createdAt).toLocaleDateString();

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
          <p className="eyebrow">CLAIM #{claimIdDisplay}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <h1 style={{ margin: 0, fontSize: '2.5rem', color: '#594a3a' }}>{titleDisplay}</h1>
            <span className={`status-badge ${claim.status === 'MORE_INFORMATION_REQUIRED' ? 'status-matched' : claim.status === 'APPROVED' ? 'status-resolved' : 'status-open'}`} style={{ fontSize: '1rem', padding: '8px 16px' }}>
              {claim.status}
            </span>
          </div>
        </div>

        <div className="detail-layout">
          <div>
            <div style={{ background: 'rgba(255,255,255,0.6)', padding: '24px', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.05)', marginBottom: '24px' }}>
              <h3 style={{ margin: '0 0 16px', color: '#a35d3f', fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Your Claim</h3>
              
              <div style={{ marginBottom: '16px' }}>
                <strong style={{ display: 'block', color: '#594a3a', fontSize: '1.2rem', marginBottom: '4px' }}>{titleDisplay}</strong>
                <span style={{ color: '#918477' }}>{categoryDisplay}</span>
              </div>
              
              <p style={{ margin: '0 0 8px', color: '#594a3a' }}><strong>Submitted:</strong> {dateDisplay}</p>
              <p style={{ margin: '0 0 16px', color: '#594a3a' }}><strong>Location:</strong> {locationDisplay}</p>
              
              <h4 style={{ margin: '0 0 8px', color: '#594a3a' }}>Identifying Details you provided:</h4>
              <p style={{ margin: 0, color: '#918777', lineHeight: '1.6', marginBottom: claim.evidence && claim.evidence.length > 0 ? '24px' : '0' }}>{claim.identifyingDetails}</p>

              {claim.evidence && claim.evidence.length > 0 && (
                <div>
                  <h4 style={{ margin: '0 0 12px', color: '#a35d3f', fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Evidence Attachments</h4>
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    {claim.evidence.map((ev) => (
                      ev.evidenceType === 'IMAGE' && ev.objectKey && (
                        <div key={ev.id} style={{ maxWidth: '300px', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.1)' }}>
                          <img 
                            src={`${(import.meta as any).env.VITE_API_URL || 'http://localhost:5050'}/uploads/${ev.objectKey}`} 
                            alt="Proof of ownership" 
                            style={{ width: '100%', height: 'auto', display: 'block' }}
                          />
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={{ background: 'rgba(255,255,255,0.6)', padding: '24px', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.05)' }}>
              <h3 style={{ margin: '0 0 16px', color: '#a35d3f', fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Status</h3>
              <p style={{ margin: 0, color: '#594a3a', lineHeight: '1.6' }}>
                {claim.status === 'MORE_INFORMATION_REQUIRED' 
                  ? 'We need more information to verify your claim. Please check the notes.' 
                  : claim.status === 'APPROVED'
                  ? 'This claim has been approved! You can collect your item.'
                  : claim.status === 'REJECTED'
                  ? 'This claim was rejected.'
                  : 'Staff is currently reviewing your ownership claim. We will notify you if a match is confirmed.'}
              </p>
              {claim.reviewNote && (
                <div style={{ marginTop: '16px', padding: '16px', background: '#fff', borderRadius: '8px' }}>
                  <p style={{ margin: '0 0 4px', fontSize: '0.85rem', color: '#a35d3f', fontWeight: 'bold' }}>Staff Note:</p>
                  <p style={{ margin: 0, color: '#594a3a' }}>{claim.reviewNote}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
