import { FormEvent, useState, CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginPageConfig } from '../types';
import { campusImage } from '../utils';

export function LoginPage({
  title,
  description,
  emailLabel,
  emailPlaceholder,
  showSignup = false,
  onLogin,
}: LoginPageConfig & {
  onLogin: () => void;
}) {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage('Signing in...');

    setTimeout(() => {
      onLogin();
    }, 300);
  }

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
          onClick={() => navigate('/')}
        >
          ← Back to Lost &amp; Found
        </button>

        <div className="card-heading">
          <p className="eyebrow">CAMPUS LOST &amp; FOUND</p>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>{emailLabel}</span>
            <input
              type="email"
              placeholder={emailPlaceholder}
              required
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              placeholder="Enter your password"
              required
            />
          </label>

          <div className="form-row">
            <label className="checkbox">
              <input type="checkbox" />
              <span>Keep me signed in</span>
            </label>

            <button
              type="button"
              className="text-link text-button"
              onClick={() => navigate('/forgot-password')}
            >
              Forgot password?
            </button>
          </div>

          <button type="submit" className="submit-button">
            Log in
          </button>

          {message && (
            <p className="form-status">{message}</p>
          )}
        </form>

        {showSignup && (
          <p className="signup-section">
            Don&apos;t have an account?{' '}
            <button
              type="button"
              className="text-link text-button"
              onClick={() => navigate('/student-signup')}
            >
              Sign up
            </button>
          </p>
        )}
      </section>
    </main>
  );
}
