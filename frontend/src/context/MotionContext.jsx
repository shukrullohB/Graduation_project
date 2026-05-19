import { createContext, useContext, useEffect, useMemo, useState } from "react";

const MotionContext = createContext(null);

const STORAGE_KEY = "motionIntensity";

function getInitialMode() {
  if (typeof window === "undefined") return "normal";

  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "normal" || saved === "calm") return saved;

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "calm"
    : "normal";
}

export function MotionProvider({ children }) {
  const [mode, setMode] = useState(getInitialMode);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, mode);
    document.documentElement.dataset.motion = mode;
    document.documentElement.classList.toggle("motion-calm", mode === "calm");
  }, [mode]);

  const value = useMemo(
    () => ({
      mode,
      setMode,
      toggleMode: () =>
        setMode((prev) => (prev === "normal" ? "calm" : "normal")),
      intensity: mode === "calm" ? 0.45 : 1,
      isCalm: mode === "calm",
    }),
    [mode],
  );

  return (
    <MotionContext.Provider value={value}>{children}</MotionContext.Provider>
  );
}

export function useMotionIntensity() {
  const ctx = useContext(MotionContext);
  if (!ctx) {
    throw new Error("useMotionIntensity must be used within MotionProvider");
  }
  return ctx;
}
