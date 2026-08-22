import { useState } from 'react';
import type { CSSProperties, FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { campusImage } from '../utils';
import { resetPassword } from '../services/authService';
import { isValidPassword, MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH } from '../utils/authValidation';
import closeEye from '../assets/images/close-eye.png';
import openEye from '../assets/images/open-eye.png';

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [message, setMessage] = useState(token ? '' : 'This password reset link is invalid.');
  const [isError, setIsError] = useState(!token);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    setIsError(false);

    if (!token) {
      setIsError(true);
      setMessage('This password reset link is invalid.');
      return;
    }
    if (!isValidPassword(password)) {
      setIsError(true);
      setMessage(`Password must contain ${MIN_PASSWORD_LENGTH}–${MAX_PASSWORD_LENGTH} characters.`);
      return;
    }
    if (password !== confirmation) {
      setIsError(true);
      setMessage('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const response = await resetPassword(token, password);
      setMessage(response.message);
      setTimeout(() => navigate('/login', { replace: true }), 1200);
    } catch (error) {
      setIsError(true);
      setMessage(error instanceof Error ? error.message : 'Unable to reset password.');
    } finally {
      setLoading(false);
    }
  }

  function renderPasswordField(
    label: string,
    value: string,
    setValue: (value: string) => void,
    visible: boolean,
    toggle: () => void,
  ) {
    return (
      <label className="field">
        <span>{label}</span>
        <span className="role-password-wrapper">
          <input
            type={visible ? 'text' : 'password'}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            autoComplete="new-password"
            minLength={MIN_PASSWORD_LENGTH}
            maxLength={MAX_PASSWORD_LENGTH}
            required
          />
          <button type="button" className="role-eye-button" onClick={toggle} aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}>
            <img src={visible ? openEye : closeEye} alt="" />
          </button>
        </span>
      </label>
    );
  }

  return (
    <main className="page-shell" style={{ '--page-background-image': `url(${campusImage})` } as CSSProperties}>
      <section className="login-card">
        <button type="button" className="detail-back-button" onClick={() => navigate('/login')}>
          ← Back to Login
        </button>
        <div className="card-heading">
          <p className="eyebrow">ACCOUNT RECOVERY</p>
          <h1>Reset Password</h1>
          <p>Choose a new password containing at least {MIN_PASSWORD_LENGTH} characters.</p>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          {renderPasswordField('New password', password, setPassword, showPassword, () => setShowPassword((value) => !value))}
          {renderPasswordField('Confirm new password', confirmation, setConfirmation, showConfirmation, () => setShowConfirmation((value) => !value))}
          <button type="submit" className="submit-button" disabled={loading || !token}>
            {loading ? 'Resetting...' : 'Reset password'}
          </button>
          {message && <p className="form-status" role={isError ? 'alert' : 'status'}>{message}</p>}
        </form>
      </section>
    </main>
  );
}
