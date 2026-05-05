import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { getMe } from "../api/auth.api";
import { DEMO_MODE } from "../api/mockData";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUserRaw = localStorage.getItem("auth_user");
    let savedUser = null;

    try {
      savedUser = savedUserRaw ? JSON.parse(savedUserRaw) : null;
    } catch {
      localStorage.removeItem("auth_user");
    }

    if (savedUser) {
      setUser(savedUser);
    }

    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          getMe()
            .then((res) => {
              setUser(res.data);
              localStorage.setItem("auth_user", JSON.stringify(res.data));
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
    localStorage.setItem("token", token);
    localStorage.setItem("auth_user", JSON.stringify(userData));
    if (DEMO_MODE && userData?.email) {
      localStorage.setItem("demo_user_email", userData.email);
    }
    setUser(userData);
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
