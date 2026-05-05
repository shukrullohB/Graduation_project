import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

export default function ProtectedRoute({ allowedRoles }) {
  const { user, loading } = useAuth();
  const savedUserRaw = localStorage.getItem("auth_user");
  let savedUser = null;

  try {
    savedUser = savedUserRaw ? JSON.parse(savedUserRaw) : null;
  } catch {
    localStorage.removeItem("auth_user");
  }

  const effectiveUser = user ?? savedUser;

  if (loading && !effectiveUser) {
    return <LoadingSpinner text="Checking access..." />;
  }

  if (!effectiveUser) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(effectiveUser.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
