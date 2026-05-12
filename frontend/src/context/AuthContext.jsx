import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { getMe } from "../api/auth.api";
import { DEMO_MODE } from "../api/mockData";

const AuthContext = createContext(null);
const VALID_ROLES = new Set(["student", "teacher"]);

const normalizeStoredUser = (rawUser) => {
  if (!rawUser || typeof rawUser !== "object") return null;
  if (!VALID_ROLES.has(rawUser.role)) return null;
  return rawUser;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUserRaw = localStorage.getItem("auth_user");
    let savedUser = null;

    try {
      savedUser = normalizeStoredUser(
        savedUserRaw ? JSON.parse(savedUserRaw) : null,
      );
    } catch {
      localStorage.removeItem("auth_user");
    }

    if (savedUser) {
      setUser(savedUser);
    } else if (savedUserRaw) {
      localStorage.removeItem("auth_user");
    }

    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          getMe()
            .then((res) => {
              const normalizedUser = normalizeStoredUser(res.data);
              if (!normalizedUser) {
                localStorage.removeItem("token");
                localStorage.removeItem("auth_user");
                setUser(null);
                return;
              }

              setUser(normalizedUser);
              localStorage.setItem("auth_user", JSON.stringify(normalizedUser));
            })
            .catch(() => {
              localStorage.removeItem("token");
              localStorage.removeItem("auth_user");
              setUser(null);
            })
            .finally(() => setLoading(false));
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("auth_user");
          setLoading(false);
        }
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("auth_user");
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const login = (token, userData) => {
    const normalizedUser = normalizeStoredUser(userData);
    if (!normalizedUser) {
      localStorage.removeItem("token");
      localStorage.removeItem("auth_user");
      setUser(null);
      return;
    }

    localStorage.setItem("token", token);
    localStorage.setItem("auth_user", JSON.stringify(normalizedUser));
    if (DEMO_MODE && normalizedUser.email) {
      localStorage.setItem("demo_user_email", normalizedUser.email);
    }
    setUser(normalizedUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("auth_user");
    localStorage.removeItem("demo_user_email");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
