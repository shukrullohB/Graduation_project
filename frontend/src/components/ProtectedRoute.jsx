import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

const VALID_ROLES = new Set(["student", "teacher"]);

export default function ProtectedRoute({ allowedRoles }) {
  const { user, loading } = useAuth();
  const savedUserRaw = localStorage.getItem("auth_user");
  let savedUser = null;

  try {
    savedUser = savedUserRaw ? JSON.parse(savedUserRaw) : null;
  } catch {
    localStorage.removeItem("auth_user");
  }

  const effectiveUser =
    user && VALID_ROLES.has(user.role)
      ? user
      : savedUser && VALID_ROLES.has(savedUser.role)
        ? savedUser
        : null;

  if (!effectiveUser && savedUserRaw) {
    localStorage.removeItem("auth_user");
  }

  if (loading && !effectiveUser) {
    return <LoadingSpinner text="Checking access..." />;
  }

  if (!effectiveUser) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(effectiveUser.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
