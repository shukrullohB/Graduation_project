import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { login } from "../api/auth.api";
import { isTeacher, setAuth } from "../store/authStore";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });

  const { mutate, isPending, error } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setAuth({ token: data.access_token, user: data.user });
      const from = location.state?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
        return;
      }
      if (isTeacher(data.user)) {
        navigate("/teacher/review", { replace: true });
      } else {
        navigate("/student", { replace: true });
      }
    },
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.email.trim() || !form.password.trim()) return;
    mutate({ email: form.email, password: form.password });
  };

  return (
    <div className="page page--centered">
      <div className="card auth-card">
        <h1>Sign in</h1>
        <p className="muted">
          Access the Intelligent Short Answer Grading platform.
        </p>
        <form className="form" onSubmit={handleSubmit}>
          <label className="form__field">
            <span>Email</span>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </label>
          <label className="form__field">
            <span>Password</span>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </label>
          {error && (
            <div className="error">Login failed. Please try again.</div>
          )}
          <button className="btn" type="submit" disabled={isPending}>
            {isPending ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
