import type { CSSProperties } from 'react';
import { campusImage } from '../utils';

export function StudentHome({ onLogout }: { onLogout: () => void }) {
  return (
    <main
      className="page-shell"
      style={
        {
          '--page-background-image': `url(${campusImage})`,
        } as CSSProperties
      }
    >
      <section className="dashboard-card">
        <div className="dashboard-header">
          <div>
            <p className="eyebrow">STUDENT PORTAL</p>
            <h1>Student Home</h1>
            <p>Manage your claims and account.</p>
          </div>

          <button
            type="button"
            className="dashboard-logout"
            onClick={onLogout}
          >
            Log out
          </button>
        </div>
      </section>
    </main>
  );
}
