import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInAdmin, saveAdminLogin } from "../config/firebase.js";

const ADMIN_EMAIL = "traveladmin@gmail.com";

// Login component
const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Handle admin login
  const handleLogin = async (event) => {
    event.preventDefault();

    if (!email.trim() || !password) {
      setErrorMessage("Please enter email and password.");
      return;
    }

    // Check if entered email is the admin email
    if (email.trim().toLowerCase() !== ADMIN_EMAIL) {
      setErrorMessage("Unauthorized: not an admin account.");
      return;
    }

    setIsLoggingIn(true);
    setErrorMessage("");

    try {
      const loginData = await signInAdmin(email.trim(), password);
      saveAdminLogin(loginData);
      navigate("/");
    } catch (error) {
      setErrorMessage(error.message || "Login failed.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Logo */}
        <div className="text-center mb-4">
          <div className="auth-logo">
            <i className="fa-solid fa-plane-departure me-2"></i>
            TravelNest
          </div>
          <p className="text-muted small mt-1 mb-0">Admin Panel</p>
        </div>

        {/* Sign In tab */}
        <ul className="nav border-bottom mb-4">
          <li className="nav-item">
            <button
              type="button"
              className="nav-link border-0 px-4"
              style={{
                borderRadius: 0,
                background: "transparent",
                color: "var(--wn-teal)",
                fontWeight: 600,
                borderBottom: "2px solid var(--wn-teal)",
              }}
            >
              Sign In
            </button>
          </li>
        </ul>

        {/* Error message */}
        {errorMessage && (
          <div className="alert alert-danger py-2 small">{errorMessage}</div>
        )}

        <form onSubmit={handleLogin}>
          {/* Email input */}
          <div className="mb-3">
            <label className="form-label small fw-semibold">Email</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="fa-solid fa-envelope text-muted"></i>
              </span>
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="mb-4">
            <label className="form-label small fw-semibold">Password</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="fa-solid fa-lock text-muted"></i>
              </span>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />

              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i
                  className={
                    showPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"
                  }
                ></i>
              </button>
            </div>
          </div>

          {/* Login button */}
          <button
            type="submit"
            className="btn wn-btn-primary w-100 py-2"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Signing in...
              </>
            ) : (
              <>
                <i className="fa-solid fa-right-to-bracket me-2"></i>
                Sign In
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
