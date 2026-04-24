import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { register as registerApi } from "../api/auth.api";
import { getApiErrorMessage } from "../api/http";
import { useToast } from "../context/ToastContext";
import FloatingField from "../components/ui/FloatingField";
import GlassPanel from "../components/ui/GlassPanel";
import PageTransition from "../components/ui/PageTransition";

export default function RegisterPage() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      showToast("Password must be at least 6 characters", "error");
      return;
    }

    setLoading(true);
    try {
      await registerApi(form);
      showToast("Account created! Please log in.", "success");
      navigate("/login");
    } catch (err) {
      showToast(getApiErrorMessage(err, "Registration failed"), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition className="relative min-h-screen px-4 py-8 md:px-6">
      <div className="mx-auto flex min-h-[90vh] w-full max-w-[680px] items-center justify-center">
        <GlassPanel className="glass-panel-strong w-full p-6 sm:p-8">
          <div className="mx-auto mb-7 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-brand-600 via-indigo-500 to-cyanx-500 text-2xl text-white shadow-glow">
            ✨
          </div>
          <div className="text-center">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              Create account
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
              Join the ASAG Intelligent Grading Platform
            </p>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <FloatingField
              id="register-name"
              label="Full Name"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              required
            />
            <FloatingField
              id="register-email"
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <FloatingField
              id="register-password"
              label="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <FloatingField
              id="register-role"
              label="Role"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              required
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </FloatingField>

            <motion.button
              whileTap={{ scale: 0.985 }}
              type="submit"
              className="btn-premium mt-2 w-full"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create Account"}
            </motion.button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-300">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-brand-600 transition hover:text-brand-700"
            >
              Sign in
            </Link>
          </p>
        </GlassPanel>
      </div>
    </PageTransition>
  );
}
