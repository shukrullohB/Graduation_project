import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { getMe } from "../api/auth.api";
import { DEMO_MODE } from "../api/mockData";
import { queryClient } from "../app/queryClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          getMe()
            .then((res) => setUser(res.data))
            .catch(() => localStorage.removeItem("token"))
            .finally(() => setLoading(false));
        } else {
          localStorage.removeItem("token");
          setLoading(false);
        }
      } catch {
        localStorage.removeItem("token");
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const login = (token, userData) => {
    if (DEMO_MODE) {
      queryClient.clear();
      setUser(userData);
      return;
    }
    localStorage.setItem("token", token);
    queryClient.clear();
    setUser(userData);
  };

  const logout = () => {
    queryClient.clear();
    localStorage.removeItem("token");
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
