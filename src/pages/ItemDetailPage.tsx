import { useState, CSSProperties, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Item } from '../types';
import { campusImage, api, ApiError } from '../utils';

export function ItemDetailPage({ items }: { items: Item[] }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showLoginMessage, setShowLoginMessage] = useState(false);
  const [identifyingDetails, setIdentifyingDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [claimMessage, setClaimMessage] = useState('');
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');

  const item = items.find((i) => i.id.toString() === id);

  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  const isLoggedIn = !!token;
  const isStudent = userRole === 'STUDENT';

  if (!item) {
    return (
      <main className="page-shell" style={{ '--page-background-image': `url(${campusImage})` } as CSSProperties}>
        <section className="detail-card">
          <h1>Item not found</h1>
          <button type="button" className="detail-back-button" onClick={() => navigate('/')}>← Back to Lost &amp; Found</button>
        </section>
      </main>
    );
  }

  async function handleClaimSubmit(e: FormEvent) {
    e.preventDefault();
    if (!item) return;
    if (!identifyingDetails.trim()) {
      setClaimMessage('Please provide details to prove this item is yours.');
      return;
    }

    setIsSubmitting(true);
    setClaimMessage('');

    try {
      const response = await api.post('/claims', {
        foundReportId: item.id,
        identifyingDetails: identifyingDetails
      });

      // Upload evidence image if selected
      if (selectedFile && response.id) {
        setClaimMessage('Uploading proof image...');
        const formData = new FormData();
        formData.append('image', selectedFile);

        const token = localStorage.getItem('token');
        const apiUrl = ((import.meta as any).env.VITE_API_URL || 'http://localhost:5050') + '/api';
        
        const headers: Record<string, string> = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const uploadRes = await fetch(`${apiUrl}/claims/${response.id}/evidence`, {
          method: 'POST',
          headers,
          body: formData
        });

        if (!uploadRes.ok) {
          throw new Error('Proof image upload failed.');
        }
      }

      setClaimMessage('Claim request submitted successfully! Staff will review it shortly.');
      setIdentifyingDetails('');
      setSelectedFile(null);
      setImagePreview('');
    } catch (err) {
      if (err instanceof ApiError) {
        setClaimMessage(err.message);
      } else {
        setClaimMessage('Failed to submit claim. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main
      className="page-shell"
      style={
        {
          '--page-background-image': `url(${campusImage})`,
        } as CSSProperties
      }
    >
      <section className="detail-card">
        <button
          type="button"
          className="detail-back-button"
          onClick={() => navigate(isLoggedIn ? '/student-home' : '/')}
        >
          ← Back to Lost &amp; Found
        </button>

        <div className="detail-layout">
          <div className="detail-image">
            {item.images && item.images.length > 0 ? (
              <img src={`${(import.meta as any).env.VITE_API_URL || 'http://localhost:5050'}/uploads/${item.images[0].objectKey}`} alt={item.title} />
            ) : (
              <span>{item.category?.name}</span>
            )}
          </div>

          <div className="detail-content">
            <p className="eyebrow">FOUND ITEM</p>
            <h1>{item.title}</h1>

            <div className="detail-info-list">
              <div>
                <span>Category</span>
                <strong>{item.category?.name}</strong>
              </div>
              <div>
                <span>Location</span>
                <strong>{item.location}</strong>
              </div>
              <div>
                <span>Reported</span>
                <strong>{new Date(item.occurredAt).toLocaleDateString()}</strong>
              </div>
            </div>

            <div className="detail-description" style={{ marginBottom: '24px' }}>
              <h3>Description</h3>
              <p>{item.description}</p>
            </div>

            {/* Check if item is already claimed or resolved */}
            {item.status === 'RESOLVED' ? (
              <p style={{ color: '#2b7a78', fontWeight: 'bold' }}>✓ This item has been returned to its owner.</p>
            ) : isLoggedIn && isStudent ? (
              /* Authenticated Student Claim Form */
              <form onSubmit={handleClaimSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(255,255,255,0.6)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)' }}>
                {item.status === 'CLAIM_IN_PROGRESS' && (
                  <p style={{ color: '#a35d3f', fontSize: '0.9rem', fontWeight: 'bold', margin: 0 }}>
                    ⚠ A claim for this item is already under review, but you can still submit yours.
                  </p>
                )}
                <label className="field">
                  <span style={{ fontWeight: 'bold', color: '#594a3a' }}>Describe proof of ownership *</span>
                  <textarea
                    required
                    rows={3}
                    value={identifyingDetails}
                    onChange={(e) => setIdentifyingDetails(e.target.value)}
                    placeholder="Provide details that only the owner would know (e.g. keychains, brand details, contents inside, password)..."
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontFamily: 'inherit' }}
                    disabled={isSubmitting}
                  />
                </label>

                <label className="field">
                  <span style={{ fontWeight: 'bold', color: '#594a3a' }}>Upload proof picture (receipt, serial number, photo of item)</span>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isSubmitting}
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (!file) {
                        return;
                      }
                      setSelectedFile(file);
                      setImagePreview(URL.createObjectURL(file));
                    }}
                  />
                </label>

                {imagePreview && (
                  <div style={{ width: '100%', maxHeight: '150px', overflow: 'hidden', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)' }}>
                    <img src={imagePreview} alt="Proof preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}

                <button
                  type="submit"
                  className="claim-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting Claim...' : 'Submit Claim Request'}
                </button>
                {claimMessage && (
                  <p style={{ 
                    marginTop: '8px', 
                    color: claimMessage.includes('successfully') ? '#2b7a78' : '#d93025', 
                    fontWeight: 'bold', 
                    fontSize: '0.95rem' 
                  }}>
                    {claimMessage}
                  </p>
                )}
              </form>
            ) : isLoggedIn && !isStudent ? (
              <p style={{ color: '#918477' }}>Only students can submit claim requests.</p>
            ) : (
              /* Public / Not logged in */
              <div>
                <button
                  type="button"
                  className="claim-button"
                  onClick={() => setShowLoginMessage(true)}
                >
                  Claim This Item
                </button>

                {showLoginMessage && (
                  <div className="claim-login-message">
                    <strong>Login required</strong>
                    <p>
                      Please log in as a student to submit an ownership claim.
                    </p>
                    <button
                      type="button"
                      className="claim-login-button"
                      onClick={() => navigate(`/student-login?redirect=/item/${item.id}`)}
                    >
                      Student Login
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
