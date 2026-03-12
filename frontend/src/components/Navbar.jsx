import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">GradProject</Link>
      </div>
      <div className="navbar-links">
        {user.role === "student" && (
          <>
            <Link to="/student">Dashboard</Link>
            <Link to="/student/my-answers">My Answers</Link>
            <Link to="/student/analytics">Analytics</Link>
          </>
        )}
        {user.role === "teacher" && (
          <>
            <Link to="/teacher">Dashboard</Link>
            <Link to="/teacher/create-question">+ Question</Link>
            <Link to="/teacher/analytics">Analytics</Link>
          </>
        )}
      </div>
      <div className="navbar-user">
        <span>
          {user.username} ({user.role})
        </span>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}
