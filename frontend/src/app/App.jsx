import Navbar from "../components/Navbar";
import AppRoutes from "./routes";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import FuturisticBackground from "../components/ui/FuturisticBackground";

const VISUAL_THEMES = [
  { key: "ocean-neon", label: "Ocean Neon" },
  { key: "emerald-aurora", label: "Emerald Aurora" },
  { key: "cyber-magenta", label: "Cyber Magenta" },
];

export default function App() {
  const { loading, user } = useAuth();
  const location = useLocation();
  const [visualTheme, setVisualTheme] = useState(() => {
    const saved = localStorage.getItem("visualTheme");
    return VISUAL_THEMES.some((item) => item.key === saved)
      ? saved
      : "ocean-neon";
  });
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";
  const hasShell = Boolean(user) && !isAuthPage;

  const activeVisualLabel =
    VISUAL_THEMES.find((item) => item.key === visualTheme)?.label ||
    "Ocean Neon";

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      return;
    }

    if (saved === "light") {
      document.documentElement.classList.remove("dark");
      return;
    }

    document.documentElement.classList.add("dark");
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-visual-theme", visualTheme);
    localStorage.setItem("visualTheme", visualTheme);
  }, [visualTheme]);

  const cycleVisualTheme = () => {
    setVisualTheme((current) => {
      const idx = VISUAL_THEMES.findIndex((item) => item.key === current);
      const next = VISUAL_THEMES[(idx + 1) % VISUAL_THEMES.length];
      return next.key;
    });
  };

  useEffect(() => {
    const onPress = (event) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const button = target.closest("button, .btn-premium, .btn-ghost");
      if (!button || !(button instanceof HTMLElement) || button.disabled) {
        return;
      }

      const rect = button.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / Math.max(rect.width, 1)) * 100;
      const y = ((event.clientY - rect.top) / Math.max(rect.height, 1)) * 100;
      button.style.setProperty(
        "--burst-x",
        `${Math.max(0, Math.min(100, x)).toFixed(2)}%`,
      );
      button.style.setProperty(
        "--burst-y",
        `${Math.max(0, Math.min(100, y)).toFixed(2)}%`,
      );

      if (button.classList.contains("btn-premium")) {
        button.style.setProperty("--burst-c1", "rgba(120, 247, 255, 0.95)");
        button.style.setProperty("--burst-c2", "rgba(55, 231, 210, 0.9)");
        button.style.setProperty("--burst-c3", "rgba(94, 163, 255, 0.84)");
        button.style.setProperty("--burst-c4", "rgba(239, 122, 255, 0.62)");
        button.style.setProperty("--burst-c5", "rgba(196, 255, 245, 0.9)");
      } else {
        button.style.setProperty("--burst-c1", "rgba(127, 255, 212, 0.95)");
        button.style.setProperty("--burst-c2", "rgba(110, 245, 230, 0.9)");
        button.style.setProperty("--burst-c3", "rgba(88, 236, 255, 0.86)");
        button.style.setProperty("--burst-c4", "rgba(38, 195, 255, 0.72)");
        button.style.setProperty("--burst-c5", "rgba(215, 255, 245, 0.9)");
      }

      button.classList.remove("btn-disintegrate-burst");
      // Force reflow so repeated clicks re-trigger animation reliably.
      void button.offsetWidth;
      button.classList.add("btn-disintegrate-burst");

      window.setTimeout(() => {
        button.classList.remove("btn-disintegrate-burst");
      }, 560);
    };

    document.addEventListener("click", onPress, true);
    return () => document.removeEventListener("click", onPress, true);
  }, []);

  if (loading) {
    return (
      <div className="app-canvas px-4 py-20 md:px-8">
        <div className="mx-auto max-w-6xl">
          <LoadingSpinner text="Preparing your workspace..." />
        </div>
      </div>
    );
  }

  return (
    <div className="app-canvas">
      <FuturisticBackground visualTheme={visualTheme}>
        <button
          type="button"
          className="style-switcher btn-ghost"
          onClick={cycleVisualTheme}
          aria-label={`Visual style: ${activeVisualLabel}. Click to switch palette`}
          title={`Visual style: ${activeVisualLabel}`}
        >
          <span className="style-switcher-text">{activeVisualLabel}</span>
        </button>
        <Navbar />
        <main
          className={
            isAuthPage
              ? "min-h-screen"
              : hasShell
                ? "mx-auto w-full max-w-[1500px] px-4 pb-8 pt-24 md:px-6 lg:pl-[19.5rem] lg:pr-8"
                : "mx-auto w-full max-w-[1200px] px-4 pb-8 pt-24 md:px-6"
          }
        >
          <AppRoutes />
        </main>
      </FuturisticBackground>
    </div>
  );
}
