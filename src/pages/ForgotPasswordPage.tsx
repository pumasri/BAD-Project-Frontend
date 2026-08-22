import { useState } from 'react';
import type { CSSProperties, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { campusImage } from '../utils';
import { requestPasswordReset } from '../services/authService';
import { isAuEmail } from '../utils/authValidation';

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    setMessage('');
    setIsError(false);

    if (!isAuEmail(normalizedEmail)) {
      setIsError(true);
      setMessage('Enter a valid @au.edu email address.');
      return;
    }

    setLoading(true);
    try {
      const response = await requestPasswordReset(normalizedEmail);
      setMessage(response.message);
    } catch (error) {
      setIsError(true);
      setMessage(error instanceof Error ? error.message : 'Unable to request a reset link.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-shell" style={{ '--page-background-image': `url(${campusImage})` } as CSSProperties}>
      <section className="login-card">
        <button type="button" className="detail-back-button" onClick={() => navigate('/login')}>
          ← Back to Login
        </button>
        <div className="card-heading">
          <p className="eyebrow">ACCOUNT RECOVERY</p>
          <h1>Forgot Password?</h1>
          <p>Enter your AU email and we will send password-reset instructions.</p>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="user@au.edu"
              autoComplete="email"
              pattern="[^\s@]+@au\.edu"
              maxLength={254}
              required
            />
          </label>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Sending...' : 'Send reset link'}
          </button>
          {message && <p className="form-status" role={isError ? 'alert' : 'status'}>{message}</p>}
        </form>
      </section>
    </main>
  );
}
