import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { login as loginApi } from "../api/auth.api";
import { useToast } from "../context/ToastContext";
import { DEMO_MODE } from "../api/mockData";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginApi(form);
      login(res.data.access_token, res.data.user);
      navigate("/");
    } catch (err) {
      showToast(err.response?.data?.detail || "Login failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">&#127891;</div>
          <h1>Welcome back</h1>
          <p>Sign in to ASAG Intelligent Grading Platform</p>
        </div>
        {DEMO_MODE && (
          <div className="demo-hint">
            &#128273; Demo mode: use <strong>student</strong> or{" "}
            <strong>teacher</strong> as email, any password.
          </div>
        )}
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn auth-submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
          <p className="auth-switch">
            Don&apos;t have an account? <Link to="/register">Create one</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
