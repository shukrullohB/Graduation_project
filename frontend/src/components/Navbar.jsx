import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ role }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const teacherLinks = [
    {
      to: "/teacher",
      label: "Dashboard",
      icon: "▦",
      hint: "Queue and overview",
      end: true,
    },
    {
      to: "/teacher/create-question",
      label: "Create",
      icon: "+",
      hint: "Design prompts",
    },
    {
      to: "/teacher/analytics",
      label: "Analytics",
      icon: "◔",
      hint: "Patterns and trends",
    },
  ];

  const studentLinks = [
    {
      to: "/student",
      label: "Dashboard",
      icon: "▦",
      hint: "Progress overview",
      end: true,
    },
    {
      to: "/student/my-answers",
      label: "My Answers",
      icon: "✎",
      hint: "Recent submissions",
    },
    {
      to: "/student/analytics",
      label: "Analytics",
      icon: "◔",
      hint: "Performance snapshots",
    },
  ];

  const links = role === "teacher" ? teacherLinks : studentLinks;
  const pageTitle = role === "teacher" ? "Teaching Command" : "Learning Studio";
  const pageLabel = role === "teacher" ? "Teacher Control" : "Student Portal";
  const profileName = user?.name || user?.username || user?.email?.split("@")[0] || "User";

  const initials = profileName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="relative flex min-h-screen gap-6">
      <aside className="glass-panel-strong sticky top-6 hidden h-[calc(100vh-3rem)] w-[290px] flex-col overflow-hidden p-5 lg:flex">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,248,231,0.16),transparent_28%)]" />

        <div className="relative flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#16c9ff,#17e3c3,#3f7bff)] text-lg font-black text-white shadow-[0_16px_34px_rgba(21,142,205,0.34)]">
            AS
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-white/72">
              {pageLabel}
            </p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-[#FFF8E7]">
              {pageTitle}
            </h2>
          </div>
        </div>

        <div className="relative mt-8 rounded-[28px] border border-white/14 bg-white/8 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          <div className="grid gap-2">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  isActive
                    ? "group flex items-center gap-3 rounded-2xl border border-white/20 bg-[#FFF8E7] px-4 py-3 text-[#0047FF] shadow-[0_18px_38px_rgba(0,71,255,0.18)]"
                    : "group flex items-center gap-3 rounded-2xl border border-transparent px-4 py-3 text-white/82 transition duration-150 hover:border-white/12 hover:bg-white/8 hover:text-[#FFF8E7]"
                }
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/12 bg-white/10 text-base text-inherit">
                  {link.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold">{link.label}</span>
                  <span className="block truncate text-[11px] text-inherit/70">
                    {link.hint}
                  </span>
                </span>
              </NavLink>
            ))}
          </div>
        </div>

        <div className="relative mt-auto overflow-hidden rounded-[28px] border border-white/16 bg-[linear-gradient(160deg,rgba(255,255,255,0.14),rgba(255,255,255,0.08))] p-5">
          <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />
          <p className="text-xs uppercase tracking-[0.24em] text-white/72">
            AI-first workflow
          </p>
          <h3 className="mt-3 text-lg font-semibold text-[#FFF8E7]">
            Faster review loops
          </h3>
          <p className="mt-2 text-sm leading-6 text-white/78">
            Keep grading, question design, and insight panels inside one cleaner control surface.
          </p>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="glass-panel sticky top-6 z-40 flex min-h-[88px] items-center justify-between gap-4 px-5 py-4 md:px-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-[#0047FF]/72">
              {pageLabel}
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#16305F]">
              {pageTitle}
            </h1>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3">
            {role === "teacher" && (
              <button
                onClick={() => navigate("/teacher/create-question")}
                className="group relative flex h-[52px] w-[52px] items-center justify-start overflow-hidden rounded-full border border-[#4A7FFF]/22 bg-[linear-gradient(144deg,#2A6BFF,#2255F5_50%,#17C8FF)] text-white shadow-[0_18px_34px_rgba(0,71,255,0.24)] transition-all duration-300 hover:w-[184px] active:translate-x-[2px] active:translate-y-[2px]"
                type="button"
                aria-label="Create new question"
              >
                <span className="flex h-full w-full shrink-0 items-center justify-center text-[30px] font-light transition-all duration-300 group-hover:w-[30%] group-hover:justify-start group-hover:pl-[16px]">
                  +
                </span>
                <span className="absolute right-0 w-0 overflow-hidden whitespace-nowrap pr-0 text-sm font-semibold opacity-0 transition-all duration-300 group-hover:w-[70%] group-hover:pr-[18px] group-hover:opacity-100">
                  New Question
                </span>
              </button>
            )}

            <div className="flex items-center gap-3 rounded-[26px] border border-[#0047FF]/14 bg-white/85 px-3 py-2">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#16c9ff,#3f7bff)] text-sm font-bold text-white shadow-[0_10px_24px_rgba(21,142,205,0.28)]">
                {initials}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#16305F]">{profileName}</p>
                <p className="text-xs uppercase tracking-[0.22em] text-[#6F7F9D]">
                  {role}
                </p>
              </div>
            </div>

            <button onClick={handleLogout} className="logout-fab" type="button" aria-label="Logout">
              <span className="logout-fab__sign" aria-hidden="true">
                <svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M377.9 105.9L500.7 228.7C507 235 512 244.5 512 256C512 267.5 507 277 500.7 283.3L377.9 406.1C365.4 418.6 345.1 418.6 332.6 406.1C320.1 393.6 320.1 373.3 332.6 360.8L400.1 293.3H192C174.3 293.3 160 279 160 261.3C160 243.6 174.3 229.3 192 229.3H400.1L332.6 161.8C320.1 149.3 320.1 129 332.6 116.5C345.1 94.4 365.4 93.4 377.9 105.9ZM160 96H96C78.3 96 64 110.3 64 128V384C64 401.7 78.3 416 96 416H160C177.7 416 192 430.3 192 448C192 465.7 177.7 480 160 480H96C43 480 0 437 0 384V128C0 75 43 32 96 32H160C177.7 32 192 46.3 192 64C192 81.7 177.7 96 160 96Z"
                    fill="white"
                  />
                </svg>
              </span>
              <span className="logout-fab__text">Logout</span>
            </button>
          </div>
        </header>

        <main className="pt-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
