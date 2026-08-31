import { CSSProperties, useMemo, useState } from 'react';
import { CheckCircle2, Clock3, PackageSearch, SearchCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { StudentClaim } from '../types';
import { campusImage, uploadUrl } from '../utils';

type ClaimFilter = 'ALL' | 'PENDING' | 'MATCHED' | 'RESOLVED';

const filterOptions: Array<{ label: string; value: ClaimFilter }> = [
  { label: 'All', value: 'ALL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Matched', value: 'MATCHED' },
  { label: 'Resolved', value: 'RESOLVED' },
];

function formatClaimStatus(status: string) {
  if (!status) return '';
  return status.split('_').map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}

function filterClaim(claim: StudentClaim, filter: ClaimFilter) {
  if (filter === 'ALL') return true;
  if (filter === 'PENDING') return ['PENDING', 'SUBMITTED', 'MORE_INFORMATION_REQUIRED'].includes(claim.status);
  if (filter === 'MATCHED') return claim.status === 'MORE_INFORMATION_REQUIRED';
  return claim.status === 'APPROVED';
}

export function StudentClaimsPage({ claims }: { claims: StudentClaim[] }) {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<ClaimFilter>('ALL');
  const filteredClaims = useMemo(
    () => claims.filter((claim) => filterClaim(claim, activeFilter)),
    [activeFilter, claims],
  );
  const approvedClaims = claims.filter((claim) => claim.status === 'APPROVED').length;
  const reviewClaims = claims.filter((claim) => !['APPROVED', 'REJECTED'].includes(claim.status)).length;

  return (
    <main
      className="page-shell student-shell"
      style={
        {
          '--page-background-image': `url(${campusImage})`,
        } as CSSProperties
      }
    >
      <section className="dashboard-card student-claims-page-card">
        <div className="claims-page-header">
          <div>
            <h1>My Claims</h1>
            <p>Track the status of your reported lost items.</p>
          </div>
          <button
            type="button"
            className="dashboard-logout"
            onClick={() => navigate('/student-home')}
          >
            ‹ Back
          </button>
        </div>

        <div className="claims-summary-grid">
          <div className="claims-summary-card">
            <Clock3 aria-hidden="true" />
            <span>In Review</span>
            <strong>{reviewClaims}</strong>
          </div>
          <div className="claims-summary-card">
            <CheckCircle2 aria-hidden="true" />
            <span>Approved</span>
            <strong>{approvedClaims}</strong>
          </div>
          <div className="claims-summary-card">
            <SearchCheck aria-hidden="true" />
            <span>Total Claims</span>
            <strong>{claims.length}</strong>
          </div>
        </div>

        <div className="claims-filter-row" aria-label="Claim filters">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={activeFilter === option.value ? 'is-active' : ''}
              onClick={() => setActiveFilter(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>

        {filteredClaims.length > 0 ? (
          <div className="student-card-grid claims-card-grid">
            {filteredClaims.map((claim) => (
              <article
                key={claim.id}
                className="student-lost-card student-claim-feature-card"
              >
                <div className="student-lost-card-image">
                  {claim.foundReport?.images && claim.foundReport.images.length > 0 ? (
                    <img
                      src={uploadUrl(claim.foundReport.images[0].objectKey)}
                      alt={claim.foundReport.title}
                    />
                  ) : (
                    <PackageSearch size={38} strokeWidth={1.5} aria-hidden="true" />
                  )}
                  <span className="student-card-category">
                    {claim.foundReport?.category?.name || 'Uncategorized'}
                  </span>
                  <span className={`status-badge student-card-status ${claim.status === 'APPROVED' ? 'status-resolved' : claim.status === 'REJECTED' ? 'status-archived' : 'status-matched'}`}>
                    {formatClaimStatus(claim.status)}
                  </span>
                </div>

                <div className="student-lost-card-content">
                  <strong>{claim.foundReport?.title || 'Unknown Item'}</strong>
                  <span>{claim.foundReport?.location || 'Location not specified'}</span>
                  <p>Submitted {new Date(claim.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>

                <div className="student-lost-card-footer">
                  <button
                    type="button"
                    className="student-card-view-button"
                    onClick={() => navigate(`/student-claims/${claim.id}`)}
                  >
                    View ›
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="claims-empty-state">
            <PackageSearch size={34} strokeWidth={1.5} aria-hidden="true" />
            <h3>No claims found</h3>
            <p>{claims.length ? 'Try another status filter.' : "You haven't submitted any claims yet."}</p>
          </div>
        )}
      </section>
    </main>
  );
}
