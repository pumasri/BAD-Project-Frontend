import { useState, type FormEvent } from "react";
import userIcon from "../assets/images/user-icon.png";
import "./LoginForm.css";

function LoginForm() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(true);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log({
      username,
      password,
      rememberMe,
    });
  };

  return (
    <div className="login-container">
      <div className="login-card-wrapper">
        <div className="profile-circle">
          <img src={userIcon} alt="User" />
        </div>

        <div className="login-card">
          <h1>ABAC Campus</h1>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="USERNAME"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="login-input"
              autoComplete="username"
            />

            <input
              type="password"
              placeholder="PASSWORD"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              autoComplete="current-password"
            />

            <button type="submit" className="login-button">
              LOGIN
            </button>

            <label className="remember-section">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />

              <span>Remember me</span>
            </label>
          </form>
        </div>
      </div>

      <button type="button" className="forgot-password">
        Forgot password?
      </button>

      <div className="signup-section">
        <span>Do not have an account yet?</span>

        <button type="button">CREATE ACCOUNT</button>
      </div>
    </div>
  );
}

export default LoginForm;