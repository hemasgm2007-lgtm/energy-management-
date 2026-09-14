import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Zap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle,
  ShieldCheck,
} from "lucide-react";

import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    remember: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (forgotPassword) {
      alert("Password reset link has been sent to your email.");
      return;
    }

    if (mode === "signup") {
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match.");
        return;
      }

      alert("Account created successfully.");
      setMode("signin");
      return;
    }

    navigate("/dashboard");
  };

  /* =====================================================
     FORGOT PASSWORD
     ===================================================== */

  if (forgotPassword) {
    return (
      <div className="login-page">

        <div className="login-background-overlay"></div>

        {/* BRAND */}

        <div className="login-brand">

          <div className="login-brand-icon">
            <Zap size={25} fill="currentColor" />
          </div>

          <div>
            <h2>Smart Energy</h2>
            <span>Monitoring System</span>
          </div>

        </div>


        {/* FORGOT CARD */}

        <div className="login-card forgot-card">

          <div className="login-card-icon">
            <ShieldCheck size={27} />
          </div>

          <h1>Forgot Password?</h1>

          <p>
            Enter your registered email address and
            we'll send you a password reset link.
          </p>


          <form onSubmit={handleSubmit}>

            <div className="login-field">

              <label>Email Address</label>

              <div className="input-wrapper">

                <Mail size={17} />

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>


            <button className="login-submit">

              Send Reset Link

              <ArrowRight size={17} />

            </button>

          </form>


          <button
            className="back-login"
            onClick={() => setForgotPassword(false)}
          >
            ← Back to Sign In
          </button>

        </div>

      </div>
    );
  }


  return (
    <div className="login-page">

      {/* =================================================
          BACKGROUND
          ================================================= */}

      <div className="login-background-overlay"></div>


      {/* =================================================
          BRAND
          ================================================= */}

      <div className="login-brand">

        <div className="login-brand-icon">
          <Zap size={25} fill="currentColor" />
        </div>

        <div>
          <h2>Smart Energy</h2>
          <span>Monitoring System</span>
        </div>

      </div>


      {/* =================================================
          LEFT CONTENT
          ================================================= */}

      <div className="login-intro">

        <div className="intro-badge">
          <CheckCircle size={15} />
          Smart Industrial Energy Management
        </div>

        <h1>
          Smarter Energy
          <br />
          for a Sustainable
          <br />
          Tomorrow
        </h1>

        <p>
          Monitor energy consumption, analyze machine
          performance and optimize operational efficiency
          with intelligent energy insights.
        </p>


        <div className="intro-features">

          <div>
            <Zap size={18} />
            <span>Real-time Monitoring</span>
          </div>

          <div>
            <CheckCircle size={18} />
            <span>AI-powered Optimization</span>
          </div>

          <div>
            <ShieldCheck size={18} />
            <span>Secure Energy Analytics</span>
          </div>

        </div>

      </div>


      {/* =================================================
          LOGIN CARD
          ================================================= */}

      <div className="login-card">

        <div className="login-card-icon">
          <Zap size={27} fill="currentColor" />
        </div>

        <h1>
          {mode === "signin"
            ? "Welcome Back"
            : "Create Account"}
        </h1>

        <p>
          {mode === "signin"
            ? "Sign in to your Smart Energy account"
            : "Create your Smart Energy monitoring account"}
        </p>


        {/* =================================================
            SIGN IN / SIGN UP
            ================================================= */}

        <div className="auth-tabs">

          <button
            className={mode === "signin" ? "active" : ""}
            onClick={() => setMode("signin")}
          >
            Sign In
          </button>

          <button
            className={mode === "signup" ? "active" : ""}
            onClick={() => setMode("signup")}
          >
            Sign Up
          </button>

        </div>


        {/* =================================================
            FORM
            ================================================= */}

        <form onSubmit={handleSubmit}>

          {mode === "signup" && (
            <div className="login-field">

              <label>Full Name</label>

              <div className="input-wrapper">

                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>
          )}


          <div className="login-field">

            <label>Email Address</label>

            <div className="input-wrapper">

              <Mail size={17} />

              <input
                type="email"
                name="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                required
              />

            </div>

          </div>


          <div className="login-field">

            <label>Password</label>

            <div className="input-wrapper">

              <Lock size={17} />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? (
                  <EyeOff size={17} />
                ) : (
                  <Eye size={17} />
                )}
              </button>

            </div>

          </div>


          {mode === "signup" && (
            <div className="login-field">

              <label>Confirm Password</label>

              <div className="input-wrapper">

                <Lock size={17} />

                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>
          )}


          {/* REMEMBER / FORGOT */}

          {mode === "signin" && (
            <div className="login-options">

              <label className="remember">

                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                />

                <span>Remember me</span>

              </label>


              <button
                type="button"
                className="forgot-link"
                onClick={() =>
                  setForgotPassword(true)
                }
              >
                Forgot Password?
              </button>

            </div>
          )}


          {/* SUBMIT */}

          <button
            type="submit"
            className="login-submit"
          >

            {mode === "signin"
              ? "Sign In"
              : "Create Account"}

            <ArrowRight size={17} />

          </button>

        </form>


        {/* =================================================
            SOCIAL LOGIN
            ================================================= */}

        {mode === "signin" && (
          <>

            <div className="login-divider">
              <span>or</span>
            </div>


            <button className="social-login">

              <strong>G</strong>

              Continue with Google

            </button>


            <button className="social-login">

              <strong className="microsoft-icon">
                ▦
              </strong>

              Continue with Microsoft

            </button>

          </>
        )}


        {/* =================================================
            BOTTOM
            ================================================= */}

        <div className="login-bottom">

          {mode === "signin" ? (
            <>
              Don't have an account?

              <button
                onClick={() => setMode("signup")}
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?

              <button
                onClick={() => setMode("signin")}
              >
                Sign In
              </button>
            </>
          )}

        </div>

      </div>


      {/* =================================================
          SECURITY
          ================================================= */}

      <div className="login-security">

        <ShieldCheck size={14} />

        Secure access to your energy management system

      </div>

    </div>
  );
}

export default Login;