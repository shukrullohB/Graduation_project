import Navbar from "../components/Navbar";
import AppRoutes from "./routes";
import { useAuth } from "../context/AuthContext";

export default function App() {
  const { loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <main className="main-content">
        <AppRoutes />
      </main>
    </>
  );
}
