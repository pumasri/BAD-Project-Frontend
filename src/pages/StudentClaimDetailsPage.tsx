import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api, ApiError, uploadUrl } from '../utils';
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
  const categoryDisplay = claim.foundReport?.category?.name || 'Category not available';
  const locationDisplay = claim.foundReport?.location || 'Location not specified';
  const dateDisplay = new Date(claim.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

  const formatStatus = (status: string) => {
    if (!status) return '';
    switch(status) {
      case 'APPROVED': return 'Approved';
      case 'MORE_INFORMATION_REQUIRED': return 'More Information Required';
      case 'OPEN': return 'Open';
      case 'MATCHED': return 'Matched';
      case 'CLAIM_IN_PROGRESS': return 'Claim In Progress';
      case 'RESOLVED': return 'Resolved';
      case 'DONATED': return 'Donated';
      case 'DISPOSED': return 'Disposed';
      case 'ARCHIVED': return 'Archived';
      case 'PENDING': return 'Pending';
      case 'REJECTED': return 'Rejected';
      default:
        return status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
    }
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
          <p className="eyebrow">CLAIM #{claimIdDisplay.toUpperCase()}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <h1 style={{ margin: 0, fontSize: '2.5rem', color: '#594a3a' }}>{titleDisplay}</h1>
            <span className={`status-badge ${claim.status === 'MORE_INFORMATION_REQUIRED' ? 'status-matched' : claim.status === 'APPROVED' ? 'status-resolved' : claim.status === 'REJECTED' ? 'status-archived' : 'status-open'}`} style={{ fontSize: '1rem', padding: '8px 16px' }}>
              {formatStatus(claim.status)}
            </span>
          </div>
        </div>

        <div className="detail-layout">
          {/* Left Column */}
          <div>
            <div style={{ background: 'rgba(255,255,255,0.6)', padding: '32px', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)', marginBottom: '24px' }}>
              <h3 style={{ margin: '0 0 24px', color: '#a35d3f', fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Your Claim</h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                <div>
                  <strong style={{ display: 'block', color: '#a89c92', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '4px' }}>Item</strong>
                  <span style={{ color: '#594a3a', fontSize: '1.1rem', fontWeight: 500 }}>{titleDisplay}</span>
                </div>
                <div>
                  <strong style={{ display: 'block', color: '#a89c92', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '4px' }}>Category</strong>
                  <span style={{ color: '#594a3a', fontSize: '1.1rem' }}>{categoryDisplay}</span>
                </div>
                <div>
                  <strong style={{ display: 'block', color: '#a89c92', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '4px' }}>Location</strong>
                  <span style={{ color: '#594a3a', fontSize: '1.1rem' }}>{locationDisplay}</span>
                </div>
                <div>
                  <strong style={{ display: 'block', color: '#a89c92', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '4px' }}>Submitted</strong>
                  <span style={{ color: '#594a3a', fontSize: '1.1rem' }}>{dateDisplay}</span>
                </div>
              </div>

              <div>
                <strong style={{ display: 'block', color: '#a89c92', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '8px' }}>Identifying Details</strong>
                <p style={{ margin: 0, color: '#594a3a', lineHeight: '1.6', fontSize: '1.05rem' }}>{claim.identifyingDetails || 'No additional details provided.'}</p>
              </div>
            </div>

            {claim.evidence && claim.evidence.length > 0 && (
              <div style={{ background: 'rgba(255,255,255,0.6)', padding: '32px', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)' }}>
                <h3 style={{ margin: '0 0 24px', color: '#a35d3f', fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Evidence Attachments</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                  {claim.evidence.map((ev) => (
                    ev.evidenceType === 'IMAGE' && ev.objectKey && (
                      <div key={ev.id} style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.1)', background: '#fff', aspectRatio: '4/3' }}>
                        <img
                          src={uploadUrl(ev.objectKey)}
                          alt="Proof of ownership"
                          style={{ width: '100%', height: '100%', display: 'block', objectFit: 'contain' }}
                          onClick={() => window.open(uploadUrl(ev.objectKey!), '_blank')}
                        />
                      </div>
                    )
                  ))}
                </div>
                <p style={{ fontSize: '0.8rem', color: '#a89c92', margin: '16px 0 0 0' }}>Click an image to view it in full size.</p>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div>
            <div style={{ background: 'white', padding: '32px', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
              <h3 style={{ margin: '0 0 24px', color: '#a35d3f', fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Claim Status</h3>

              <div style={{ marginBottom: '24px' }}>
                <strong style={{ display: 'block', color: '#a89c92', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '8px' }}>Current State</strong>
                <span className={`status-badge ${claim.status === 'MORE_INFORMATION_REQUIRED' ? 'status-matched' : claim.status === 'APPROVED' ? 'status-resolved' : claim.status === 'REJECTED' ? 'status-archived' : 'status-open'}`} style={{ fontSize: '1.1rem', padding: '6px 12px' }}>
                  {formatStatus(claim.status)}
                </span>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <strong style={{ display: 'block', color: '#a89c92', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '8px' }}>Status Information</strong>
                <p style={{ margin: 0, color: '#594a3a', lineHeight: '1.6' }}>
                  {claim.status === 'MORE_INFORMATION_REQUIRED'
                    ? 'We need more information to verify your claim. Please read the staff note carefully.'
                    : claim.status === 'APPROVED'
                    ? 'This claim has been approved! You can now collect your item from the lost and found office.'
                    : claim.status === 'REJECTED'
                    ? 'Unfortunately, this claim was rejected.'
                    : 'Staff is currently reviewing your ownership claim. We will notify you if a match is confirmed.'}
                </p>
              </div>

              {claim.reviewNote && (
                <div style={{ padding: '16px', background: 'rgba(163, 93, 63, 0.05)', borderRadius: '12px', borderLeft: '4px solid #a35d3f' }}>
                  <p style={{ margin: '0 0 8px', fontSize: '0.85rem', color: '#a35d3f', fontWeight: 'bold', textTransform: 'uppercase' }}>Staff Note</p>
                  <p style={{ margin: 0, color: '#594a3a', fontStyle: 'italic', lineHeight: '1.6' }}>"{claim.reviewNote}"</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
