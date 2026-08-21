import { useState, CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { campusImage } from '../utils';

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

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
          ← Back to Login
        </button>

        <div className="card-heading">
          <p className="eyebrow">ACCOUNT RECOVERY</p>
          <h1>Forgot Password?</h1>
          <p>
            Enter your email address and we will send you instructions to reset your password.
          </p>
        </div>

        <form
          className="login-form"
          onSubmit={(event) => {
            event.preventDefault();
            setMessage(
              'Password reset will be connected to the authentication backend soon.',
            );
          }}
        >
          <label className="field">
            <span>Email Address</span>
            <input
              type="email"
              placeholder="Enter your email"
              required
            />
          </label>

          <button type="submit" className="submit-button">
            Send Reset Instructions
          </button>

          {message && <p className="form-status">{message}</p>}
        </form>
      </section>
    </main>
  );
}
