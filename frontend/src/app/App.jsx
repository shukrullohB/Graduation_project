// Navbar is provided by route-level layouts for /teacher and /student
import AppRoutes from "./routes";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import LoadingSpinner from "../components/LoadingSpinner";

export default function App() {
  const { loading, user } = useAuth();
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  // Permanent dark theme enforced by global CSS; no toggle.

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
    <div
      className="app-canvas"
      style={{ background: "#FFF8E7", minHeight: "100vh" }}
    >
      <main
        className={
          isAuthPage
            ? "min-h-screen"
            : "mx-auto w-full max-w-[1500px] px-4 pb-8 pt-24 md:px-6 lg:pr-8"
        }
      >
        <AppRoutes />
      </main>
    </div>
  );
}

