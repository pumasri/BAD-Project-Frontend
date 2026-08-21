import { useState, CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { campusImage } from '../utils';

export function StudentSignupPage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  return (
    <main
      className="page-shell"
      style={
        {
          '--page-background-image': `url(${campusImage})`,
        } as CSSProperties
      }
    >
      <section className="login-card">
        <button
          type="button"
          className="detail-back-button"
          onClick={() => navigate('/student-login')}
        >
          ← Back to Student Login
        </button>

        <div className="card-heading">
          <p className="eyebrow">STUDENT ACCOUNT</p>
          <h1>Create Account</h1>
          <p>
            Create your AU student account to submit ownership claims.
          </p>
        </div>

        <form
          className="login-form"
          onSubmit={(event) => {
            event.preventDefault();
            setMessage(
              'Student signup will be connected to the backend later.',
            );
          }}
        >
          <label className="field">
            <span>AU Student Email</span>
            <input type="email" placeholder="uID@au.edu" required />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              placeholder="Create a password"
              required
            />
          </label>

          <label className="field">
            <span>Confirm Password</span>
            <input
              type="password"
              placeholder="Confirm your password"
              required
            />
          </label>

          <button type="submit" className="submit-button">
            Create Student Account
          </button>

          {message && <p className="form-status">{message}</p>}
        </form>
      </section>
    </main>
  );
}
