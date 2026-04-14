import Navbar from "../components/Navbar";
import AppRoutes from "./routes";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";

export default function App() {
  const { loading } = useAuth();
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";
  const isTeacherPage = location.pathname.startsWith("/teacher");
  const isTeacherDashboardPage = location.pathname === "/teacher";

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <>
      {!isTeacherPage && <Navbar />}
      <main
        className={
          isAuthPage
            ? "main-content main-content--auth"
            : isTeacherDashboardPage
              ? "main-content main-content--teacher-dashboard"
              : isTeacherPage
                ? "main-content main-content--teacher"
                : "main-content"
        }
      >
        <AppRoutes />
      </main>
    </>
  );
}
