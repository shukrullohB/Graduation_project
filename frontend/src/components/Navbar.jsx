import { useMemo, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useMotionIntensity } from "../context/MotionContext";
import InteractiveTilt from "./ui/InteractiveTilt";

function BrandIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M4 13.5 12 4l8 9.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M6.5 12.5V20h11v-7.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="12" cy="13" r="1.2" fill="currentColor" />
    </svg>
  );
}

function SideIcon({ d }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-[18px] w-[18px]"
      aria-hidden="true"
    >
      <path
        d={d}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const linkIcons = {
  dashboard: "M4 13h7V4H4zM13 20h7v-9h-7zM13 11h7V4h-7zM4 20h7v-5H4z",
  answers:
    "M8 7h8M8 12h8M8 17h5M6 4h12a2 2 0 0 1 2 2v12l-3-2-3 2-3-2-3 2V6a2 2 0 0 1 2-2Z",
  analytics: "M4 19h16M7 16v-4M12 16V8M17 16v-7",
  create: "M12 5v14M5 12h14",
};

function MoonSunIcon({ dark }) {
  if (dark) {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-[18px] w-[18px]"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 1 0 9.8 9.8Z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.2 2.2M16.9 16.9l2.2 2.2M4.9 19.1l2.2-2.2M16.9 7.1l2.2-2.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MotionIcon({ mode }) {
  if (mode === "calm") {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-[18px] w-[18px]"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M3 13c3.2 0 3.2-3.8 6.4-3.8S12.6 13 15.8 13s3.2-3.8 6.4-3.8"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 14c2.2 0 2.2-4.8 4.4-4.8S9.6 14 11.8 14s2.2-4.8 4.4-4.8S18.4 14 20.6 14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="3" cy="14" r="1" fill="currentColor" />
      <circle cx="7.4" cy="9.2" r="1" fill="currentColor" />
      <circle cx="11.8" cy="14" r="1" fill="currentColor" />
      <circle cx="16.2" cy="9.2" r="1" fill="currentColor" />
      <circle cx="20.6" cy="14" r="1" fill="currentColor" />
    </svg>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const { mode, toggleMode } = useMotionIntensity();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );

  if (!user) return null;

  const links = useMemo(() => {
    if (user.role === "teacher") {
      return [
        { to: "/teacher", label: "Dashboard", icon: "dashboard", end: true },
        { to: "/teacher/create-question", label: "Create", icon: "create" },
        { to: "/teacher/analytics", label: "Analytics", icon: "analytics" },
      ];
    }

    return [
      { to: "/student", label: "Dashboard", icon: "dashboard", end: true },
      { to: "/student/my-answers", label: "My Answers", icon: "answers" },
      { to: "/student/analytics", label: "Analytics", icon: "analytics" },
    ];
  }, [user.role]);

  const initials = (user.username || user.email || "U")
    .slice(0, 2)
    .toUpperCase();

  const workspaceLabel =
    user.role === "teacher" ? "Teacher Control" : "Student Flow";

  const toggleTheme = () => {
    const nextDark = !dark;
    setDark(nextDark);
    document.documentElement.classList.toggle("dark", nextDark);
    localStorage.setItem("theme", nextDark ? "dark" : "light");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navBlock = (
    <div className="flex h-full flex-col p-4">
      <InteractiveTilt maxTilt={5}>
        <Link
          to="/"
          className="glass-panel-strong flex items-center gap-3 px-3 py-3"
        >
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-brand-600 via-indigo-500 to-cyanx-500 text-white shadow-glow">
            <BrandIcon />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight">
              ASAG Platform
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-300">
              {workspaceLabel}
            </p>
          </div>
        </Link>
      </InteractiveTilt>

      <nav className="mt-5 space-y-1">
        {links.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "sidebar-link-active" : ""}`
            }
          >
            <SideIcon d={linkIcons[item.icon]} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <InteractiveTilt className="mt-auto" maxTilt={4}>
        <div className="glass-panel p-4 text-xs text-slate-500 dark:text-slate-300">
          <p className="font-semibold text-slate-700 dark:text-slate-100">
            AI-First Workflow
          </p>
          <p className="mt-1 leading-relaxed">
            Fast feedback loops, richer analytics, and calmer grading.
          </p>
        </div>
      </InteractiveTilt>
    </div>
  );

  const isAuthRoute =
    location.pathname === "/login" || location.pathname === "/register";
  if (isAuthRoute) return null;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40">
        <div className="mx-auto flex w-full max-w-[1500px] items-center gap-3 px-4 pt-4 md:px-6 lg:pl-[19.5rem] lg:pr-8">
          <InteractiveTilt className="w-full" maxTilt={3}>
            <div className="glass-panel-strong flex h-16 w-full items-center justify-between px-4 md:px-5">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMobileOpen(true)}
                  className="btn-ghost lg:hidden"
                  aria-label="Open sidebar"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-[18px] w-[18px]"
                    fill="none"
                  >
                    <path
                      d="M4 7h16M4 12h16M4 17h12"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500 dark:text-slate-300">
                    {workspaceLabel}
                  </p>
                  <h1 className="font-display text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                    {user.role === "teacher"
                      ? "Command Center"
                      : "Learning Dashboard"}
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {user.role === "teacher" && (
                  <Link
                    to="/teacher/create-question"
                    className="btn-ghost hidden sm:inline-flex"
                  >
                    + New Question
                  </Link>
                )}
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="btn-ghost"
                  aria-label="Toggle theme"
                >
                  <MoonSunIcon dark={dark} />
                </button>
                <button
                  type="button"
                  onClick={toggleMode}
                  className="btn-ghost"
                  aria-label={`Motion mode: ${mode}. Click to switch`}
                  title={`Motion mode: ${mode === "calm" ? "Calm" : "Normal"}`}
                >
                  <MotionIcon mode={mode} />
                  <span className="hidden sm:inline">
                    {mode === "calm" ? "Calm" : "Motion"}
                  </span>
                </button>
                <div className="glass-panel hidden items-center gap-3 px-3 py-2 md:flex">
                  <div className="text-right">
                    <p className="text-sm font-semibold leading-tight text-slate-900 dark:text-slate-100">
                      {user.username || user.email}
                    </p>
                    <p className="text-xs capitalize text-slate-500 dark:text-slate-300">
                      {user.role}
                    </p>
                  </div>
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-600 via-indigo-500 to-cyanx-500 text-xs font-semibold text-white">
                    {initials}
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.985 }}
                  type="button"
                  onClick={handleLogout}
                  className="btn-ghost"
                >
                  Logout
                </motion.button>
              </div>
            </div>
          </InteractiveTilt>
        </div>
      </header>

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[18rem] p-4 lg:block">
        {navBlock}
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close sidebar"
              className="fixed inset-0 z-40 bg-slate-900/45 lg:hidden"
              onClick={() => setMobileOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-[18rem] p-3 lg:hidden"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 380, damping: 36 }}
            >
              {navBlock}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
