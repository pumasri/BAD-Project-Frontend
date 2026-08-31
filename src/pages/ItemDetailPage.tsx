import { useState, CSSProperties, FormEvent } from 'react';
import { CalendarDays, CheckCircle2, MapPin, PackageSearch, ShieldCheck, Tag } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { FileUpload } from '../components/FileUpload';
import type { AuthUser, Item } from '../types';
import { campusImage, api, ApiError, formatStatus, uploadUrl } from '../utils';

export function ItemDetailPage({ items, user }: { items: Item[]; user: AuthUser | null }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showLoginMessage, setShowLoginMessage] = useState(false);
  const [identifyingDetails, setIdentifyingDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [claimMessage, setClaimMessage] = useState('');

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');

  const item = items.find((i) => i.id.toString() === id);

  const isLoggedIn = Boolean(user);
  const isStudent = user?.role === 'STUDENT';

  if (!item) {
    return (
      <main className="page-shell public-detail-shell" style={{ '--page-background-image': `url(${campusImage})` } as CSSProperties}>
        <section className="detail-card">
          <h1>Item not found</h1>
          <button type="button" className="detail-back-button" onClick={() => navigate('/browse-items')}>‹ Back</button>
        </section>
      </main>
    );
  }

  const showsClaimRequestForm = item.status !== 'RESOLVED' && isLoggedIn && isStudent;

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

        await api.postForm(`/claims/${response.id}/evidence`, formData);
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
      className="page-shell public-detail-shell"
      style={
        {
          '--page-background-image': `url(${campusImage})`,
        } as CSSProperties
      }
    >
      <section className={`detail-card${showsClaimRequestForm ? ' claim-request-card' : ''}`}>
        <button
          type="button"
          className="detail-back-button"
          onClick={() => navigate(isLoggedIn ? '/student-home' : '/browse-items')}
        >
          ‹ Back
        </button>

        <div className="detail-layout">
          <div className="detail-image">
            {item.images && item.images.length > 0 ? (
              <img src={uploadUrl(item.images[0].objectKey)} alt={item.title} />
            ) : (
              <div className="detail-image-placeholder">
                <PackageSearch size={58} strokeWidth={1.4} aria-hidden="true" />
                <strong>No image available</strong>
              </div>
            )}
          </div>

          <div className="detail-content">
            <div className="detail-title-row">
              <div>
                <p className="eyebrow">FOUND ITEM</p>
                <h1>{item.title}</h1>
              </div>
              <span className={`detail-status status-${item.status.toLowerCase()}`}>{formatStatus(item.status)}</span>
            </div>

            <div className="detail-info-list">
              <div>
                <Tag aria-hidden="true" />
                <span>Category</span>
                <strong>{item.category?.name || 'Uncategorized'}</strong>
              </div>
              <div>
                <MapPin aria-hidden="true" />
                <span>Location</span>
                <strong>{item.location}</strong>
              </div>
              <div>
                <CalendarDays aria-hidden="true" />
                <span>Reported</span>
                <strong>{new Date(item.occurredAt).toLocaleDateString()}</strong>
              </div>
            </div>

            <div className="detail-description">
              <h3>Description</h3>
              <p>{item.description}</p>
            </div>

            {/* Check if item is already claimed or resolved */}
            {item.status === 'RESOLVED' ? (
              <div className="detail-returned-message">
                <CheckCircle2 aria-hidden="true" />
                <span>This item has been returned to its owner.</span>
              </div>
            ) : isLoggedIn && isStudent ? (
              /* Authenticated Student Claim Form */
              <form onSubmit={handleClaimSubmit} className="detail-claim-form">
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
                    disabled={isSubmitting}
                  />
                </label>

                <div className="field">
                  <span style={{ fontWeight: 'bold', color: '#594a3a' }}>Upload proof picture (receipt, serial number, photo of item)</span>
                  <FileUpload
                    disabled={isSubmitting}
                    selectedFileName={selectedFile?.name}
                    onFileSelected={(file) => {
                      if (!file) {
                        setSelectedFile(null);
                        setImagePreview('');
                        return;
                      }
                      setSelectedFile(file);
                      setImagePreview(URL.createObjectURL(file));
                    }}
                  />
                </div>

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
              <p className="detail-role-notice"><ShieldCheck size={19} aria-hidden="true" /> Only students can submit claim requests.</p>
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
                      onClick={() => navigate('/login')}
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
