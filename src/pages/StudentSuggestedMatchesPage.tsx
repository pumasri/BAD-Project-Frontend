import { useEffect, useState, type CSSProperties } from 'react';
import { ArrowLeft, CalendarDays, CheckCircle2, MapPin, PackageSearch, ShieldCheck } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import type { StudentSuggestedMatch } from '../types';
import { ApiError, api, campusImage } from '../utils';

function safeError(error: unknown) {
  if (!(error instanceof ApiError)) return 'Suggested matches could not be loaded. Please try again.';
  if (error.status === 401) return 'Your session has expired. Please sign in again.';
  if (error.status === 403) return 'You can only view matches for your own lost reports.';
  if (error.status === 404) return 'This lost report could not be found.';
  return error.message || 'Suggested matches could not be loaded.';
}

export function StudentSuggestedMatchesPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [matches, setMatches] = useState<StudentSuggestedMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) {
      setError('This lost report could not be found.');
      setLoading(false);
      return;
    }

    api.get<StudentSuggestedMatch[]>(`/items/${id}/matches`)
      .then(setMatches)
      .catch((requestError) => setError(safeError(requestError)))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <main
      className="page-shell"
      style={{ '--page-background-image': `url(${campusImage})` } as CSSProperties}
    >
      <section className="dashboard-card match-page">
        <button
          type="button"
          className="detail-back-button"
          onClick={() => navigate('/student-home')}
        >
          <ArrowLeft size={18} aria-hidden="true" /> Back to Student Home
        </button>

        <div className="match-page-heading">
          <div>
            <p className="eyebrow">SMART MATCH REVIEW</p>
            <h1>Suggested Matches</h1>
            <p>
              Close possibilities from recent found-item reports. Keep the final call careful:
              staff will still verify ownership before anything is released.
            </p>
          </div>
          <div className="match-page-note" aria-label="Verification required">
            <ShieldCheck size={21} aria-hidden="true" />
            <span>Verification required</span>
          </div>
        </div>

        {loading && <div className="match-state">Checking for suggested matches…</div>}
        {!loading && error && <div className="match-state match-error" role="alert">{error}</div>}
        {!loading && !error && matches.length === 0 && (
          <div className="match-state">
            <div className="match-empty-icon">
              <PackageSearch size={32} aria-hidden="true" />
            </div>
            <h2>No suggestions yet</h2>
            <p>New found reports are checked quietly in the background. When something looks close, it will appear here.</p>
            <button type="button" className="match-primary-button" onClick={() => navigate('/student-find-item')}>
              Browse found items
            </button>
          </div>
        )}

        {!loading && !error && matches.length > 0 && (
          <div className="student-match-grid">
            {matches.map((match) => (
              <article className="student-match-card" key={match.id}>
                <div className="student-match-card-top">
                  <div className="match-score-ring" aria-label={`${match.score.toFixed(0)} percent match`}>
                    {match.score.toFixed(0)}%
                  </div>
                  <span className={`match-confidence confidence-${match.confidence.toLowerCase()}`}>
                    {match.confidence}
                  </span>
                </div>
                <div className="student-match-content">
                  <div className="match-card-title">
                    <div>
                      <h2>{match.foundItem.category || 'General item'}</h2>
                    </div>
                    <span className="status-badge status-review">{match.status}</span>
                  </div>
                  <dl className="safe-match-facts">
                    <div><dt><MapPin size={15} aria-hidden="true" /> Location</dt><dd>{match.foundItem.approximateLocation || 'Not available'}</dd></div>
                    <div><dt><CalendarDays size={15} aria-hidden="true" /> Date</dt><dd>{match.foundItem.approximateDate || 'Not available'}</dd></div>
                  </dl>
                  <div className="match-reasons">
                    <strong>Why it may match</strong>
                    <ul>{match.reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul>
                  </div>
                  <div className="match-card-actions">
                    <button
                      type="button"
                      className="match-primary-button"
                      onClick={() => navigate('/student-find-item')}
                    >
                      <CheckCircle2 size={18} aria-hidden="true" /> Matched
                    </button>
                    <button
                      type="button"
                      className="match-secondary-button"
                      onClick={() => navigate('/student-find-item')}
                    >
                      View found items
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
