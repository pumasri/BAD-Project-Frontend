import { useEffect, useMemo, useState } from 'react';
import { History, KeyRound, SearchCheck, Tags, UsersRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { AdminTopNav } from '../components/AdminTopNav';
import type { Item, MatchDetail } from '../types';
import { api, formatStatus } from '../utils';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

const quickManagement = [
  {
    title: 'User Management',
    description: 'Roles and account status',
    icon: UsersRound,
    path: '/admin-users',
  },
  {
    title: 'Categories',
    description: 'Report taxonomy',
    icon: Tags,
    path: '/admin-categories',
  },
  {
    title: 'API Integrations',
    description: 'Partner connections',
    icon: KeyRound,
    path: '/admin-api-integrations',
  },
];

export function AdminDashboard({ items }: { items: Item[] }) {
  const navigate = useNavigate();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [matches, setMatches] = useState<MatchDetail[]>([]);

  useEffect(() => {
    api.get<AdminUser[]>('/admin/users').then(setUsers).catch(console.error);
    api.get<MatchDetail[]>('/matches').then(setMatches).catch(console.error);
  }, []);

  const openReports = useMemo(
    () => items.filter((item) => ['OPEN', 'MATCHED', 'CLAIM_IN_PROGRESS'].includes(item.status)).length,
    [items],
  );
  const resolvedCases = useMemo(
    () => items.filter((item) => item.status === 'RESOLVED').length,
    [items],
  );
  const pendingMatches = useMemo(
    () => matches.filter((match) => match.status === 'SUGGESTED').length,
    [matches],
  );
  const latestMatch = matches[0] || null;
  const recentReports = items
    .slice()
    .sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime())
    .slice(0, 4);

  const summaryCards = [
    { label: 'Total Users', value: users.length },
    { label: 'Open Reports', value: openReports },
    { label: 'Pending Matches', value: pendingMatches },
    { label: 'Resolved Cases', value: resolvedCases },
  ];

  return (
    <main className="page-shell admin-shell">
      <section className="dashboard-card admin-dashboard-card">
        <AdminTopNav />

        <div className="admin-overview-header">
          <p className="eyebrow">Administration</p>
          <h1>Admin Overview</h1>
          <p>Monitor system health, review matching work, and jump into core administration tasks.</p>
        </div>

        <div className="admin-summary-grid">
          {summaryCards.map((card) => (
            <article className="admin-summary-card" key={card.label}>
              <span>{card.label}</span>
              <strong>{card.value}</strong>
            </article>
          ))}
        </div>

        <div className="admin-main-layout">
          <section className="admin-primary-panel">
            <div>
              <span className="admin-panel-icon"><SearchCheck size={22} aria-hidden="true" /></span>
              <p className="eyebrow">AI Matches</p>
              <h2>Review suggested matches</h2>
              <p>
                {latestMatch
                  ? `${latestMatch.lostReport.title} and ${latestMatch.foundReport.title} are the latest suggested pair.`
                  : 'No match suggestions are waiting right now.'}
              </p>
            </div>
            <div className="admin-match-snapshot">
              <span>{pendingMatches}</span>
              <strong>pending review</strong>
            </div>
            <button type="button" className="submit-button" onClick={() => navigate('/admin/matches')}>
              Review AI Matches
            </button>
          </section>

          <section className="admin-secondary-panel">
            <div className="admin-panel-heading">
              <div>
                <p className="eyebrow">Activity</p>
                <h2>Recent reports</h2>
              </div>
              <History size={20} aria-hidden="true" />
            </div>

            {recentReports.length > 0 ? (
              <div className="admin-activity-list">
                {recentReports.map((item) => (
                  <div className="admin-activity-item" key={item.id}>
                    <div>
                      <strong>{item.title}</strong>
                      <span>{item.reportType} · {item.category?.name || 'Uncategorized'}</span>
                    </div>
                    <span>{formatStatus(item.status)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="admin-panel-empty">No reports have been added yet.</p>
            )}
          </section>
        </div>

        <section className="admin-quick-section" aria-labelledby="quick-management-title">
          <h2 id="quick-management-title">Quick management</h2>
          <div className="admin-quick-row">
            {quickManagement.map(({ title, description, icon: Icon, path }) => (
              <button type="button" className="admin-quick-card" onClick={() => navigate(path)} key={path}>
                <Icon size={19} aria-hidden="true" />
                <span>
                  <strong>{title}</strong>
                  <small>{description}</small>
                </span>
              </button>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
