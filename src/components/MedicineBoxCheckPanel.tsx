import { useCallback, useEffect, useState } from 'react';
import { ApiError, api } from '../utils';

type MedicineBoxCheck = {
  id: string;
  status: 'AVAILABLE' | 'UNAVAILABLE' | 'UNKNOWN' | 'ERROR';
  supportLocation: string | null;
  message: string | null;
  checkedAt: string;
};

function statusLabel(status: MedicineBoxCheck['status']) {
  return {
    AVAILABLE: 'Available',
    UNAVAILABLE: 'Unavailable',
    UNKNOWN: 'Needs review',
    ERROR: 'Check unavailable',
  }[status];
}

function statusColor(status: MedicineBoxCheck['status']) {
  return {
    AVAILABLE: '#2b7a78',
    UNAVAILABLE: '#a35d3f',
    UNKNOWN: '#8a6d1f',
    ERROR: '#a35d3f',
  }[status];
}

export function MedicineBoxCheckPanel({ reportId }: { reportId: string }) {
  const [checks, setChecks] = useState<MedicineBoxCheck[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState('');

  const loadChecks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await api.get<MedicineBoxCheck[]>(`/items/${reportId}/medicine-box-checks`);
      setChecks(data);
    } catch (requestError) {
      setError(requestError instanceof ApiError ? requestError.message : 'Medicine Box history could not be loaded.');
    } finally {
      setIsLoading(false);
    }
  }, [reportId]);

  useEffect(() => {
    void loadChecks();
  }, [loadChecks]);

  async function runCheck() {
    try {
      setIsChecking(true);
      setError('');
      const response = await api.post<{ check: MedicineBoxCheck }>(`/items/${reportId}/medicine-box-check`);
      setChecks((currentChecks) => [response.check, ...currentChecks].slice(0, 5));
    } catch (requestError) {
      setError(requestError instanceof ApiError ? requestError.message : 'Medicine Box check could not be completed.');
      await loadChecks();
    } finally {
      setIsChecking(false);
    }
  }

  const latestCheck = checks[0] || null;

  return (
    <section
      aria-labelledby="medicine-box-title"
      style={{
        marginTop: '24px',
        padding: '20px',
        borderRadius: '16px',
        border: '1px solid rgba(43, 122, 120, 0.22)',
        background: 'rgba(246, 251, 250, 0.92)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'flex-start' }}>
        <div>
          <p className="eyebrow" style={{ marginBottom: '4px', color: '#2b7a78' }}>PEER API CHECK</p>
          <h2 id="medicine-box-title" style={{ margin: 0, color: '#31281f', fontSize: '1.15rem' }}>Medicine Box availability</h2>
          <p style={{ margin: '6px 0 0', color: '#6d6257', fontSize: '0.9rem' }}>
            Sends only the agreed First-Aid category filter to the partner service.
          </p>
        </div>
        <button
          type="button"
          className="claim-button"
          onClick={runCheck}
          disabled={isChecking}
          style={{ width: 'auto', margin: 0, whiteSpace: 'nowrap', opacity: isChecking ? 0.7 : 1 }}
        >
          {isChecking ? 'Checking…' : 'Check Medicine Box'}
        </button>
      </div>

      {isLoading ? (
        <p style={{ margin: '18px 0 0', color: '#6d6257' }}>Loading previous check…</p>
      ) : latestCheck ? (
        <div style={{ marginTop: '18px', paddingTop: '16px', borderTop: '1px solid rgba(43, 122, 120, 0.16)' }}>
          <p style={{ margin: 0, color: statusColor(latestCheck.status), fontWeight: 700 }}>
            {statusLabel(latestCheck.status)}
          </p>
          {latestCheck.supportLocation && <p style={{ margin: '6px 0 0', color: '#594a3a' }}>Support location: {latestCheck.supportLocation}</p>}
          {latestCheck.message && <p style={{ margin: '6px 0 0', color: '#594a3a' }}>{latestCheck.message}</p>}
          <small style={{ display: 'block', marginTop: '8px', color: '#918477' }}>
            Last checked: {new Date(latestCheck.checkedAt).toLocaleString()}
          </small>
        </div>
      ) : (
        <p style={{ margin: '18px 0 0', color: '#6d6257' }}>No Medicine Box check has been run for this report.</p>
      )}

      {error && <p role="alert" style={{ margin: '14px 0 0', color: '#a35d3f', fontWeight: 600 }}>{error}</p>}
    </section>
  );
}
