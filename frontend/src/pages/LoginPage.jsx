import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { login as loginApi } from "../api/auth.api";
import { getApiErrorMessage } from "../api/http";
import { useToast } from "../context/ToastContext";
import { DEMO_MODE } from "../api/mockData";
import FloatingField from "../components/ui/FloatingField";
import GlassPanel from "../components/ui/GlassPanel";
import PageTransition from "../components/ui/PageTransition";
import InteractiveTilt from "../components/ui/InteractiveTilt";

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
      showToast(getApiErrorMessage(err, "Login failed"), "error");
    } finally {
      setLoading(false);
    }
  };

  const challengeCards = [
    {
      challenge: "Deadlines are close, but team bandwidth is thin",
      outcome: "Spin up AI-assisted grading workflows in minutes.",
    },
    {
      challenge: "Your product scales, but feedback quality drops",
      outcome: "Keep scoring consistency with live review intelligence.",
    },
    {
      challenge: "You need to launch improvements fast",
      outcome: "Ship confident iterations with real-time analytics.",
    },
  ];

  return (
    <PageTransition className="stage-spotlight relative min-h-screen px-4 py-8 md:px-6">
      <div className="mx-auto grid min-h-[90vh] w-full max-w-[1240px] items-center gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <GlassPanel className="cinematic-hero relative hidden overflow-hidden p-8 lg:flex lg:min-h-[640px] lg:flex-col lg:justify-between">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gradient-to-br from-white/50 to-transparent blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-gradient-to-br from-cyan-300/35 to-transparent blur-3xl" />

          <div className="relative z-10 max-w-xl">
            <span className="inline-flex rounded-full border border-white/30 bg-white/35 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700 dark:text-slate-100">
              AI-Powered Grading
            </span>
            <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.03] tracking-tight text-slate-900 dark:text-slate-50">
              Design-level experience.
              <br />
              Classroom-level impact.
            </h1>
            <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-slate-600 dark:text-slate-200">
              Build an assessment workflow that looks premium and performs under
              pressure, from first submission to final feedback.
            </p>
            <div className="mt-6 inline-flex items-center rounded-full border border-white/30 bg-white/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-700 dark:text-slate-200">
              Future-ready Learning Platform
            </div>
          </div>

          <div className="relative z-10 grid gap-3">
            {challengeCards.map((item, i) => (
              <InteractiveTilt
                key={item.challenge}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.08, duration: 0.35 }}
                className="control-module rounded-2xl p-4"
              >
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500 dark:text-slate-300">
                  Challenge
                </p>
                <p className="mt-1 text-sm font-medium leading-relaxed text-slate-800 dark:text-slate-100">
                  {item.challenge}
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.14em] text-brand-700 dark:text-cyan-300">
                  Outcome
                </p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  {item.outcome}
                </p>
              </InteractiveTilt>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel
          className="glass-panel-strong stage-spotlight mx-auto w-full max-w-[500px] p-6 sm:p-8"
          delay={0.05}
        >
          <div className="mx-auto mb-7 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-brand-600 via-indigo-500 to-cyanx-500 text-2xl text-white shadow-glow">
            🎓
          </div>
          <div className="text-center">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
              Sign in to ASAG Intelligent Grading Platform
            </p>
          </div>

          {DEMO_MODE && (
            <div className="mt-5 rounded-2xl border border-amber-300/50 bg-amber-100/70 px-4 py-3 text-sm text-amber-900 dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-100">
              Demo mode: use <strong>student</strong> or{" "}
              <strong>teacher</strong> as email.
            </div>
          )}

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <FloatingField
              id="login-email"
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <FloatingField
              id="login-password"
              label="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />

            <motion.button
              whileTap={{ scale: 0.985 }}
              type="submit"
              className="btn-premium mt-2 w-full"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </motion.button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-300">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-brand-600 transition hover:text-brand-700"
            >
              Create one
            </Link>
          </p>
        </GlassPanel>
      </div>
    </PageTransition>
  );
}
