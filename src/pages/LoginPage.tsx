import { useState, useEffect, useRef, FormEvent, CSSProperties } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Role } from '../types';
import { api, ApiError, campusImage } from '../utils';

export function LoginPage({
  role,
  title,
  description,
  emailLabel,
  emailPlaceholder,
  onLogin,
}: {
  role: Role;
  title?: string;
  description?: string;
  emailLabel?: string;
  emailPlaceholder?: string;
  onLogin: (role: Role, redirectPath?: string) => void;
}) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const isStudent = role === 'student';
  const displayTitle = title || (isStudent ? 'Student Portal' : 'Staff Portal');
  const displayDescription = description || (isStudent
    ? 'Log in to report lost items or submit ownership claims.'
    : 'Log in to manage reported items and verify ownership claims.');

  const displayEmailLabel = emailLabel || (isStudent ? 'Student Email' : 'Staff Email');
  const displayEmailPlaceholder = emailPlaceholder || (isStudent
    ? 'e.g. u1234567@au.edu'
    : 'e.g. staffname@au.edu');

  const handoffAttempted = useRef(false);

  useEffect(() => {
    const code = searchParams.get('microsoft_handoff');
    const error = searchParams.get('microsoft_error');

    if (code && !handoffAttempted.current) {
      handoffAttempted.current = true;
      setIsLoading(true);
      setMessage('Completing Microsoft sign-in...');
      api.post('/auth/microsoft/exchange', { code })
        .then((response) => {
          localStorage.setItem('token', response.token);
          const roleStr = response.user.role.toLowerCase() as Role;
          onLogin(roleStr, response.redirect || undefined);
        })
        .catch((err) => {
          if (err instanceof ApiError) {
            setMessage(err.message);
          } else {
            setMessage('Microsoft authentication failed. Please try again.');
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else if (error) {
      if (error === 'account_inactive') {
        setMessage('Your Microsoft account is currently inactive.');
      } else {
        setMessage('Microsoft authentication failed. Please try again.');
      }
    }
  }, [searchParams, onLogin]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsLoading(true);
    setMessage('Signing in...');

    try {
      const response = await api.post('/auth/login', { email, password });
      
      localStorage.setItem('token', response.token);
      
      const meResponse = await api.get('/auth/me');
      const roleStr = meResponse.user.role.toLowerCase() as Role;
      const redirect = searchParams.get('redirect');
      onLogin(roleStr, redirect || undefined);
    } catch (error) {
      if (error instanceof ApiError) {
        setMessage(error.message);
      } else {
        setMessage('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
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

        <div className="card-heading">
          <p className="eyebrow">{displayTitle.toUpperCase()}</p>
          <h1>{displayTitle}</h1>
          <p>{displayDescription}</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>{displayEmailLabel}</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={displayEmailPlaceholder}
              required
              disabled={isLoading}
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={isLoading}
            />
          </label>

          <div className="form-row">
            <label className="checkbox">
              <input type="checkbox" disabled={isLoading} />
              <span>Keep me signed in</span>
            </label>

          <div className="role-login-form">
            <button
              type="button"
              className="text-link text-button"
              onClick={() => navigate('/forgot-password')}
              disabled={isLoading}
            >
              <span className="role-microsoft-mark" aria-hidden="true">
                <span /><span /><span /><span />
              </span>
              {loading ? 'Signing in...' : 'Sign in with Microsoft'}
            </button>
          </div>

          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Log in'}
          </button>

          {role === 'student' && (
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <span style={{ display: 'block', marginBottom: '0.75rem', color: '#666', fontSize: '0.875rem' }}>or</span>
              <button
                type="button"
                className="submit-button"
                style={{ backgroundColor: '#2F2F2F', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                onClick={() => {
                  const apiUrl = (import.meta as any).env.VITE_API_URL || 'http://localhost:5050';
                  const redirect = searchParams.get('redirect');
                  const redirectParam = redirect ? `?redirect=${encodeURIComponent(redirect)}` : '';
                  window.location.href = `${apiUrl}/api/auth/microsoft${redirectParam}`;
                }}
                disabled={isLoading}
              >
                <svg width="20" height="20" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
                  <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
                  <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
                  <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
                </svg>
                Sign in with Microsoft
              </button>
            </div>
          )}

          {message && <p className="form-status">{message}</p>}
        </form>
      </section>
    </main>
  );
}
