import { NavLink } from 'react-router-dom';
import { UserRound } from 'lucide-react';

import auLogo from '../assets/images/aulogo.png';

const staffTabs = [
  { label: 'Overview', path: '/staff-dashboard' },
  { label: 'Report Found Item', path: '/staff/report-item' },
  { label: 'Found Items', path: '/staff/items' },
  { label: 'Claims', path: '/staff/claims' },
  { label: 'Lost Reports', path: '/staff/lost-reports' },
  { label: 'AI Matches', path: '/staff/matches' },
];

export function StaffTopNav() {
  return (
    <header className="admin-top-nav staff-top-nav">
      <NavLink to="/staff-dashboard" className="admin-top-logo" aria-label="Staff overview">
        <img src={auLogo} alt="AU L&F" />
      </NavLink>

      <nav className="admin-top-tabs" aria-label="Staff sections">
        {staffTabs.map((tab) => (
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
        to="/staff-profile"
        className={({ isActive }) => `admin-account-tab${isActive ? ' active' : ''}`}
      >
        <UserRound size={18} aria-hidden="true" />
        <span>My Account</span>
      </NavLink>
    </header>
  );
}
