import { useState, type FormEvent } from "react";
import userIcon from "../assets/images/abacCampus.jpeg";
import closeEye from "../assets/images/close-eye.png";
import openEye from "../assets/images/open-eye.png";
import microsoftTeamsIcon from "../assets/images/microsoftT.png";
import "./LoginForm.css";

function LoginForm() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [microsoftError, setMicrosoftError] = useState<string>("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log({
      username,
      password,
      rememberMe,
    });
  };

  const handleMicrosoftLogin = () => {
    const microsoftLoginUrl = import.meta.env.VITE_MICROSOFT_LOGIN_URL;

    if (!microsoftLoginUrl) {
      setMicrosoftError("Microsoft sign-in is not configured yet.");
      return;
    }

    window.location.assign(microsoftLoginUrl);
  };

  return (
    <div className="login-container">
      <aside className="campus-panel">
        <img src={userIcon} alt="ABAC Campus" className="campus-image" />
        <div className="campus-overlay" />
        <div className="brand-mark" aria-hidden="true">AU</div>
        <div className="campus-copy">
          <span className="eyebrow">Welcome to</span>
          <h2>ABAC Campus</h2>
          <p>Your campus, connected.</p>
        </div>
        <div className="campus-location">Assumption University</div>
      </aside>

      <main className="login-card">
        <div className="mobile-brand">
          <span className="brand-mark brand-mark-small" aria-hidden="true">AU</span>
          <span>ABAC Campus</span>
        </div>

        <div className="form-heading">
          <span className="eyebrow">Member access</span>
          <h1>Welcome back</h1>
          <p>Sign in to continue to your campus portal.</p>
        </div>

        <form onSubmit={handleSubmit}>
            <label className="field-label" htmlFor="username">Email or username</label>
            {/* Username */}
            <input
              id="username"
              type="text"
              placeholder="Email or Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="login-input"
              autoComplete="username"
            />

            {/* Password */}
            <label className="field-label" htmlFor="password">Password</label>
            <div className="password-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input password-input"
                autoComplete="current-password"
              />

              <button
                type="button"
                className="eye-button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <img
                  src={showPassword ? openEye : closeEye}
                  alt=""
                  className="eye-icon"
                />
              </button>
            </div>

            {/* Login */}
            <button type="submit" className="login-button">
              Log in
            </button>

            {/* Remember Me + Forgot Password */}
            <div className="login-options">
              <label className="remember-section">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>

              <button type="button" className="forgot-password">
                Forgot password?
              </button>
            </div>
        </form>

        <div className="login-divider" aria-hidden="true">
          <span>or continue with</span>
        </div>

        <button
          type="button"
          className="microsoft-login-button"
          onClick={handleMicrosoftLogin}
        >
          <span className="microsoft-icon-wrap">
            <img src={microsoftTeamsIcon} alt="" />
          </span>
          <span>Sign in with Microsoft Teams</span>
        </button>

        {microsoftError && (
          <p className="microsoft-error" role="status">{microsoftError}</p>
        )}

        <p className="secure-note"><span aria-hidden="true">●</span> Secure campus access</p>
      </main>
    </div>
  );
}

export default LoginForm;
