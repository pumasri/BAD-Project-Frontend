import { useState, CSSProperties, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { campusImage, api, ApiError } from '../utils';

export function StudentSignupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'REGISTER' | 'VERIFY'>('REGISTER');
  
  // Registration form state
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Verification form state
  const [otpCode, setOtpCode] = useState('');
  
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setMessage('Creating account...');

    try {
      await api.post('/auth/register', { email, name, password });
      setMessage('Account created! Please check your email for the verification code.');
      setStep('VERIFY');
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

  async function handleVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    
    setIsLoading(true);
    setMessage('Verifying code...');

    try {
      await api.post('/auth/verify-otp', { email, code: otpCode });
      setMessage('Email verified successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/student-login');
      }, 1500);
    } catch (error) {
      if (error instanceof ApiError) {
        setMessage(error.message);
      } else {
        setMessage('Invalid or expired verification code.');
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
          <h1>{step === 'REGISTER' ? 'Create Account' : 'Verify Email'}</h1>
          <p>
            {step === 'REGISTER' 
              ? 'Join the campus network to claim and report items.' 
              : `We sent a 6-digit code to ${email}. Check your backend terminal output in development mode to see the code.`}
          </p>
        </div>

        {step === 'REGISTER' && (
          <form onSubmit={handleRegister}>
            <label className="field">
              <span>Full Name</span>
              <input
                type="text"
                placeholder="John Doe"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label className="field">
              <span>University Email</span>
              <input
                type="email"
                placeholder="u1234567@au.edu"
                required
                pattern="^u[0-9]{7}@au\.edu$"
                title="Must be an AU email address like u1234567@au.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label className="field">
              <span>Password</span>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <label className="field">
              <span>Confirm Password</span>
              <input
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </label>
            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Sign Up'}
            </button>
          </form>
        )}

        {step === 'VERIFY' && (
          <form onSubmit={handleVerify}>
            <label className="field">
              <span>6-Digit Verification Code</span>
              <input
                type="text"
                placeholder="123456"
                required
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                style={{ fontSize: '1.25rem', letterSpacing: '4px', textAlign: 'center' }}
              />
            </label>
            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>
        )}

        {message && (
          <div className="login-error" style={{ color: message.includes('success') ? '#2e7d32' : undefined }}>
            {message}
          </div>
        )}
      </section>
    </main>
  );
}
