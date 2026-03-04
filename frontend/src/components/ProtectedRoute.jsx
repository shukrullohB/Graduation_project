import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../store/authStore";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { token, user } = useAuth();
  const location = useLocation();

  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const fallback = user.role === "teacher" ? "/teacher/review" : "/student";
    return <Navigate to={fallback} replace />;
  }

  return children;
};

export default ProtectedRoute;
