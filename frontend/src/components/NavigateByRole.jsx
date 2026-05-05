import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NavigateByRole() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "teacher") return <Navigate to="/teacher" replace />;
  return <Navigate to="/student" replace />;
}
