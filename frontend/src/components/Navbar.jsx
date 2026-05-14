import { Link, NavLink, useNavigate } from "react-router-dom";
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
        <Link to="/">
          <span className="navbar-brand-mark">A</span>
          <span className="navbar-brand-text">ASAG</span>
        </Link>
      </div>
      <div className="navbar-links">
        {user.role === "student" && (
          <>
            <NavLink to="/student" end>
              Dashboard
            </NavLink>
            <NavLink to="/student/my-answers">My Answers</NavLink>
            <NavLink to="/student/analytics">Analytics</NavLink>
          </>
        )}
        {user.role === "teacher" && (
          <>
            <NavLink to="/teacher" end>
              Dashboard
            </NavLink>
            <NavLink to="/teacher/create-question">+ Question</NavLink>
            <NavLink to="/teacher/analytics">Analytics</NavLink>
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
          <span className="btn-logout-icon" aria-hidden="true">
            ↪
          </span>
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}
