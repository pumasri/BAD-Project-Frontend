import { useCallback, useEffect, useMemo, useState, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';

import { AdminTopNav } from '../components/AdminTopNav';
import type {
  Item,
  MatchConfidence,
  MatchDetail,
  MatchStatus,
  Role,
} from '../types';
import { ApiError, api, campusImage } from '../utils';

type FilterStatus = 'ALL' | MatchStatus;
type FilterConfidence = 'ALL' | MatchConfidence;

function errorMessage(error: unknown) {
  if (error instanceof ApiError) {
    if (error.status === 401) return 'Your session has expired. Please sign in again.';
    if (error.status === 403) return 'You do not have permission to review matches.';
    if (error.status === 404) return 'The requested report or match no longer exists.';
    return error.message;
  }
  return 'The matching service request failed. Please try again.';
}

function ReportSummary({ label, report }: { label: string; report: Item }) {
  return (
    <section className="match-report-summary">
      <span className="eyebrow">{label}</span>
      <h3>{report.title}</h3>
      <p>{report.description}</p>
      <dl>
        <div><dt>Category</dt><dd>{report.category?.name || 'Unknown'}</dd></div>
        <div><dt>Location</dt><dd>{report.location}</dd></div>
        <div><dt>Date</dt><dd>{new Date(report.occurredAt).toLocaleDateString()}</dd></div>
        <div><dt>Color / brand</dt><dd>{[report.color, report.brand].filter(Boolean).join(' · ') || 'Not provided'}</dd></div>
      </dl>
    </section>
  );
}

export function MatchReviewPage({ role, items }: { role: Extract<Role, 'STAFF' | 'ADMIN'>; items: Item[] }) {
  const navigate = useNavigate();
  const [matches, setMatches] = useState<MatchDetail[]>([]);
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('ALL');
  const [confidenceFilter, setConfidenceFilter] = useState<FilterConfidence>('ALL');
  const [selectedReportId, setSelectedReportId] = useState('');
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const eligibleItems = useMemo(
    () => items.filter((item) => ['OPEN', 'MATCHED', 'CLAIM_IN_PROGRESS'].includes(item.status)),
    [items],
  );

  const loadMatches = useCallback(async () => {
    setLoading(true);
    setError('');
    const parameters = new URLSearchParams();
    if (statusFilter !== 'ALL') parameters.set('status', statusFilter);
    if (confidenceFilter !== 'ALL') parameters.set('confidence', confidenceFilter);
    const query = parameters.toString();

    try {
      const data = await api.get<MatchDetail[]>(`/matches${query ? `?${query}` : ''}`);
      setMatches(data);
      if (selectedMatchId && !data.some((match) => match.id === selectedMatchId)) {
        setSelectedMatchId(null);
      }
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, [confidenceFilter, selectedMatchId, statusFilter]);

  useEffect(() => {
    void loadMatches();
  }, [loadMatches]);

  async function reviewMatch(match: MatchDetail, status: 'CONFIRMED' | 'REJECTED') {
    if (reviewing || match.status !== 'SUGGESTED') return;
    const verb = status === 'CONFIRMED' ? 'confirm' : 'reject';
    if (!window.confirm(`Are you sure you want to ${verb} this AI suggestion?`)) return;

    setReviewing(true);
    setMessage('');
    setError('');
    try {
      await api.patch<MatchDetail>(`/matches/${match.id}`, { status });
      setMessage(`Suggestion ${status === 'CONFIRMED' ? 'confirmed' : 'rejected'} successfully.`);
      await loadMatches();
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setReviewing(false);
    }
  }

  async function runMatching() {
    if (!selectedReportId || running) return;

    setRunning(true);
    setMessage('');
    setError('');
    try {
      await api.post<{ matches: MatchDetail[] }>(`/items/${selectedReportId}/matches/run`, {});
      setMessage('Matching completed. Review the latest suggestions below.');
      await loadMatches();
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setRunning(false);
    }
  }

  const selectedMatch = matches.find((match) => match.id === selectedMatchId) || null;
  const dashboardPath = role === 'STAFF' ? '/staff-dashboard' : '/admin-dashboard';

  return (
    <main
      className={`page-shell${role === 'ADMIN' ? ' admin-shell' : ''}`}
      style={{ '--page-background-image': `url(${campusImage})` } as CSSProperties}
    >
      <section className={`dashboard-card match-page staff-match-page${role === 'ADMIN' ? ' admin-content-card' : ''}`}>
        {role === 'ADMIN' ? (
          <AdminTopNav />
        ) : (
          <button type="button" className="detail-back-button" onClick={() => navigate(dashboardPath)}>
            ‹ Back
          </button>
        )}

        <div className="match-page-heading">
          <div>
            <h1>AI Match Review</h1>
            <p>Review suggestions before any ownership or claim decision is made.</p>
          </div>
        </div>

        <section className="match-run-panel staff-match-run-panel">
          <div>
            <span className="eyebrow">Matching Workbench</span>
            <h2>Run matching manually</h2>
            <p>Choose an eligible lost or found report and refresh its suggested matches.</p>
          </div>
          <div className="match-run-controls">
            <select value={selectedReportId} onChange={(event) => setSelectedReportId(event.target.value)}>
              <option value="">Select a report</option>
              {eligibleItems.map((item) => (
                <option value={item.id} key={item.id}>
                  {item.reportType}: {item.title} · {item.location}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="submit-button"
              disabled={!selectedReportId || running}
              onClick={runMatching}
            >
              {running ? 'Running...' : 'Run matching'}
            </button>
          </div>
        </section>

        <div className="match-filter-bar staff-match-filter-bar">
          <label>
            <span>Status</span>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as FilterStatus)}>
              <option value="ALL">All statuses</option>
              <option value="SUGGESTED">Suggested</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="REJECTED">Rejected</option>
              <option value="CLAIMED">Claimed</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </label>
          <label>
            <span>Confidence</span>
            <select value={confidenceFilter} onChange={(event) => setConfidenceFilter(event.target.value as FilterConfidence)}>
              <option value="ALL">All confidence</option>
              <option value="HIGH">High</option>
              <option value="POSSIBLE">Possible</option>
            </select>
          </label>
        </div>

        {message && <p className="match-feedback match-success" role="status">{message}</p>}
        {error && <p className="match-feedback match-error" role="alert">{error}</p>}
        {loading && <div className="match-state">Loading match suggestions…</div>}
        {!loading && !error && matches.length === 0 && (
          <div className="match-state"><h2>No matches found</h2><p>Try another filter or run matching for an eligible report.</p></div>
        )}

        {!loading && matches.length > 0 && (
          <div className="match-review-layout">
            <div className="match-review-list">
              {matches.map((match) => (
                <button
                  type="button"
                  className={`match-review-row${selectedMatchId === match.id ? ' active' : ''}`}
                  key={match.id}
                  onClick={() => setSelectedMatchId(match.id)}
                >
                  <span className="match-score-small">{match.totalScore.toFixed(0)}%</span>
                  <span>
                    <strong>{match.lostReport.title} ↔ {match.foundReport.title}</strong>
                    <small>{match.confidence} · {match.status}</small>
                  </span>
                  <span aria-hidden="true">→</span>
                </button>
              ))}
            </div>

            <div className="match-detail-panel">
              {!selectedMatch && <div className="match-state">Select a suggestion to inspect its details.</div>}
              {selectedMatch && (
                <>
                  <div className="match-detail-header">
                    <div>
                      <span className={`match-confidence confidence-${selectedMatch.confidence.toLowerCase()}`}>
                        {selectedMatch.confidence}
                      </span>
                      <h2>{selectedMatch.totalScore.toFixed(1)}% match</h2>
                    </div>
                    <span className="status-badge status-review">{selectedMatch.status}</span>
                  </div>

                  <div className="match-report-grid">
                    <ReportSummary label="LOST REPORT" report={selectedMatch.lostReport} />
                    <ReportSummary label="FOUND REPORT" report={selectedMatch.foundReport} />
                  </div>

                  <div className="match-score-grid">
                    {[
                      ['Description', selectedMatch.descriptionSimilarityScore],
                      ['Category', selectedMatch.categoryScore],
                      ['Color', selectedMatch.colorScore],
                      ['Location', selectedMatch.locationScore],
                      ['Date', selectedMatch.dateScore],
                    ].map(([label, score]) => (
                      <div key={String(label)}>
                        <span>{label}</span>
                        <strong>{Number(score).toFixed(0)}%</strong>
                      </div>
                    ))}
                  </div>

                  <div className="match-reasons">
                    <strong>Match reasons</strong>
                    <ul>{selectedMatch.reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul>
                  </div>

                  {selectedMatch.status === 'SUGGESTED' && (
                    <div className="match-review-actions">
                      <button
                        type="button"
                        className="secondary-button match-reject-button"
                        disabled={reviewing}
                        onClick={() => reviewMatch(selectedMatch, 'REJECTED')}
                      >
                        Reject suggestion
                      </button>
                      <button
                        type="button"
                        className="submit-button"
                        disabled={reviewing}
                        onClick={() => reviewMatch(selectedMatch, 'CONFIRMED')}
                      >
                        Confirm suggestion
                      </button>
                    </div>
                  )}
                  <p className="match-privacy-note">
                    Confirming a suggestion does not approve a claim, resolve a report, or authorize item handover.
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
