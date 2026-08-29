import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api, ApiError } from '../utils';
import type { StudentClaim } from '../types';

export function StaffClaimDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [claim, setClaim] = useState<StudentClaim | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Custom modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewStatus, setReviewStatus] = useState<string>('');
  const [reviewNote, setReviewNote] = useState('');
  const [uiMessage, setUiMessage] = useState('');

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

  function openReviewModal(status: string) {
    setReviewStatus(status);
    setReviewNote('');
    setIsModalOpen(true);
  }

  async function submitReview() {
    if (!claim) return;

    setIsUpdating(true);
    setUiMessage('');
    setIsModalOpen(false);

    try {
      await api.patch(`/claims/${claim.id}/review`, {
        status: reviewStatus,
        reviewNote: reviewNote
      });

      const data = await api.get(`/claims/${claim.id}`);
      setClaim(data);
      setUiMessage(`Claim successfully ${reviewStatus.toLowerCase().replace(/_/g, ' ')}!`);
      setTimeout(() => setUiMessage(''), 4000);
    } catch {
      setUiMessage('Failed to update claim.');
      setTimeout(() => setUiMessage(''), 4000);
    } finally {
      setIsUpdating(false);
    }
  }

  if (isLoading) {
    return (
      <main className="page-shell">
        <section className="dashboard-card" style={{ maxWidth: '900px' }}>
          <p>Loading claim details...</p>
        </section>
      </main>
    );
  }

  if (error || !claim) {
    return (
      <main className="page-shell">
        <section className="dashboard-card" style={{ maxWidth: '900px' }}>
          <p>Error: {error || 'Claim not found'}</p>
          <button onClick={() => navigate('/staff/claims')} className="submit-button">Back to Claims</button>
        </section>
      </main>
    );
  }

  const claimIdDisplay = claim.id.substring(0, 8);
  const titleDisplay = claim.foundReport?.title || 'Unknown Item';
  const categoryDisplay = claim.foundReport?.category?.name || 'Unknown Category';
  const locationDisplay = claim.foundReport?.location || 'Unknown Location';
  const dateDisplay = new Date(claim.createdAt).toLocaleDateString();

  // Get display details for review action
  const getActionTitle = () => {
    if (reviewStatus === 'APPROVED') return 'Approve Claim';
    if (reviewStatus === 'REJECTED') return 'Reject Claim';
    if (reviewStatus === 'MORE_INFORMATION_REQUIRED') return 'Request More Information';
    return '';
  };

  return (
    <main className="page-shell">
      <section className="dashboard-card" style={{ maxWidth: '900px', position: 'relative' }}>
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
            <h1>Claim #{claimIdDisplay}</h1>
          </div>
          <span className={`status-badge ${claim.status === 'MORE_INFORMATION_REQUIRED' ? 'status-matched' : claim.status === 'APPROVED' ? 'status-resolved' : 'status-open'}`} style={{ fontSize: '1rem', padding: '8px 16px' }}>
            {claim.status}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
          {/* Student Info */}
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.6)', padding: '24px', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 16px', color: '#a35d3f', fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Student</h3>
            <strong style={{ display: 'block', fontSize: '1.2rem', color: '#594a3a', marginBottom: '4px' }}>{claim.claimant?.fullName || 'Unknown Student'}</strong>
            <p style={{ margin: 0, color: '#918477' }}>{claim.claimant?.universityEmail || 'No email'}</p>
          </div>

          {/* Lost Item Info */}
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.6)', padding: '24px', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 16px', color: '#a35d3f', fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Lost Item</h3>
            <strong style={{ display: 'block', fontSize: '1.2rem', color: '#594a3a', marginBottom: '4px' }}>{titleDisplay}</strong>
            <p style={{ margin: 0, color: '#918477' }}>{categoryDisplay}</p>
            <p style={{ margin: '8px 0 0', color: '#594a3a', fontSize: '0.9rem' }}>Submitted: {dateDisplay}</p>
            <p style={{ margin: 0, color: '#594a3a', fontSize: '0.9rem' }}>Location: {locationDisplay}</p>
          </div>
        </div>

        <div style={{ background: 'rgba(87, 120, 157, 0.05)', padding: '32px', borderRadius: '24px', border: '1px solid rgba(87, 120, 157, 0.15)', marginBottom: '24px' }}>
          <h3 style={{ margin: '0 0 24px', color: '#52739a', fontSize: '1rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Identifying Details Provided</h3>
          <p style={{ margin: 0, color: '#594a3a', lineHeight: '1.6' }}>{claim.identifyingDetails}</p>

          {claim.evidence && claim.evidence.length > 0 && (
            <div style={{ marginTop: '24px' }}>
              <h4 style={{ margin: '0 0 12px', color: '#52739a', fontSize: '0.9rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Evidence Attachments</h4>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                {claim.evidence.map((ev) => (
                  ev.evidenceType === 'IMAGE' && ev.objectKey && (
                    <div key={ev.id} style={{ maxWidth: '300px', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.1)' }}>
                      <img
                        src={`${((import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:5050/api').replace('/api', '')}/uploads/${ev.objectKey}`}
                        alt="Proof of ownership"
                        style={{ width: '100%', height: 'auto', display: 'block' }}
                      />
                    </div>
                  )
                ))}
              </div>
            </div>
          )}

          {claim.reviewNote && (
            <div style={{ marginTop: '24px', padding: '16px', background: '#fff', borderRadius: '12px' }}>
              <h4 style={{ margin: '0 0 8px', color: '#594a3a' }}>Previous Review Note</h4>
              <p style={{ margin: 0, color: '#918477' }}>{claim.reviewNote}</p>
            </div>
          )}
        </div>

        {/* Global Action Notifications */}
        {uiMessage && (
          <div style={{
            padding: '16px',
            borderRadius: '12px',
            background: uiMessage.includes('successfully') ? '#e6f4ea' : '#fce8e6',
            color: uiMessage.includes('successfully') ? '#137333' : '#c5221f',
            fontWeight: 'bold',
            marginBottom: '24px',
            textAlign: 'center'
          }}>
            {uiMessage}
          </div>
        )}

        {/* Actions */}
        {claim.status !== 'APPROVED' && claim.status !== 'REJECTED' && (
          <div style={{ borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '32px', display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
            <button className="secondary-button" disabled={isUpdating} onClick={() => openReviewModal('MORE_INFORMATION_REQUIRED')}>
              Request More Information
            </button>
            <button className="secondary-button" style={{ color: '#d9534f', borderColor: '#d9534f' }} disabled={isUpdating} onClick={() => openReviewModal('REJECTED')}>
              Reject Claim
            </button>
            <button className="submit-button" style={{ margin: 0, width: 'auto' }} disabled={isUpdating} onClick={() => openReviewModal('APPROVED')}>
              Approve Claim
            </button>
          </div>
        )}
      </section>

      {/* Modern Custom Dialog Modal Overlay */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: '#fffbf7',
            width: '90%',
            maxWidth: '500px',
            borderRadius: '24px',
            padding: '32px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
            border: '1px solid rgba(93, 82, 64, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            <div style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '16px' }}>
              <h2 style={{ margin: 0, color: '#594a3a', fontSize: '1.5rem' }}>{getActionTitle()}</h2>
              <p style={{ margin: '8px 0 0', color: '#918477', fontSize: '0.9rem' }}>
                {reviewStatus === 'MORE_INFORMATION_REQUIRED'
                  ? 'Tell the student what details or evidence they need to provide next.'
                  : 'Add a note to explain this decision to the student (optional).'}
              </p>
            </div>

            <div className="field">
              <span>Review Note</span>
              <textarea
                rows={4}
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                placeholder={reviewStatus === 'MORE_INFORMATION_REQUIRED' ? 'e.g. Please specify the stickers on the back of the laptop.' : 'Type your note here...'}
                required={reviewStatus === 'MORE_INFORMATION_REQUIRED'}
                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '0.95rem', fontFamily: 'inherit' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="secondary-button"
                onClick={() => setIsModalOpen(false)}
                style={{ margin: 0, padding: '10px 20px' }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="submit-button"
                onClick={submitReview}
                disabled={reviewStatus === 'MORE_INFORMATION_REQUIRED' && !reviewNote.trim()}
                style={{ margin: 0, padding: '10px 20px', width: 'auto' }}
              >
                Confirm Decision
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
