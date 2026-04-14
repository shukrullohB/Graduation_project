import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function TeacherProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="page teacher-profile-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Teacher Profile</h1>
          <p className="page-subtitle">Account information and quick access.</p>
        </div>
        <button
          type="button"
          className="btn btn--secondary"
          onClick={() => navigate("/teacher")}
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="teacher-profile-card">
        <div className="teacher-profile-avatar">
          {(user?.username ?? "TE").slice(0, 2).toUpperCase()}
        </div>
        <div className="teacher-profile-info">
          <h2>{user?.username ?? "Teacher User"}</h2>
          <p>{user?.email ?? "No email"}</p>
          <span className="badge badge--reviewed">{user?.role ?? "teacher"}</span>
        </div>
      </div>

      <div className="teacher-profile-actions">
        <button type="button" className="btn" onClick={() => navigate("/teacher/create-question")}>
          + Create Question
        </button>
        <button type="button" className="btn btn--secondary" onClick={() => navigate("/teacher/analytics")}>
          Open Analytics
        </button>
        <button type="button" className="btn btn--secondary" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

