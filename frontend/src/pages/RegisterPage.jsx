import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register as registerApi } from "../api/auth.api";
import { getApiErrorMessage } from "../api/http";
import { useToast } from "../context/ToastContext";

export default function RegisterPage() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const sanitizedForm = {
      ...form,
      full_name: form.full_name.trim(),
      email: form.email.trim().toLowerCase(),
    };

    if (sanitizedForm.full_name.length < 2) {
      const msg = "Full name must be at least 2 characters";
      setError(msg);
      showToast(msg, "error");
      return;
    }

    if (sanitizedForm.password.length < 6) {
      const msg = "Password must be at least 6 characters";
      setError(msg);
      showToast(msg, "error");
      return;
    }

    setLoading(true);
    try {
      await registerApi(sanitizedForm);
      showToast("Account created! Please log in.", "success");
      navigate("/login");
    } catch (err) {
      const msg = getApiErrorMessage(err, "Registration failed");
      setError(msg);
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#FFF8E7",
      }}
    >
      {/* LEFT PANEL - BLUE */}
      <div
        style={{
          flex: 1,
          background: "#0047FF",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 40px",
          color: "#FFF8E7",
        }}
      >
        <div style={{ maxWidth: "400px" }}>
          <div
            style={{
              fontSize: "12px",
              letterSpacing: "0.12em",
              fontWeight: "600",
              marginBottom: "20px",
              opacity: 0.8,
            }}
          >
            AI-POWERED GRADING
          </div>
          <h1
            style={{
              fontSize: "42px",
              fontWeight: "700",
              lineHeight: "1.2",
              margin: "0 0 20px 0",
            }}
          >
            Join our community. Start grading smarter.
          </h1>
          <p
            style={{
              fontSize: "15px",
              lineHeight: "1.7",
              margin: 0,
              opacity: 0.75,
            }}
          >
            Create your account and experience the future of educational
            assessment. Get started in seconds.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL - CREAM */}
      <div
        style={{
          flex: 1,
          background: "#FFF8E7",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
        }}
      >
        {/* FORM CARD - WHITE WITH BLUE BORDER */}
        <div
          style={{
            background: "#FFFFFF",
            border: "2px solid #0047FF",
            borderRadius: "16px",
            padding: "40px",
            width: "100%",
            maxWidth: "360px",
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "#0A0A1A",
              margin: "0 0 8px 0",
            }}
          >
            Create Account
          </h2>
          <p
            style={{
              fontSize: "13px",
              color: "#555555",
              margin: "0 0 28px 0",
            }}
          >
            Join ASAG Grading Platform
          </p>

          {error && (
            <div
              style={{
                color: "#C92A2A",
                marginBottom: "20px",
                fontSize: "13px",
                background: "rgba(201,42,42,0.08)",
                border: "1px solid rgba(201,42,42,0.2)",
                padding: "12px 14px",
                borderRadius: "8px",
              }}
            >
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "18px" }}
          >
            {/* FULL NAME FIELD */}
            <div>
              <label
                htmlFor="register-name"
                style={{
                  display: "block",
                  color: "#0047FF",
                  fontSize: "12px",
                  letterSpacing: "0.08em",
                  marginBottom: "8px",
                  fontWeight: "600",
                }}
              >
                FULL NAME
              </label>
              <input
                id="register-name"
                type="text"
                value={form.full_name}
                onChange={(e) =>
                  setForm({ ...form, full_name: e.target.value })
                }
                minLength={2}
                required
                style={{
                  background: "#FFFFFF",
                  border: "1px solid rgba(0,71,255,0.2)",
                  padding: "12px 14px",
                  color: "#0A0A1A",
                  width: "100%",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                  borderRadius: "8px",
                  transition: "all 0.2s ease",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#0047FF";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px rgba(0,71,255,0.1)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(0,71,255,0.2)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            {/* EMAIL FIELD */}
            <div>
              <label
                htmlFor="register-email"
                style={{
                  display: "block",
                  color: "#0047FF",
                  fontSize: "12px",
                  letterSpacing: "0.08em",
                  marginBottom: "8px",
                  fontWeight: "600",
                }}
              >
                EMAIL
              </label>
              <input
                id="register-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                autoComplete="email"
                required
                style={{
                  background: "#FFFFFF",
                  border: "1px solid rgba(0,71,255,0.2)",
                  padding: "12px 14px",
                  color: "#0A0A1A",
                  width: "100%",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                  borderRadius: "8px",
                  transition: "all 0.2s ease",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#0047FF";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px rgba(0,71,255,0.1)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(0,71,255,0.2)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            {/* PASSWORD FIELD */}
            <div>
              <label
                htmlFor="register-password"
                style={{
                  display: "block",
                  color: "#0047FF",
                  fontSize: "12px",
                  letterSpacing: "0.08em",
                  marginBottom: "8px",
                  fontWeight: "600",
                }}
              >
                PASSWORD
              </label>
              <input
                id="register-password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                minLength="6"
                autoComplete="new-password"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid rgba(0,71,255,0.2)",
                  padding: "12px 14px",
                  color: "#0A0A1A",
                  width: "100%",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                  borderRadius: "8px",
                  transition: "all 0.2s ease",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#0047FF";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px rgba(0,71,255,0.1)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(0,71,255,0.2)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
              <p
                style={{
                  fontSize: "11px",
                  color: "#888888",
                  margin: "6px 0 0 0",
                }}
              >
                Minimum 6 characters
              </p>
            </div>

            {/* ROLE FIELD */}
            <div>
              <label
                htmlFor="register-role"
                style={{
                  display: "block",
                  color: "#0047FF",
                  fontSize: "12px",
                  letterSpacing: "0.08em",
                  marginBottom: "8px",
                  fontWeight: "600",
                }}
              >
                I AM A
              </label>
              <select
                id="register-role"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                style={{
                  background: "#FFFFFF",
                  border: "1px solid rgba(0,71,255,0.2)",
                  padding: "12px 14px",
                  color: "#0A0A1A",
                  width: "100%",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                  borderRadius: "8px",
                  transition: "all 0.2s ease",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#0047FF";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px rgba(0,71,255,0.1)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(0,71,255,0.2)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                background: "#0047FF",
                color: "#FFF8E7",
                border: "none",
                borderRadius: "8px",
                fontWeight: "700",
                fontSize: "14px",
                padding: "12px 16px",
                cursor: loading ? "not-allowed" : "pointer",
                textTransform: "uppercase",
                letterSpacing: "1.2px",
                transition: "all 0.2s ease",
                opacity: loading ? 0.6 : 1,
                marginTop: "6px",
              }}
              onMouseEnter={(e) =>
                !loading && (e.currentTarget.style.background = "#0035CC")
              }
              onMouseLeave={(e) =>
                !loading && (e.currentTarget.style.background = "#0047FF")
              }
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>

          {/* LOGIN LINK */}
          <p
            style={{
              fontSize: "13px",
              color: "#555555",
              textAlign: "center",
              margin: "20px 0 0 0",
            }}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              style={{
                color: "#0047FF",
                fontWeight: "700",
                textDecoration: "none",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#0035CC")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#0047FF")}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
