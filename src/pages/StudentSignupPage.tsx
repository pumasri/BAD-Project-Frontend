import { useState } from 'react';
import type { CSSProperties, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { campusImage } from '../utils';
import { registerStudent } from '../services/authService';
import closeEye from '../assets/images/close-eye.png';
import openEye from '../assets/images/open-eye.png';
import { isAuStudentEmail, isValidPassword, MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH } from '../utils/authValidation';

export function StudentSignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    setMessage('');
    setIsError(false);

    if (!isAuStudentEmail(normalizedEmail)) {
      setIsError(true);
      setMessage('Enter a valid AU email, such as u1234567@au.edu.');
      return;
    }

    if (password !== confirmPassword) {
      setIsError(true);
      setMessage('Passwords do not match.');
      return;
    }

    if (!isValidPassword(password)) {
      setIsError(true);
      setMessage(`Password must contain ${MIN_PASSWORD_LENGTH}–${MAX_PASSWORD_LENGTH} characters.`);
      return;
    }

    setLoading(true);

    try {
      await registerStudent(normalizedEmail, name.trim(), password);
      setMessage('Account created. You can now log in.');
    } catch (error) {
      setIsError(true);
      setMessage(error instanceof Error ? error.message : 'Registration failed.');
    } finally {
      setLoading(false);
    }
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
          onClick={() => navigate('/login')}
        >
          ← Back to Login
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
          onSubmit={handleSubmit}
        >
          <label className="field">
            <span>Full Name</span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your full name"
              autoComplete="name"
              maxLength={120}
              required
            />
          </label>

          <label className="field">
            <span>AU Student Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="u1234567@au.edu"
              autoComplete="email"
              pattern="[uU][0-9]{7}@au\.edu"
              maxLength={254}
              required
            />
          </label>

          <label className="field">
            <span>Password</span>
            <span className="role-password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Create a password"
                autoComplete="new-password"
                minLength={MIN_PASSWORD_LENGTH}
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

          <label className="field">
            <span>Confirm Password</span>
            <span className="role-password-wrapper">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Confirm your password"
                autoComplete="new-password"
                minLength={MIN_PASSWORD_LENGTH}
                maxLength={MAX_PASSWORD_LENGTH}
                required
              />
              <button
                type="button"
                className="role-eye-button"
                onClick={() => setShowConfirmPassword((current) => !current)}
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              >
                <img src={showConfirmPassword ? openEye : closeEye} alt="" />
              </button>
            </span>
          </label>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Student Account'}
          </button>

          {message && (
            <p className="form-status" role={isError ? 'alert' : 'status'}>
              {message}
            </p>
          )}
        </form>
      </section>
    </main>
  );
}
