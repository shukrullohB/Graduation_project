import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { login as loginApi } from "../api/auth.api";
import { getApiErrorMessage } from "../api/http";
import { useToast } from "../context/ToastContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await loginApi({ email, password });
      const { access_token, user: userData } = res.data;

      login(access_token, userData);

      const dashboardPath =
        userData.role === "teacher" ? "/teacher" : "/student";
      navigate(dashboardPath, { replace: true });
    } catch (err) {
      const msg = getApiErrorMessage(
        err,
        "Invalid credentials. Please try again.",
      );
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
            Design-level experience. Classroom-level impact.
          </h1>
          <p
            style={{
              fontSize: "15px",
              lineHeight: "1.7",
              margin: 0,
              opacity: 0.75,
            }}
          >
            Build an assessment workflow that looks premium and performs under
            pressure. Streamline your grading process with AI-powered insights.
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
            Welcome Back
          </h2>
          <p
            style={{
              fontSize: "13px",
              color: "#555555",
              margin: "0 0 28px 0",
            }}
          >
            Sign in to ASAG Grading Platform
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
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            {/* EMAIL FIELD */}
            <div>
              <label
                htmlFor="login-email"
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
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                htmlFor="login-password"
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
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              }}
              onMouseEnter={(e) =>
                !loading && (e.currentTarget.style.background = "#0035CC")
              }
              onMouseLeave={(e) =>
                !loading && (e.currentTarget.style.background = "#0047FF")
              }
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* REGISTER LINK */}
          <p
            style={{
              fontSize: "13px",
              color: "#555555",
              marginTop: "24px",
              textAlign: "center",
              margin: "24px 0 0 0",
            }}
          >
            No account?{" "}
            <Link
              to="/register"
              style={{
                color: "#0047FF",
                fontWeight: "700",
                textDecoration: "none",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#0035CC")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#0047FF")}
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
