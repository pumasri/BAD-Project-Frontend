import { NavLink } from 'react-router-dom';
import { UserRound } from 'lucide-react';

import auLogo from '../assets/images/aulogo.png';

const adminTabs = [
  { label: 'Overview', path: '/admin-dashboard' },
  { label: 'Users', path: '/admin-users' },
  { label: 'Categories', path: '/admin-categories' },
  { label: 'AI Matches', path: '/admin/matches' },
  { label: 'Integrations', path: '/admin-api-integrations' },
  { label: 'Audit Logs', path: '/admin-audit-logs' },
];

export function AdminTopNav() {
  return (
    <header className="admin-top-nav">
      <NavLink to="/admin-dashboard" className="admin-top-logo" aria-label="Admin overview">
        <img src={auLogo} alt="AU L&F" />
      </NavLink>

      <nav className="admin-top-tabs" aria-label="Admin sections">
        {adminTabs.map((tab) => (
          <NavLink
            to={tab.path}
            className={({ isActive }) => `admin-top-tab${isActive ? ' active' : ''}`}
            key={tab.path}
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>

      <NavLink
        to="/admin-profile"
        className={({ isActive }) => `admin-account-tab${isActive ? ' active' : ''}`}
      >
        <UserRound size={18} aria-hidden="true" />
        <span>My Account</span>
      </NavLink>
    </header>
  );
}
