import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AuthUser } from '../types';
import { completeMicrosoftLogin } from '../services/authService';
import { startMicrosoftLogin } from '../services/microsoftAuthService';
import campusImage from '../assets/images/abacCampus.jpeg';
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

    startMicrosoftLogin();
  }

  return (
    <main className="role-login-shell">
      <section className="role-login-layout">
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
          <button
            type="button"
            className="role-login-close"
            onClick={() => navigate('/')}
            aria-label="Close login and return to homepage"
          >
            &times;
          </button>

          <div className="role-form-heading">
            <span className="role-login-kicker">Login</span>
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
              {loading ? 'Signing in...' : 'Sign in with Microsoft'}
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
