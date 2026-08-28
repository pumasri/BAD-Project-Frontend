import { useState, CSSProperties, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { campusImage, api, ApiError } from '../utils';

export function StudentSignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setMessage('Creating account...');

    try {
      await api.post('/auth/register', { email, name, password });
      setMessage('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/student-login');
      }, 1500);
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
          onSubmit={handleSubmit}
        >
          <label className="field">
            <span>Full Name</span>
            <input 
              type="text" 
              placeholder="e.g. John Doe" 
              value={name}
              onChange={e => setName(e.target.value)}
              required 
              disabled={isLoading}
            />
          </label>

          <label className="field">
            <span>AU Student Email</span>
            <input 
              type="email" 
              placeholder="uID@au.edu" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              required 
              disabled={isLoading}
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </label>

          <label className="field">
            <span>Confirm Password</span>
            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </label>

          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Student Account'}
          </button>

          {message && <p className="form-status">{message}</p>}
        </form>
      </section>
    </main>
  );
}
