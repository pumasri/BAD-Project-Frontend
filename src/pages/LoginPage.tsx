import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AuthUser } from '../types';
import { developmentLogin, loginWithMicrosoft } from '../services/authService';
import {
  getMicrosoftIdentityToken,
  isMicrosoftAuthConfigured,
} from '../services/microsoftAuthService';
import campusImage from '../assets/images/abacCampus.jpeg';
import closeEye from '../assets/images/close-eye.png';
import openEye from '../assets/images/open-eye.png';
import { isAuEmail, MAX_PASSWORD_LENGTH } from '../utils/authValidation';
import './LoginPage.css';

export function LoginPage({
  onLogin,
}: {
  onLogin: (user: AuthUser) => void;
}) {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [developmentEmail, setDevelopmentEmail] = useState('');
  const [developmentPassword, setDevelopmentPassword] = useState('');
  const [showDevelopmentPassword, setShowDevelopmentPassword] = useState(false);
  const [developmentLoading, setDevelopmentLoading] = useState(false);
  const microsoftConfigured = isMicrosoftAuthConfigured();

  async function handleMicrosoftLogin() {
    setErrorMessage('');
    setLoading(true);

    try {
      const idToken = await getMicrosoftIdentityToken();
      const auth = await loginWithMicrosoft(idToken);
      onLogin(auth.user);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Microsoft sign-in failed.',
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDevelopmentLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage('');
    const email = developmentEmail.trim().toLowerCase();

    if (!isAuEmail(email)) {
      setErrorMessage('Enter a valid local @au.edu account email.');
      return;
    }

    setDevelopmentLoading(true);
    try {
      const auth = await developmentLogin(email, developmentPassword);
      onLogin(auth.user);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Development login failed.',
      );
    } finally {
      setDevelopmentLoading(false);
    }
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
              disabled={loading || !microsoftConfigured}
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

          {import.meta.env.DEV && (
            <section className="role-development-login" aria-label="Development login">
              <span>Development Login</span>
              <form onSubmit={handleDevelopmentLogin}>
                <label className="role-field">
                  <span>Email</span>
                  <input
                    type="email"
                    value={developmentEmail}
                    onChange={(event) => setDevelopmentEmail(event.target.value)}
                    autoComplete="username"
                    placeholder="local-user@au.edu"
                    maxLength={254}
                    required
                  />
                </label>
                <label className="role-field">
                  <span>Password</span>
                  <span className="role-password-wrapper">
                    <input
                      type={showDevelopmentPassword ? 'text' : 'password'}
                      value={developmentPassword}
                      onChange={(event) => setDevelopmentPassword(event.target.value)}
                      autoComplete="current-password"
                      maxLength={MAX_PASSWORD_LENGTH}
                      required
                    />
                    <button
                      type="button"
                      className="role-eye-button"
                      onClick={() => setShowDevelopmentPassword((value) => !value)}
                      aria-label={showDevelopmentPassword ? 'Hide password' : 'Show password'}
                    >
                      <img src={showDevelopmentPassword ? openEye : closeEye} alt="" />
                    </button>
                  </span>
                </label>
                <button type="submit" className="role-submit-button" disabled={developmentLoading}>
                  {developmentLoading ? 'Logging in...' : 'Development Login'}
                </button>
              </form>
              <small>Uses a real local PostgreSQL account, application JWT, and backend RBAC.</small>
            </section>
          )}

        </div>
      </section>
    </main>
  );
}
