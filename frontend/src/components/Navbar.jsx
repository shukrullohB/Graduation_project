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

  const initials = user.username?.slice(0, 2).toUpperCase() ?? "U";

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">ASAG</Link>
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
        <div className="navbar-user-info">
          <span className="navbar-user-name">{user.username}</span>
          <span className="navbar-user-role">{user.role}</span>
        </div>
        <div className="navbar-avatar">{initials}</div>
        <button className="btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
