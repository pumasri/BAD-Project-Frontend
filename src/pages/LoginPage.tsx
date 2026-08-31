import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AuthUser } from '../types';
import { completeMicrosoftLogin, getMicrosoftLoginUrl } from '../services/authService';
import campusImage from '../assets/images/abacCampus.jpeg';
import lostAndFoundLogo from '../assets/images/l-and-f-logo.png';
import './LoginPage.css';

export function LoginPage({
  onLogin,
  authenticationError = '',
}: {
  onLogin: (user: AuthUser) => void;
  authenticationError?: string;
}) {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(authenticationError);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authenticationError) setErrorMessage(authenticationError);
  }, [authenticationError]);

  useEffect(() => {
    const parameters = new URLSearchParams(window.location.search);
    const handoff = parameters.get('microsoft_handoff');
    const microsoftError = parameters.get('microsoft_error');

    if (microsoftError) {
      const messages: Record<string, string> = {
        account_inactive: 'This account is inactive.',
        account_setup_failed: 'Microsoft sign-in succeeded, but your local account could not be prepared. Check the backend database migrations and roles.',
        authentication_failed: 'Microsoft sign-in could not be verified.',
      };
      setErrorMessage(messages[microsoftError] || 'Microsoft sign-in failed.');
      window.history.replaceState({}, '', '/login');
      return;
    }

    if (!handoff) return;
    window.history.replaceState({}, '', '/login');
    setLoading(true);
    completeMicrosoftLogin(handoff)
      .then((auth) => onLogin(auth.user))
      .catch((error) => {
        setErrorMessage(
          error instanceof Error ? error.message : 'Microsoft sign-in failed.',
        );
      })
      .finally(() => setLoading(false));
  }, [onLogin]);

  function handleMicrosoftLogin() {
    setErrorMessage('');
    setLoading(true);

    window.location.assign(getMicrosoftLoginUrl());
  }

  return (
    <main className="role-login-shell">
      <section className="role-login-layout">
        <img
          src={lostAndFoundLogo}
          alt="AU Lost & Found"
          className="role-login-logo"
        />

        <button
          type="button"
          className="role-login-close"
          onClick={() => navigate('/')}
          aria-label="Close sign in and return to homepage"
        >
          &times;
        </button>

        <aside className="role-login-campus">
          <img src={campusImage} alt="ABAC Campus" className="role-campus-image" />
          <div className="role-campus-overlay" />
          <div className="role-campus-copy">
            <h2>Find what matters.</h2>
            <p>One campus community, helping every item find its way home.</p>
          </div>
          <span className="role-campus-location">Assumption University</span>
        </aside>

        <div className="role-login-card">
          <div className="role-form-heading">
            <span className="role-login-kicker">Sign in</span>
            <p>Sign in using your AU Microsoft account.</p>
          </div>

          <div className="role-login-form">
            <button
              type="button"
              className="role-microsoft-button"
              onClick={handleMicrosoftLogin}
              disabled={loading}
            >
              <span className="role-microsoft-mark" aria-hidden="true">
                <span /><span /><span /><span />
              </span>
              <span className="role-microsoft-label">
                {loading ? 'Signing in...' : 'Sign in'}
              </span>
            </button>
          </div>

          <p className="role-microsoft-notice">
            Only authorized AU accounts can access this system.
          </p>

          {errorMessage && (
            <p className="role-login-error" role="alert">{errorMessage}</p>
          )}
        </div>
      </section>
    </main>
  );
}
