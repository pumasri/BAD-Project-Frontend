import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AuthUser } from '../types';
import { login } from '../services/authService';
import campusImage from '../assets/images/abacCampus.jpeg';
import closeEye from '../assets/images/close-eye.png';
import openEye from '../assets/images/open-eye.png';
import { isAuEmail, MAX_PASSWORD_LENGTH } from '../utils/authValidation';
import './LoginPage.css';

export function LoginPage({ onLogin }: { onLogin: (user: AuthUser) => void }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage('');

    const normalizedEmail = email.trim().toLowerCase();
    if (!isAuEmail(normalizedEmail)) {
      setErrorMessage('Enter a valid @au.edu email address.');
      return;
    }

    setLoading(true);

    try {
      const auth = await login(normalizedEmail, password, rememberMe);
      onLogin(auth.user);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setLoading(false);
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
            <span className="role-login-kicker">Campus Lost &amp; Found</span>
            <p>Students, staff, and administrators use the same AU login.</p>
          </div>

          <form className="role-login-form" onSubmit={handleSubmit}>
            <label className="role-field">
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="user@au.edu"
                autoComplete="username"
                pattern="[^\s@]+@au\.edu"
                maxLength={254}
                required
              />
            </label>

            <label className="role-field">
              <span>Password</span>
              <span className="role-password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  maxLength={MAX_PASSWORD_LENGTH}
                  required
                />
                <button
                  type="button"
                  className="role-eye-button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <img src={showPassword ? openEye : closeEye} alt="" />
                </button>
              </span>
            </label>

            <div className="role-login-options">
              <label className="role-checkbox">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                className="role-text-button"
                onClick={() => navigate('/forgot-password')}
              >
                Forgot password?
              </button>
            </div>

            <button type="submit" className="role-submit-button" disabled={loading}>
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>

          {errorMessage && (
            <p className="role-login-error" role="alert">{errorMessage}</p>
          )}

          <p className="role-signup-prompt">
            Don&apos;t have an account?{' '}
            <button
              type="button"
              className="role-text-button"
              onClick={() => navigate('/student-signup')}
            >
              Create account
            </button>
          </p>
        </div>
      </section>
    </main>
  );
}
