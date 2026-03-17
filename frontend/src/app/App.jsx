import Navbar from "../components/Navbar";
import AppRoutes from "./routes";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";

export default function App() {
  const { loading } = useAuth();
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <main className={isAuthPage ? "main-content main-content--auth" : "main-content"}>
        <AppRoutes />
      </main>
    </>
  );
}
